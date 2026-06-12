import jwt from "jsonwebtoken";

/**
 * Generate a signed JWT token
 * @param {string} id - MongoDB user _id
 * @returns {string} Signed JWT token (expires in 7 days)
 */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export default generateToken;
