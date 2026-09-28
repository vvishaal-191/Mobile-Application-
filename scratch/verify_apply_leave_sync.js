const fs = require('fs');

const files = [
  'EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.jsx',
  'EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.styles.js',
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.html',
  'EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.css',
];

let allPassed = true;

for (const f of files) {
  if (!fs.existsSync(f)) {
    console.error('File missing: ' + f);
    allPassed = false;
    continue;
  }
  const content = fs.readFileSync(f, 'utf8');

  if (f.endsWith('ApplyPermissionScreen.jsx')) {
    const checks = ['toggleDate', 'cardInputText', 'inputCard', 'calendarIconBtn'];
    for (const c of checks) {
      if (!content.includes(c)) {
        console.error(`[FAIL] ${f} missing check: ${c}`);
        allPassed = false;
      }
    }
    console.log(`[PASS] ${f}`);
  } else if (f.endsWith('ApplyPermissionScreen.styles.js')) {
    const checks = ['inputCard:', 'cardInputText:', 'calendarIconBtn:'];
    for (const c of checks) {
      if (!content.includes(c)) {
        console.error(`[FAIL] ${f} missing check: ${c}`);
        allPassed = false;
      }
    }
    console.log(`[PASS] ${f}`);
  } else if (f.endsWith('.html')) {
    const checks = [
      "openCalPicker('perm-date-picker')",
      'perm-hidden-picker-label',
      'id="perm-date-picker"',
      'onPermDateChange(this.value)',
      'function openCalPicker',
    ];
    for (const c of checks) {
      if (!content.includes(c)) {
        console.error(`[FAIL] ${f} missing check: ${c}`);
        allPassed = false;
      }
    }
    console.log(`[PASS] ${f}`);
  } else if (f.endsWith('.css')) {
    const checks = ['.perm-hidden-picker-label'];
    for (const c of checks) {
      if (!content.includes(c)) {
        console.error(`[FAIL] ${f} missing check: ${c}`);
        allPassed = false;
      }
    }
    console.log(`[PASS] ${f}`);
  }
}

if (allPassed) {
  console.log('\n>>> ALL APPLY LEAVE CALENDAR STYLE & INTERACTION CHECKS PASSED! <<<');
} else {
  console.error('\n>>> SOME CHECKS FAILED! <<<');
  process.exit(1);
}
