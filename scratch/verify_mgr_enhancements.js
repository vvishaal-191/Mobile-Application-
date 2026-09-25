const fs = require('fs');

console.log('--- RUNNING COMPREHENSIVE MANAGER DASHBOARD VERIFICATION ---');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

let allPassed = true;

function assert(condition, message) {
  if (!condition) {
    console.error('❌ FAIL:', message);
    allPassed = false;
  } else {
    console.log('✅ PASS:', message);
  }
}

files.forEach(f => {
  console.log(`\nValidating ${f}...`);
  const content = fs.readFileSync(f, 'utf8');

  // Requirement 1: Employee Status Button colors
  assert(content.includes('.profile-status-pill.inactive-status { background: #FEE2E2 !important; border: 1px solid #FCA5A5 !important; }'), `${f}: Inactive status pill CSS present`);
  assert(content.includes('.profile-status-pill.inactive-status .profile-status-dot { background: #EF4444 !important; }'), `${f}: Inactive status dot CSS present`);
  assert(content.includes('.profile-status-pill.inactive-status .profile-status-text { color: #DC2626 !important; }'), `${f}: Inactive status text CSS present`);
  assert(content.includes('.profile-status-pill.active-status { background: #DCFCE7 !important; border: 1px solid #86EFAC !important; }'), `${f}: Active status pill CSS present`);

  // updateLiveProfileStatusUI
  assert(content.includes("pillEl.className = 'profile-status-pill inactive-status';"), `${f}: updateLiveProfileStatusUI sets inactive-status`);
  assert(content.includes("pillEl.className = 'profile-status-pill active-status';"), `${f}: updateLiveProfileStatusUI sets active-status`);

  // Requirement 2: Notification Count on Permission Approvals card
  assert(content.includes('id="manager-dash-perm-badge"'), `${f}: manager-dash-perm-badge element exists in template`);
  assert(content.includes('parentWin.MGR_NOTIFICATION_COUNT = (parentWin.MGR_NOTIFICATION_COUNT || 0) + 1;'), `${f}: handleApplyPermissionSubmit increments MGR_NOTIFICATION_COUNT`);
  assert(content.includes('store.MGR_NOTIFICATION_COUNT = (store.MGR_NOTIFICATION_COUNT || 0) + 1;'), `${f}: handleApplyLeaveSubmit increments MGR_NOTIFICATION_COUNT`);

  // Requirement 3: Recent Requests
  assert(content.includes('function syncManagerDashboard('), `${f}: syncManagerDashboard function defined`);
  assert(content.includes("doc.getElementById('mgr-dash-requests-label')"), `${f}: syncManagerDashboard updates requests label`);
  assert(content.includes("doc.getElementById('mgr-dash-requests-list')"), `${f}: syncManagerDashboard updates requests list`);
  assert(content.includes("handleCardNav('tpl-LeaveApprovalDetail'"), `${f}: Recent requests clickable to review`);
});

// React Native files
console.log('\nValidating React Native files...');
const mgrJsx = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/ManagerDashboardScreen.jsx', 'utf8');
assert(!mgrJsx.includes("(r.status || 'Pending').toLowerCase() !== 'pending'"), 'ManagerDashboardScreen.jsx does NOT exclude pending requests');
assert(mgrJsx.includes("action.key === 'PermissionApprovals'"), 'ManagerDashboardScreen.jsx increments PermissionApprovals badge');

const profileJsx = fs.readFileSync('EmergereApp/EmergereApp/src/screens/MyProfile/MyProfileScreen.jsx', 'utf8');
assert(profileJsx.includes('styles.statusPillInactive'), 'MyProfileScreen.jsx uses statusPillInactive');

const profileStyles = fs.readFileSync('EmergereApp/EmergereApp/src/screens/MyProfile/MyProfileScreen.styles.js', 'utf8');
assert(profileStyles.includes('statusPillInactive:'), 'MyProfileScreen.styles.js defines statusPillInactive');
assert(profileStyles.includes('#FEE2E2'), 'MyProfileScreen.styles.js has red background for inactive');
assert(profileStyles.includes('#EF4444'), 'MyProfileScreen.styles.js has red dot for inactive');

// Test simulation of syncManagerDashboard logic with JSDOM / mocked DOM
console.log('\nTesting syncManagerDashboard simulation...');
global.window = global;
global.document = {
  getElementById() { return null; }
};

const syncCode = fs.readFileSync('scratch/sync_mgr_code.js', 'utf8');

