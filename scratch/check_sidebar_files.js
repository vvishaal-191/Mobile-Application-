const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/src/screens/EmployeeDashboard/preview.html'
];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const hasOverlay = c.includes('id="sidebar-overlay"');
  const hasCorrupted = c.includes('گوشواره') || c.includes('JD_Avatar_Card');
  const hasDrawer = c.includes('class="sidebar-drawer"');
  console.log(f, '-> hasOverlay:', hasOverlay, 'hasDrawer:', hasDrawer, 'hasCorrupted:', hasCorrupted);
});
