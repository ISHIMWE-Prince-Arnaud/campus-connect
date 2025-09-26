export function errorHandler(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  console.error("Error:", err);
  const status = err.status || 500;
  const message = err.message || "Server error";
  // Show stack trace and details in development
  const response = { error: message };
  if (process.env.NODE_ENV !== "production") {
    response.details = err;
    response.stack = err.stack;
  }
  res.status(status).json(response);
}
