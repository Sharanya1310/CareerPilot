import ExperienceService from "../services/experienceService.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getExperiences = asyncHandler(async (req, res) => {
  const experiences = await ExperienceService.getAllExperiences(req.user._id, req.query);
  return res.json(experiences);
});

export const createExperience = asyncHandler(async (req, res) => {
  const newExp = await ExperienceService.createExperience(req.user._id, req.body);
  return res.status(201).json(newExp);
});

export const toggleUpvote = asyncHandler(async (req, res) => {
  const updated = await ExperienceService.toggleUpvote(req.user._id, req.params.id);
  return res.json(updated);
});

export const getTrendingCompanies = asyncHandler(async (req, res) => {
  const trending = await ExperienceService.getTrendingCompanies();
  return res.json(trending);
});
