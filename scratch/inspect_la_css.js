const fs = require('fs');

const file = 'EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html';
const c = fs.readFileSync(file, 'utf8');
const laHeaderIdx = c.indexOf('has-la-header');
console.log('has-la-header index:', laHeaderIdx);
if (laHeaderIdx !== -1) {
  console.log(c.substring(laHeaderIdx - 100, laHeaderIdx + 300));
}

const cssFile = 'EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.css';
if (fs.existsSync(cssFile)) {
  const css = fs.readFileSync(cssFile, 'utf8');
  console.log('--- preview.css ---');
  console.log(css.substring(0, 1000));
}
