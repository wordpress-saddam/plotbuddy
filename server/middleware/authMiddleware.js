const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findById(decoded.id);
      if (!user || !user.isActive) {
        return res.status(401).json({ success: false, message: 'Not authorized, user is inactive or not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'administrator') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an administrator' });
  }
};

module.exports = { protect, admin };
