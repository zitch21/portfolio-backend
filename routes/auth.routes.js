// portfolio-backend/routes/auth.routes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail'); // ⬅️ Clean import
const User = require('../models/User');
const router = express.Router();

// Helper to generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

// ─── POST /api/auth/register ───
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/auth/login ───
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      if (user.status === 'inactive') {
        return res.status(403).json({ message: 'Account deactivated. Contact admin.' });
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/auth/forgot-password (Clean Architecture) ───
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Please provide your registered email address.' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate and save OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ message: 'Email service is not configured. Please set EMAIL_USER and EMAIL_PASS.' });
    }

    // Draft message and call the utility function
    const message = `
      <h2>Password Reset Request</h2>
      <p>Your 6-digit password reset code is: <strong style="font-size: 24px; letter-spacing: 2px;">${otp}</strong></p>
      <p>This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Code',
      message: message
    });

    res.json({ message: 'OTP sent to your email!' });
  } catch (err) {
    console.error('\n❌ NODEMAILER ERROR:', err.message, '\n');
    res.status(500).json({ message: 'Error sending email. Check server console for details.' });
  }
});

// ─── POST /api/auth/reset-password (Verify OTP & Save New Password) ───
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email) return res.status(400).json({ message: 'Please provide your registered email address.' });

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      resetPasswordOtp: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP.' });

    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: 'Password has been reset successfully! You can now log in.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;