// Create mock document
const mockDoc = {
  elements: {},
  getElementById(id) {
    if (!this.elements[id]) {
      this.elements[id] = { textContent: '', innerHTML: '', style: {} };
    }
    return this.elements[id];
  }
};

// Initialize elements
mockDoc.getElementById('manager-dash-perm-badge').textContent = '0';
mockDoc.getElementById('manager-dash-leave-badge').textContent = '0';
mockDoc.getElementById('mgr-stat-pending').textContent = '18';
mockDoc.getElementById('mgr-dash-requests-label').textContent = 'Recent Requests (0)';
mockDoc.getElementById('mgr-dash-requests-list').innerHTML = '';

// Run sync on empty state
eval(syncCode);
syncManagerDashboard(mockDoc);

assert(mockDoc.getElementById('manager-dash-perm-badge').textContent === '0', 'Initial perm badge is 0');
assert(mockDoc.getElementById('mgr-dash-requests-list').innerHTML.includes('No recent requests'), 'Empty state shows "No recent requests"');

// Simulate submitting permission request
global.EMP_LEAVE_REQUESTS = [
  {
    id: 'perm-101',
    isPermission: true,
    leaveType: 'Early Going',
    fromDate: '08-Sep-2026',
    daysText: '2 Hours',
    reason: 'Doctor appointment',
    employeeName: 'Sneha Reddy',
    employeeRole: 'UI/UX Designer',
    status: 'pending'
  }
];
global.MGR_NOTIFICATION_COUNT = 1;

syncManagerDashboard(mockDoc);

assert(mockDoc.getElementById('manager-dash-perm-badge').textContent === '1', 'Notification count increases to 1');
assert(mockDoc.getElementById('mgr-dash-requests-label').textContent === 'Recent Requests (1)', 'Recent requests label is Recent Requests (1)');
assert(mockDoc.getElementById('mgr-dash-requests-list').innerHTML.includes('Sneha Reddy'), 'Recent requests list shows Sneha Reddy');
assert(mockDoc.getElementById('mgr-dash-requests-list').innerHTML.includes('Early Going (2 Hours)'), 'Recent requests list shows Early Going (2 Hours)');
assert(mockDoc.getElementById('mgr-dash-requests-list').innerHTML.includes('Doctor appointment'), 'Recent requests list shows Doctor appointment');
assert(mockDoc.getElementById('mgr-dash-requests-list').innerHTML.includes('active-status'), 'Active status button is shown');
assert(mockDoc.getElementById('mgr-dash-requests-list').innerHTML.includes('#DCFCE7'), 'Active status button has green background');

// Simulate adding a second leave request with inactive status
global.EMP_LEAVE_REQUESTS.push({
  id: 'leave-102',
  isPermission: false,
  leaveType: 'Casual Leave',
  fromDate: '09-Sep-2026',
  toDate: '10-Sep-2026',
  daysText: '2 Days',
  reason: 'Family function',
  employeeName: 'Priya Sharma',
  employeeRole: 'Senior Software Engineer',
  status: 'approved'
});
global.MGR_NOTIFICATION_COUNT = 2;

syncManagerDashboard(mockDoc);

assert(mockDoc.getElementById('manager-dash-perm-badge').textContent === '2', 'Notification count increases to 2');
assert(mockDoc.getElementById('mgr-dash-requests-label').textContent === 'Recent Requests (2)', 'Recent requests label is Recent Requests (2)');
assert(mockDoc.getElementById('mgr-dash-requests-list').innerHTML.includes('Priya Sharma'), 'Recent requests list shows Priya Sharma');
assert(mockDoc.getElementById('mgr-dash-requests-list').innerHTML.includes('inactive-status'), 'Inactive status button is shown for approved leave');
assert(mockDoc.getElementById('mgr-dash-requests-list').innerHTML.includes('#FEE2E2'), 'Inactive status button has red background');
assert(mockDoc.getElementById('mgr-dash-requests-list').innerHTML.includes('#EF4444'), 'Inactive status button has red dot');
assert(mockDoc.getElementById('mgr-dash-requests-list').innerHTML.includes('#DC2626'), 'Inactive status button has red text');

console.log('\n========================================');
if (allPassed) {
  console.log('🎉 ALL ASSERTIONS PASSED PERFECTLY!');
} else {
  console.log('⚠️ SOME ASSERTIONS FAILED. CHECK LOGS ABOVE.');
}
console.log('========================================');
