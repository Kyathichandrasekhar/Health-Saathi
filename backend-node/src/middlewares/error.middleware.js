/**
 * Global error handling middleware
 */
function errorHandler(err, req, res, _next) {
  console.error('❌ Error:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    detail: err.message || 'Internal server error',
    status,
  });
}

module.exports = { errorHandler };
