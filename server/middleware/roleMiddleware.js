// ─── restrictTo: Only allow specific roles ────────────────
// Usage: restrictTo('admin')  OR  restrictTo('admin', 'manager')
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Role '${req.user.role}' is not permitted to perform this action.`,
      });
    }
    next();
  };
};

module.exports = { restrictTo };
