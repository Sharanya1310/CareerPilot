/**
 * Environment Variables Validator
 * Ensures all required env vars are present on startup.
 * Prevents silent failures from missing config.
 */

const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "MONGODB_URI",
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

export const validateEnvironment = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error("❌ Missing required environment variables:");
    missing.forEach((key) => console.error(`   - ${key}`));
    console.error("\n📋 Copy .env.example to .env and fill in all values.");
    process.exit(1);
  }

  console.log("✅ Environment variables validated");
};
