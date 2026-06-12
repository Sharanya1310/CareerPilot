import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { uploadResume as uploadResumeMiddleware } from "../config/upload.js";
import {
  activateResume,
  analyzeJobMatch,
  downloadResume,
  getOptimizationDashboard,
  getResumes,
  removeResume,
  uploadResume,
} from "../controllers/resumeController.js";

const router = Router();

router.use(protect);

router.get("/", getResumes);
router.get("/optimization", getOptimizationDashboard);
router.post("/upload", uploadResumeMiddleware.single("resume"), uploadResume);
router.post("/analyze", analyzeJobMatch);
router.patch("/:id/activate", activateResume);
router.get("/:id/download", downloadResume);
router.delete("/:id", removeResume);

export default router;
