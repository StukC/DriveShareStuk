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
                    const imageSrc = car.carImage ? `data:image/jpeg;base64,${car.carImage}` : 'placeholder-image-url';
                    carElement.innerHTML = `
                        <img src="${imageSrc}" alt="Car Image">
                        <h3>${car.make} ${car.model}</h3>
                        <p>Mileage: ${car.mileage} | Price: $${car.pricePerDay}/day</p>
                    `;
                    container.appendChild(carElement);
                });
            })
            .catch(error => console.error('Error fetching cars:', error));
    }
});
