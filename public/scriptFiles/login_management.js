// script2.js - This script handles the manager login page (Manager Login.html)

document.addEventListener('DOMContentLoaded', () => {
    // Get references to the HTML elements
    const managerLoginForm = document.getElementById('managerLoginForm');
    const managerUsernameInput = document.getElementById('managerUsernameInput');
    const managerPasswordInput = document.getElementById('managerPasswordInput');
    const messageParagraph = document.getElementById('message');
    const togglePassword = document.getElementById('togglePassword'); // NEW: Get toggle icon

    // Define dummy manager credentials for demonstration purposes
    const DUMMY_USERNAME = 'jamal';
    const DUMMY_PASSWORD = 'password123';

    // Add event listener for the password toggle icon
    if (togglePassword) { // Ensure the element exists before adding listener
        togglePassword.addEventListener('click', () => {
            // Toggle the type attribute between 'password' and 'text'
            const type = managerPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            managerPasswordInput.setAttribute('type', type);

            // Toggle the eye icon (eye-outline for show, eye-off-outline for hide)
            const icon = togglePassword.querySelector('ion-icon');
            if (icon) {
                icon.setAttribute('name', type === 'password' ? 'eye-outline' : 'eye-off-outline');
            }
        });
    } else {
        console.warn("Password toggle icon not found. Ensure ID 'togglePassword' is correct.");
    }

    // Add an event listener for the form submission
    managerLoginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission

        messageParagraph.textContent = ''; // Clear previous messages
        messageParagraph.style.color = '#dc3545'; // Default to error color

        const enteredUsername = managerUsernameInput.value;
        const enteredPassword = managerPasswordInput.value;

        if (enteredUsername === DUMMY_USERNAME && enteredPassword === DUMMY_PASSWORD) {
            // Successful login
            messageParagraph.textContent = 'Login successful! Redirecting...';
            messageParagraph.style.color = '#28a745'; // Green for success

            // Set login state in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('loggedInUser', enteredUsername);

            // Redirect to the dashboard page
            setTimeout(() => {
                window.location.href = 'manager_dashboard.html'; // Ensure this matches your dashboard HTML file name
            }, 1500); // Redirect after 1.5 seconds
        } else {
            // Failed login
            messageParagraph.textContent = 'Invalid username or password. Please try again.';
            messageParagraph.style.color = '#dc3545'; // Red for error
        }

        // Clear the password field after each attempt for security
        managerPasswordInput.value = '';
    });
});
