const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const idx = html.indexOf("frame.addEventListener('load'");
const snippet = html.substring(idx + 40500, idx + 41400);
console.log(snippet);
