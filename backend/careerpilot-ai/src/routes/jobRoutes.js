import { Router } from "express";
import {
  getJobs,
  getRecommendations,
  getSavedJobs,
  saveJob,
  unsaveJob,
  triggerJobAggregation,
  clearAndReaggregate,
} from "../controllers/jobController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

// Protect all routes
router.use(protect);

router.get("/", getJobs);
router.get("/recommendations", getRecommendations);
router.get("/saved", getSavedJobs);
router.post("/saved", saveJob);
router.delete("/saved/:jobId", unsaveJob);
router.post("/aggregate", triggerJobAggregation);
router.post("/reaggregate", clearAndReaggregate);

export default router;
