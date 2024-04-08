const express = require('express');
const router = express.Router();
const Booking = require('../models/booking'); // Adjust the path as necessary
const isAuthenticated = require('../middleware/authenticate'); // Placeholder, adjust according to your setup

// Endpoint to create a new booking
router.post('/create', isAuthenticated, async (req, res) => {
    try {
        const { carId, startDate, endDate } = req.body;
        // Assume authenticated user's ID is available through middleware
        const renterId = req.user._id;

        // Here, add any logic necessary to calculate totalPrice based on the car's pricePerDay and the number of days
        const totalPrice = 100; // Placeholder calculation

        const newBooking = new Booking({
            car: carId,
            renter: renterId,
            startDate,
            endDate,
            totalPrice
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
