/**
 * Centralized API Response Utility
 * Ensures a consistent response envelope across all endpoints.
 *
 * Success shape:  { success: true,  message, data, meta? }
 * Error shape:    { success: false, message, errors? }
 */

/**
 * Send a successful response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {*} data
 * @param {object} [meta]  - Optional pagination or extra info
 */
export const sendSuccess = (res, statusCode = 200, message = "Success", data = null, meta = null) => {
  const response = {
    success: true,
    message,
    data,
  };

  if (meta) response.meta = meta;

  return res.status(statusCode).json(response);
};

/**
 * Send an error response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {*} [errors]  - Optional field-level validation errors
 */
export const sendError = (res, statusCode = 500, message = "Internal Server Error", errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) response.errors = errors;

  return res.status(statusCode).json(response);
};

/**
 * Convenience wrappers for common HTTP statuses
 */
export const ApiResponse = {
  ok: (res, message, data, meta) => sendSuccess(res, 200, message, data, meta),
  created: (res, message, data) => sendSuccess(res, 201, message, data),
  badRequest: (res, message, errors) => sendError(res, 400, message, errors),
  unauthorized: (res, message = "Unauthorized") => sendError(res, 401, message),
  forbidden: (res, message = "Forbidden") => sendError(res, 403, message),
  notFound: (res, message = "Resource not found") => sendError(res, 404, message),
  conflict: (res, message) => sendError(res, 409, message),
  serverError: (res, message = "Internal Server Error") => sendError(res, 500, message),
};
