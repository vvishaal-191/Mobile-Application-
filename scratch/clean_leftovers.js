const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '..', 'preview_app.html'),
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'preview_app.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'index.html'),
];

const leftoverRegex = /\s*<hr\s*\/>\s*<div class="stats-row">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  if (leftoverRegex.test(c)) {
    c = c.replace(leftoverRegex, '');
    fs.writeFileSync(f, c, 'utf8');
    console.log('Cleaned leftover stats in', f);
  } else {
    console.log('Leftover regex did not match in', f);
  }
});
