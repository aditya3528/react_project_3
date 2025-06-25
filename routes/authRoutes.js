const express = require('express');
const { register, login, logout } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(401).json({ msg: 'User not found' });

  res.json({ username: user.username, role: user.role });
});

module.exports = router;
