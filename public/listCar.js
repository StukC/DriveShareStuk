// Function to convert an image file to Base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }
  
  async function submitCarListing(formData) {
    console.log('submitCarListing function entered');
  
    // Convert the image file to Base64 if it exists
    const carImage = formData.get('carImage');
    if (carImage && carImage.size > 0) {
      console.log('Image file detected, converting to Base64');
      try {
        const base64Image = await getBase64(carImage);
        formData.set('imageBase64', base64Image);
        formData.delete('carImage'); // Remove the file object from formData
      } catch (error) {
        console.error('Error converting image:', error);
        alert('Failed to convert image. Please try again.');
        return;
      }
    }
  
    // Prepare the JSON payload
    const jsonFormData = {
        make: formData.get('make'),
        model: formData.get('model'),
        year: parseInt(formData.get('year'), 10),
        mileage: parseInt(formData.get('mileage'), 10),
        location: formData.get('location'),
        pricePerDay: parseFloat(formData.get('pricePerDay')),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        imageBase64: formData.get('imageBase64'), // Updated line
      };
    console.log('JSON Form Data:', jsonFormData);
  
    try {
      console.log('Making fetch call to server...');
      const response = await fetch('/api/list', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json' // This header was missing.
        },
        body: JSON.stringify(jsonFormData),
      });      
      console.log('Fetch call completed');
  
      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log('Success:', responseData);
      alert('Car listed successfully!');
    } catch (error) {
      console.error('Error listing car:', error);
      alert('Failed to list car. Please try again.');
    } finally {
      console.log('Re-enabling the list car button');
      document.getElementById('listCarButton').disabled = false;
    }
  }  
  
  // Event listener for the car listing form
  document.getElementById('carListingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const button = document.getElementById('listCarButton');
    button.disabled = true; // Disable the button while processing
  
    // Create a FormData object from the form
    const formElement = document.getElementById('carListingForm');
    const formData = new FormData(formElement);
  
    submitCarListing(formData);
  });
  