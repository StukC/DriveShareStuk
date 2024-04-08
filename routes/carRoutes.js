const express = require('express');
const router = express.Router();
const Car = require('../models/car');
const CarBuilder = require('../utils/carBuilder');
const authenticate = require('../middleware/authenticate');

// Assume authenticate middleware adds the authenticated user's ID to req.user._id

// Input validation middleware
const validateCarInput = (req, res, next) => {
    const { make, model, year, mileage, location, pricePerDay, startDate, endDate } = req.body;
    if (!make || !model || !year || !mileage || !location || !pricePerDay || !startDate || !endDate) {
        return res.status(400).json({ message: "All fields are required." });
    }
    next();
};

// Endpoint to list a new car
router.post('/list', authenticate, validateCarInput, async (req, res) => {
    const { make, model, year, mileage, location, pricePerDay, startDate, endDate, carImage } = req.body;
    // Extracting owner from the authenticated user
    const ownerId = req.user._id; 

    const carBuilder = new CarBuilder()
        .setMake(make)
        .setModel(model)
        .setYear(year)
        .setMileage(mileage)
        .setLocation(location)
        .setPricePerDay(pricePerDay)
        .setStartDate(startDate)
        .setEndDate(endDate)
        .setCarImage(carImage)
        .setOwner(ownerId); // Building the car object

    // Assign the result of the build method to a variable
    const car = carBuilder.build();

    try {
        const newCar = await Car.create(car); // Now 'car' is defined
        res.status(201).json(newCar);
    } catch (error) {
        console.error("Error creating car:", error);
        res.status(400).json({ message: "Failed to list car." });
    }
});

// Endpoint to get all car listings
router.get('/all', async (req, res) => {
    try {
        const cars = await Car.find({});
        res.status(200).json(cars);
    } catch (error) {
        console.error("Error fetching cars:", error);
        res.status(400).json({ message: "Failed to fetch cars." });
    }
});

module.exports = router;
