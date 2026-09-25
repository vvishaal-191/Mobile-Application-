const fs = require('fs');

const content = fs.readFileSync('scratch/temp_index_html_29.js', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(1300, 1360).join('\n'));
