const express = require('express');
const User = require('../models/user.model');
const router = express.Router();

// @route   POST /api/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, mobile, email } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ message: 'Name and Mobile are required' });
    }

    // Check if mobile already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Mobile number already registered' });
    }

    const newUser = new User({ name, mobile, email });
    await newUser.save();

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('❌ Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/latest-user
// @desc    Get the most recently registered user
router.get('/latest-user', async (req, res) => {
  try {
    const latestUser = await User.findOne().sort({ createdAt: -1 });
    if (!latestUser) {
      return res.status(404).json({ message: 'No user found' });
    }
    res.json({
      _id: latestUser._id,
      name: latestUser.name,
      mobile: latestUser.mobile,
      email: latestUser.email || null,
      createdAt: latestUser.createdAt,
    });
  } catch (err) {
    console.error('❌ Error fetching latest user:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;
