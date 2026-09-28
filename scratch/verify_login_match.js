const fs = require('fs');
const path = require('path');

const b64Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'login_assets_base64.json'), 'utf8'));

const files = [
  path.join(__dirname, '../preview_app.html'),
  path.join(__dirname, '../index.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/preview_app.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/index.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/src/screens/Login/preview.html')
];

let allOk = true;
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hasTopHeader = content.includes(b64Data.topHeader);
  const hasBottomWave = content.includes(b64Data.bottomWave);
  const hasOrDivider = content.includes('login-or-divider');
  console.log(path.basename(f), ': topHeader=' + hasTopHeader + ', bottomWave=' + hasBottomWave + ', hasOrDivider=' + hasOrDivider);
  if (!hasTopHeader || !hasBottomWave || !hasOrDivider) {
    allOk = false;
  }
});

console.log('All files verified with new design reference assets:', allOk);
