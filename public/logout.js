function logout() {
    localStorage.removeItem('jwtToken');

    // Redirect to the login page
    window.location.href = '/login.html';
}
