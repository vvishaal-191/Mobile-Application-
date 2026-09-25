const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'index.html');
let content = fs.readFileSync(filePath, 'utf8');

const target = '" />\'\' +';
console.log('Target found:', content.includes(target));

if (content.includes(target)) {
  const fixed = content.replace(target, '" />\' +');
  const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
  let match;
  let count = 0;
  let allOk = true;
  while ((match = scriptRegex.exec(fixed)) !== null) {
    count++;
    try {
      new Function(match[1]);
    } catch (e) {
      console.log(`Script ${count} failed:`, e.message);
      allOk = false;
    }
  }
  if (allOk) {
    console.log(`All ${count} scripts passed syntax check with the fix!`);
  }
}
