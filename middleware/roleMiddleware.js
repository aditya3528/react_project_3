const User = require('../models/User');

const allowRoles = (...roles) => {
  return async (req, res, next) => {
    const user = await User.findById(req.userId);
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ msg: 'Access denied' });
    }
    next();
  };
};

module.exports = allowRoles;
