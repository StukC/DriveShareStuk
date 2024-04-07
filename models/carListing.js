const mongoose = require('mongoose');

const carListingSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  make: String,
  model: String,
  year: Number,
  mileage: Number,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  pricing: {
    perDay: Number,
  },
  availability: [{ startDate: Date, endDate: Date }],
  image: String, // Store a single Base64 image string
  createdAt: { type: Date, default: Date.now }
});

carListingSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('CarListing', carListingSchema);
