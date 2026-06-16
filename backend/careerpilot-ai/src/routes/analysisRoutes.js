import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import { runAnalysis, getHistory, removeAnalysis } from "../controllers/analysisController.js";

const router = Router();
router.use(protect);

router.post("/",           runAnalysis);     // POST   /api/analysis
router.get("/history",     getHistory);      // GET    /api/analysis/history
router.delete("/history/:id", removeAnalysis); // DELETE /api/analysis/history/:id

export default router;
