const express = require('express');
const User = require('../models/user.model');
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, mobile, email } = req.body;
    if (!name || !mobile)
      return res.status(400).json({ message: 'Name and Mobile are required' });
    const existingUser = await User.findOne({ mobile });
    if (existingUser)
      return res
        .status(400)
        .json({ message: 'Mobile number already registered' });
    const newUser = new User({ name, mobile, email });
    await newUser.save();
    res
      .status(201)
      .json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get latest user
router.get('/latest-user', async (req, res) => {
  try {
    const latestUser = await User.findOne().sort({ createdAt: -1 });
    if (!latestUser) return res.status(404).json({ message: 'No user found' });
    res.json(latestUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user by id
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

module.exports = router;
