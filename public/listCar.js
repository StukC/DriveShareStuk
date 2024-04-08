document.getElementById('carListingForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);

  // Convert the image file to Base64 if present
  const file = formData.get('carImage');
  if (file && file.type.match('image.*')) {
      const base64 = await fileToBase64(file);
      const base64Data = base64.split(';base64,').pop();
      formData.set('carImage', base64Data); // Replace file object with base64 string
  } else {
      formData.delete('carImage'); // No image uploaded or not a valid image file
  }

  // Convert FormData into JSON, adding the owner property
  let carData = Object.fromEntries(formData.entries());
  carData = { ...carData, owner: localStorage.getItem('userId') }; // Ensure 'userId' is stored in localStorage at login

  try {
      // Send the car data to the server
      const response = await fetch('/cars/list', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token') // Assuming the JWT is stored in localStorage
          },
          body: JSON.stringify(carData)
      });

      const result = await response.json();

      if (response.ok) {
          alert('Car listed successfully!');
          // Optionally, redirect the user or clear the form
          window.location.href = '/home.html'; // Update this to your actual success path
          // event.target.reset(); // Clear the form, alternative to redirecting
      } else {
          // Handle errors, such as showing an error message to the user
          console.error('Failed to list car:', result.message);
          alert('Failed to list car: ' + result.message);
      }
  } catch (error) {
      console.error('Error listing car:', error);
      alert('Error listing car. Please try again.');
  }
});

// Utility function to convert file to Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
  });
}
