import InterviewExperience from "../models/InterviewExperience.js";
import AppError from "../utils/AppError.js";

class ExperienceService {
  /**
   * Fetch all experiences matching search / difficulty filters
   */
  static async getAllExperiences(userId, filters = {}) {
    const query = {};

    // Filter by text search
    if (filters.search) {
      const searchRegex = new RegExp(filters.search, "i");
      query.$or = [
        { company: searchRegex },
        { role: searchRegex },
        { description: searchRegex }
      ];
    }

    // Filter by difficulty level
    if (filters.difficulty && filters.difficulty.toLowerCase() !== "all") {
      query.difficulty = new RegExp(filters.difficulty, "i");
    }

    const experiences = await InterviewExperience.find(query).sort({ createdAt: -1 });

    return experiences.map(exp => {
      const expObj = exp.toJSON();
      return {
        ...expObj,
        hasUpvoted: exp.upvotedBy.some(id => id.toString() === userId.toString())
      };
    });
  }

  /**
   * Post a new interview experience
   */
  static async createExperience(userId, payload) {
    const { company, role, difficulty, outcome, tags, description, rounds, prepTips } = payload;

    if (!company || !role || !description) {
      throw new AppError("Company, role, and description are required.", 400);
    }

    return await InterviewExperience.create({
      user: userId,
      company: company.trim(),
      role: role.trim(),
      difficulty: difficulty || "Medium",
      outcome: outcome || "Selected",
      tags: tags || [],
      description: description.trim(),
      rounds: rounds || [],
      prepTips: prepTips || []
    });
  }

  /**
   * Toggle helpful upvote for an experience
   */
  static async toggleUpvote(userId, experienceId) {
    const experience = await InterviewExperience.findById(experienceId);
    if (!experience) {
      throw new AppError("Interview experience not found.", 404);
    }

    const userIdStr = userId.toString();
    const upvotedIdx = experience.upvotedBy.findIndex(id => id.toString() === userIdStr);

    if (upvotedIdx > -1) {
      // User already upvoted, remove upvote
      experience.upvotedBy.splice(upvotedIdx, 1);
      experience.upvotes = Math.max(0, experience.upvotes - 1);
    } else {
      // User hasn't upvoted, add upvote
      experience.upvotedBy.push(userId);
      experience.upvotes += 1;
    }

    await experience.save();
    
    const expObj = experience.toJSON();
    return {
      ...expObj,
      hasUpvoted: upvotedIdx === -1 // True if we just added the upvote
    };
  }

  /**
   * Get trending target companies aggregated from crowdsourced counts
   */
  static async getTrendingCompanies() {
    const trending = await InterviewExperience.aggregate([
      { $group: { _id: "$company", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    return trending.map(item => {
      const name = item._id;
      let logo = name.substring(0, 1).toUpperCase();
      let bg = "bg-zinc-800";
      
      if (name.toLowerCase() === "google") {
        logo = "G";
        bg = "bg-white text-zinc-900 border border-zinc-200 shadow-sm";
      } else if (name.toLowerCase() === "microsoft") {
        logo = "M";
        bg = "bg-blue-600 text-white";
      } else if (name.toLowerCase() === "accenture") {
        logo = "A";
        bg = "bg-purple-650/10 text-purple-400 border border-purple-500/20";
      } else if (name.toLowerCase() === "amazon") {
        logo = "Am";
        bg = "bg-amber-600/15 text-amber-500 border border-amber-500/20";
      } else if (name.toLowerCase() === "meta") {
        logo = "Me";
        bg = "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      }

      return {
        name,
        count: item.count,
        dotColor: "bg-emerald-500",
        logo,
        bg
      };
    });
  }
}

export default ExperienceService;
