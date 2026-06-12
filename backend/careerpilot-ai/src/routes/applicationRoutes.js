import { Router } from "express";
import {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} from "../controllers/applicationController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

// Protect all routes
router.use(protect);

router.route("/")
  .get(getApplications)
  .post(createApplication);

router.route("/:id")
  .get(getApplication)
  .put(updateApplication)
  .delete(deleteApplication);

export default router;
