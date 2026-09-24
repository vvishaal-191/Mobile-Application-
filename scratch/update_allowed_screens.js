const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '../preview_app.html'),
  path.join(__dirname, '../index.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/preview_app.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/index.html'),
];

targetFiles.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');

  // Regex replacement for EMPLOYEE_ALLOWED_SCREENS
  content = content.replace(
    /(var\s+EMPLOYEE_ALLOWED_SCREENS\s*=\s*\[[\s\S]*?'tpl-LeaveHistory')(\s*,)/,
    "$1,\r\n          'tpl-MyRequests'$2"
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated EMPLOYEE_ALLOWED_SCREENS in:', file);
});
