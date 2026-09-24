const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('function loadScreen(')) {
    console.log('loadScreen at line', idx + 1);
    console.log(lines.slice(idx, idx + 60).join('\n'));
  }
});
