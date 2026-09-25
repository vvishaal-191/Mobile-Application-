const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const idx = c.indexOf('tpl-ManagerDashboard');
console.log('Position:', idx);
const line = c.substring(0, idx).split('\n').length;
console.log('Line number:', line);

const snippet = c.substring(idx - 50, idx + 1500);
console.log('Snippet:\n', snippet);
