const express = require('express');
const router = express.Router();
const Car = require('../models/car');
const CarBuilder = require('../utils/carBuilder');
const authenticate = require('../middleware/authenticate');

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
    // get owner from auth user
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
        .setOwner(ownerId);

    const car = carBuilder.build();

    try {
        const newCar = await Car.create(car);
        res.status(201).json(newCar);
    } catch (error) {
        console.error("Error creating car:", error);
        res.status(400).json({ message: "Failed to list car." });
    }
});

// Endpoint to get all car listings
router.get('/all', async (req, res) => {
    const { make, model, location, startDate, endDate, mileage, pricePerDay } = req.query;
    let query = { status: "active" };

    if (make) query.make = make;
    if (model) query.model = model;
    if (location) query.location = location;
    if (startDate) query.startDate = { $gte: startDate };
    if (endDate) query.endDate = { $lte: endDate };
    if (mileage) query.mileage = { $lte: mileage };
    if (pricePerDay) query.pricePerDay = { $lte: pricePerDay };

    try {
        const cars = await Car.find(query);
        res.status(200).json(cars);
    } catch (error) {
        console.error("Error fetching cars:", error);
        res.status(400).json({ message: "Failed to fetch cars." });
    }
});


router.get('/user/:userId', authenticate, async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.userId) {
            return res.status(403).json({ message: "Unauthorized access." });
        }
        const userCars = await Car.find({ owner: req.params.userId });
        res.json(userCars);
    } catch (error) {
        console.error("Error fetching user's cars:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Endpoint to update a car listing
router.put('/edit/:carId', authenticate, async (req, res) => {
    const { make, model, year, mileage, location, pricePerDay, startDate, endDate } = req.body;
    try {
        const carToUpdate = await Car.findOne({ _id: req.params.carId, owner: req.user._id });
        if (!carToUpdate) {
            return res.status(404).json({ message: "Car not found or you're not the owner." });
        }

        // Update the car details
        carToUpdate.make = make || carToUpdate.make;
        carToUpdate.model = model || carToUpdate.model;
        carToUpdate.year = year || carToUpdate.year;
        carToUpdate.mileage = mileage || carToUpdate.mileage;
        carToUpdate.location = location || carToUpdate.location;
        carToUpdate.pricePerDay = pricePerDay || carToUpdate.pricePerDay;
        carToUpdate.startDate = startDate || carToUpdate.startDate;
        carToUpdate.endDate = endDate || carToUpdate.endDate;
        await carToUpdate.save();

        res.json({ message: "Car updated successfully", car: carToUpdate });
    } catch (error) {
        console.error("Error updating car:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// Endpoint to delete a car listing
router.delete('/:carId', authenticate, async (req, res) => {
    try {
        const carToDelete = await Car.findOneAndDelete({ _id: req.params.carId, owner: req.user._id });
        if (!carToDelete) {
            return res.status(404).json({ message: "Car not found or you're not the owner." });
        }
        res.json({ message: "Car deleted successfully" });
    } catch (error) {
        console.error("Error deleting car:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


router.get('/:carId', authenticate, async (req, res) => {
    try {
        const car = await Car.findById(req.params.carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found." });
        }
        res.json(car);
    } catch (error) {
        console.error("Error fetching car:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


module.exports = router;
