import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { sendResetOTP } from '../utils/mailer.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId, rememberMe = false) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: rememberMe ? '30d' : '1d' }
  );
};

// ─── POST /api/auth/signup ───
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    // Create user
    const user = await User.create({ name, email, password });
    const token = generateToken(user._id, false);

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join('. ') });
    }
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// ─── POST /api/auth/login ───
router.post('/login', async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // Find user with password field
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user._id, rememberMe);

    res.json({
      message: 'Login successful!',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// ─── GET /api/auth/me ───
router.get('/me', auth, async (req, res) => {
  res.json({ user: req.user.toJSON() });
});

// ─── POST /api/auth/forgot-password ───
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+resetOTP +resetOTPExpiry');
    if (!user) {
      // Don't reveal whether user exists — always return success
      return res.json({ message: 'If an account with that email exists, a reset code has been generated.' });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    
    // Hash the OTP before storing
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
    
    user.resetOTP = hashedOTP;
    user.resetOTPExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save({ validateBeforeSave: false });

    // Send OTP via email
    try {
      await sendResetOTP(email, otp, user.name);
      console.log(`📧 Reset code sent to ${email}`);
    } catch (emailError) {
      console.error('Email send error:', emailError.message);
      return res.status(500).json({ message: 'Failed to send reset email. Please try again.' });
    }

    res.json({
      message: 'A 6-digit reset code has been sent to your email.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// ─── POST /api/auth/reset-password ───
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Hash provided OTP and compare
    const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

    const user = await User.findOne({
      email: email.toLowerCase(),
      resetOTP: hashedOTP,
      resetOTPExpiry: { $gt: new Date() },
    }).select('+resetOTP +resetOTPExpiry +password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset code.' });
    }

    // Update password
    user.password = newPassword;
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;
    await user.save();

    const token = generateToken(user._id, false);

    res.json({
      message: 'Password reset successfully!',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

export default router;
