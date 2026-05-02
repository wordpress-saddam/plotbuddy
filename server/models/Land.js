const mongoose = require('mongoose');

const LandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  area: {
    type: Number,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  amenities: {
    fencing: { type: Boolean, default: false },
    water: { type: Boolean, default: false },
    electricity: { type: Boolean, default: false }
  },
  monthlyRent: {
    type: Number,
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create a geospatial index on location
LandSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Land', LandSchema);
