document.addEventListener('DOMContentLoaded', function() {
    fetchCarListings();

    function fetchCarListings() {
        fetch('/cars/all')
            .then(response => response.json())
            .then(cars => {
                const container = document.getElementById('availableCarsContainer');
                cars.forEach(car => {
                    const carElement = document.createElement('div');
                    carElement.className = 'car-listing';
                    const imageSrc = car.carImage ? `data:image/jpeg;base64,${car.carImage}` : 'placeholder-image-url'; // Use a placeholder image if carImage is null

                    // Use a div to wrap the image and details for better styling control
                    carElement.innerHTML = `
                        <div class="car-image-wrapper">
                            <img src="${imageSrc}" alt="${car.make} ${car.model}" class="car-image">
                        </div>
                        <div class="car-details">
                            <h3>${car.make} ${car.model}</h3>
                            <p>Mileage: ${car.mileage} | Price: $${car.pricePerDay}/day</p>
                        </div>
                    `;
                    container.appendChild(carElement);
                });
            })
            .catch(error => console.error('Error fetching cars:', error));
    }
});
