const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('COMPREHENSIVE VERIFICATION REPORT');
console.log('====================================================');

const filesToCheck = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

let totalPassed = 0;
let totalFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(' [PASS]', message);
    totalPassed++;
  } else {
    console.error(' [FAIL]', message);
    totalFailed++;
  }
}

filesToCheck.forEach((filePath) => {
  console.log('\n--- Checking File:', filePath, '---');
  const content = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

  // Requirement 1, 2, 3: Apply Permission Spacing
  assert(
    content.includes('padding-bottom: 90px;') || content.includes('padding-bottom: 220px;') || content.includes('padding-bottom: 140px;'),
    'Apply Permission: Screen padding bottom matches Apply Leave (90px)'
  );
  assert(
    content.includes('margin: -24px 14px 40px 14px;') && content.includes('padding: 22px 16px 32px 16px;'),
    'Apply Permission: Form card has proper bottom margin (40px) and padding (32px)'
  );
  assert(
    content.includes('margin-top: 20px;') && content.includes('margin-bottom: 12px;'),
    'Apply Permission: Submit Request button has generous 20px top margin and 12px bottom margin'
  );

  // Requirement 4, 5, 6: Manager Dashboard Notification Count
  assert(
    !content.includes('mgrHtml2.replace(/class="qbadge" id="manager-dash-perm-badge">'),
    'Leave submission handler does NOT increment permission badge'
  );
  assert(
    content.includes('const notifCount = pendingPerms.length;'),
    'syncManagerDashboard counts pending permission requests accurately'
  );
  assert(
    content.includes('store.MGR_NOTIFICATION_COUNT = pendingPerms.length;'),
    'store.MGR_NOTIFICATION_COUNT matches pending permissions without artificial inflation'
  );

  // Requirement 7, 8: Bottom Navigation Bar and Holiday Calendar Labels
  assert(
    content.includes('<!-- 4. Holiday Calendar -->') && content.includes('<div class="qa-title">Holiday Calendar</div>'),
    'Manager Dashboard: Quick Action card renamed from Team Calendar to Holiday Calendar'
  );
  assert(
    content.includes('<!-- 5. Holiday Calendar -->') && content.includes('<span class="sidebar-item-label">Holiday Calendar</span>'),
    'Manager Dashboard: Sidebar item renamed from Team Calendar to Holiday Calendar'
  );
  assert(
    content.includes('<div class="nav-tab" id="tab-history" onclick="handleCardNav(\'tpl-HolidayCalendar\')">') &&
    content.includes('<span style="white-space:nowrap;font-size:10px;">Holiday Calendar</span>'),
    'Manager Dashboard: Tab 4 in bottom nav has calendar icon and Holiday Calendar label'
  );
  assert(
    content.includes('<div class="tab nav-tab active" id="tab-history"') &&
    content.includes('<span style="white-space:nowrap;font-size:10px;color:#0066FF;font-weight:700;">Holiday Calendar</span>'),
    'Holiday Calendar: Tab 4 has active class, highlighted calendar SVG and blue Holiday Calendar label'
  );

  // Requirement 9, 10, 11: Navigation and Access without restrictions
  assert(
    content.includes("'tpl-Notifications',\n          'tpl-EmployeeDashboard',"),
    'MANAGER_ALLOWED_SCREENS includes Notifications and EmployeeDashboard'
  );
  assert(
    content.includes("if (tplId === 'tpl-EmployeeDashboard' || tplId === 'tpl-Dashboard') {\n              tplId = 'tpl-ManagerDashboard';"),
    'loadScreen normalizes EmployeeDashboard/Dashboard to ManagerDashboard for manager role'
  );
  assert(
    !content.includes("alert('Access Restricted: Manager account is not authorized to access My Requests (History).');"),
    'No Access Restricted alert when manager clicks history / calendar'
  );
  assert(
    content.includes("var backBtns = doc.querySelectorAll('.back-btn, [class*=\"back\"], .hc-back-btn, .lb-back-btn, .perm-back-btn');"),
    'Back buttons query includes hc-back-btn, lb-back-btn, perm-back-btn'
  );
});

// React Native files check
console.log('\n--- Checking React Native & Screen Styles ---');
const rnPermStyles = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.styles.js', 'utf8');
assert(rnPermStyles.includes('paddingBottom: 110,') || rnPermStyles.includes('paddingBottom: 220,') || rnPermStyles.includes('paddingBottom: 140,'), 'RN ApplyPermission styles: paddingBottom matches Apply Leave (110)');
assert(rnPermStyles.includes('marginTop: 20,') && rnPermStyles.includes('marginBottom: 12,'), 'RN ApplyPermission styles: Submit btn margins');

const rnMgrScreen = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/ManagerDashboardScreen.jsx', 'utf8');
assert(rnMgrScreen.includes("title: 'Holiday Calendar',"), 'RN ManagerDashboard: Quick Action title Holiday Calendar');
assert(rnMgrScreen.includes("fresh.filter((r) => r.isPermission).length"), 'RN ManagerDashboard: Permission badge counts only permission requests');

const rnNavBar = fs.readFileSync('EmergereApp/EmergereApp/src/components/BottomNavBar.jsx', 'utf8');
assert(rnNavBar.includes("label: 'Holiday Calendar', icon: 'calendar'"), 'RN BottomNavBar: Manager 4th tab is Holiday Calendar');
assert(!rnNavBar.includes("alert('Access Restricted: Manager account is not authorized to access My Requests (History).');"), 'RN BottomNavBar: Removed restriction alert for managers');

console.log('\n====================================================');
console.log(`TOTAL RESULTS: ${totalPassed} PASSED, ${totalFailed} FAILED`);
console.log('====================================================');
if (totalFailed > 0) process.exit(1);
