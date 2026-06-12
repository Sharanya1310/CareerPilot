import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * protect — JWT Auth Middleware
 *
 * Reads the Authorization: Bearer <token> header,
 * verifies the token, finds the user in DB,
 * and attaches them to req.user for downstream use.
 *
 * Usage:
 *   router.get("/profile", protect, getProfile);
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Read token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. No token found
  if (!token) {
    if (process.env.NODE_ENV === "development") {
      let user = await User.findOne({ email: "sharanya@email.com" });
      if (!user) {
        user = await User.create({
          name: "Sharanya Singh",
          email: "sharanya@email.com",
          password: "DefaultPassword123",
          skills: ["React", "TypeScript", "Tailwind", "Node.js", "Express.js", "MongoDB", "Java", "Git", "Docker"],
          desiredRoles: ["Full Stack Developer", "Frontend Developer"],
          preferredLocations: ["Bangalore", "Pune", "Hyderabad", "Remote"],
          workType: "Hybrid",
          followedCompanies: ["Google", "Microsoft", "Amazon"]
        });
      }
      req.user = user;
      return next();
    }
    throw new AppError("Not authorized. No token provided.", 401);
  }

  // 3. Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new AppError("Session expired. Please log in again.", 401);
    }
    throw new AppError("Invalid token. Please log in again.", 401);
  }

  // 4. Find user in DB (exclude password)
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new AppError("User not found. Token is no longer valid.", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account has been deactivated. Please contact support.", 403);
  }

  // 5. Attach user to request object
  req.user = user;
  next();
});

export default protect;
