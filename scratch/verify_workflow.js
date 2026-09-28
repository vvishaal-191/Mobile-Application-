const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('preview_app.html', 'utf8');

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  resources: 'usable',
  url: 'http://localhost:3000/preview_app.html'
});

const { window } = dom;
const { document } = window;

console.log('--- Initializing DOM and Stores ---');

// Setup global mock stores on window
window.AUTH_USER = { name: 'Rahul Sharma', role: 'manager' };
window.USER_PROFILE = { name: 'Rahul Sharma', role: 'Manager', reportingManager: 'Rahul Sharma', initials: 'RS' };
window.EMP_LEAVE_REQUESTS = [];
window.PERM_STATE = [];
window.PERMISSION_REQUESTS = [];
window.MANAGER_SUBMITTED_DECISIONS = {};

// 1. Employee applies for Leave (Casual Leave)
const leaveReq1 = {
  id: 'leave_101',
  name: 'Sneha Reddy',
  employeeName: 'Sneha Reddy',
  employeeId: 'EMP-2024-0103',
  employeeRole: 'UI/UX Designer',
  initials: 'SR',
  leaveType: 'Casual Leave',
  type: 'Casual Leave',
  fromDate: '07-Sep-2026',
  toDate: '12-Sep-2026',
  date: '07-Sep-2026 – 12-Sep-2026',
  duration: '6.0 Days',
  totalDays: '6.0 Days',
  reason: 'Attending family event in hometown',
  status: 'pending',
  isPermission: false,
  createdAt: Date.now()
};
window.EMP_LEAVE_REQUESTS.push(leaveReq1);

// 2. Employee applies for Permission (Early Going) at the same time
const permReq1 = {
  id: 'perm_202',
  name: 'Sneha Reddy',
  employeeName: 'Sneha Reddy',
  employeeId: 'EMP-2024-0103',
  employeeRole: 'UI/UX Designer',
  initials: 'SR',
  type: 'Early Going',
  permissionType: 'Early Going',
  leaveType: 'Early Going',
  date: '04-Sep-2026',
  schedule: '04-Sep-2026 (03:00 PM - 05:00 PM)',
  duration: '2 Hours',
  totalDays: '2 Hours',
  reason: 'Personal doctor appointment',
  status: 'pending',
  isPermission: true,
  createdAt: Date.now() + 10
};
window.PERM_STATE.push(permReq1);
window.PERMISSION_REQUESTS.push(permReq1);

console.log('\\n[TEST 1] Verifying Leave Approvals Screen:');
// Instantiate tpl-LeaveApprovals in a container
const laTpl = document.getElementById('tpl-LeaveApprovals');
const laContainer = document.createElement('div');
laContainer.innerHTML = laTpl.innerHTML;
document.body.appendChild(laContainer);

// Execute Leave Approvals script
const laScripts = laContainer.querySelectorAll('script');
laScripts.forEach(s => window.eval(s.textContent));

// Check counts and rendered cards
const laList = laContainer.querySelector('#leave-cards-list');
const laCards = laList ? laList.querySelectorAll('.approval-card') : [];
console.log('Leave Approvals Pending cards rendered count:', laCards.length);
let hasPermissionInLeave = false;
laCards.forEach(c => {
  console.log('Card text:', c.textContent.replace(/\\s+/g, ' ').trim());
  if (c.textContent.includes('Early Going') || c.textContent.includes('Permission')) {
    hasPermissionInLeave = true;
  }
});
if (laCards.length === 1 && !hasPermissionInLeave) {
  console.log('✅ PASS: Only Leave request is displayed on Leave Approvals. Permission request is NOT present.');
} else {
  console.error('❌ FAIL: Leave Approvals card filtering issue.');
}

console.log('\\n[TEST 2] Verifying Permission Approvals Screen:');
// Instantiate tpl-PermissionApprovals in a container
const paTpl = document.getElementById('tpl-PermissionApprovals');
const paContainer = document.createElement('div');
paContainer.innerHTML = paTpl.innerHTML;
document.body.appendChild(paContainer);

