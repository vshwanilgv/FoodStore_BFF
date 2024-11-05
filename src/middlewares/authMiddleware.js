const { validateToken } = require('../services/cognitoService');


const authMiddleware = async (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const userData = await validateToken(token);
    req.user = userData; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token', error: error.message });
  }
};

module.exports = authMiddleware;
