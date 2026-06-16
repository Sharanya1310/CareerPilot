import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import {
  createAnalysis,
  getAnalysisHistory,
  deleteAnalysis,
} from "../services/analysisService.js";

export const runAnalysis = asyncHandler(async (req, res) => {
  const { resumeId, jobDescription, jobTitle, company } = req.body;
  if (!resumeId)       throw new AppError("resumeId is required.", 400);
  if (!jobDescription) throw new AppError("jobDescription is required.", 400);

  const result = await createAnalysis(
    req.user._id,
    resumeId,
    jobDescription,
    jobTitle || "",
    company  || ""
  );
  res.status(201).json(result);
});

export const getHistory = asyncHandler(async (req, res) => {
  const history = await getAnalysisHistory(req.user._id);
  res.json(history);
});

export const removeAnalysis = asyncHandler(async (req, res) => {
  await deleteAnalysis(req.user._id, req.params.id);
  res.json({ success: true, message: "Analysis entry deleted." });
});
