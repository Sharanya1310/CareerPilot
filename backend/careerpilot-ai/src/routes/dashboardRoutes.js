import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

// Protect all routes
router.use(protect);

router.get("/", getDashboard);

export default router;
