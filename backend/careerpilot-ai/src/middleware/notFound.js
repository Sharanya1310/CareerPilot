import AppError from "../utils/AppError.js";

/**
 * 404 Not Found Handler
 * Catches any request that doesn't match a registered route
 * and forwards it as an operational AppError to the global error handler.
 */
const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

export default notFound;
