const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const p = c.indexOf('detailNoGlowStyle');
console.log(c.substring(p - 60, p + 450));
