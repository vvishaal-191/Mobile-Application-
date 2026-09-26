const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- LINES 17360 - 17410 ---');
lines.slice(17360, 17410).forEach((l, i) => console.log((17361 + i) + ': ' + l));

console.log('--- LINES 18690 - 18730 ---');
lines.slice(18690, 18730).forEach((l, i) => console.log((18691 + i) + ': ' + l));
