const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// @route   GET /api/users/me
// @desc    Get current user profile (with favorites populated)
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
        favorites: user.favorites // Fully populated Land objects
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   PUT /api/users/me
// @desc    Update user profile details
// @access  Private
router.put('/me', protect, async (req, res) => {
  try {
    const { name, phone, address, bio } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (bio !== undefined) user.bio = bio;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
        favorites: user.favorites // Just ObjectIds here, but that's fine
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   POST /api/users/favorites/:plotId
// @desc    Add a plot to favorites
// @access  Private
router.post('/favorites/:plotId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Initialize if undefined
    if (!user.favorites) {
      user.favorites = [];
    }
    
    // Check if already in favorites
    if (user.favorites.some(id => id.toString() === req.params.plotId)) {
      return res.status(400).json({ success: false, message: 'Plot is already in favorites' });
    }
    
    user.favorites.push(req.params.plotId);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Plot added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   DELETE /api/users/favorites/:plotId
// @desc    Remove a plot from favorites
// @access  Private
router.delete('/favorites/:plotId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Initialize if undefined
    if (!user.favorites) {
      user.favorites = [];
    }
    
    // Remove from array
    user.favorites = user.favorites.filter(id => id.toString() !== req.params.plotId);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Plot removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// @route   POST /api/users/profile-photo
// @desc    Upload profile photo
// @access  Private
router.post('/profile-photo', protect, upload.single('profilePicture'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.profilePicture = req.file.path;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile photo updated successfully',
      profilePicture: user.profilePicture
    });
  } catch (error) {
    console.error('Error uploading profile photo:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
