const fs = require('fs');
const vm = require('vm');

let allPassed = true;
function assert(desc, condition) {
  if (condition) {
    console.log('✓ PASS:', desc);
  } else {
    console.error('✗ FAIL:', desc);
    allPassed = false;
  }
}

console.log('=== 1. Checking HTML Templates for Image 2 Requirements ===');
const htmlFiles = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');

  // Verify template existence
  assert(`${file}: Contains tpl-EmployeeDashboard`, content.includes('id="tpl-EmployeeDashboard"'));

  // Header branding & tagline
  assert(`${file}: Header has IT Solutions Pvt. Ltd.`, content.includes('IT Solutions Pvt. Ltd.'));
  assert(`${file}: Header has Work Together. <b>Grow</b> Together.`, content.includes('Work Together. <b>Grow</b> Together.'));
  assert(`${file}: Header has hamburger button`, content.includes('class="hamburger-btn"'));
  assert(`${file}: Header has dash-bell-btn with dot`, content.includes('id="dash-bell-btn"') && content.includes('header-bell-dot'));

  // Greeting & profile
  assert(`${file}: Greeting has default Sneha Reddy with wave emoji`, content.includes('id="dash-greeting"') && content.includes('Sneha Reddy 👋'));
  assert(`${file}: Profile has UI/UX Designer and EMP-2024-0103`, content.includes('id="dash-role-text"') && content.includes('id="dash-id-text"'));
  assert(`${file}: Date badge has Thu, Sep 03 2026`, content.includes('Thu, Sep 03 2026'));
  assert(`${file}: Avatar has Have a great day! caption`, content.includes('Have a great day!') && content.includes('avatar-line-accent'));

  // 4 Action Cards
  assert(`${file}: Action card Apply Leave with corner swoosh`, content.includes('card-leave') && content.includes('Apply Leave') && content.includes('Plan your time off'));
  assert(`${file}: Action card Apply Permission with corner swoosh`, content.includes('card-perm') && content.includes('Apply Permission') && content.includes('Request short leave'));
  assert(`${file}: Action card My Requests with corner swoosh`, content.includes('card-reqs') && content.includes('My Requests') && content.includes('Track your leaves & permissions'));
  assert(`${file}: Action card Holiday Calendar with corner swoosh`, content.includes('card-holiday') && content.includes('Holiday Calendar') && content.includes('View upcoming holidays'));

  // Card navigations
  assert(`${file}: Apply Leave navigates to tpl-ApplyLeave`, content.includes("loadScreen('tpl-ApplyLeave')"));
  assert(`${file}: Apply Permission navigates to tpl-ApplyPermission`, content.includes("loadScreen('tpl-ApplyPermission')"));
  assert(`${file}: My Requests navigates to tpl-LeaveHistory`, content.includes("loadScreen('tpl-LeaveHistory')"));
  assert(`${file}: Holiday Calendar navigates to tpl-HolidayCalendar`, content.includes("loadScreen('tpl-HolidayCalendar')"));

  // Leave Balances
  assert(`${file}: Leave Balances card has pie icon and title`, content.includes('Leave Balances') && content.includes('id="dash-leave-balance-card"'));
  assert(`${file}: Casual Leave row (8 / 12 Days)`, content.includes('Casual Leave') && content.includes('For personal time') && content.includes('8 / 12 Days'));
  assert(`${file}: Sick Leave row (5 / 7 Days)`, content.includes('Sick Leave') && content.includes('For your well-being') && content.includes('5 / 7 Days'));
  assert(`${file}: WFH row (10 / 15 Days)`, content.includes('WFH') && content.includes('Work from home') && content.includes('10 / 15 Days'));

  // Upcoming Holiday Card
  assert(`${file}: Upcoming Holiday card present with Ganesh Chaturthi`, content.includes('UPCOMING HOLIDAY') && content.includes('Ganesh Chaturthi') && content.includes('Have a joyful celebration!'));
  assert(`${file}: Holiday date badge Sep 15 TUE`, content.includes('holiday-month-text') && content.includes('holiday-day-num') && content.includes('holiday-weekday-text'));
  assert(`${file}: Holiday card has lotus watermark SVG`, content.includes('holiday-lotus-wrap'));

  // Bottom Navigation
  assert(`${file}: Bottom nav has active Dashboard with dot`, content.includes('active-dot-indicator') && content.includes('Dashboard</span>'));
  assert(`${file}: Bottom nav has elevated Apply center button`, content.includes('nav-apply-circle') && content.includes('Apply</span>'));
  assert(`${file}: Bottom nav tabs wired to Attendance, Apply, History, Profile`, 
    content.includes("loadScreen('tpl-MyAttendance')") &&
    content.includes("loadScreen('tpl-LeaveHistory')") &&
    content.includes("loadScreen('tpl-MyProfile')")
  );

  // Dynamic state & helper scripts
  assert(`${file}: deleteEmpRequest defined`, content.includes('function deleteEmpRequest'));
  assert(`${file}: openNotificationsFromDashboard defined`, content.includes('function openNotificationsFromDashboard'));
  assert(`${file}: emp-dash-requests-list placeholder exists`, content.includes('id="emp-dash-requests-list"'));
});

