document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('carId');

    // Previously defined code to fetch and display car details

    const bookingForm = document.getElementById('bookingForm');
    bookingForm.onsubmit = async function(e) {
        e.preventDefault();

        // Gather booking details
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        // Assuming you have an API endpoint /bookings/create to handle POST request for a new booking
        try {
            const response = await fetch('/bookings/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Include authentication headers if necessary
                },
                body: JSON.stringify({
                    carId,
                    startDate,
                    endDate,
                    // Add any other booking details your server might need
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            // Handle success - maybe redirect to a confirmation page or show a success message
            console.log('Booking successful:', result);
            alert('Booking successful!');
            // Redirect to a different page or update the DOM as needed
        } catch (error) {
            console.error('Error during booking:', error);
            alert('Booking failed: ' + error.message);
            // Handle errors, such as by displaying a message to the user
        }
    };
});
