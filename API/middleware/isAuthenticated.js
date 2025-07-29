// middlewares/isAuthenticated.js
const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  // Check if Authorization header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Authorization header missing or invalid" });
  }

  const token = authHeader.split(" ")[1]; // Get token after "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode and verify token

    // Attach user data to the request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next(); // Proceed to the controller
  } catch (error) {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = isAuthenticated;
