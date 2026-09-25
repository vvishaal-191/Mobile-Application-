const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  console.log(f, 'has detailNoGlowStyle:', c.includes('detailNoGlowStyle'));
});
