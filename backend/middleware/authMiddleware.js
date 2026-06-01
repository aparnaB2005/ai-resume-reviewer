const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // JWT is sent in the header like: Authorization: Bearer <token>
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];  // extract just the token

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // decoded = { id: "abc123", iat: ..., exp: ... }

      // Attach full user object to req (minus password)
      req.user = await User.findById(decoded.id).select('-password');

      next();  // ✅ auth passed — continue to the actual route handler
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = protect;