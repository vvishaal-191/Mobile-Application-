const fs = require('fs');
const c = fs.readFileSync('preview_app.html', 'utf8');
const matches = [...c.matchAll(/id=["'](tpl-[^"']+)["']/g)].map(m => m[1]);
console.log('Template IDs found:', matches);
