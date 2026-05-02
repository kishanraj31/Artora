// Middleware — restrict by user role
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // Check if req.user exists and if the user's role is in the allowed roles array
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action' });
    }
    
    // Call next if allowed
    next();
  };
};
