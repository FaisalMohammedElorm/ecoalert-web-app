// 404 handler for unknown routes.
export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

// Central error handler. Translates common errors to clean JSON responses.
export function errorHandler(err, req, res, _next) {
  console.error('API error:', err.message);

  // Multer file-size / type errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File size must be less than 10MB.' });
  }
  if (err.message?.startsWith('Invalid file type')) {
    return res.status(400).json({ message: err.message });
  }
  // Duplicate key (e.g. email already registered)
  if (err.code === 11000) {
    return res.status(409).json({ message: 'This email is already registered.' });
  }
  // Mongoose validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: Object.values(err.errors)[0]?.message || 'Validation failed.' });
  }
  // Invalid MongoDB ObjectId values, for example /api/reports/not-an-id.
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid resource id.' });
  }

  res.status(err.status || 500).json({ message: err.message || 'Something went wrong.' });
}
