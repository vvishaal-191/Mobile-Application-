const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const p = content.indexOf('class="quick-actions-grid"');
console.log(content.substring(p, p + 2500));
