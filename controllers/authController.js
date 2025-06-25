const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

exports.register = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.create({ username, password });
  res.status(201).json({ msg: 'User created' });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({ msg: 'Invalid credentials' });
  }
  const token = createToken(user._id);
  res.cookie('token', token, { httpOnly: true }).json({ msg: 'Logged in' });
};

exports.logout = (req, res) => {
  res.clearCookie('token').json({ msg: 'Logged out' });
};
