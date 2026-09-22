const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/src/screens/HolidayCalendar/preview.html'
];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const lines = c.split(/\r?\n/);
  lines.forEach((l, idx) => {
    if (l.includes('Profile') && (l.includes('active') || lines[Math.max(0, idx - 1)].includes('active') || lines[Math.min(lines.length - 1, idx + 1)].includes('active'))) {
      console.log(`${f}:${idx + 1}: ${l}`);
    }
  });
});
