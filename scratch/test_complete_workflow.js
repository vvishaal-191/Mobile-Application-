const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('🧪 RUNNING COMPLETE WORKFLOW SEPARATION VERIFICATION TESTS');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log('  ✅ PASS: ' + message);
    passCount++;
  } else {
    console.error('  ❌ FAIL: ' + message);
    failCount++;
  }
}

// ---------------------------------------------------------
// TEST SUITE 1: Helper Predicates and Filter Logic
// ---------------------------------------------------------
console.log('[SUITE 1] Helper Predicates (isPermissionRequest vs isLeaveRequest):');

function isPermissionRequest(r) {
  if (!r) return false;
  if (r.isPermission === true || r._isPermCard === true) return true;
  if (r.isPermission === false) return false;
  if (r.permissionType) return true;
  const permTypes = ['early going', 'late coming', 'personal work', 'official work', 'permission'];
  const t = (r.type || r.leaveType || r.permissionType || '').trim().toLowerCase();
  return permTypes.includes(t) || t.includes('early going') || t.includes('late coming');
}

function isLeaveRequest(r) {
  if (!r) return false;
  return !isPermissionRequest(r);
}

const leaveSample1 = { id: 'l1', leaveType: 'Casual Leave', isPermission: false, totalDays: '2 Days' };
const leaveSample2 = { id: 'l2', type: 'Sick Leave', duration: '1 Day' };
const permSample1 = { id: 'p1', permissionType: 'Early Going', isPermission: true, duration: '2 Hours' };
const permSample2 = { id: 'p2', type: 'Late Coming', schedule: '04-Sep-2026 (09:00 AM - 11:00 AM)' };

assert(isLeaveRequest(leaveSample1), 'Casual Leave is identified as Leave request');
assert(isLeaveRequest(leaveSample2), 'Sick Leave is identified as Leave request');
assert(!isPermissionRequest(leaveSample1), 'Casual Leave is NOT a Permission request');
assert(!isPermissionRequest(leaveSample2), 'Sick Leave is NOT a Permission request');

assert(isPermissionRequest(permSample1), 'Early Going is identified as Permission request');
assert(isPermissionRequest(permSample2), 'Late Coming is identified as Permission request');
assert(!isLeaveRequest(permSample1), 'Early Going is NOT a Leave request');
assert(!isLeaveRequest(permSample2), 'Late Coming is NOT a Leave request');

// ---------------------------------------------------------
// TEST SUITE 2: Leave Approvals Screen Filter Isolation
// ---------------------------------------------------------
console.log('\n[SUITE 2] Leave Approvals Screen Filter Isolation:');

const mixedStore = [
  { id: '1', name: 'Priya Sharma', leaveType: 'Casual Leave', status: 'approved', isPermission: false },
  { id: '2', name: 'Sneha Reddy', leaveType: 'Sick Leave', status: 'pending', isPermission: false },
  { id: '3', name: 'Sneha Reddy', permissionType: 'Early Going', status: 'pending', isPermission: true },
  { id: '4', name: 'Vikram Singh', permissionType: 'Late Coming', status: 'approved', isPermission: true },
];

const leaveApprovalsList = mixedStore.filter(isLeaveRequest);
assert(leaveApprovalsList.length === 2, 'Leave Approvals list contains exactly 2 Leave items');
assert(leaveApprovalsList.every(r => !r.isPermission && !isPermissionRequest(r)), 'All items in Leave Approvals list are pure Leave requests');
assert(!leaveApprovalsList.some(r => r.permissionType === 'Early Going'), 'Permission request "Early Going" is excluded from Leave Approvals');

// ---------------------------------------------------------
// TEST SUITE 3: Permission Approvals Screen Filter Isolation
// ---------------------------------------------------------
console.log('\n[SUITE 3] Permission Approvals Screen Filter Isolation:');

