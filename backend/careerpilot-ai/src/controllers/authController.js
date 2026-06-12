import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// ─────────────────────────────────────────────────────────────
// TASK 2: REGISTER
// POST /api/auth/register
// Public
// ─────────────────────────────────────────────────────────────
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // 1. Validate required fields
  if (!name || !email || !password) {
    throw new AppError("Name, email and password are required.", 400);
  }

  // 2. Validate email format
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    throw new AppError("Please provide a valid email address.", 400);
  }

  // 3. Validate password length
  if (password.length < 6) {
    throw new AppError("Password must be at least 6 characters.", 400);
  }

  // 4. Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError("An account with this email already exists.", 409);
  }

  // 5. Create user (password hashed in pre-save hook)
  const user = await User.create({ name, email, password });

  // 6. Generate JWT token
  const token = generateToken(user._id);

  // 7. Return success response
  res.status(201).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// ─────────────────────────────────────────────────────────────
// TASK 3: LOGIN
// POST /api/auth/login
// Public
// ─────────────────────────────────────────────────────────────
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Validate required fields
  if (!email || !password) {
    throw new AppError("Email and password are required.", 400);
  }

  // 2. Find user by email (explicitly include password for comparison)
  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  // 3. Compare password using bcrypt
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401);
  }

  // 4. Update lastLogin timestamp
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // 5. Generate JWT token
  const token = generateToken(user._id);

  // 6. Return authenticated user (no password)
  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

// ─────────────────────────────────────────────────────────────
// TASK 6: GET PROFILE
// GET /api/auth/profile
// Protected
// ─────────────────────────────────────────────────────────────
export const getProfile = asyncHandler(async (req, res) => {
  // req.user is already attached by protect middleware
  // password is excluded via select: false on model

  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      skills: req.user.skills,
      desiredRoles: req.user.desiredRoles,
      preferredLocations: req.user.preferredLocations,
      workType: req.user.workType,
      followedCompanies: req.user.followedCompanies,
      avatar: req.user.avatar,
      lastLogin: req.user.lastLogin,
      createdAt: req.user.createdAt,
    },
  });
});

// ─────────────────────────────────────────────────────────────
// BONUS: UPDATE PROFILE
// PUT /api/auth/profile
// Protected
// ─────────────────────────────────────────────────────────────
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "name",
    "skills",
    "desiredRoles",
    "preferredLocations",
    "workType",
    "followedCompanies",
    "avatar",
  ];

  // Build update object from only allowed fields
  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw new AppError("No valid fields provided to update.", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    user: {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      skills: updatedUser.skills,
      desiredRoles: updatedUser.desiredRoles,
      preferredLocations: updatedUser.preferredLocations,
      workType: updatedUser.workType,
      followedCompanies: updatedUser.followedCompanies,
      avatar: updatedUser.avatar,
      lastLogin: updatedUser.lastLogin,
      createdAt: updatedUser.createdAt,
    },
  });
});
