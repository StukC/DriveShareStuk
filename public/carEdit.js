document.addEventListener('DOMContentLoaded', function() {
    const carId = getCarIdFromUrl();
    if (carId) {
        fetchCarDetailsAndAutofillForm(carId);
    } else {
        alert('Car ID is missing from the URL');
        window.location.href = 'myCars.html';
    }

    document.getElementById('carEditForm').addEventListener('submit', function(event) {
        event.preventDefault();
        updateCarDetails(carId);
    });
});

function getCarIdFromUrl() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get('carId');
}

function fetchCarDetailsAndAutofillForm(carId) {
    fetch(`/cars/${carId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(car => {
        document.getElementById('make').value = car.make;
        document.getElementById('model').value = car.model;
        document.getElementById('year').value = car.year;
        document.getElementById('mileage').value = car.mileage;
        document.getElementById('location').value = car.location;
        document.getElementById('pricePerDay').value = car.pricePerDay;
        document.getElementById('startDate').value = car.startDate.split('T')[0];
        document.getElementById('endDate').value = car.endDate.split('T')[0];
    })
    .catch(error => {
        console.error('Error fetching car details:', error);
        alert('Failed to fetch car details. Please try again.');
    });
}

function updateCarDetails(carId) {
    const carData = {
        make: document.getElementById('make').value,
        model: document.getElementById('model').value,
        year: parseInt(document.getElementById('year').value, 10),
        mileage: parseInt(document.getElementById('mileage').value, 10),
        location: document.getElementById('location').value,
        pricePerDay: parseFloat(document.getElementById('pricePerDay').value),
        startDate: new Date(document.getElementById('startDate').value).toISOString(),
        endDate: new Date(document.getElementById('endDate').value).toISOString(),
    };

    fetch(`/cars/edit/${carId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(carData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to update car details');
        }
        return response.json();
    })
    .then(() => {
        alert('Car updated successfully!');
        window.location.href = 'myCars.html'; // Redirect back to My Cars page
    })
    .catch(error => {
        console.error('Error updating car:', error);
        alert('Error updating car. Please try again.');
    });
}