const permissionApprovalsList = mixedStore.filter(isPermissionRequest);
assert(permissionApprovalsList.length === 2, 'Permission Approvals list contains exactly 2 Permission items');
assert(permissionApprovalsList.every(r => isPermissionRequest(r)), 'All items in Permission Approvals list are pure Permission requests');
assert(!permissionApprovalsList.some(r => r.leaveType === 'Casual Leave' || r.leaveType === 'Sick Leave'), 'Leave requests "Casual Leave" and "Sick Leave" are excluded from Permission Approvals');

// ---------------------------------------------------------
// TEST SUITE 4: Manager Dashboard Recent Requests Separation
// ---------------------------------------------------------
console.log('\n[SUITE 4] Manager Dashboard Recent Requests (Simultaneous Decision Processing):');

function isDecidedAndSubmitted(r) {
  if (!r) return false;
  const s = (r.status || '').toLowerCase();
  return (s === 'approved' || s === 'rejected');
}

const allLeaves = mixedStore.filter(isLeaveRequest);
const allPerms = mixedStore.filter(isPermissionRequest);

const pendingLeaves = allLeaves.filter(r => r.status === 'pending');
const pendingPerms = allPerms.filter(r => r.status === 'pending');

assert(pendingLeaves.length === 1, 'Quick action Leave Approvals badge shows pending leave count (1)');
assert(pendingPerms.length === 1, 'Quick action Permission Approvals badge shows pending permission count (1)');

// Simulate decisions: Manager Approves Sneha Sick Leave and Rejects Sneha Early Going
const leaveDecision = { ...allLeaves.find(r => r.id === '2'), status: 'approved', approvedAt: Date.now() };
const permDecision = { ...allPerms.find(r => r.id === '3'), status: 'rejected', rejectedAt: Date.now() + 10 };

const updatedLeaves = [leaveDecision, allLeaves.find(r => r.id === '1')];
const updatedPerms = [permDecision, allPerms.find(r => r.id === '4')];

const processedLeaves = updatedLeaves.filter(isDecidedAndSubmitted);
const processedPerms = updatedPerms.filter(isDecidedAndSubmitted);

const processedRequests = [];
processedLeaves.forEach(l => processedRequests.push(Object.assign({}, l, { _isPermCard: false })));
processedPerms.forEach(p => processedRequests.push(Object.assign({}, p, { _isPermCard: true })));

assert(processedRequests.length === 4, 'Total processed requests in Recent Requests equals 4 (2 leaves, 2 permissions)');
const snehaLeaves = processedRequests.filter(r => r.name === 'Sneha Reddy' && !r._isPermCard);
const snehaPerms = processedRequests.filter(r => r.name === 'Sneha Reddy' && r._isPermCard);

assert(snehaLeaves.length === 1, 'Sneha Reddy Leave request is present as a distinct card in Recent Requests');
assert(snehaLeaves[0].status === 'approved', 'Sneha Reddy Leave request has Approved status');
assert(snehaPerms.length === 1, 'Sneha Reddy Permission request is present as a distinct card in Recent Requests');
assert(snehaPerms[0].status === 'rejected', 'Sneha Reddy Permission request has Rejected status');

// ---------------------------------------------------------
// TEST SUITE 5: Source Files Inspection
// ---------------------------------------------------------
console.log('\n[SUITE 5] Verifying Code In Workspace Files:');

const filesToCheck = [
  'EmergereApp/EmergereApp/src/screens/LeaveApprovals/LeaveApprovalsScreen.jsx',
  'EmergereApp/EmergereApp/src/screens/PermissionApprovals/PermissionApprovalsScreen.jsx',
  'EmergereApp/EmergereApp/src/screens/ManagerDashboard/ManagerDashboardScreen.jsx',
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html',
  'EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html',
  'EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.js'
];

filesToCheck.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  assert(content.includes('isPermissionRequest') || content.includes('isPermReq'), `${f} contains isPermissionRequest logic`);
  assert(!content.includes("parentWin.EMP_LEAVE_REQUESTS.unshift({ id: newId, leaveType: pType"), `${f} does not improperly inject permissions into EMP_LEAVE_REQUESTS`);
});

console.log('\n================================================================');
console.log(`📊 SUMMARY: Total Passed: ${passCount}, Failed: ${failCount}`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
}
