const User = require('../models/User');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Register User/Admin
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role });

    const token = crypto.randomBytes(32).toString('hex');
    await Token.create({
      userId: user._id,
      token,
      type: 'verify',
    });

    const link = `${process.env.CLIENT_URL}/verify-email/${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email',
      html: `<p>Hello ${user.name}, please verify your email by clicking <a href="${link}">here</a>.</p>`,
    });

    res.status(201).json({ message: 'Registration successful. Please verify your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const existing = await Token.findOne({ token, type: 'verify' }).populate('userId');

    if (!existing) return res.status(400).json({ message: 'Invalid or expired token' });

    const user = existing.userId;
    user.isVerified = true;
    await user.save();
    await existing.deleteOne();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Email verification failed' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email first' });
    }

    const token = generateToken(user);
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed' });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = crypto.randomBytes(32).toString('hex');
    await Token.create({
      userId: user._id,
      token,
      type: 'reset',
    });

    const link = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Reset Your Password',
      html: `<p>Click <a href="${link}">here</a> to reset your password. Link expires in 1 hour.</p>`,
    });

    res.status(200).json({ message: 'Password reset link sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to send reset link' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const existing = await Token.findOne({ token, type: 'reset' }).populate('userId');
    if (!existing) return res.status(400).json({ message: 'Invalid or expired token' });

    const user = existing.userId;
    user.password = newPassword;
    await user.save();
    await existing.deleteOne();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Reset failed' });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
};
