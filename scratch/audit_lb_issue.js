const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/preview/base.css',
  'EmergereApp/EmergereApp/src/screens/LeaveBalance/preview.html',
  'EmergereApp/EmergereApp/src/screens/LeaveBalance/preview.css',
  'EmergereApp/EmergereApp/src/screens/LeaveBalance/LeaveBalanceScreen.jsx',
  'EmergereApp/EmergereApp/src/screens/LeaveBalance/LeaveBalanceScreen.styles.js'
];

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log(f, 'DOES NOT EXIST');
    return;
  }
  const content = fs.readFileSync(f, 'utf8');
  console.log('=== FILE:', f, '===');
  console.log('  has lb-header-banner:', content.includes('lb-header-banner'));
  console.log('  has has-lb-header:', content.includes('has-lb-header'));
  console.log('  has max-width: 390px in tpl-LeaveBalance:', content.includes('max-width: 390px'));
  console.log('  has min-width: 480px:', content.includes('min-width: 480px'));
  console.log('  global override has lb:', content.includes(':not(.has-lb-header)'));
});
