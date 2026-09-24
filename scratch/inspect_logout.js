const fs = require('fs');
const content = fs.readFileSync('scratch/profile_tpl.html', 'utf8');

const matches = [...content.matchAll(/logout[^{<"'\s]*/gi)];
console.log('Matches for logout:', matches.length);
matches.forEach(m => console.log(m[0], 'context:', content.substring(Math.max(0, m.index - 50), Math.min(content.length, m.index + 150)).replace(/\n/g, ' ')));
