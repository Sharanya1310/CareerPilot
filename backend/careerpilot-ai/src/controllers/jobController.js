import JobService from "../services/jobService.js";
import JobAggregationService from "../services/jobAggregationService.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await JobService.getAllJobs(req.user._id, req.query);
  return res.json(jobs);
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const result = await JobService.getRecommendedForUser(req.user._id);
  return res.json(result);
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

export const triggerJobAggregation = asyncHandler(async (req, res) => {
  const count = await JobAggregationService.aggregateAllSources();
  return res.status(200).json({
    success: true,
    message: `Job aggregation completed. Added ${count} new jobs.`,
    count,
  });
});

export const clearAndReaggregate = asyncHandler(async (req, res) => {
  const Job = (await import("../models/Job.js")).default;
  await Job.deleteMany({ source: { $ne: "Local" } });
  const count = await JobAggregationService.aggregateAllSources();
  return res.status(200).json({
    success: true,
    message: `Cleared stale jobs and re-fetched ${count} fresh jobs.`,
    count,
  });
});
