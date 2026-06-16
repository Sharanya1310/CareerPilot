import { Router } from "express";
import { getCompanyInfo, listGeminiModels } from "../controllers/companyController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();
router.use(protect);

router.get("/gemini-models", listGeminiModels);
router.get("/:name/info", getCompanyInfo);

export default router;
