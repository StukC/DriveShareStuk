const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
require('dotenv').config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Create an HTTP server
const server = http.createServer(app);

// Import and configure Socket.io
const { Server } = require('socket.io');
const io = new Server(server);

// MongoDB connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse JSON
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Authentication routes
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Car routes
const carRoutes = require('./routes/carRoutes');
app.use('/cars', carRoutes);

// Booking routes
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/bookings', bookingRoutes);

// Root route to serve the login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('A user connected with id:', socket.id);

  socket.on('example_event', (data) => {
    console.log(data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

// Start the server with the HTTP server instance instead of the Express
server.listen(port, () => {
  console.log(`DriveShare app listening at http://localhost:${port}`);
});
