const mongoose = require('mongoose');

const carListingSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    mileage: { type: Number, required: true },
    location: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    availability: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
    },
    imageBase64: { type: String, required: false }, // Consider making this optional based on your application's requirements
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

// Ensure indexes for search optimization (adjust according to your search requirements)
carListingSchema.index({ location: 1, "availability.startDate": 1, "availability.endDate": 1 });

const CarListing = mongoose.model('CarListing', carListingSchema);

module.exports = CarListing;
