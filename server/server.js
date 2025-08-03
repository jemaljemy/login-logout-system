// server.js - Our simple Node.js and Express server
const path = require('path');
// 1. Import the Express module
const express = require('express');

// 2. Create an instance of the Express application
const app = express();
const PORT = process.env.PORT || 3000; // Define a port for our server

// --- Middleware ---
// 3. Use middleware to serve our static front-end files
// The 'public' directory will be the root for our front-end
app.use(express.static('../public/htmlFiles/index.html'));

// --- API Endpoints ---
// This is a dummy data set to simulate a database.
const staffLogs = [
    { username: 'staff1', activityType: 'clockIn', timestamp: '2025-07-25T08:00:00Z' },
    { username: 'staff2', activityType: 'clockIn', timestamp: '2025-07-25T08:15:00Z' },
    { username: 'staff1', activityType: 'clockOut', timestamp: '2025-07-25T16:00:00Z' },
    { username: 'staff2', activityType: 'clockOut', timestamp: '2025-07-25T16:45:00Z' },
    { username: 'staff1', activityType: 'clockIn', timestamp: '2025-07-26T08:30:00Z' },
    // Add more mock data here as needed
];

// 4. Define our first API endpoint
// When a GET request is made to /api/staff-logs, we will send back our mock data.
app.get('/api/staff-logs', (req, res) => {
    console.log('Received request for staff logs.');
    // In the future, this is where you would fetch data from a database.
    res.json(staffLogs); // Send the JSON data as the response
});

// --- Start the server ---
// 5. Tell the server to listen for requests on the specified port.
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Serving files from the "public" directory.');
});