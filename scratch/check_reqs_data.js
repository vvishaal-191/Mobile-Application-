const fs = require('fs');
const c = fs.readFileSync('preview_app.html', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (l.includes('EMP_LEAVE_REQUESTS')) {
    console.log(i + ': ' + l.trim().slice(0, 120));
  }
});
