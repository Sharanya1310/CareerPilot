import express from "express";
import cors from "cors";
import morgan from "morgan";

// Routes
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

// Middleware
import requestIdMiddleware from "./middleware/requestId.js";
import securityHeadersMiddleware from "./middleware/securityHeaders.js";
import notFound from "./middleware/notFound.js";
import globalErrorHandler from "./middleware/errorHandler.js";

const app = express();

// ─── Security & CORS ──────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ─── Security Headers ────────────────────────────────────────
app.use(securityHeadersMiddleware);

// ─── Request ID for Tracing ──────────────────────────────────
app.use(requestIdMiddleware);

// ─── Request Parsing ──────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── HTTP Logger ──────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Routes ───────────────────────────────────────────────────
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/interviews", interviewRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/jobs", jobRoutes);

// ─── 404 Handler ──────────────────────────────────────────────
app.use(notFound);

// ─── Global Error Handler ─────────────────────────────────────
// Must be registered LAST
app.use(globalErrorHandler);

export default app;
