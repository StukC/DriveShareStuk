document.addEventListener('DOMContentLoaded', function() {
    const homeMediator = (function() {
        const channels = {};

        function subscribe(channel, fn) {
            if (!channels[channel]) channels[channel] = [];
            channels[channel].push(fn);
        }

        function publish(channel, ...args) {
            if (!channels[channel]) return false;
            channels[channel].forEach(callback => {
                callback(...args);
            });
        }

        return {
            subscribe,
            publish
        };
    })();

    function displayAvailableCars(cars) {
        const container = document.getElementById('availableCarsContainer');
        container.innerHTML = ''; // Clear previous content

        cars.forEach(car => {
            const carElement = document.createElement('div');
            carElement.className = 'car-card';
            const imageUrl = car.image || 'default-car-image.jpg'; // Replace with your default car image path
            carElement.innerHTML = `
                <img src="${imageUrl}" alt="${car.make} ${car.model}" class="car-image">
                <div>
                    <h3>${car.make} ${car.model}</h3>
                    <p>Year: ${car.year}</p>
                    <p>Availability: ${car.availability.startDate} to ${car.availability.endDate}</p>
                    <p>Pick Up Location: ${car.location}</p>
                    <p>Rental Pricing: $${car.pricing.perDay} per day</p>
                </div>
            `;
            container.appendChild(carElement);
        });
    }

    // Trigger the fetch available cars when the DOM is fully loaded
    homeMediator.publish('fetchAvailableCars');
});
