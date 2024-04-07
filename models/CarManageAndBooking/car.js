const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  fromDate: Date,
  toDate: Date,
  isBooked: {
    type: Boolean,
    default: false,
  },
});

const carSchema = new mongoose.Schema({
  model: String,
  year: Number,
  mileage: Number,
  pickUpLocation: String,
  rentalPricing: mongoose.Schema.Types.Decimal128,
  availabilityCalendar: [bookingSchema],
});

carSchema.methods.isAvailable = async function(fromDate, toDate) {
  for (let booking of this.availabilityCalendar) {
    if (
      (booking.fromDate <= toDate && booking.toDate >= fromDate) &&
      booking.isBooked
    ) {
      return false; // Not available if the ranges overlap and the car is booked
    }
  }
  return true; // Available if none of the bookings overlap
};

carSchema.methods.addBooking = async function(fromDate, toDate) {
  // Add a check to ensure the dates are not already booked
  if (await this.isAvailable(fromDate, toDate)) {
    this.availabilityCalendar.push({
      fromDate,
      toDate,
      isBooked: true,
    });

    await this.save();
    return true;
  } else {
    return false;
  }
};

const Car = mongoose.model('Car', carSchema);
module.exports = Car;