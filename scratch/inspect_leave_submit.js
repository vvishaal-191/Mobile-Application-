const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
console.log(content.substring(659000, 661000));
