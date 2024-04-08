// Mediator for booking operations
class BookingMediator {
  constructor() {
    this.token = localStorage.getItem('token');
    this.carId = new URLSearchParams(window.location.search).get('carId');
    if (!this.token) {
      this.redirectToLogin();
    } else {
      this.initListeners();
      this.fetchCarDetails();
    }
  }

  redirectToLogin() {
    console.error('No authentication token found.');
    alert('Please log in to continue.');
    window.location.href = 'login.html';
  }

  // booking data listener for notifications/messages
  initListeners() {
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', this.handleBookingSubmit.bind(this));
  }

  // get car data
  fetchCarDetails() {
    fetch(`/cars/${this.carId}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.token,
        'Content-Type': 'application/json'
      }
    })
    .then(this.handleResponse)
    .then(this.displayCarDetails)
    .catch(this.handleError);
  }

  // edge case
  handleResponse(response) {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // display available car listings
  displayCarDetails = (car) => {
    const detailsDiv = document.querySelector('.car-details');
    const imageSrc = car.carImage ? `data:image/jpeg;base64,${car.carImage}` : 'placeholder-image-url';
    detailsDiv.innerHTML = `
      <h3>${car.make} ${car.model} (${car.year})</h3>
      <p><strong>Mileage:</strong> ${car.mileage} miles</p>
      <p><strong>Location:</strong> ${car.location}</p>
      <p><strong>Price Per Day:</strong> $${car.pricePerDay}</p>
    `;
    document.getElementById('startDate').min = car.startDate.split('T')[0];
    document.getElementById('endDate').max = car.endDate.split('T')[0];
  }

  handleBookingSubmit(e) {
    e.preventDefault();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    fetch('/bookings/create', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        carId: this.carId,
        startDate,
        endDate
      })
    })
    .then(this.handleResponse)
    .then(this.handleBookingSuccess)
    .catch(this.handleError);
  }

  handleBookingSuccess = (data) => {
    alert('Booking successful!');
    console.log(data);
    window.location.href = '/home.html';
  }

  handleError = (error) => {
    console.error('Error:', error);
    alert('Failed: ' + error.message);
  }
}

// Payment handler - Real Subject
class PaymentHandler {
  processPayment(amount) {
    console.log(`Processing payment of $${amount}`);
    return new Promise((resolve) => {
      setTimeout(() => resolve("Payment Processed, you will be charged upon Rental Confirmation"), 2000);
    });
  }
}

// Payment Proxy
class PaymentProxy {
  constructor() {
    this.paymentHandler = new PaymentHandler();
    this.cache = new Map();
  }

  processPayment(amount) {
    if (this.cache.has(amount)) {
      return Promise.resolve(this.cache.get(amount));
    } else {
      return this.paymentHandler.processPayment(amount).then((result) => {
        this.cache.set(amount, result);
        return result;
      });
    }
  }
}

const paymentProxy = new PaymentProxy();

function handlePayment() {
  paymentProxy.processPayment(100) // Simulate payment of a fixed amount
    .then((message) => {
      alert(message);
    })
    .catch((error) => {
      console.error('Payment processing error:', error);
      alert('Payment failed. Please try again.');
    });
}

// Making handlePayment globally accessible
window.handlePayment = handlePayment;

// Instantiate the mediator to activate it
document.addEventListener('DOMContentLoaded', () => new BookingMediator());
