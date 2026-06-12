import InterviewService from "../services/interviewService.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const getInterviews = asyncHandler(async (req, res) => {
  const interviews = await InterviewService.getUserInterviews(req.user._id);
  // Return the array directly to match the frontend expectations
  return res.json(interviews);
});

export const createInterview = asyncHandler(async (req, res) => {
  const { company, role, date, time } = req.body;
  if (!company || !role || !date || !time) {
    throw new AppError("Company, role, date, and time are required.", 400);
  }

  const interview = await InterviewService.scheduleInterview(req.user._id, req.body);
  return res.status(201).json(interview);
});

export const deleteInterview = asyncHandler(async (req, res) => {
  await InterviewService.deleteInterview(req.user._id, req.params.id);
  return res.json({ success: true, message: "Interview deleted successfully." });
});
