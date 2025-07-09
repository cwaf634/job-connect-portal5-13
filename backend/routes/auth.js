
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, userType, phone, companyName, shopName, location } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user object
    const userData = {
      name,
      email,
      password,
      userType,
      phone
    };

    // Add type-specific data
    if (userType === 'employer') {
      userData.employerDetails = {
        companyName,
        shopName,
        location,
        verificationStatus: 'pending'
      };
    } else if (userType === 'student') {
      userData.studentDetails = {
        subscriptionPlan: 'basic',
        mockTestsCompleted: 0
      };
    } else if (userType === 'admin') {
      userData.adminDetails = {
        permissions: ['all']
      };
    }

    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Update last login for admin
    if (user.userType === 'admin') {
      user.adminDetails.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, userType: user.userType },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Login successful',
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const userResponse = req.user.toObject();
    delete userResponse.password;
    res.json({ user: userResponse });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user data', error: error.message });
  }
});

// Logout (client-side token removal)
router.post('/logout', auth, (req, res) => {
  res.json({ message: 'Logout successful' });
});

module.exports = router;