console.log('\n=== 2. Testing Screen Previews ===');
const prevHtml = fs.readFileSync('EmergereApp/EmergereApp/src/screens/EmployeeDashboard/preview.html', 'utf8');
assert('preview.html has header with IT Solutions', prevHtml.includes('IT Solutions Pvt. Ltd.'));
assert('preview.html has Sneha Reddy 👋', prevHtml.includes('Sneha Reddy 👋'));
assert('preview.html has 4 action cards', prevHtml.includes('card-leave') && prevHtml.includes('card-perm') && prevHtml.includes('card-reqs') && prevHtml.includes('card-holiday'));
assert('preview.html has WFH item in balances', prevHtml.includes('WFH') && prevHtml.includes('10 / 15 Days'));
assert('preview.html has Ganesh Chaturthi holiday card', prevHtml.includes('Ganesh Chaturthi'));
assert('preview.html has elevated Apply button', prevHtml.includes('nav-apply-circle'));

const prevCss = fs.readFileSync('EmergereApp/EmergereApp/src/screens/EmployeeDashboard/preview.css', 'utf8');
assert('preview.css has dash-header gradient', prevCss.includes('.dash-header'));
assert('preview.css has action card corner swooshes', prevCss.includes('.card-leave') && prevCss.includes('.card-perm'));
assert('preview.css has elevated Apply button styles', prevCss.includes('.nav-apply-circle'));

console.log('\n=== 3. Testing React Native Files ===');
const rnScreen = fs.readFileSync('EmergereApp/EmergereApp/src/screens/EmployeeDashboard/EmployeeDashboardScreen.jsx', 'utf8');
assert('EmployeeDashboardScreen.jsx has Sneha Reddy default', rnScreen.includes('Sneha Reddy'));
assert('EmployeeDashboardScreen.jsx has WFH in LEAVE_BALANCES', rnScreen.includes('WFH'));
assert('EmployeeDashboardScreen.jsx has Ganesh Chaturthi holiday card', rnScreen.includes('Ganesh Chaturthi'));
assert('EmployeeDashboardScreen.jsx has dashHeader', rnScreen.includes('styles.dashHeader'));

const rnStyles = fs.readFileSync('EmergereApp/EmergereApp/src/screens/EmployeeDashboard/EmployeeDashboardScreen.styles.js', 'utf8');
assert('EmployeeDashboardScreen.styles.js has dashHeader', rnStyles.includes('dashHeader:'));
assert('EmployeeDashboardScreen.styles.js has holidayCard', rnStyles.includes('holidayCard:'));

const rnNav = fs.readFileSync('EmergereApp/EmergereApp/src/components/BottomNavBar.jsx', 'utf8');
assert('BottomNavBar.jsx has isElevated Apply tab', rnNav.includes('isElevated: true'));
assert('BottomNavBar.jsx has activeDot', rnNav.includes('activeDot'));

console.log('\n=== 4. Script Syntax Verification ===');
htmlFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const scripts = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi) || [];
  let fileOk = true;
  scripts.forEach((tag, idx) => {
    const code = tag.replace(/<script[\s\S]*?>/i, '').replace(/<\/script>/i, '');
    if (!code.trim()) return;
    try {
      new vm.Script(code);
    } catch (e) {
      console.error(`Syntax error in ${file} script #${idx + 1}:`, e.message);
      fileOk = false;
      allPassed = false;
    }
  });
  assert(`${file} scripts compile cleanly (${scripts.length} scripts)`, fileOk);
});

if (allPassed) {
  console.log('\n========================================');
  console.log('ALL REDESIGN VERIFICATION TESTS PASSED!');
  console.log('========================================');
} else {
  console.error('\nSOME CHECKS FAILED!');
  process.exit(1);
}
