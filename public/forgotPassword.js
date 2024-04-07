document.addEventListener('DOMContentLoaded', function() {
    // Mediator object
    const forgotPasswordMediator = (function() {
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

    // Subscriptions
    forgotPasswordMediator.subscribe('getSecurityQuestions', email => {
        fetch('/auth/get-security-questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP status ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (data && data.questions) {
                displaySecurityQuestions(data.questions);
                document.getElementById('emailForm').style.display = 'none';
            } else {
                throw new Error('Security questions not received.');
            }
        })
        .catch(error => {
            console.error('Error fetching security questions:', error);
            alert('Failed to fetch security questions. Please try again.');
        });
    });

    forgotPasswordMediator.subscribe('verifySecurityAnswers', (email, answers) => {
        fetch('/auth/verify-security-answers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, answers }),
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP status ${response.status}`);
            return response.json();
        })
        .then(() => {
            document.getElementById('securityQuestionsContainer').style.display = 'none';
            document.getElementById('resetPasswordForm').style.display = 'block';
        })
        .catch(error => {
            console.error('Error verifying security questions:', error);
            alert('Failed to verify security answers. Please try again.');
        });
    });

    forgotPasswordMediator.subscribe('resetPassword', (email, newPassword) => {
        fetch('/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, newPassword }),
        })
        .then(response => {
            if (!response.ok) throw new Error(`HTTP status ${response.status}`);
            return response.json();
        })
        .then(() => {
            alert('Your password has been reset successfully.');
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.error('Error resetting password:', error);
            alert('Failed to reset password. Please try again.');
        });
    });

    // Event Listeners
    document.getElementById('emailForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        forgotPasswordMediator.publish('getSecurityQuestions', email);
    });

    // Trigger verifySecurityAnswers on button click or form submission as needed
    window.verifySecurityAnswers = function() {
        const answers = Array.from(document.querySelectorAll('#securityQuestionsContainer input')).map(input => input.value);
        const email = document.getElementById('email').value;
        forgotPasswordMediator.publish('verifySecurityAnswers', email, answers);
    };

    document.getElementById('resetPasswordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const newPassword = document.getElementById('newPassword').value;
        const email = document.getElementById('email').value;
        forgotPasswordMediator.publish('resetPassword', email, newPassword);
    });

    function displaySecurityQuestions(questions) {
        const container = document.getElementById('securityQuestionsContainer');
        container.innerHTML = ''; // Clear previous content
    
        questions.forEach((question, index) => {
            const div = document.createElement('div');
            div.className = 'form-group';
    
            const label = document.createElement('label');
            label.htmlFor = `answer${index}`;
            label.textContent = question;
            div.appendChild(label);
    
            const input = document.createElement('input');
            input.type = 'text';
            input.id = `answer${index}`;
            input.name = `answer${index}`;
            input.required = true;
            div.appendChild(input);
    
            container.appendChild(div);
        });
    
        // Append the verify answers button dynamically
        let verifyButton = document.getElementById('verifyAnswersButton');
        if (!verifyButton) {
            verifyButton = document.createElement('button');
            verifyButton.type = 'button'; // Avoid form auto-submit
            verifyButton.textContent = 'Verify Answers';
            verifyButton.id = 'verifyAnswersButton';
            // Attach click event listener to the button
            verifyButton.addEventListener('click', verifySecurityAnswers);
            container.appendChild(verifyButton);
        } else {
            verifyButton.style.display = 'block'; // Show button if it was previously hidden
        }
    
        container.style.display = 'block'; // Make the container visible
    }
    
});
