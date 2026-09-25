const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
console.log(lines.slice(17340, 17430).join('\n'));
