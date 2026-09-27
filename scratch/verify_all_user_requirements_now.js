const fs = require('fs');

console.log('=== VERIFYING ALL 4 USER REQUIREMENTS ===\n');

let allPassed = true;
function assert(desc, condition) {
  if (condition) {
    console.log('  [PASS]', desc);
  } else {
    console.error('  [FAIL]', desc);
    allPassed = false;
  }
}

const bundleFiles = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

// Requirement 1 & 2: Permission Approval Notification & Card
console.log('Requirement 1 & 2: Permission Approval Notification & Card');
bundleFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  assert(`${f}: No perm-init-1 in initial PERM_STATE`, !c.includes("id: 'perm-init-1'"));
  assert(`${f}: PERM_STATE initialized as empty array`, c.includes('window.PERM_STATE = [];'));
});

// Check standalone PermissionApprovals/preview.html
const paHtml = fs.readFileSync('EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html', 'utf8');
assert('PermissionApprovals: updatePermTabCounts starts at 0 for all statuses', paHtml.includes('let pending = 0, approved = 0, rejected = 0;'));

// Requirement 3: Leave Approval Notification
console.log('\nRequirement 3: Leave Approval Notification');
bundleFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  assert(`${f}: LeaveApprovals count-approved initialized to 0`, c.includes('id="count-approved">0</span>'));
  assert(`${f}: LeaveApprovals count-approved-wrap hidden by default`, c.includes('id="count-approved-wrap" style="display:none;"'));
  assert(`${f}: updateLeaveTabCounts starts approved at 0`, c.includes('let pending = 0, approved = 0, rejected = 0;'));
  assert(`${f}: updateLeaveTabCounts manages wrapApproved.style.display`, c.includes('wrapApproved.style.display = approved > 0 ? "inline" : "none"'));
});

const laHtml = fs.readFileSync('EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html', 'utf8');
assert('LeaveApprovals/preview.html: count-approved initialized to 0', laHtml.includes('id="count-approved">0</span>'));
assert('LeaveApprovals/preview.html: count-approved-wrap hidden by default', laHtml.includes('id="count-approved-wrap" style="display:none;"'));
assert('LeaveApprovals/preview.html: updateLeaveTabCounts starts approved at 0', laHtml.includes('let pending = 0, approved = 0, rejected = 0;'));

// Requirement 4: Manager Dashboard Notification Icon
console.log('\nRequirement 4: Manager Dashboard Notification Icon');
const mgrPreview = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html', 'utf8');
assert('ManagerDashboard/preview.html: mgr-bell-btn removed', !mgrPreview.includes('mgr-bell-btn'));
assert('ManagerDashboard/preview.html: mgr-bell-dot removed', !mgrPreview.includes('mgr-bell-dot'));

bundleFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  const tplStart = c.indexOf('<template id="tpl-ManagerDashboard">');
  const tplEnd = c.indexOf('</template>', tplStart);
  const tplContent = c.substring(tplStart, tplEnd);
  assert(`${f}: tpl-ManagerDashboard has no mgr-bell-btn`, !tplContent.includes('mgr-bell-btn'));
  assert(`${f}: tpl-ManagerDashboard has no mgr-bell-dot`, !tplContent.includes('mgr-bell-dot'));
});

const mgrJsx = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/ManagerDashboardScreen.jsx', 'utf8');
assert('ManagerDashboardScreen.jsx: bellButton removed', !mgrJsx.includes('bellButton'));

console.log('\n=== OVERALL STATUS ===');
if (allPassed) {
  console.log('>>> ALL 4 USER REQUIREMENTS VERIFIED AND PASSED! <<<');
} else {
  console.error('>>> SOME CHECKS FAILED! <<<');
  process.exit(1);
}
