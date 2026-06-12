/**
 * AppError — Custom operational error class.
 *
 * Distinguishes operational errors (e.g. 404, 400) from
 * unexpected programming errors, so the global error handler
 * can respond appropriately without leaking stack traces.
 *
 * Usage:
 *   throw new AppError('User not found', 404);
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true; // mark as a known, safe-to-expose error

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
