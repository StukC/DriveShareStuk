document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('carId');
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('No authentication token found.');
        alert('Please log in to continue.');
        window.location.href = 'login.html'; // Redirect to the login page
        return;
    }

    fetch(`/cars/${carId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(car => {
        const detailsDiv = document.querySelector('.car-details');
        // Use the same approach as in home.js for the image source
        const imageSrc = car.carImage ? `data:image/jpeg;base64,${car.carImage}` : 'placeholder-image-url';
        detailsDiv.innerHTML = `
            <h3>${car.make} ${car.model} (${car.year})</h3>
            <p><strong>Mileage:</strong> ${car.mileage} miles</p>
            <p><strong>Location:</strong> ${car.location}</p>
            <p><strong>Price Per Day:</strong> $${car.pricePerDay}</p>
        `;
        // Setting the min and max values for start and end date inputs
        document.getElementById('startDate').min = car.startDate.split('T')[0];
        document.getElementById('endDate').max = car.endDate.split('T')[0];
    })
    .catch(error => {
        console.error('Error fetching car details:', error);
        alert('Failed to load car details.');
    });

    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        fetch('/bookings/create', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                carId,
                startDate,
                endDate
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            alert('Booking successful!');
            console.log(data);
            window.location.href = '/home.html';
        })
        .catch(error => {
            console.error('Error during booking:', error);
            alert('Booking failed: ' + error.message);
        });
    });
});
