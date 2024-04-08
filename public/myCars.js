document.addEventListener('DOMContentLoaded', function() {
    fetchMyCarListings();
});

function fetchMyCarListings() {
    // Retrieve 'userId' from localStorage. Ensure that you're storing 'userId' after login
    const userId = localStorage.getItem('userId'); 
    if (!userId) {
        console.error('No user ID found in localStorage.');
        return;
    }

    // Construct the URL with the user's ID to get the cars associated with this user
    const url = `/cars/user/${userId}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // Add the authorization token if your authentication process requires it
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming you store the token in localStorage
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(cars => {
        const container = document.getElementById('myCarsContainer');
        container.innerHTML = ''; // Clear existing content

        // Check if the user has no cars listed
        if (cars.length === 0) {
            container.innerHTML = '<p>You have no cars listed.</p>';
            return;
        }

        // Iterate through the list of cars and create elements for each one
        cars.forEach(car => {
            const carElement = document.createElement('div');
            carElement.className = 'car-listing';
            const imageSrc = car.carImage ? `data:image/jpeg;base64,${car.carImage}` : 'placeholder-image-url';

            carElement.innerHTML = `
                <div class="car-image-wrapper">
                    <img src="${imageSrc}" alt="${car.make} ${car.model}" class="car-image">
                </div>
                <div class="car-details">
                    <h3>${car.make} ${car.model}</h3>
                    <p>Mileage: ${car.mileage} | Price: $${car.pricePerDay}/day</p>
                    <!-- You may want to add additional details here -->
                </div>
            `;
            container.appendChild(carElement);
        });
    })
    .catch(error => {
        console.error('Error fetching my cars:', error);
        const container = document.getElementById('myCarsContainer');
        container.innerHTML = '<p>Error fetching cars. Please try again later.</p>';
    });
}
