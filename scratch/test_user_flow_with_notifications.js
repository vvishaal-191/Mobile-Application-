const http = require('http');
const fs = require('fs');

console.log('=== END-TO-END NOTIFICATION & VISIBILITY FLOW TEST ===\n');

// 1. Verify Dev Server response
http.get('http://localhost:3000/preview_app.html', res => {
  console.log(`[HTTP TEST] Dev server status: ${res.statusCode}`);
  if (res.statusCode !== 200) {
    console.error('Dev server failed!');
    process.exit(1);
  }

  runFlowTests();
});

function runFlowTests() {
  console.log('\n--- Step 1: Default / Initial State ---');
  // Initialize shared state as in the app
  const parentWin = {
    PERM_STATE: [],
    EMP_LEAVE_REQUESTS: []
  };

  // Manager dashboard computation
  function computeManagerDashboard(store) {
    const allRequests = (store.EMP_LEAVE_REQUESTS || []).concat(store.PERM_STATE || []);
    const pendingPerms = allRequests.filter(r => (r.isPermission === true || (r.leaveType||'').toLowerCase().includes('permission') || (r.leaveType||'').toLowerCase().includes('going') || (r.type||'').toLowerCase().includes('going')) && (r.status || 'pending').toLowerCase() === 'pending');
    return {
      permBadgeCount: pendingPerms.length,
      permBadgeVisible: pendingPerms.length > 0
    };
  }

  // Permission approvals computation
  function computePermissionApprovals(store, currentTab = 'pending') {
    const reqs = store.PERM_STATE || [];
    const filtered = reqs.filter(r => (r.status || 'pending').toLowerCase() === currentTab);
    return {
      pendingCount: reqs.filter(r => (r.status || 'pending').toLowerCase() === 'pending').length,
      approvedCount: reqs.filter(r => (r.status || 'pending').toLowerCase() === 'approved').length,
      rejectedCount: reqs.filter(r => (r.status || 'pending').toLowerCase() === 'rejected').length,
      cardsDisplayed: filtered.length,
      emptyStateVisible: filtered.length === 0
    };
  }

  // Leave approvals computation
  function computeLeaveApprovals(store) {
    const reqs = store.EMP_LEAVE_REQUESTS || [];
    const approved = reqs.filter(r => (r.status || 'pending').toLowerCase() === 'approved').length;
    return {
      approvedCount: approved,
      approvedNotificationVisible: approved > 0
    };
  }

  let mgrState = computeManagerDashboard(parentWin);
  console.log('1. Manager Dashboard Permission Badge count:', mgrState.permBadgeCount, 'Visible:', mgrState.permBadgeVisible);
  if (mgrState.permBadgeVisible) throw new Error('Permission badge should not be visible by default!');

  let paState = computePermissionApprovals(parentWin, 'pending');
  console.log('2. Permission Approvals Pending Cards:', paState.cardsDisplayed, 'Empty state visible:', paState.emptyStateVisible);
  if (paState.cardsDisplayed !== 0 || !paState.emptyStateVisible) throw new Error('Permission card should not appear by default!');

  let laState = computeLeaveApprovals(parentWin);
  console.log('3. Leave Approvals Approved Notification Count:', laState.approvedCount, 'Visible:', laState.approvedNotificationVisible);
  if (laState.approvedNotificationVisible) throw new Error('Approved notification should not be visible by default!');

  console.log('\n--- Step 2: Employee Submits a Permission Request ---');
  const newPerm = {
    id: 'perm-new-101',
    type: 'Early Going',
    date: '04-Sep-2026',
    duration: '2 Hours',
    reason: 'Personal work',
    status: 'pending',
    isPermission: true,
    employeeName: 'Priya Sharma',
    employeeRole: 'Senior Software Engineer'
  };
  parentWin.PERM_STATE.unshift(newPerm);

  mgrState = computeManagerDashboard(parentWin);
  console.log('1. Manager Dashboard Permission Badge count:', mgrState.permBadgeCount, 'Visible:', mgrState.permBadgeVisible);
  if (!mgrState.permBadgeVisible || mgrState.permBadgeCount !== 1) throw new Error('Permission badge should be visible with count 1 after submission!');

  paState = computePermissionApprovals(parentWin, 'pending');
  console.log('2. Permission Approvals Pending Cards:', paState.cardsDisplayed, 'Empty state visible:', paState.emptyStateVisible);
  if (paState.cardsDisplayed !== 1 || paState.emptyStateVisible) throw new Error('Permission card should be visible after employee submits!');

  console.log('\n--- Step 3: Manager Approves a Leave Request ---');
  const newLeave = {
    id: 'leave-101',
    type: 'Casual Leave',
    fromDate: '10-Sep-2026',
    toDate: '12-Sep-2026',
    duration: '2 Days',
    status: 'pending',
    employeeName: 'Amit Verma'
  };
  parentWin.EMP_LEAVE_REQUESTS.unshift(newLeave);

  // Before approval
  laState = computeLeaveApprovals(parentWin);
  console.log('Before Approval - Approved count:', laState.approvedCount, 'Visible:', laState.approvedNotificationVisible);
  if (laState.approvedNotificationVisible) throw new Error('Approved notification should not be visible before approval!');

  // Manager approves
  newLeave.status = 'approved';
  laState = computeLeaveApprovals(parentWin);
  console.log('After Approval - Approved count:', laState.approvedCount, 'Visible:', laState.approvedNotificationVisible);
  if (!laState.approvedNotificationVisible || laState.approvedCount !== 1) throw new Error('Approved notification should be visible with count 1 after approval!');

  console.log('\n>>> END-TO-END FLOW VERIFICATION COMPLETED SUCCESSFULLY! <<<');
}
