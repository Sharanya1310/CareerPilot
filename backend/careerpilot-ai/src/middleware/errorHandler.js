import { sendError } from "../utils/apiResponse.js";

/**
 * Handle Mongoose CastError (invalid ObjectId)
 */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return { statusCode: 400, message };
};

/**
 * Handle Mongoose duplicate key error
 */
const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate value for field '${field}': '${value}'. Please use a different value.`;
  return { statusCode: 409, message };
};

/**
 * Handle Mongoose ValidationError
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((e) => ({
    field: e.path,
    message: e.message,
  }));
  return { statusCode: 400, message: "Validation failed", errors };
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => ({
  statusCode: 401,
  message: "Invalid token. Please log in again.",
});

const handleJWTExpiredError = () => ({
  statusCode: 401,
  message: "Your session has expired. Please log in again.",
});

/**
 * Development error — full detail for debugging
 */
const sendDevError = (err, res) => {
  console.error("🔴 ERROR:", err);
  return res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

/**
 * Production error — safe messages only
 */
const sendProdError = (err, res) => {
  if (err.isOperational) {
    return sendError(res, err.statusCode, err.message, err.errors || null);
  }
  // Unknown / programming error — don't leak details
  console.error("🔴 UNEXPECTED ERROR:", err);
  return sendError(res, 500, "Something went wrong. Please try again later.");
};

/**
 * Global Error Handler Middleware
 * Must be registered LAST in app.js (after all routes).
 */
const handleMulterError = (err) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return {
      statusCode: 400,
      message: "File too large. Maximum allowed size is 5MB.",
      isOperational: true,
    };
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return {
      statusCode: 400,
      message: "Unexpected file field. Use the 'resume' field for uploads.",
      isOperational: true,
    };
  }

  return null;
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    const multerError = handleMulterError(err);
    if (multerError) {
      err.statusCode = multerError.statusCode;
      err.message = multerError.message;
      err.isOperational = multerError.isOperational;
    }
    return sendDevError(err, res);
  }

  // Transform known Mongoose / JWT errors into clean AppErrors
  let error = { ...err, message: err.message, isOperational: err.isOperational };

  if (err.name === "CastError") {
    const { statusCode, message } = handleCastError(err);
    error = { statusCode, message, isOperational: true };
  } else if (err.code === 11000) {
    const { statusCode, message } = handleDuplicateKeyError(err);
    error = { statusCode, message, isOperational: true };
  } else if (err.name === "ValidationError") {
    const { statusCode, message, errors } = handleValidationError(err);
    error = { statusCode, message, errors, isOperational: true };
  } else if (err.name === "JsonWebTokenError") {
    const { statusCode, message } = handleJWTError();
    error = { statusCode, message, isOperational: true };
  } else if (err.name === "TokenExpiredError") {
    const { statusCode, message } = handleJWTExpiredError();
    error = { statusCode, message, isOperational: true };
  } else if (err.name === "MulterError") {
    const multerError = handleMulterError(err);
    if (multerError) {
      error = multerError;
    }
  }

  return sendProdError(error, res);
};

export default globalErrorHandler;
