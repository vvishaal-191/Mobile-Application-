const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, i) => {
  if (l.includes('MANAGER_ALLOWED_SCREENS') || l.includes('EMPLOYEE_ALLOWED_SCREENS')) {
    console.log((i+1) + ': ' + l);
  }
});
