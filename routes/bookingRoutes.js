const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Car = require('../models/car');
const isAuthenticated = require('../middleware/authenticate');

// Endpoint to create a new booking
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        const { carId, startDate, endDate } = req.body;
        const renterId = req.user._id;

        const totalPrice = 100;

        const newBooking = new Booking({
            car: carId,
            renter: renterId,
            startDate,
            endDate,
            totalPrice
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
        await Car.findByIdAndUpdate(carId, { status: 'inactive' });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
