const mainTitle = document.getElementById('mainTitle');
const staffActionForm = document.getElementById('staffActionForm');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const messageDisplay = document.getElementById('message');
const togglePassword = document.getElementById('togglePassword'); // NEW: Get toggle icon


   // Add event listener for the password toggle icon
    if (togglePassword) { // Ensure the element exists before adding listener
        togglePassword.addEventListener('click', () => {
            // Toggle the type attribute between 'password' and 'text'
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);

            // Toggle the eye icon (eye-outline for show, eye-off-outline for hide)
            const icon = togglePassword.querySelector('ion-icon');
            if (icon) {
                icon.setAttribute('name', type === 'password' ? 'eye-outline' : 'eye-off-outline');
            }
        });
    } else {
        console.warn("Password toggle icon not found. Ensure ID 'togglePassword' is correct.");
    }


function resetUI() {
    usernameInput.value = '';
    passwordInput.value = '';
    messageDisplay.textContent = '';
    mainTitle.textContent = 'Welcome to Catherine Booth House';
}

staffActionForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (data.success) {
            messageDisplay.style.color = 'lightgreen';
            messageDisplay.textContent = data.message;
            mainTitle.textContent = `Welcome, ${username}!`;
        } else {
            messageDisplay.style.color = 'red';
            messageDisplay.textContent = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
        messageDisplay.style.color = 'red';
        messageDisplay.textContent = 'Failed to connect to the server.';
    }
    // Keep the timeout to reset the UI after the message is shown
    setTimeout(resetUI, 3000);
});

logoutButton.addEventListener('click', async () => {
    const username = usernameInput.value; // Get the username for the logout request
    
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });
        const data = await response.json();
        
        if (data.success) {
            messageDisplay.style.color = 'lightgreen';
            messageDisplay.textContent = data.message;
        } else {
            messageDisplay.style.color = 'red';
            messageDisplay.textContent = data.message;
        }
    } catch (error) {
        console.error('Error:', error);
        messageDisplay.style.color = 'red';
        messageDisplay.textContent = 'Failed to connect to the server.';
    }
    // Keep the timeout to reset the UI after the message is shown
    setTimeout(resetUI, 3000);
});




document.addEventListener('DOMContentLoaded', resetUI);