import { Router } from "express";
import {
  getExperiences,
  createExperience,
  toggleUpvote,
  getTrendingCompanies,
} from "../controllers/experienceController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

// Protect all routes
router.use(protect);

router.get("/", getExperiences);
router.post("/", createExperience);
router.post("/:id/upvote", toggleUpvote);
router.get("/trending", getTrendingCompanies);

export default router;
