// middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  
  // Look for the token in the request headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized — please log in first' });
  }

  try {
    // Verify the token using the secret key from our .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user in the database and attach them to the request (minus their password)
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user || req.user.status === 'inactive') {
      return res.status(401).json({ message: 'Account not found or deactivated' });
    }
    
    next(); // The token is good! Let the request pass through to the route.
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or has expired' });
  }
};

module.exports = { protect };