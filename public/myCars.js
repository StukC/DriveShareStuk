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
            // Inside fetchMyCarListings function in myCars.js, after appending carElement to the container
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = function() {
                window.location.href = `carEdit.html?carId=${car._id}`; // Assuming car._id is the unique identifier for each car
            };
            carElement.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('delete-btn'); // Optionally add a class for styling
            deleteButton.onclick = function() {
                const confirmDelete = confirm('Are you sure you want to delete this car listing?');
                if (confirmDelete) {
                    deleteCarListing(car._id);
                }
            };
            carElement.appendChild(deleteButton);

        });
    })
    .catch(error => {
        console.error('Error fetching my cars:', error);
        const container = document.getElementById('myCarsContainer');
        container.innerHTML = '<p>Error fetching cars. Please try again later.</p>';
    });
}

function deleteCarListing(carId) {
    fetch(`/cars/${carId}`, { // Your API endpoint for deleting a car listing
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token') // Include the auth token
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete car listing');
        }
        return response.json();
    })
    .then(() => {
        alert('Car listing deleted successfully');
        fetchMyCarListings(); // Refresh the listings
    })
    .catch(error => {
        console.error('Error deleting car listing:', error);
        alert('Error deleting car listing. Please try again.');
    });
}