const fs = require('fs');

const content = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/ManagerDashboardScreen.jsx', 'utf8');

const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.toLowerCase().includes('status')) {
    console.log(`${i+1}: ${l.trim()}`);
  }
});
