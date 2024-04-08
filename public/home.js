document.addEventListener('DOMContentLoaded', function() {
    const applyFiltersBtn = document.getElementById('applyFilters');
    const clearFiltersBtn = document.getElementById('clearFilters');

    // Fetch listings with or without filters
    function fetchCarListings(filters) {
        let query = filters ? Object.keys(filters)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(filters[key])}`)
            .join('&') : '';

        fetch(`/cars/all?${query}`)
            .then(response => response.json())
            .then(cars => {
                const container = document.getElementById('availableCarsContainer');
                container.innerHTML = ''; // Clear existing listings
                cars.forEach(car => {
                    const carElement = document.createElement('div');
                    carElement.className = 'car-listing';
                    const imageSrc = car.carImage ? `data:image/jpeg;base64,${car.carImage}` : 'placeholder-image-url';
                    carElement.innerHTML = `
                        <a href="booking.html?carId=${car._id}">
                            <div class="car-image-wrapper">
                                <img src="${imageSrc}" alt="${car.make} ${car.model}" class="car-image">
                            </div>
                            <div class="car-details">
                                <h3>${car.make} ${car.model}</h3>
                                <p>Mileage: ${car.mileage} | Price: $${car.pricePerDay}/day</p>
                            </div>
                        </a>
                    `;
                    container.appendChild(carElement);
                });
            })
            .catch(error => console.error('Error fetching cars:', error));
    }

    function applyFilters() {
        const filters = {
            make: document.getElementById('filterMake').value,
            model: document.getElementById('filterModel').value,
            location: document.getElementById('filterLocation').value,
            startDate: document.getElementById('filterStartDate').value,
            endDate: document.getElementById('filterEndDate').value,
            mileage: document.getElementById('filterMileage').value,
            pricePerDay: document.getElementById('filterPrice').value,
        };

        // Remove empty keys to avoid unnecessary filtering
        Object.keys(filters).forEach(key => {
            if (!filters[key]) delete filters[key];
        });

        fetchCarListings(Object.keys(filters).length ? filters : null);
    }

    function clearFilters() {
        document.querySelectorAll('.search-filters input').forEach(input => {
            input.value = '';
        });
        fetchCarListings(); // Call without parameters to fetch all active listings
    }

    applyFiltersBtn.addEventListener('click', applyFilters);
    clearFiltersBtn.addEventListener('click', clearFilters);

    // Initial fetch for car listings
    fetchCarListings(); // Call without filters to ensure initial load shows all active cars
});
