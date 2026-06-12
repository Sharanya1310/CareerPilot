import Job from "../models/Job.js";
import SavedJob from "../models/SavedJob.js";
import User from "../models/User.js";

class JobService {
  /**
   * Get all jobs matching optional filters, with dynamic AI matching scores
   */
  static async getAllJobs(userId, filters = {}) {
    const user = await User.findById(userId);
    const userSkills = user?.skills || [];
    const desiredRoles = user?.desiredRoles || [];

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

    // Filter by location
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
      const jobSkills = job.skills || [];
      let matchedSkills = [];
      let missingSkills = [];
      let matchScore = 75; // Default fallback match score

      if (jobSkills.length > 0) {
        matchedSkills = jobSkills.filter(skill =>
          userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
        );
        missingSkills = jobSkills.filter(skill =>
          !userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
        );

        const skillRatio = matchedSkills.length / jobSkills.length;
        matchScore = Math.round(50 + skillRatio * 50); // Guarantee match score is 50-100%

        // Boost score slightly if job title matches user's desired roles
        const titleLower = job.title.toLowerCase();
        const matchesRole = desiredRoles.some(role => titleLower.includes(role.toLowerCase()));
        if (matchesRole) {
          matchScore = Math.min(matchScore + 5, 99);
        }
      }

      // Overwrite match score for specific mock values if skills match is exactly 100% or default to look nice
      if (jobSkills.length === 0 && desiredRoles.length > 0) {
        matchScore = 80;
      }

      const jobObj = job.toJSON();
      return {
        ...jobObj,
        match: matchScore,
        missingSkills,
        isSaved: savedJobIds.has(job._id.toString())
      };
    });

    // Sort: Premium listings first, then descending by match percentage
    mappedJobs.sort((a, b) => {
      if (a.isPremium && !b.isPremium) return -1;
      if (!a.isPremium && b.isPremium) return 1;
      return b.match - a.match;
    });

    return mappedJobs;
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
    const user = await User.findById(userId);
    const userSkills = user?.skills || [];
    const desiredRoles = user?.desiredRoles || [];

    const savedDocs = await SavedJob.find({ user: userId }).populate("job");
    const validDocs = savedDocs.filter(doc => doc.job);

    return validDocs.map(doc => {
      const job = doc.job;
      const jobSkills = job.skills || [];
      let matchedSkills = [];
      let missingSkills = [];
      let matchScore = 75;

      if (jobSkills.length > 0) {
        matchedSkills = jobSkills.filter(skill =>
          userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
        );
        missingSkills = jobSkills.filter(skill =>
          !userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
        );

        const skillRatio = matchedSkills.length / jobSkills.length;
        matchScore = Math.round(50 + skillRatio * 50);

        const titleLower = job.title.toLowerCase();
        const matchesRole = desiredRoles.some(role => titleLower.includes(role.toLowerCase()));
        if (matchesRole) {
          matchScore = Math.min(matchScore + 5, 99);
        }
      }

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
