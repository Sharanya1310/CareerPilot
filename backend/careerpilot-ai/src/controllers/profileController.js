import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// ─────────────────────────────────────────────────────────────────
// TASK 2 — GET PROFILE
// GET /api/profile
// Protected
// ─────────────────────────────────────────────────────────────────
export const getProfile = asyncHandler(async (req, res) => {
  // req.user is attached by protect middleware (password excluded)
  const user = req.user;

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    skills: user.skills,
    toolsSkills: user.toolsSkills || [],
    keywords: user.keywords || [],
    desiredRoles: user.desiredRoles,
    preferredLocations: user.preferredLocations,
    workType: user.workType,
    followedCompanies: user.followedCompanies,
    avatar: user.avatar,
    lastLogin: user.lastLogin,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
});

// ─────────────────────────────────────────────────────────────────
// TASK 3 — UPDATE PROFILE
// PUT /api/profile
// Protected
// ─────────────────────────────────────────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, skills, toolsSkills, keywords, desiredRoles, preferredLocations, workType, avatar } = req.body;

  // Validate name if provided
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 2) {
      throw new AppError("Name must be at least 2 characters.", 400);
    }
    if (name.trim().length > 50) {
      throw new AppError("Name cannot exceed 50 characters.", 400);
    }
  }

  // Validate skills if provided
  if (skills !== undefined) {
    if (!Array.isArray(skills)) {
      throw new AppError("Skills must be an array of strings.", 400);
    }
    if (skills.length > 50) {
      throw new AppError("You can add a maximum of 50 skills.", 400);
    }
  }

  // Validate toolsSkills if provided
  if (toolsSkills !== undefined) {
    if (!Array.isArray(toolsSkills)) {
      throw new AppError("Tools must be an array of strings.", 400);
    }
    if (toolsSkills.length > 50) {
      throw new AppError("You can add a maximum of 50 tools.", 400);
    }
  }

  // Validate keywords if provided
  if (keywords !== undefined) {
    if (!Array.isArray(keywords)) {
      throw new AppError("Keywords must be an array of strings.", 400);
    }
    if (keywords.length > 50) {
      throw new AppError("You can add a maximum of 50 keywords.", 400);
    }
  }

  // Validate desiredRoles if provided
  if (desiredRoles !== undefined) {
    if (!Array.isArray(desiredRoles)) {
      throw new AppError("Desired roles must be an array of strings.", 400);
    }
    if (desiredRoles.length > 20) {
      throw new AppError("You can add a maximum of 20 desired roles.", 400);
    }
  }

  // Validate preferredLocations if provided
  if (preferredLocations !== undefined) {
    if (!Array.isArray(preferredLocations)) {
      throw new AppError("Preferred locations must be an array of strings.", 400);
    }
    if (preferredLocations.length > 20) {
      throw new AppError("You can add a maximum of 20 preferred locations.", 400);
    }
  }

  // Validate workType if provided
  const validWorkTypes = ["Remote", "On-site", "Hybrid", "Any", ""];
  if (workType !== undefined && !validWorkTypes.includes(workType)) {
    throw new AppError("workType must be one of: Remote, On-site, Hybrid, Any.", 400);
  }

  // Build update object — only include provided fields
  const updates = {};
  if (name !== undefined) updates.name = name.trim();
  if (skills !== undefined) updates.skills = [...new Set(skills.map((s) => s.trim()).filter(Boolean))];
  if (toolsSkills !== undefined) updates.toolsSkills = [...new Set(toolsSkills.map((t) => t.trim()).filter(Boolean))];
  if (keywords !== undefined) updates.keywords = [...new Set(keywords.map((k) => k.trim()).filter(Boolean))];
  if (desiredRoles !== undefined) updates.desiredRoles = [...new Set(desiredRoles.map((r) => r.trim()).filter(Boolean))];
  if (preferredLocations !== undefined) updates.preferredLocations = [...new Set(preferredLocations.map((l) => l.trim()).filter(Boolean))];
  if (workType !== undefined) updates.workType = workType;
  if (avatar !== undefined) updates.avatar = avatar.trim();

  if (Object.keys(updates).length === 0) {
    throw new AppError("No valid fields provided to update.", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    skills: updatedUser.skills,
    toolsSkills: updatedUser.toolsSkills || [],
    keywords: updatedUser.keywords || [],
    desiredRoles: updatedUser.desiredRoles,
    preferredLocations: updatedUser.preferredLocations,
    workType: updatedUser.workType,
    followedCompanies: updatedUser.followedCompanies,
    avatar: updatedUser.avatar,
    lastLogin: updatedUser.lastLogin,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  });
});

// ─────────────────────────────────────────────────────────────────
// TASK 4 — ADD SKILL
// POST /api/profile/skills
// Protected
// ─────────────────────────────────────────────────────────────────
export const addSkill = asyncHandler(async (req, res) => {
  const { skill } = req.body;

  if (!skill || typeof skill !== "string" || skill.trim().length === 0) {
    throw new AppError("A valid skill name is required.", 400);
  }

  const trimmedSkill = skill.trim();

  // Fetch current user
  const user = await User.findById(req.user._id);

  // Check for duplicate (case-insensitive)
  const alreadyExists = user.skills.some(
    (s) => s.toLowerCase() === trimmedSkill.toLowerCase()
  );
  if (alreadyExists) {
    throw new AppError(`Skill "${trimmedSkill}" already exists in your profile.`, 409);
  }

  // Check max limit
  if (user.skills.length >= 50) {
    throw new AppError("You have reached the maximum limit of 50 skills.", 400);
  }

  // Add skill using $push
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { skills: trimmedSkill } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: `Skill "${trimmedSkill}" added successfully.`,
    skills: updatedUser.skills,
  });
});

