const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "sugarcane-demo-secret-key";

// --------------------------------------------------
// Verify JWT token
// --------------------------------------------------

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const user = jwt.verify(token, JWT_SECRET);

    req.user = user;

    next();
  } catch (error) {
    return res.status(403).json({
      message: "Invalid or expired token"
    });
  }
}

// --------------------------------------------------
// Admin-only middleware
// --------------------------------------------------

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  next();
}

// --------------------------------------------------
// Farmer-only middleware
// --------------------------------------------------

function requireFarmer(req, res, next) {
  if (!req.user || req.user.role !== "farmer") {
    return res.status(403).json({
      message: "Farmer access required"
    });
  }

  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireFarmer
};