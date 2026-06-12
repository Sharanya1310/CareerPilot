/**
 * Async Handler Utility
 *
 * Wraps async route controllers to eliminate try/catch boilerplate.
 * Any thrown error is automatically forwarded to Express's next(err)
 * and caught by the global error handler middleware.
 *
 * Usage:
 *   router.get('/example', asyncHandler(async (req, res) => {
 *     const data = await SomeService.getData();
 *     ApiResponse.ok(res, 'Fetched', data);
 *   }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
