import Job from "../models/Job.js";
import SavedJob from "../models/SavedJob.js";
import User from "../models/User.js";
import Resume from "../models/Resume.js";

class JobService {
  /**
   * Helper to compute dynamic matching score based on Profile, Resume & ATS parameters
   */
  static calculateMatchScore(job, user, activeResume) {
    const userSkills = user?.skills || [];
    const toolsSkills = user?.toolsSkills || [];
    const keywords = user?.keywords || [];
    const resumeKeywords = activeResume?.resumeKeywords || [];
    const allUserSkills = [...new Set([...userSkills, ...toolsSkills, ...keywords, ...resumeKeywords])];
    const desiredRoles = user?.desiredRoles || [];
    const jobSkills = job.skills || [];
    
    let matchedSkills = [];
    let missingSkills = [];
    let matchScore = 75; // Default fallback match score

    if (jobSkills.length > 0) {
      matchedSkills = jobSkills.filter(skill =>
        allUserSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
      );
      missingSkills = jobSkills.filter(skill =>
        !allUserSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
      );

      const skillRatio = matchedSkills.length / jobSkills.length;
      matchScore = Math.round(50 + skillRatio * 30); // up to +30% based on user skills
    }

    // 2. Active Resume & ATS Match
    if (activeResume) {
      const resumeSkillsEnhance = activeResume.aiOptimizedContent?.skillsEnhancement || [];
      const resumeMissing = activeResume.missingSkills || [];
      
      const matchesEnhancement = jobSkills.some(s => 
        resumeSkillsEnhance.some(re => re.toLowerCase() === s.toLowerCase())
      );
      if (matchesEnhancement) {
        matchScore += 10;
      }
      
      const hasMissing = jobSkills.some(s => 
        resumeMissing.some(rm => rm.toLowerCase() === s.toLowerCase())
      );
      if (hasMissing) {
        matchScore -= 10;
      }
      
      if (activeResume.atsScore) {
        matchScore += Math.round((activeResume.atsScore / 100) * 10);
      }
    }

    // 3. Desired Roles Match (+15%)
    const titleLower = job.title.toLowerCase();
    const matchesRole = desiredRoles.some(role => titleLower.includes(role.toLowerCase()));
    if (matchesRole) {
      matchScore += 15;
    }

    // 4. Preferred Locations and Work Type Match (up to +10%)
    const prefLocations = user?.preferredLocations || [];
    const matchesLoc = prefLocations.some(loc => job.location.toLowerCase().includes(loc.toLowerCase()));
    if (matchesLoc) {
      matchScore += 10;
    }

    if (user?.workType && job.workType) {
      if (user.workType.toLowerCase() === "remote" && job.workType.toLowerCase() === "remote") {
        matchScore += 10;
      } else if (user.workType.toLowerCase() === "remote" && job.workType.toLowerCase() === "on-site") {
        matchScore -= 15;
      }
    }

    // 5. Keywords Match (+15%)
    const descriptionLower = (job.description || '').toLowerCase();
    const matchesKeyword = keywords.some(keyword => 
      titleLower.includes(keyword.toLowerCase()) || 
      descriptionLower.includes(keyword.toLowerCase())
    );
    if (matchesKeyword) {
      matchScore += 15;
    }

    // Clamp matchScore between 50% and 98%
    matchScore = Math.min(Math.max(matchScore, 50), 98);

    return {
      matchScore,
      missingSkills
    };
  }

