const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- syncManagerDashboard inside tpl-ManagerDashboard (13250-13320) ---');
lines.slice(13250, 13320).forEach((l, i) => console.log((13251 + i) + ': ' + l));

console.log('--- syncManagerDashboard in shell (17550-17630) ---');
lines.slice(17550, 17630).forEach((l, i) => console.log((17551 + i) + ': ' + l));
