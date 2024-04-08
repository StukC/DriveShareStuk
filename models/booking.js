const mongoose = require('mongoose');
const Car = require('./car'); // Make sure this path correctly points to your Car model

const bookingSchema = new mongoose.Schema({
    car: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Car', 
        required: true 
    },
    renter: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['pending', 'confirmed', 'cancelled', 'completed'], 
        default: 'pending' 
    },
    totalPrice: { 
        type: Number, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Ensure a car cannot be double-booked for overlapping periods
bookingSchema.index({ car: 1, startDate: 1, endDate: 1 }, { unique: true });

// Pre-save hook for validating booking dates against car availability
bookingSchema.pre('save', async function(next) {
    const booking = this;
    // Find the car associated with this booking
    const car = await Car.findById(booking.car);
    if (!car) {
        return next(new Error('Car not found'));
    }

    // Check if the booking dates are within the car's available dates
    if (booking.startDate < car.startDate || booking.endDate > car.endDate) {
        return next(new Error('Booking dates must be within the car\'s available period'));
    }

    next();
});

module.exports = mongoose.model('Booking', bookingSchema);
