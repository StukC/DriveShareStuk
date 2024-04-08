const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    mileage: { type: Number, required: true },
    location: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    carImage: { type: String, required: false }, // Consider renaming to photos: [{ type: String }]
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['active', 'inactive', 'under_review'], default: 'active' },
    description: { type: String, required: false },
    features: [{ type: String }]
});

carSchema.index({ location: 1, status: 1 });

module.exports = mongoose.model('Car', carSchema);
