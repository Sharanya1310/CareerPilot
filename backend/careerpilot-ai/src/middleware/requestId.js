/**
 * Request ID Middleware
 * Generates or uses existing request ID for request tracing.
 * Useful for debugging and log aggregation.
 */
const generateRequestId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const requestIdMiddleware = (req, res, next) => {
  const requestId = req.headers["x-request-id"] || generateRequestId();
  req.id = requestId;

  // Add to response headers for client reference
  res.setHeader("X-Request-ID", requestId);

  next();
};

export default requestIdMiddleware;
