// Global error handler — must be last middleware in server.js
const errorMiddleware = (err, req, res, next) => {
  // ─── Mongoose ValidationError → 400 with clean message ───────────────────
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages[0] || "Validation failed",
    });
  }

  // ─── Mongoose CastError (invalid ObjectId, etc.) → 400 ───────────────────
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for field "${err.path}"`,
    });
  }

  // ─── Mongoose duplicate key → 409 ─────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      success: false,
      message: `Duplicate value for "${field}"`,
    });
  }

  // ─── All other errors → use status from error or default to 500 ───────────
  const status  = err.status || err.statusCode || 500;
  const message = err.message || "Internal server error";
  console.error(`[error] ${req.method} ${req.originalUrl} → ${status}: ${message}`);
  res.status(status).json({ success: false, message });
};

export default errorMiddleware;