// ─────────────────────────────────────────────────────────────────
// TASK 4 — REMOVE SKILL
// DELETE /api/profile/skills/:skill
// Protected
// ─────────────────────────────────────────────────────────────────
export const removeSkill = asyncHandler(async (req, res) => {
  const skillToRemove = decodeURIComponent(req.params.skill).trim();

  if (!skillToRemove) {
    throw new AppError("Skill name is required.", 400);
  }

  const user = await User.findById(req.user._id);

  // Case-insensitive check that skill exists
  const existingSkill = user.skills.find(
    (s) => s.toLowerCase() === skillToRemove.toLowerCase()
  );
  if (!existingSkill) {
    throw new AppError(`Skill "${skillToRemove}" not found in your profile.`, 404);
  }

  // Remove the exact casing match
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { skills: existingSkill } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: `Skill "${existingSkill}" removed successfully.`,
    skills: updatedUser.skills,
  });
});

// ─────────────────────────────────────────────────────────────────
// TASK 5 — UPDATE CAREER PREFERENCES
// PUT /api/profile/preferences
// Protected
// ─────────────────────────────────────────────────────────────────
export const updatePreferences = asyncHandler(async (req, res) => {
  const { desiredRoles, preferredLocations, workType } = req.body;

  // At least one field must be provided
  if (desiredRoles === undefined && preferredLocations === undefined && workType === undefined) {
    throw new AppError("Provide at least one preference field: desiredRoles, preferredLocations, or workType.", 400);
  }

  // Validate desiredRoles
  if (desiredRoles !== undefined) {
    if (!Array.isArray(desiredRoles)) {
      throw new AppError("desiredRoles must be an array of strings.", 400);
    }
    if (desiredRoles.length > 20) {
      throw new AppError("You can add a maximum of 20 desired roles.", 400);
    }
  }

  // Validate preferredLocations
  if (preferredLocations !== undefined) {
    if (!Array.isArray(preferredLocations)) {
      throw new AppError("preferredLocations must be an array of strings.", 400);
    }
    if (preferredLocations.length > 20) {
      throw new AppError("You can add a maximum of 20 preferred locations.", 400);
    }
  }

  // Validate workType
  const validWorkTypes = ["Remote", "On-site", "Hybrid", "Any", ""];
  if (workType !== undefined && !validWorkTypes.includes(workType)) {
    throw new AppError("workType must be one of: Remote, On-site, Hybrid, Any.", 400);
  }

  // Build updates
  const updates = {};
  if (desiredRoles !== undefined) {
    updates.desiredRoles = [...new Set(desiredRoles.map((r) => r.trim()).filter(Boolean))];
  }
  if (preferredLocations !== undefined) {
    updates.preferredLocations = [...new Set(preferredLocations.map((l) => l.trim()).filter(Boolean))];
  }
  if (workType !== undefined) {
    updates.workType = workType;
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Career preferences updated successfully.",
    preferences: {
      desiredRoles: updatedUser.desiredRoles,
      preferredLocations: updatedUser.preferredLocations,
      workType: updatedUser.workType,
    },
  });
});

// ─────────────────────────────────────────────────────────────────
// TASK 6 — FOLLOW COMPANY
// POST /api/profile/follow-company
// Protected
// ─────────────────────────────────────────────────────────────────
export const followCompany = asyncHandler(async (req, res) => {
  const { companyName } = req.body;

  if (!companyName || typeof companyName !== "string" || companyName.trim().length === 0) {
    throw new AppError("A valid company name is required.", 400);
  }

  const trimmedCompany = companyName.trim();

  const user = await User.findById(req.user._id);

  // Check for duplicate (case-insensitive)
  const alreadyFollowing = user.followedCompanies.some(
    (c) => c.toLowerCase() === trimmedCompany.toLowerCase()
  );
  if (alreadyFollowing) {
    throw new AppError(`You are already following "${trimmedCompany}".`, 409);
  }

  // Check max limit
  if (user.followedCompanies.length >= 100) {
    throw new AppError("You have reached the maximum limit of 100 followed companies.", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { followedCompanies: trimmedCompany } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: `Now following "${trimmedCompany}".`,
    followedCompanies: updatedUser.followedCompanies,
  });
});

// ─────────────────────────────────────────────────────────────────
// TASK 6 — UNFOLLOW COMPANY
// DELETE /api/profile/follow-company/:companyName
// Protected
// ─────────────────────────────────────────────────────────────────
export const unfollowCompany = asyncHandler(async (req, res) => {
  const companyToRemove = decodeURIComponent(req.params.companyName).trim();

  if (!companyToRemove) {
    throw new AppError("Company name is required.", 400);
  }

  const user = await User.findById(req.user._id);

  // Case-insensitive check that company is followed
  const existingCompany = user.followedCompanies.find(
    (c) => c.toLowerCase() === companyToRemove.toLowerCase()
  );
  if (!existingCompany) {
    throw new AppError(`You are not following "${companyToRemove}".`, 404);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { followedCompanies: existingCompany } },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: `Unfollowed "${existingCompany}".`,
    followedCompanies: updatedUser.followedCompanies,
  });
});

// ─────────────────────────────────────────────────────────────────
// TASK 6 — GET FOLLOWED COMPANIES
// GET /api/profile/followed-companies
// Protected
// ─────────────────────────────────────────────────────────────────
export const getFollowedCompanies = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    count: user.followedCompanies.length,
    followedCompanies: user.followedCompanies,
  });
});
