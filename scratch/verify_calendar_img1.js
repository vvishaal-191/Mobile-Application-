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
    const checks = [
      'showCalendarModal',
      'handleSelectDate',
      'handleClearDate',
      'handleTodayDate',
      'calendarCells',
      'calMonthSelector',
      'calNavArrows',
      'calFooterLink',
    ];
    for (const c of checks) {
      if (!content.includes(c)) {
        console.error(`[FAIL] ${f} missing check: ${c}`);
        allPassed = false;
      }
    }
    console.log(`[PASS] ${f}`);
  } else if (f.endsWith('ApplyPermissionScreen.styles.js')) {
    const checks = [
      'calModalCard:',
      'calMonthSelector:',
      'calNavArrows:',
      'calArrowBtn:',
      'calDayCellSelected:',
      'calDayCellToday:',
      'calFooterLink:',
    ];
    for (const c of checks) {
      if (!content.includes(c)) {
        console.error(`[FAIL] ${f} missing check: ${c}`);
        allPassed = false;
      }
    }
    console.log(`[PASS] ${f}`);
  } else if (f.endsWith('.html')) {
    const checks = [
      'perm-calendar-modal',
      'cal-month-selector',
      'cal-nav-arrows',
      'clearPermDate',
      'selectTodayPermDate',
      'cal-footer-link',
    ];
    for (const c of checks) {
      if (!content.includes(c)) {
        console.error(`[FAIL] ${f} missing check: ${c}`);
        allPassed = false;
      }
    }
    console.log(`[PASS] ${f}`);
  } else if (f.endsWith('.css')) {
    const checks = [
      '.perm-calendar-modal-overlay',
      '.perm-calendar-modal-card',
      '.cal-month-selector',
      '.cal-nav-arrows',
      '.cal-day-cell.selected',
      '.cal-day-cell.today',
      '.cal-footer-link',
    ];
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
  console.log('\n>>> ALL IMAGE 1 CALENDAR DESIGN CHECKS PASSED SUCCESSFULLY! <<<');
} else {
  console.error('\n>>> SOME CHECKS FAILED! <<<');
  process.exit(1);
}
