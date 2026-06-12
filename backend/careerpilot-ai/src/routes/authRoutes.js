import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

// ─── Public Routes ────────────────────────────────────────────
router.post("/register", register);   // POST /api/auth/register
router.post("/login", login);         // POST /api/auth/login

// ─── Protected Routes ─────────────────────────────────────────
router.get("/profile", protect, getProfile);      // GET  /api/auth/profile
router.put("/profile", protect, updateProfile);   // PUT  /api/auth/profile

export default router;
