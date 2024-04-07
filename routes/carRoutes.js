const express = require('express');
const CarListing = require('../models/carListing');
const router = express.Router();
const authenticate = require('../middleware/authenticate'); // Adjust the path as necessary

// Middleware to extract user from token and add to request object
router.use(authenticate);

// Endpoint to list a new car
router.post('/list-car', async (req, res) => {
    try {
      const { make, model, year, mileage, location, pricing, availability, image } = req.body;
  
      const carListing = new CarListing({
        owner: req.user._id, // Assuming you have user information from a middleware
        make,
        model,
        year,
        mileage,
        location,
        pricing: {
          perDay: pricing
        },
        availability,
        image // Assuming the image is a Base64 string
      });
      
      await carListing.save();
      res.status(201).send('Car listed successfully');
    } catch (error) {
      console.error("An error occurred while listing the car:", error);
      res.status(400).send(error.message);
    }
  });
  

// Endpoint to get car listings
router.get('/car-listings', async (req, res) => {
  try {
    const listings = await CarListing.find({});
    res.status(200).json(listings);
  } catch (error) {
    console.error("An error occurred while fetching car listings:", error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
