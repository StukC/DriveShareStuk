const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse JSON bodies
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Authentication routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Car routes
const carRoutes = require('./routes/carRoutes');
app.use('/cars', carRoutes); // Use the car routes with /cars prefix

// Root route to serve the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`DriveShare app listening at http://localhost:${port}`);
});
