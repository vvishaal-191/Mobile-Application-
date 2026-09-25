const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'index.html');
const content = fs.readFileSync(filePath, 'utf8');

const target = "if(svgEl) svgEl.style.display=\\'block\\';\" />'' +";
const count = content.split(target).length - 1;
console.log('Occurrences of target:', count);
