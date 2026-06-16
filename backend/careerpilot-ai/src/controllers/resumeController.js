import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {
  analyzeResumeForJob,
  createResume,
  deleteResume,
  formatOptimizationPayload,
  formatResumeItem,
  getActiveResume,
  getResumeById,
  getUserResumes,
  setActiveResume,
} from "../services/resumeService.js";

export const getResumes = asyncHandler(async (req, res) => {
  const resumes = await getUserResumes(req.user._id);
  return res.json(resumes.map(formatResumeItem));
});

export const getOptimizationDashboard = asyncHandler(async (req, res) => {
  const resumes = await getUserResumes(req.user._id);
  const activeResume = resumes.find((resume) => resume.isActive) || null;

  return ApiResponse.ok(
    res,
    "Resume optimization data fetched successfully.",
    formatOptimizationPayload(resumes, activeResume)
  );
});

export const uploadResume = asyncHandler(async (req, res) => {
  const resume = await createResume(req.user._id, req.file);
  return res.status(201).json(formatResumeItem(resume));
});

export const analyzeJobMatch = asyncHandler(async (req, res) => {
  const { jobDescription } = req.body;
  const resume = await analyzeResumeForJob(req.user._id, jobDescription);

  return ApiResponse.ok(res, "Job match analysis completed.", {
    resumeId: resume._id,
    jobMatchScore: resume.jobMatchScore,
    missingSkills: resume.missingSkills,
    matchSummary: resume.matchSummary,
    aiOptimizedContent: resume.aiOptimizedContent,
  });
});

export const activateResume = asyncHandler(async (req, res) => {
  const resume = await setActiveResume(req.user._id, req.params.id);
  return res.json(formatResumeItem(resume));
});

export const downloadResume = asyncHandler(async (req, res) => {
  const resume = await getResumeById(req.user._id, req.params.id);
  if (!resume.fileUrl) throw new AppError("Resume file not available.", 404);
  return res.redirect(resume.fileUrl);
});

export const removeResume = asyncHandler(async (req, res) => {
  await deleteResume(req.user._id, req.params.id);

  return ApiResponse.ok(res, "Resume deleted successfully.");
});
