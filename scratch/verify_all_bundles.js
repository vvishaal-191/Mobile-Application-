const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const matches = (content.match(/<template\s+id=["']([^"']+)["']/g) || []).map(m => m.replace(/<template\s+id=/, '').replace(/["']/g, ''));
  console.log(f, 'templates (' + matches.length + '):', matches.includes('tpl-EmployeeDashboard') && matches.includes('tpl-ManagerDashboard') ? 'PASS (has both)' : 'FAIL');
});
