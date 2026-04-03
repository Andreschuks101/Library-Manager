const User = require('../models/user');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ status: 'fail', message: 'User already exists' });
    }

    const user = await User.create({ username, password, role });
    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: { user: { id: user._id, username: user.username, role: user.role } },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ status: 'fail', message: 'Please provide username and password' });
    }

    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ status: 'fail', message: 'Incorrect username or password' });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
      data: { user: { id: user._id, username: user.username, role: user.role } },
    });
  } catch (err) {
    next(err);
  }
};
