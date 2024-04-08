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

// Fetch all car listings
router.get('/', async (req, res) => {
    try {
        const cars = await Car.find({});
        res.status(200).json(cars);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a car listing
router.put('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const updatedCar = await Car.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedCar) {
            return res.status(404).json({ message: "Car not found." });
        }
        res.status(200).json(updatedCar);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a car listing
router.delete('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedCar = await Car.findByIdAndDelete(id);
        if (!deletedCar) {
            return res.status(404).json({ message: "Car not found." });
        }
        res.status(200).json({ message: "Car successfully deleted." });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
