// script3.js for Manager Dashboard - Using LocalStorage for state and data

// Global variables for data storage
let currentMonthlySummaryData = [];
let currentDetailedLogsData = [];

document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication Check (LocalStorage based) ---
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (isLoggedIn !== 'true' || !loggedInUser) {
        console.log("User not logged in or session expired. Redirecting to manager login page.");
        // Redirect to the manager login page
        // Ensure this matches your manager login HTML file name exactly
        window.location.href = 'management_login.html';
        return; // Stop execution if not authenticated
    }

    // Display manager name from localStorage
    document.getElementById('manager-name').textContent = ` ${loggedInUser} `;

    // Set default month filter to current month
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    document.getElementById('month-filter').value = currentMonth;

    // --- Get references to HTML elements for the dashboard ---
    const logoutButton = document.getElementById('logout-manager-button');
    const monthFilterInput = document.getElementById('month-filter');
    const filterButton = document.getElementById('filter-button');
    const exportCsvButton = document.getElementById('export-csv-button');
    const monthlySummaryTableDiv = document.getElementById('monthly-summary-table');
    const detailedLogsTableDiv = document.getElementById('detailed-logs-table');

    // --- Event Listeners ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Clear login state from localStorage
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loggedInUser');
            console.log("User logged out. Redirecting to manager login page.");
            // Redirect to the manager login page
            window.location.href = 'management_login.html';
        });
    } else {
        console.warn("Logout button not found in the DOM. Ensure ID 'logout-manager-button' is correct.");
    }

    filterButton.addEventListener('click', () => {
        const selectedMonth = monthFilterInput.value;
        if (selectedMonth) {
            fetchAndDisplayLogs(selectedMonth);
        } else {
            alert("Please select a month to filter."); // Using alert for simplicity
        }
    });

    exportCsvButton.addEventListener('click', exportMonthlySummaryToCSV);

    // Initial data load for the current month
    fetchAndDisplayLogs(currentMonth);

    /**
     * Fetches and displays staff activity logs from LocalStorage.
     * @param {string} monthYear - The month and year to filter logs (e.g., "2025-07").
     */
    function fetchAndDisplayLogs(monthYear) {
        monthlySummaryTableDiv.innerHTML = '<p>Loading monthly summary from local storage...</p>';
        detailedLogsTableDiv.innerHTML = '<p>Loading detailed logs from local storage...</p>';

        // Retrieve all logs from localStorage
        const storedLogs = JSON.parse(localStorage.getItem('staffActivityLogs') || '[]');
        console.log("All stored logs:", storedLogs);

        // Filter logs by the selected monthYear
        const filteredLogs = storedLogs.filter(log => {
            // Ensure log.timestamp is a valid date string or number
            const logDate = new Date(log.timestamp);    
            const logMonthYear = `${logDate.getFullYear()}-${(logDate.getMonth() + 1).toString().padStart(2, '0')}`;
            return logMonthYear === monthYear;
        });

        console.log("Filtered logs for", monthYear, ":", filteredLogs);

        currentDetailedLogsData = filteredLogs; // Store for CSV export
        displayDetailedLogs(filteredLogs);
        calculateAndDisplayMonthlySummary(filteredLogs);
    }

    /**
     * Displays detailed activity logs in a table.
     * @param {Array<Object>} logs - Array of activity log objects.
     */
    function displayDetailedLogs(logs) {
        if (logs.length === 0) {
            detailedLogsTableDiv.innerHTML = '<p>No detailed activity logs found for this month.</p>';
            return;
        }

        let tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>Staff Name</th>
                        <th>Activity Type</th>
                        <th>Timestamp</th>
                        <th>Duration (Hours)</th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Sort logs by timestamp (assuming timestamp is a number or Date string)
        logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        logs.forEach(log => {
            const date = new Date(log.timestamp);
            const formattedDate = date.toLocaleString(); // Format date and time
            // Duration is assumed to be in milliseconds if provided, convert to hours
            const duration = log.duration ? (log.duration / (1000 * 60 * 60)).toFixed(2) : 'N/A';

            tableHtml += `
                <tr>
                    <td>${log.username || 'Unknown Staff'}</td>
                    <td>${log.activityType || 'N/A'}</td>
                    <td>${formattedDate}</td>
                    <td>${duration}</td>
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table>
        `;
        detailedLogsTableDiv.innerHTML = tableHtml;
    }

    /**
     * Calculates and displays the monthly hours summary per staff member.
     * @param {Array<Object>} logs - Array of activity log objects.
     */
    function calculateAndDisplayMonthlySummary(logs) {
        const staffHours = {}; // { 'staffId': { username: 'Name', totalDuration: 0 } }

        // Process logs to calculate durations
        const clockInEvents = {}; // { 'staffId': { timestamp: Date, logId: string } }

        // Ensure chronological order for accurate clock-in/out pairing
        logs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

        logs.forEach(log => {
            // Use username as staffId for simplicity in a local app
            const staffId = log.username;
            const username = log.username || 'Unknown Staff';

            if (!staffHours[staffId]) {
                staffHours[staffId] = { username: username, totalDuration: 0 };
            }

            if (log.activityType === 'clockIn') {
                clockInEvents[staffId] = { timestamp: new Date(log.timestamp), logId: log.id };
            } else if (log.activityType === 'clockOut' && clockInEvents[staffId]) {
                const clockInTime = clockInEvents[staffId].timestamp;
                const clockOutTime = new Date(log.timestamp);
                const durationMs = clockOutTime.getTime() - clockInTime.getTime();

                // Add duration if it's positive (valid clock-in/out pair)
                if (durationMs > 0) {
                    staffHours[staffId].totalDuration += durationMs;
                }
                delete clockInEvents[staffId]; // Clear the clock-in event after a pair is found
            } else if (log.duration) {
                // Handle logs that already have a duration (e.g., task completed, assumed in milliseconds)
                staffHours[staffId].totalDuration += log.duration;
            }
        });

        // Convert total durations from milliseconds to hours
        currentMonthlySummaryData = Object.values(staffHours).map(staff => ({
            username: staff.username,
            totalHours: (staff.totalDuration / (1000 * 60 * 60)).toFixed(2)
        }));

        if (currentMonthlySummaryData.length === 0) {
            monthlySummaryTableDiv.innerHTML = '<p>No monthly summary data found for this month.</p>';
            return;
        }

        let tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>Staff Name</th>
                        <th>Total Hours</th>
                    </tr>
                </thead>
                <tbody>
        `;

        currentMonthlySummaryData.forEach(staff => {
            tableHtml += `
                <tr>
                    <td>${staff.username}</td>
                    <td>${staff.totalHours}</td>
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table>
        `;
        monthlySummaryTableDiv.innerHTML = tableHtml;
    }

    /**
     * Exports the current monthly summary data to a CSV file.
     */
    function exportMonthlySummaryToCSV() {
        if (currentMonthlySummaryData.length === 0) {
            alert("No data to export. Please filter logs first.");
            return;
        }

        let csvContent = "Staff Name,Total Hours\n"; // CSV header
        currentMonthlySummaryData.forEach(row => {
            csvContent += `${row.username},${row.totalHours}\n`;
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `monthly_summary_${monthFilterInput.value}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
});
