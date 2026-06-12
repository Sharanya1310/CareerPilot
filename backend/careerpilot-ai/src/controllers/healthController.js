import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

/**
 * @desc    Health check — verify server + DB are alive
 * @route   GET /api/health
 * @access  Public
 */
export const healthCheck = asyncHandler(async (req, res) => {
  const dbState = mongoose.connection.readyState;

  const dbStatus = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  }[dbState] ?? "unknown";

  const data = {
    server: "online",
    database: dbStatus,
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    memoryUsage: {
      rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
    },
  };

  const statusCode = dbState === 1 ? 200 : 503;
  const message = dbState === 1 ? "CareerPilot AI is healthy 🚀" : "Database unavailable";

  return res.status(statusCode).json({ success: dbState === 1, message, data });
});
