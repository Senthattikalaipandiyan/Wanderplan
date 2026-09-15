const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ─── Helper: Generate JWT ─────────────────────────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// ─── Helper: Format user response ────────────────────────
const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  nationality: user.nationality,
  createdAt: user.createdAt,
});

// ─── POST /api/auth/signup ────────────────────────────────
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Create new user (password hashed via pre-save hook in model)
    const user = await User.create({ name, email, password, role: role || 'traveler' });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: userResponse(user),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/auth/login ─────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Find user and include password field (excluded by default)
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact admin.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: userResponse(user),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    res.json({ success: true, user: userResponse(req.user) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PUT /api/auth/profile ────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, nationality, passportNumber, emergencyContact } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, nationality, passportNumber, emergencyContact },
      { new: true, runValidators: true }
    );

    res.json({ success: true, user: userResponse(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
