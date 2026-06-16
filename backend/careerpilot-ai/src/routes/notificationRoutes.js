import { Router } from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = Router();

// Protect all routes
router.use(protect);

router.get("/", getNotifications);
router.patch("/:id/read", markRead);
router.post("/read-all", markAllRead);
router.delete("/:id", deleteNotification);

export default router;
