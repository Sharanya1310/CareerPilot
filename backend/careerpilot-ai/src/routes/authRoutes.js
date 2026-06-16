import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import passport from "../config/passport.js";
import generateToken from "../utils/generateToken.js";

const router = Router();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// ─── Public Routes ────────────────────────────────────────────
router.post("/register", register);
router.post("/login", login);

// ─── Google OAuth ─────────────────────────────────────────────
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);
router.get("/google/callback",
  passport.authenticate("google", { failureRedirect: `${CLIENT_URL}?oauth_error=google_failed`, session: false }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const user = encodeURIComponent(JSON.stringify({ id: req.user._id, name: req.user.name, email: req.user.email }));
    res.redirect(`${CLIENT_URL}?token=${token}&user=${user}`);
  }
);

// ─── GitHub OAuth ─────────────────────────────────────────────
router.get("/github",
  passport.authenticate("github", { scope: ["user:email"], session: false })
);
router.get("/github/callback",
  passport.authenticate("github", { failureRedirect: `${CLIENT_URL}?oauth_error=github_failed`, session: false }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const user = encodeURIComponent(JSON.stringify({ id: req.user._id, name: req.user.name, email: req.user.email }));
    res.redirect(`${CLIENT_URL}?token=${token}&user=${user}`);
  }
);

// ─── Protected Routes ─────────────────────────────────────────
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