// Execute Permission Approvals script
const paScripts = paContainer.querySelectorAll('script');
paScripts.forEach(s => window.eval(s.textContent));

// Check counts and rendered cards
const paList = paContainer.querySelector('#perm-cards-list');
const paCards = paList ? paList.querySelectorAll('.approval-card') : [];
console.log('Permission Approvals Pending cards rendered count:', paCards.length);
let hasLeaveInPermission = false;
paCards.forEach(c => {
  console.log('Card text:', c.textContent.replace(/\\s+/g, ' ').trim());
  if (c.textContent.includes('Casual Leave')) {
    hasLeaveInPermission = true;
  }
});
if (paCards.length === 1 && !hasLeaveInPermission) {
  console.log('✅ PASS: Only Permission request is displayed on Permission Approvals. Leave request is NOT present.');
} else {
  console.error('❌ FAIL: Permission Approvals card filtering issue.');
}

console.log('\\n[TEST 3] Verifying Manager Dashboard Before Decisions:');
const mdTpl = document.getElementById('tpl-ManagerDashboard');
const mdContainer = document.createElement('div');
mdContainer.innerHTML = mdTpl.innerHTML;
document.body.appendChild(mdContainer);
const mdScripts = mdContainer.querySelectorAll('script');
mdScripts.forEach(s => window.eval(s.textContent));

// Check badges on Manager Dashboard
const leaveBadge = mdContainer.querySelector('#manager-dash-leave-badge');
const permBadge = mdContainer.querySelector('#manager-dash-perm-badge');
console.log('Leave Badge count:', leaveBadge ? leaveBadge.textContent : 'none');
console.log('Permission Badge count:', permBadge ? permBadge.textContent : 'none');
const reqListBefore = mdContainer.querySelector('#mgr-dash-requests-list');
const recentCardsBefore = reqListBefore ? reqListBefore.querySelectorAll('.recent-req-item') : [];
console.log('Recent Requests count before decisions:', recentCardsBefore.length);

console.log('\\n[TEST 4] Approving Leave Request & Rejecting Permission Request:');
// 4a. Manager Approves Leave Request
leaveReq1.status = 'approved';
leaveReq1.managerDecisionSubmitted = true;
leaveReq1.approvedAt = Date.now();
window.MANAGER_SUBMITTED_DECISIONS['leave_101'] = true;

// 4b. Manager Rejects Permission Request
permReq1.status = 'rejected';
permReq1.managerDecisionSubmitted = true;
permReq1.rejectedAt = Date.now() + 5;
window.MANAGER_SUBMITTED_DECISIONS['perm_202'] = true;

// Trigger syncManagerDashboard
window.eval("syncManagerDashboard(document.body.querySelector('#tpl-ManagerDashboard') ? document : document)");

// Re-run sync on the mdContainer
const syncScript = mdContainer.querySelector('script');
window.eval(syncScript.textContent);
// Call syncManagerDashboard with mdContainer's document
if (typeof window.syncManagerDashboard === 'function') {
  window.syncManagerDashboard(mdContainer);
}

const reqListAfter = mdContainer.querySelector('#mgr-dash-requests-list');
const recentCardsAfter = reqListAfter ? reqListAfter.querySelectorAll('.recent-req-item') : [];
console.log('Recent Requests count after decisions:', recentCardsAfter.length);
recentCardsAfter.forEach((c, idx) => {
  console.log(`Recent Card ${idx + 1}:`, c.textContent.replace(/\\s+/g, ' ').trim());
});

if (recentCardsAfter.length === 2) {
  console.log('✅ PASS: Both processed requests appear separately in Recent Requests with their independent statuses!');
} else {
  console.error('❌ FAIL: Recent Requests count unexpected:', recentCardsAfter.length);
}

console.log('\\nAll tests completed.');
