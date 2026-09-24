const fs = require('fs');
const content = fs.readFileSync('scratch/profile_tpl.html', 'utf8');

const idx = content.indexOf('function enableProfileEdit');
console.log(content.substring(idx - 100, idx + 800));
