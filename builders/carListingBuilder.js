class CarListingBuilder {
    constructor() {
      this.listing = {};
    }
  
    setModel(model) {
      this.listing.model = model;
      return this;
    }
  
    setMake(make) {
      this.listing.make = make;
      return this;
    }
  
    setYear(year) {
      this.listing.year = year;
      return this;
    }
  
    setMileage(mileage) {
      this.listing.mileage = mileage;
      return this;
    }
  
    setLocation(location) {
      this.listing.location = location;
      return this;
    }
  
    setPricing(pricing) {
      this.listing.pricing = pricing;
      return this;
    }
  
    setAvailability(availability) {
      this.listing.availability = availability;
      return this;
    }
  
    build() {
      return this.listing;
    }
  }
  
  // Usage
  const carListing = new CarListingBuilder()
    .setModel('Model S')
    .setMake('Tesla')
    .setYear(2020)
    .setMileage(15000)
    .setLocation({ latitude: 37.7749, longitude: -122.4194 })
    .setPricing({ perDay: 100 })
    .setAvailability([{ startDate: new Date(), endDate: new Date() }])
    .build();
  
  console.log(carListing);
  