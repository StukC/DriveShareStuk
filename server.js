const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable if available

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

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
app.use('/auth', authRoutes); // Prefix all auth routes with /auth

// Car Routes
const carRoutes = require('./routes/carRoutes');
const authenticate = require('./middleware/authenticate');
app.use('/api', authenticate, carRoutes);

// Root route to serve the login page
app.get('/', (req, res) => {
  console.log('Serving login.html...');
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`DriveShare app listening at http://localhost:${port}`);
});
