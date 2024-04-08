# CIS476DriveShare
sessionManager.js
Key Observations:

    Implements the Singleton pattern to manage user sessions, ensuring only one instance of SessionManager is used throughout the application.
    Utilizes jsonwebtoken for generating JWT tokens, standard practice for handling authentication in modern web applications.

handler.js and securityQuestionHandler.js

These files collectively implement a Chain of Responsibility pattern for processing requests, particularly focusing on validating security questions.
Key Observations:

    Handler.js establishes a base class for creating a chain of responsibility, with setNext for chaining and handle for processing.
    SecurityQuestionHandler.js extends Handler, focusing on validating answers to security questions using bcrypt, showcasing the pattern's flexibility in handling a variety of tasks.

authenticate.js

This middleware is crucial for securing routes by verifying JWT tokens.
Key Observations:

    Uses the jsonwebtoken package to verify tokens and extract user details.
    Queries the database to fetch the user associated with the token, ensuring they are still valid and their session is active.



authRoutes.js
Key Observations:

    The file structures the authentication logic, including user registration, login, fetching security questions, verifying security answers, and resetting passwords.
    Passwords and security answers are hashed using bcrypt, enhancing security by protecting against plaintext password storage.
    JWTs are generated upon successful login, providing a method for session management and user authentication in subsequent requests.

users.js (Model)
Key Observations:

    Defines a Mongoose schema for users, including fields for email, password, and security questions and answers.
    Utilizes bcrypt for hashing passwords and security answers before saving, enhancing security.


GPT

Focusing on the newer files and providing actionable insights with a coding perspective in mind, let's delve into specifics that will aid in future development and refinement.
authRoutes.js
Key Observations:

    The file structures the authentication logic, including user registration, login, fetching security questions, verifying security answers, and resetting passwords.
    Passwords and security answers are hashed using bcrypt, enhancing security by protecting against plaintext password storage.
    JWTs are generated upon successful login, providing a method for session management and user authentication in subsequent requests.

users.js (Model)
Key Observations:

    Defines a Mongoose schema for users, including fields for email, password, and security questions and answers.
    Utilizes bcrypt for hashing passwords and security answers before saving, enhancing security.


register.js and login.js (Frontend Scripts)
Key Observations:

    Implements the Mediator pattern to facilitate communication between different parts of the application without them needing to directly reference each other.
    Handles user input and interactions for registration and login, respectively, and communicates with the backend via fetch API calls.


home.js (Frontend Script)
Key Observations:

    Serves as the entry point for the application's home page, potentially handling the display of available cars.
    Utilizes a custom event system (similar to the Mediator pattern) for managing interactions within the page.