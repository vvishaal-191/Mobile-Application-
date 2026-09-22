const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');
const lines = content.split(/\r?\n/);
lines.forEach((l, idx) => {
  if (l.includes('bottom-nav') && l.includes('addEventListener')) {
    console.log(idx + 1, l);
  }
});
