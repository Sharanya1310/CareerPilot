import DashboardService from "../services/dashboardService.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const data = await DashboardService.getDashboardData(req.user._id);
  return res.json(data);
});
