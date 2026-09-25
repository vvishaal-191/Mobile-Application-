const fs = require('fs');
const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html'
];
files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  console.log(f, 'has TeamAttendance click:', c.includes("handleCardNav('tpl-TeamAttendance')"));
  console.log(f, 'has Team<br>Members:', c.includes("Team<br>Members"));
});
