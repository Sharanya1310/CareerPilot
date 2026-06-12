import JobService from "../services/jobService.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await JobService.getAllJobs(req.user._id, req.query);
  return res.json(jobs);
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const jobs = await JobService.getAllJobs(req.user._id);
  // Filter for jobs with a match score >= 85 or top recommendations
  const recommendations = jobs.filter(j => j.match >= 85);
  return res.json(recommendations);
});

export const getSavedJobs = asyncHandler(async (req, res) => {
  const savedJobs = await JobService.getSavedJobs(req.user._id);
  return res.json(savedJobs);
});

export const saveJob = asyncHandler(async (req, res) => {
  const jobId = req.body.jobId || req.body.id;
  if (!jobId) {
    throw new AppError("jobId is required", 400);
  }
  const saved = await JobService.saveJob(req.user._id, jobId);
  return res.status(201).json({ success: true, data: saved });
});

export const unsaveJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  if (!jobId) {
    throw new AppError("jobId parameter is required", 400);
  }
  await JobService.unsaveJob(req.user._id, jobId);
  return res.json({ success: true, message: "Job unsaved successfully" });
});
