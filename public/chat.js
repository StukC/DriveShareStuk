document.getElementById('send-message').addEventListener('click', function() {
    const messageInput = document.getElementById('message-input');
    const messagesList = document.getElementById('messages-list');

    // Create a new message div
    const messageDiv = document.createElement('div');
    messageDiv.textContent = messageInput.value;

    // Append the new message to the messages list
    messagesList.appendChild(messageDiv);

    // Clear the input box
    messageInput.value = '';
});
