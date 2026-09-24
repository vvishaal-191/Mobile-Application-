const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('frame.onload') || l.includes('addEventListener') && l.includes('load') || l.includes('srcdoc')) {
    console.log(idx + 1, l.trim());
  }
});
