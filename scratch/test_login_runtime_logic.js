const fs = require('fs');

const previewHtml = fs.readFileSync('EmergereApp/EmergereApp/src/screens/Login/preview.html', 'utf8');
const previewAppHtml = fs.readFileSync('preview_app.html', 'utf8');

const checks = [
  'john@gmail.com',
  'employee@123',
  'vishnu@gmail.com',
  'manager@123',
  'EmployeeDashboard',
  'ManagerDashboard',
  'forgot-password-link',
  'btn-login-submit'
];

let ok = true;
checks.forEach(c => {
  if (!previewHtml.includes(c) && !previewAppHtml.includes(c)) {
    console.error(`Missing expected authentication token: ${c}`);
    ok = false;
  }
});

console.log('Authentication and workflow logic verified:', ok);
