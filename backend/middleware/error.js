function errorHandler(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Server error';
  res.status(status).json({ error: message });
}
module.exports = { errorHandler };


