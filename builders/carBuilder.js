class CarBuilder {
  constructor() {
      // Initialize with default values
      this.car = {
          make: '',
          model: '',
          year: null,
          mileage: null,
          location: '',
          pricePerDay: null,
          availability: {
              startDate: null,
              endDate: null,
          },
          imageBase64: '',
          ownerId: null,
      };
  }

  setMake(make) {
      this.car.make = make;
      return this; // Return the builder for chaining
  }

  setModel(model) {
      this.car.model = model;
      return this;
  }

  setYear(year) {
      this.car.year = year;
      return this;
  }

  setMileage(mileage) {
      this.car.mileage = mileage;
      return this;
  }

  setLocation(location) {
      this.car.location = location;
      return this;
  }

  setPricePerDay(pricePerDay) {
      this.car.pricePerDay = pricePerDay;
      return this;
  }

  setAvailability(startDate, endDate) {
      this.car.availability.startDate = startDate;
      this.car.availability.endDate = endDate;
      return this;
  }

  setImageBase64(imageBase64) {
      this.car.imageBase64 = imageBase64;
      return this;
  }

  setOwner(ownerId) {
      this.car.ownerId = ownerId;
      return this;
  }

  build() {
      // You could add validation or transformations here if needed
      return this.car;
  }
}

module.exports = CarBuilder;
