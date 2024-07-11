const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({
        msg: "Unauthorized",
      });
    }
  
    const token = authHeader.split(" ")[1];
  
    if (!token || token.split('.').length !== 3) {
      return res.status(403).json({
        msg: "Invalid token",
      });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
  
      req.userId = decoded.userId;
  
      next();
    } catch (err) {
      return res.status(403).json({
        msg: "Invalid token",
      });
    }
  };

module.exports = {
  authMiddleware,
};