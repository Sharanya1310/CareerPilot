import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "./config/passport.js";

// Routes
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import analysisRoutes from "./routes/analysisRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";

// Middleware
import requestIdMiddleware from "./middleware/requestId.js";
import securityHeadersMiddleware from "./middleware/securityHeaders.js";
import notFound from "./middleware/notFound.js";
import globalErrorHandler from "./middleware/errorHandler.js";

const app = express();

// ─── Security & CORS ──────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(",").map(o => o.trim())
      : "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ─── Passport (OAuth) ────────────────────────────────────────
app.use(passport.initialize());

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
app.use("/api/experiences", experienceRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/companies", companyRoutes);

// ─── 404 Handler ──────────────────────────────────────────────
app.use(notFound);

// ─── Global Error Handler ─────────────────────────────────────
// Must be registered LAST
app.use(globalErrorHandler);

export default app;
