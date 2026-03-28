import { verifyAccessToken } from "../services/authService.js";

const authenticate = (req, res, next) => {
  // Get access token from cookie
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return res.status(401).json({ message: 'No access token provided' });
  }

  // Verify token
  const decoded = verifyAccessToken(accessToken);
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired access token' });
  }

  // Attach user info to request
  req.user = decoded;
  next();
};


export default authenticate;
