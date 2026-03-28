const authorize = (...roles) => {
  return (req, res, next) => {
     console.log('Authorize - req.user:', req.user);
    if (!req.user) {
      return res.status(401).json({
        message: "user is not authorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log(`Role ${req.user.role} not allowed. Allowed: ${roles}`);
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
};

export default authorize;
