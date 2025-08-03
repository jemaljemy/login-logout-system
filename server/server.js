// server.js - Our simple Node.js and Express server
const path = require('path');
// 1. Import the Express module
const express = require('express');

const sqlite3 = require('sqlite3').verbose(); // NEW: Import the sqlite3 module


// 2. Create an instance of the Express application
const app = express();
const PORT = process.env.PORT || 3000; // Define a port for our server

// --- Middleware ---
// 3. Use middleware to serve our static front-end files
// The 'public' directory will be the root for our front-end
app.use(express.static(path.join(__dirname, '../public')));

// Add this line after the express() middleware
app.use(express.json());

// --- API Endpoints ---


// NEW: Connect to the database
// The file 'logs.db' will be created automatically if it doesn't exist.
const db = new sqlite3.Database('./logs.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the logs.db database.');
        // Create the table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS staff_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            activityType TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )`);
    }
});


// Login endpoint: now logs a clock-in event to the database
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'user' && password === 'password') {
        const timestamp = new Date().toISOString();
        const activityType = 'clockIn';
        const stmt = db.prepare("INSERT INTO staff_logs (username, activityType, timestamp) VALUES (?, ?, ?)");
        stmt.run(username, activityType, timestamp, function(err) {
            if (err) {
                console.error('Error inserting log:', err.message);
                return res.status(500).json({ success: false, message: 'Server error while logging.' });
            }
            res.json({ success: true, message: `Login successful for ${username}!` });
        });
        stmt.finalize();
    } else {
        res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
});

// Logout endpoint: now logs a clock-out event to the database
app.post('/api/logout', (req, res) => {
    const { username } = req.body;
    if (username === 'user') {
        const timestamp = new Date().toISOString();
        const activityType = 'clockOut';
        const stmt = db.prepare("INSERT INTO staff_logs (username, activityType, timestamp) VALUES (?, ?, ?)");
        stmt.run(username, activityType, timestamp, function(err) {
            if (err) {
                console.error('Error inserting log:', err.message);
                return res.status(500).json({ success: false, message: 'Server error while logging.' });
            }
            res.json({ success: true, message: 'You have successfully logged out!' });
        });
        stmt.finalize();
    } else {
        res.status(401).json({ success: false, message: 'Logout failed.' });
    }
});


// Endpoint to retrieve all logs from the database
app.get('/api/staff-logs', (req, res) => {
    db.all("SELECT * FROM staff_logs", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// --- Start the server ---
// 5. Tell the server to listen for requests on the specified port.
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Serving files from the "public" directory.');
});