  /**
   * Get all jobs matching optional filters, with dynamic AI matching scores
   */
  static async getAllJobs(userId, filters = {}) {
    // Auto-trigger aggregation if no external jobs exist
    Job.countDocuments({ source: { $ne: "Local" } }).then(count => {
      if (count === 0) {
        import("./jobAggregationService.js").then(module => {
          module.default.aggregateAllSources().catch(console.error);
        });
      }
    }).catch(console.error);

    const [user, activeResume] = await Promise.all([
      User.findById(userId),
      Resume.findOne({ user: userId, isActive: true })
    ]);

    const profileSkills  = user?.skills || [];
    const toolsSkills    = user?.toolsSkills || [];
    const keywords       = user?.keywords || [];
    const resumeSkills   = activeResume?.aiOptimizedContent?.skillsEnhancement || [];
    const allSkills      = [...new Set([...profileSkills, ...toolsSkills, ...keywords, ...resumeSkills])];
    const desiredRoles   = user?.desiredRoles || [];

    // No early exit here — the discovery/search page should always be browsable.
    // Match scores will be computed based on whatever profile data exists (defaulting to 50%).

    const query = {};

    // Filter by search text (title, company, or team)
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, "i");
      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { team: searchRegex }
      ];
    }

    // Filter by location — India only
    if (filters.location && filters.location.toLowerCase() !== "all") {
      query.location = new RegExp(filters.location, "i");
    }

    // Filter by work type (Remote, Hybrid, On-site)
    if (filters.workType && filters.workType.toLowerCase() !== "any") {
      // Handle "Remote Only" toggle
      if (filters.workType.toLowerCase() === "remote only" || filters.workType.toLowerCase() === "remote") {
        query.workType = "Remote";
      } else {
        query.workType = new RegExp(filters.workType, "i");
      }
    }

    // Fetch jobs and user saved mappings
    const [jobs, savedDocs] = await Promise.all([
      Job.find(query),
      SavedJob.find({ user: userId })
    ]);

    const savedJobIds = new Set(savedDocs.map(doc => doc.job.toString()));

    // Map and compute matching scores
    const mappedJobs = jobs.map(job => {
      const { matchScore, missingSkills } = this.calculateMatchScore(job, user, activeResume);

      // Trigger matching alerts asynchronously
      import("./notificationService.js").then(module => {
        module.default.checkAndTriggerJobMatch(userId, job._id, matchScore, job.title, job.company).catch(console.error);
        module.default.checkAndTriggerCompanyHiring(userId, job._id, job.title, job.company).catch(console.error);
      }).catch(console.error);

      const jobObj = job.toJSON();
      return {
        ...jobObj,
        match: matchScore,
        missingSkills,
        isSaved: savedJobIds.has(job._id.toString())
      };
    });

    // Sort: Premium first, then by match score
    mappedJobs.sort((a, b) => {
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      return b.match - a.match;
    });

    // Cap at 3 jobs per company to ensure variety
    const companyCounts = {};
    const diverseJobs = [];
    for (const job of mappedJobs) {
      const key = (job.company || '').toLowerCase();
      companyCounts[key] = (companyCounts[key] || 0) + 1;
      if (companyCounts[key] <= 3) diverseJobs.push(job);
    }

    return diverseJobs;
  }

  /**
   * Fetch fresh skill-based jobs from Remotive, store in DB, return top matches
   * with metadata about which skills were used.
   */
  static async getRecommendedForUser(userId) {
    const [user, activeResume] = await Promise.all([
      User.findById(userId),
      Resume.findOne({ user: userId, isActive: true })
    ]);

    const profileSkills    = user?.skills || [];
    const toolsSkills      = user?.toolsSkills || [];
    const keywords         = user?.keywords || [];
    const resumeSkills     = activeResume?.aiOptimizedContent?.skillsEnhancement || [];
    const resumeKeywords   = activeResume?.resumeKeywords || [];
    const allSkills        = [...new Set([...profileSkills, ...toolsSkills, ...keywords, ...resumeSkills, ...resumeKeywords])];
    const desiredRoles     = user?.desiredRoles || [];

    // Recommend when the user has keywords, desired roles, or a resume with extracted tech skills.
    const hasMeaningfulCriteria = keywords.length > 0 || resumeSkills.length > 0 || desiredRoles.length > 0 || resumeKeywords.length > 0;
    if (!hasMeaningfulCriteria) {
      return { jobs: [], skills: [], roles: [] };
    }

    // Fetch fresh Remotive jobs based on skills/roles
    if (allSkills.length > 0 || desiredRoles.length > 0) {
      try {
        const { default: JobAggregationService } = await import("./jobAggregationService.js");
        const freshJobs = await JobAggregationService.fetchJobsBySkills(allSkills, desiredRoles);

        for (const jobData of freshJobs) {
          if (!jobData.externalId || !jobData.source) continue;
          const exists = await Job.findOne({ source: jobData.source, externalId: jobData.externalId });
          if (!exists) await Job.create(jobData);
          else if (jobData.url && !exists.url) await Job.updateOne({ _id: exists._id }, { url: jobData.url });
        }
      } catch (err) {
        console.warn("Skill-based Remotive fetch failed:", err.message);
      }
    }

    // India jobs only
    const [allJobs, savedDocs] = await Promise.all([
      Job.find({ location: /india/i }),
      SavedJob.find({ user: userId })
    ]);

    const savedJobIds = new Set(savedDocs.map(d => d.job.toString()));

    const scored = allJobs.map(job => {
      const { matchScore, missingSkills } = this.calculateMatchScore(job, user, activeResume);
      return {
        ...job.toJSON(),
        match: matchScore,
        missingSkills,
        isSaved: savedJobIds.has(job._id.toString())
      };
    });

    // Filter: only jobs where at least one skill matches or the title matches a desired role.
    // Without this, the 50% score floor makes every job appear as a match.
    const meaningful = scored.filter(job => {
      const totalJobSkills = (job.skills || []).length;
      const missingCount = (job.missingSkills || []).length;
      const hasSkillMatch = totalJobSkills > 0 && totalJobSkills > missingCount;
      const titleLower = (job.title || '').toLowerCase();
      const hasRoleMatch = desiredRoles.some(role => titleLower.includes(role.toLowerCase()));
      return hasSkillMatch || hasRoleMatch;
    });

    // Sort by match score, then cap at 2 jobs per company for variety
    meaningful.sort((a, b) => b.match - a.match);
    const companyCounts = {};
    const recommendations = [];
    for (const job of meaningful) {
      const key = (job.company || '').toLowerCase();
      companyCounts[key] = (companyCounts[key] || 0) + 1;
      if (companyCounts[key] <= 2) recommendations.push(job);
      if (recommendations.length >= 20) break;
    }

    return { jobs: recommendations, skills: allSkills, roles: desiredRoles };
  }

  /**
   * Save a job for a user
   */
  static async saveJob(userId, jobId) {
    try {
      return await SavedJob.create({ user: userId, job: jobId });
    } catch (err) {
      if (err.code === 11000) {
        // Already saved
        return await SavedJob.findOne({ user: userId, job: jobId });
      }
      throw err;
    }
  }

  /**
   * Unsave a job for a user
   */
  static async unsaveJob(userId, jobId) {
    return await SavedJob.findOneAndDelete({ user: userId, job: jobId });
  }

  /**
   * Get all saved jobs with populated metadata and matching scores
   */
  static async getSavedJobs(userId) {
    const [user, activeResume] = await Promise.all([
      User.findById(userId),
      Resume.findOne({ user: userId, isActive: true })
    ]);

    const savedDocs = await SavedJob.find({ user: userId }).populate("job");
    const validDocs = savedDocs.filter(doc => doc.job);

    return validDocs.map(doc => {
      const job = doc.job;
      const { matchScore, missingSkills } = this.calculateMatchScore(job, user, activeResume);

      const jobObj = job.toJSON();
      return {
        ...jobObj,
        match: matchScore,
        missingSkills,
        isSaved: true,
        savedAt: doc.createdAt
      };
    });
  }
}

export default JobService;
