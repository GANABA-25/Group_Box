const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  const token = req.get("Authorization").split(" ")[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed: Invalid token",
    });
  }

  if (!decodedToken) {
    return res.status(401).json({
      message: "Authentication failed: Invalid token",
    });
  }

  req.userId = decodedToken.userId;

  next();
};
