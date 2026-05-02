const express = require('express');
const router = express.Router();
const Land = require('../models/Land');
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');

// Delhi NCR Bounding Box validation
const isWithinDelhiNCR = (lat, lng) => {
  const minLat = 28.2;
  const maxLat = 28.9;
  const minLng = 76.8;
  const maxLng = 77.6;
  return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
};

// @route   POST /api/lands/register
// @desc    Register a new land plot
// @access  Private
router.post('/register', protect, upload.array('images', 5), async (req, res) => {
  try {
    const { title, area, lat, lng, fencing, water, electricity, monthlyRent } = req.body;

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ success: false, message: 'Invalid coordinates provided.' });
    }

    if (!isWithinDelhiNCR(latitude, longitude)) {
      return res.status(400).json({ success: false, message: 'Plot location must be within Delhi NCR.' });
    }

    // Get Cloudinary URLs
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    const newLand = new Land({
      title,
      area: parseFloat(area),
      location: {
        type: 'Point',
        // Note: GeoJSON uses [longitude, latitude]
        coordinates: [longitude, latitude]
      },
      amenities: {
        fencing: fencing === 'true' || fencing === true,
        water: water === 'true' || water === true,
        electricity: electricity === 'true' || electricity === true,
      },
      monthlyRent: parseFloat(monthlyRent),
      images: imageUrls,
      owner: req.user.id // Associate the land with the logged-in user
    });

    await newLand.save();

    res.status(201).json({
      success: true,
      message: 'Land registered successfully!',
      data: newLand
    });
  } catch (error) {
    console.error('Error registering land:', error);
    res.status(500).json({ success: false, message: 'Server Error. Please try again.' });
  }
});

// @route   GET /api/lands
// @desc    Get all registered plots (with optional filtering)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { minArea, maxRent, fencing, water, electricity, limit } = req.query;
    
    // Build query object
    let query = {};
    
    if (minArea) query.area = { $gte: parseFloat(minArea) };
    if (maxRent) query.monthlyRent = { $lte: parseFloat(maxRent) };
    
    if (fencing === 'true') query['amenities.fencing'] = true;
    if (water === 'true') query['amenities.water'] = true;
    if (electricity === 'true') query['amenities.electricity'] = true;
    
    let landsQuery = Land.find(query).sort({ createdAt: -1 });
    
    if (limit) {
      landsQuery = landsQuery.limit(parseInt(limit));
    }
    
    const lands = await landsQuery;
    
    res.status(200).json({
      success: true,
      count: lands.length,
      data: lands
    });
  } catch (error) {
    console.error('Error fetching lands:', error);
    res.status(500).json({ success: false, message: 'Server Error. Please try again.' });
  }
});

// @route   GET /api/lands/:id
// @desc    Get a single plot by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);
    
    if (!land) {
      return res.status(404).json({ success: false, message: 'Plot not found' });
    }
    
    res.status(200).json({
      success: true,
      data: land
    });
  } catch (error) {
    console.error('Error fetching land by ID:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Plot not found' });
    }
    res.status(500).json({ success: false, message: 'Server Error. Please try again.' });
  }
});

module.exports = router;
