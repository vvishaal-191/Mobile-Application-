const fs = require('fs');

const content = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/ManagerDashboardScreen.jsx', 'utf8');

const lines = content.split('\n');
console.log(lines.slice(90, 145).join('\n'));
