// Adaptation of the mediator pattern from register.js
const carListingMediator = (function() {
    const channels = {};

    const subscribe = function(channel, fn) {
        if (!channels[channel]) channels[channel] = [];
        channels[channel].push({ context: this, callback: fn });
        return this;
    };

    const publish = function(channel, ...args) {
        if (!channels[channel]) return false;
        channels[channel].forEach(subscription => {
            subscription.callback.apply(subscription.context, args);
        });
        return this;
    };

    return {
        subscribe,
        publish
    };
})();

// Subscription for list-car event
carListingMediator.subscribe('listCar', formData => {
    const listCarButton = document.getElementById('listCarButton');
    listCarButton.disabled = true;

    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
    fetch('/api/list-car', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        console.log(data);
        alert('Car listed successfully!');
        window.location.href = './home.html'; // Redirect to home after listing
    })
    .catch(error => {
        console.error('Error listing car:', error);
        alert('Error listing car. Please try again.');
    })
    .finally(() => {
        listCarButton.disabled = false;
    });
});

// Car listing form event listener using mediator pattern
document.getElementById('carListingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = new FormData(this); // 'this' refers to the form element
    if (!validateDates()) {
        alert('Please check the dates. The start date must be before the end date.');
        return;
    }

    // Append other form elements as necessary
    const carImageInput = document.getElementById('carImage');
    if (carImageInput.files.length > 0) {
        formData.append('carImage', carImageInput.files[0]);
    }

    carListingMediator.publish('listCar', formData);
});

// Function to validate dates from startDate and endDate inputs
function validateDates() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    return new Date(startDate) < new Date(endDate);
}
