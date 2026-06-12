import ApplicationService from "../services/applicationService.js";
import { ApiResponse } from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const getApplications = asyncHandler(async (req, res) => {
  const apps = await ApplicationService.getUserApplications(req.user._id);
  // Note: The frontend expects the response to be an array directly or a specific shape.
  // Wait, let's look at DataContext.jsx:
  // "const apps = await api.getApplications(); setApplications(apps);"
  // If the frontend does 'setApplications(apps)', and expects it to be an array, 
  // but wait, is the frontend reading apps directly as array or checking properties?
  // Let's check api.js:
  // getApplications: () => request('/applications')
  // And request() returns response.json() directly.
  // If the mock backend returned the array directly: res.json(db.get('applications') || [])
  // Yes! The mock backend returned the array directly, NOT wrapped in { success: true, data: ... }!
  // To avoid breaking the frontend which was written to fetch mock arrays directly,
  // we should return the array directly, OR adjust.
  // Let's return the array directly to be fully backward-compatible with the frontend!
  return res.json(apps);
});

export const getApplication = asyncHandler(async (req, res) => {
  const app = await ApplicationService.getApplicationById(req.user._id, req.params.id);
  return res.json(app);
});

export const createApplication = asyncHandler(async (req, res) => {
  const { company, role } = req.body;
  if (!company || !role) {
    throw new AppError("Company and role are required.", 400);
  }

  const app = await ApplicationService.createApplication(req.user._id, req.body);
  // Return application object directly
  return res.status(201).json(app);
});

export const updateApplication = asyncHandler(async (req, res) => {
  const app = await ApplicationService.updateApplication(req.user._id, req.params.id, req.body);
  return res.json(app);
});

export const deleteApplication = asyncHandler(async (req, res) => {
  await ApplicationService.deleteApplication(req.user._id, req.params.id);
  return res.json({ success: true, message: "Application deleted successfully" });
});
