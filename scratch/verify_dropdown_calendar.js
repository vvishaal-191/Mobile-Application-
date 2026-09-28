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
      'isCalendarOpen',
      'setIsCalendarOpen',
      'calendarDropdownCard',
      'handleSelectDate',
      'handleClearDate',
      'handleTodayDate',
    ];
    for (const c of checks) {
      if (!content.includes(c)) {
        console.error(`[FAIL] ${f} missing check: ${c}`);
        allPassed = false;
      }
    }
    // Make sure Modal is NOT used for calendar
    if (content.includes('<Modal\n        visible={showCalendarModal}')) {
      console.error(`[FAIL] ${f} still has calendar modal!`);
      allPassed = false;
    }
    console.log(`[PASS] ${f}`);
  } else if (f.endsWith('ApplyPermissionScreen.styles.js')) {
    const checks = [
      'calendarDropdownCard:',
      'calHeader:',
      'calMonthSelector:',
      'calNavArrows:',
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
      'perm-calendar-dropdown',
      'togglePermCalendar',
      'openPermCalendar',
      'closePermCalendar',
      'clearPermDate',
      'selectTodayPermDate',
    ];
    for (const c of checks) {
      if (!content.includes(c)) {
        console.error(`[FAIL] ${f} missing check: ${c}`);
        allPassed = false;
      }
    }
    if (content.includes('id="perm-calendar-modal"')) {
      console.error(`[FAIL] ${f} still has perm-calendar-modal element!`);
      allPassed = false;
    }
    console.log(`[PASS] ${f}`);
  } else if (f.endsWith('.css')) {
    const checks = [
      '.perm-calendar-dropdown',
      '.cal-dropdown-header',
      '.cal-month-selector',
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
  console.log('\n>>> ALL DROPDOWN CALENDAR CHECKS PASSED! <<<');
} else {
  console.error('\n>>> SOME CHECKS FAILED! <<<');
  process.exit(1);
}
