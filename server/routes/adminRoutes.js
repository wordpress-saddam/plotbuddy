const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Land = require('../models/Land');
const { protect, admin } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');

// Apply admin protection to all routes in this file
router.use(protect);
router.use(admin);

// --- USER MANAGEMENT ---

// @route   GET /api/admin/users
// @desc    Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   POST /api/admin/users
// @desc    Create a new user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      isEmailVerified: true // Admins create verified users by default
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update a user
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, role, phone, address, bio } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.bio = bio || user.bio;

    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete a user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete yourself' });
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   PUT /api/admin/users/:id/toggle-status
// @desc    Toggle user active status
router.put('/users/:id/toggle-status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// --- PLOT MANAGEMENT ---

// @route   GET /api/admin/lands
// @desc    Get all plots
router.get('/lands', async (req, res) => {
  try {
    const lands = await Land.find({}).populate('owner', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: lands });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   PUT /api/admin/lands/:id/toggle-publish
// @desc    Toggle plot published status
router.put('/lands/:id/toggle-publish', async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);
    if (!land) {
      return res.status(404).json({ success: false, message: 'Plot not found' });
    }

    land.isPublished = !land.isPublished;
    await land.save();

    res.status(200).json({ success: true, data: land });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Note: General Plot CRUD (Add, Edit, Delete) can reuse landRoutes but with admin check or 
// we can implement them here for more control. For "Assign User", we definitely need specific logic.

module.exports = router;
