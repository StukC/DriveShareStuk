// Mediator for car listing operations
class CarListingMediator {
    constructor() {
      this.token = localStorage.getItem('token');
      this.userId = localStorage.getItem('userId');
      this.initListeners();
    }
  
    initListeners() {
      document.getElementById('carListingForm').addEventListener('submit', this.handleFormSubmit.bind(this));
    }
  
    async handleFormSubmit(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
  
      // Image processing and formData transformation are handled by the mediator
      await this.processCarImage(formData);
      const carData = this.buildCarData(formData);
  
      this.postCarListing(carData).then(this.handleResponse).catch(this.handleError);
    }
  
    //process car image with base64
    async processCarImage(formData) {
      const file = formData.get('carImage');
      if (file && file.type.match('image.*')) {
        const base64Data = await this.convertFileToBase64(file);
        formData.set('carImage', base64Data.split(';base64,').pop());
      } else {
        formData.delete('carImage');
      }
    }
  
    //build car data
    buildCarData(formData) {
      let carData = Object.fromEntries(formData.entries());
      return { ...carData, owner: this.userId };
    }
  
    // post listing
    async postCarListing(carData) {
      return fetch('/cars/list', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + this.token
        },
        body: JSON.stringify(carData)
      });
    }
  
    //converting to base64 for db storage
    async convertFileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
      });
    }
  
    handleResponse = async (response) => {
      const result = await response.json();
  
      if (response.ok) {
        alert('Car listed successfully!');
        window.location.href = '/home.html';
      } else {
        console.error('Failed to list car:', result.message);
        alert('Failed to list car: ' + result.message);
      }
    }
  
    handleError = (error) => {
      console.error('Error listing car:', error);
      alert('Error listing car. Please try again.');
    }
  }
  
  // Instantiate the mediator to activate it
  new CarListingMediator();
  