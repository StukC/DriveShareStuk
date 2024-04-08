// Mediator object
const authMediator = (function() {
    // Private members
    const channels = {};

    const subscribe = function(channel, fn) {
        if (!channels[channel]) {
            channels[channel] = [];
        }
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

    // Public API
    return {
        subscribe,
        publish
    };
})();

// Subscribe to login event
authMediator.subscribe('login', (email, password) => {
    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.token && data.userId) {
            // Store the token and the user ID in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId); // Now also storing the user ID

            alert('Login successful!');
            window.location.href = '/home.html'; // Redirect to the home page
        } else {
            alert('Login failed. Please check your credentials.');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Login failed. Please try again later.');
    });
});

// Form submission event listener using mediator
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    authMediator.publish('login', email, password);
});
