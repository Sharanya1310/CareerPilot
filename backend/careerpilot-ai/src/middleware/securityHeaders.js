/**
 * Security Headers Middleware
 * Sets common security headers to protect against common attacks.
 */
const securityHeadersMiddleware = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader("X-Frame-Options", "DENY");

  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Enable XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");

  // Disable referrer header for privacy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Allow requests from same domain only
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  next();
};

export default securityHeadersMiddleware;
