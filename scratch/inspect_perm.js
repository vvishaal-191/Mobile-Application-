const fs = require('fs');
const tpl = fs.readFileSync('scratch/perm_tpl.html', 'utf8');
const bodyStart = tpl.indexOf('<body>');
const scriptStart = tpl.indexOf('<script', bodyStart);
const middle = tpl.substring(bodyStart, scriptStart);

console.log('Middle length:', middle.length);
const imgMatches = [...middle.matchAll(/data:image[^"']+/g)];
console.log('Embedded data:images:', imgMatches.length);
imgMatches.forEach((m, idx) => console.log(idx, 'length:', m[0].length));

// Let's see what is after the logo
const logoIdx = middle.indexOf('mini-logo');
console.log('mini-logo context:', middle.substring(logoIdx - 20, logoIdx + 150));
