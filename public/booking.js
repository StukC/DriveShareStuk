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
  
    initListeners() {
      const bookingForm = document.getElementById('bookingForm');
      bookingForm.addEventListener('submit', this.handleBookingSubmit.bind(this));
    }
  
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
  
    handleResponse(response) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    }
  
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
  
  // Instantiate the mediator to activate it
  document.addEventListener('DOMContentLoaded', () => new BookingMediator());
  