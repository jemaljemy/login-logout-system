const mainTitle = document.getElementById('mainTitle');
const staffActionForm = document.getElementById('staffActionForm');
const usernameInput = document.getElementById('usernameInput');
const passwordInput = document.getElementById('passwordInput');
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const messageDisplay = document.getElementById('message');
const togglePassword = document.getElementById('togglePassword'); // NEW: Get toggle icon


const MOCKED_USERNAME = 'user';
const MOCKED_PASSWORD = 'password';

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


function resetUI() {
    usernameInput.value = '';
    passwordInput.value = '';
    messageDisplay.textContent = '';
    mainTitle.textContent = 'Welcome to Catherine Booth House';
}

staffActionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;
    if (username === MOCKED_USERNAME && password === MOCKED_PASSWORD) {
        messageDisplay.style.color = 'lightgreen';
        messageDisplay.textContent = `Login successful for ${username}!`;
        mainTitle.textContent = `Welcome, ${username}!`;
        setTimeout(resetUI, 3000); // Reset UI after 3 seconds
        } else {
            messageDisplay.style.color = 'red';
            messageDisplay.textContent = 'Invalid username or password.';
            passwordInput.value = '';
            setTimeout(resetUI, 3000);
        }
    });

logoutButton.addEventListener('click', () => {
    const username = usernameInput.value; // Get username value for logout verification
    const password = passwordInput.value; // Get password value for logout verification

    if (username === MOCKED_USERNAME && password === MOCKED_PASSWORD) {
        messageDisplay.style.color = 'lightgreen';
        messageDisplay.textContent = 'You have successfully logged out!';
        setTimeout(resetUI, 3000); // Reset UI after 3 seconds
    } else {
        messageDisplay.style.color = 'red';
        messageDisplay.textContent = 'Invalid username or password for logout.';
        passwordInput.value = ''; // Clear password on failure
        setTimeout(resetUI, 3000);
    }
});
document.addEventListener('DOMContentLoaded', resetUI);