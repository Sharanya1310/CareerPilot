import { Router } from "express";
import {
  getProfile,
  updateProfile,
  addSkill,
  removeSkill,
  updatePreferences,
  followCompany,
  unfollowCompany,
  getFollowedCompanies,
} from "../controllers/profileController.js";
import protect from "../middleware/authMiddleware.js";

const router = Router();

// All profile routes are protected — JWT required
router.use(protect);

// ─── Profile ──────────────────────────────────────────────────
router.get("/", getProfile);              // GET    /api/profile
router.put("/", updateProfile);           // PUT    /api/profile

// ─── Skills ──────────────────────────────────────────────────
router.post("/skills", addSkill);                     // POST   /api/profile/skills
router.delete("/skills/:skill", removeSkill);         // DELETE /api/profile/skills/:skill

// ─── Career Preferences ──────────────────────────────────────
router.put("/preferences", updatePreferences);        // PUT    /api/profile/preferences

// ─── Followed Companies ───────────────────────────────────────
router.get("/followed-companies", getFollowedCompanies);              // GET    /api/profile/followed-companies
router.post("/follow-company", followCompany);                        // POST   /api/profile/follow-company
router.delete("/follow-company/:companyName", unfollowCompany);       // DELETE /api/profile/follow-company/:companyName

export default router;
