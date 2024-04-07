function logout() {
    // Remove the token from localStorage or sessionStorage
    localStorage.removeItem('jwtToken'); // Replace 'jwtToken' with the key you use to store the token

    // Redirect to the login page
    window.location.href = '/login.html'; // Adjust if your login route is different
}
