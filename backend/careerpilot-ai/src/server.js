import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/database.js";
import { configureCloudinary } from "./config/cloudinary.js";
import { validateEnvironment } from "./config/validateEnv.js";

const PORT = process.env.PORT || 5000;

/**
 * Graceful shutdown — close DB + server on SIGTERM / SIGINT
 */
const gracefulShutdown = (signal, server) => {
  console.log(`\n⚠️  ${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log("✅ HTTP server closed.");
    process.exit(0);
  });

  // Force shutdown after 10s if connections are hanging
  setTimeout(() => {
    console.error("❌ Forced shutdown after timeout.");
    process.exit(1);
  }, 10_000);
};

/**
 * Bootstrap function — connect to services, then start server
 */
const bootstrap = async () => {
  try {
    // 1. Validate environment variables
    validateEnvironment();

    // 2. Connect to MongoDB Atlas
    await connectDB();

    // 3. Configure Cloudinary
    configureCloudinary();

    // 4. Start Express server
    const server = app.listen(PORT, () => {
      console.log("─────────────────────────────────────────");
      console.log(`🚀 CareerPilot AI — Server running`);
      console.log(`   Mode     : ${process.env.NODE_ENV || "development"}`);
      console.log(`   Port     : ${PORT}`);
      console.log(`   Health   : http://localhost:${PORT}/api/health`);
      console.log("─────────────────────────────────────────");
    });

    // 5. Graceful shutdown listeners
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM", server));
    process.on("SIGINT", () => gracefulShutdown("SIGINT", server));

    // 6. Handle unhandled promise rejections
    process.on("unhandledRejection", (reason) => {
      console.error("🔴 Unhandled Rejection:", reason);
      gracefulShutdown("unhandledRejection", server);
    });

    // 7. Handle uncaught exceptions
    process.on("uncaughtException", (err) => {
      console.error("🔴 Uncaught Exception:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

bootstrap();
