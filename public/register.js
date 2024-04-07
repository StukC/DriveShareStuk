// Mediator object
const authMediator = (function() {
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

// Subscription for register event
authMediator.subscribe('register', formData => {
    const registerButton = document.querySelector('button[type="submit"]');
    registerButton.disabled = true;

    fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
        }
        return response.text();
    })
    .then(data => {
        console.log(data);
        alert('Registration successful!');
        window.location.href = '/login.html';
    })
    .catch(error => {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
    })
    .finally(() => {
        registerButton.disabled = false;
    });
});

// Register form event listener using mediator
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const formData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        securityQuestion1: "Your first pet's name?", // Use actual question text
        securityAnswer1: document.getElementById('securityAnswer1').value,
        securityQuestion2: "The city you were born in?", // Use actual question text
        securityAnswer2: document.getElementById('securityAnswer2').value,
        securityQuestion3: "Your favorite book?", // Use actual question text
        securityAnswer3: document.getElementById('securityAnswer3').value
    };

    console.log(formData);
    authMediator.publish('register', formData);
});
