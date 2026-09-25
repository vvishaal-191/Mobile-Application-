const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const search = 'id="mgr-dash-requests-list"';
const start = c.indexOf(search);
console.log(c.substring(start, start + 1500));
