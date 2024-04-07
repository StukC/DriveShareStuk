router.post('/book-car/:carId', async (req, res) => {
  const { carId } = req.params;
  const { fromDate, toDate } = req.body; // Assuming these dates are in ISO format

  try {
    const car = await Car.findById(carId);
    if (!car) {
      res.status(404).json({ message: 'Car not found' });
      return;
    }

    const isBooked = await car.addBooking(new Date(fromDate), new Date(toDate));
    if (isBooked) {
      res.status(200).json({ message: 'Car successfully booked' });
    } else {
      res.status(400).json({ message: 'Car is not available for the selected dates' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});