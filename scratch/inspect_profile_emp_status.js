const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
console.log(content.substring(1793900, 1795000));
