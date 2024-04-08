class CarBuilder {
    constructor() {
        this.car = {};
    }

    setMake(make) {
        this.car.make = make;
        return this;
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

    setStartDate(startDate) {
        this.car.startDate = startDate;
        return this;
    }

    setEndDate(endDate) {
        this.car.endDate = endDate;
        return this;
    }

    setCarImage(carImage) {
        this.car.carImage = carImage;
        return this;
    }

    setOwner(ownerId) {
        this.car.owner = ownerId;
        return this;
    }

    build() {
        return this.car;
    }
}
module.exports = CarBuilder;
