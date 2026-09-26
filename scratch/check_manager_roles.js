const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((l, i) => {
  if (l.includes("role === 'manager'") || l.includes('role === "manager"') || l.includes("AUTH_USER.role")) {
    console.log('Line', i+1, ':', l.trim().slice(0, 150));
  }
});
