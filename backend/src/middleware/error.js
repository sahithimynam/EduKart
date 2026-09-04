// Centralized error handler
export function errorHandler(err, req, res, next) {
  console.error("API Error:", err);

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(400).json({ message: `An account with this ${field} already exists.` });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: `Resource not found with invalid id: ${err.value}` });
  }

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({ message: err.message || "Internal server error." });
}
