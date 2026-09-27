const fs = require('fs');

console.log('=== TESTING USER WORKFLOW ON MANAGER DASHBOARD ===\n');

// Load preview_app.html
const html = fs.readFileSync('preview_app.html', 'utf8');

// Mock a lightweight DOM environment
function createMockDoc() {
  const elements = {};
  function getEl(id) {
    if (!elements[id]) {
      elements[id] = {
        id: id,
        textContent: '',
        innerHTML: '',
        style: {},
        classList: {
          add: () => {},
          remove: () => {}
        }
      };
    }
    return elements[id];
  }
  return {
    getElementById: getEl,
    querySelector: () => null,
    querySelectorAll: () => [],
    ownerDocument: null,
    elements: elements
  };
}

// Extract syncManagerDashboard from preview_app.html
const syncMatch = html.match(/function syncManagerDashboard\(targetDoc\) \{([\s\S]*?)\n    \}/);
if (!syncMatch) {
  console.error('[FAIL] Could not find syncManagerDashboard');
  process.exit(1);
}

const syncFnBody = syncMatch[1];
const syncManagerDashboard = new Function('targetDoc', syncFnBody);

// TEST 1: Initial state (No decisions submitted by manager yet)
console.log('--- TEST 1: Initial State ---');
global.window = {
  EMP_LEAVE_REQUESTS: [],
  PERM_STATE: [
    {
      id: 'perm-init-1',
      type: 'Early Going',
      date: '04-Sep-2026',
      duration: '2 Hours',
      reason: 'Personal work',
      status: 'pending',
      managerDecisionSubmitted: false,
      employeeName: 'Priya Sharma',
      employeeInitials: 'PS',
      employeeId: 'EMP-2024-0156'
    }
  ],
  MANAGER_SUBMITTED_DECISIONS: {}
};
global.document = createMockDoc();
const mockDoc1 = createMockDoc();
syncManagerDashboard(mockDoc1);

const label1 = mockDoc1.getElementById('mgr-dash-requests-label').textContent;
const listHtml1 = mockDoc1.getElementById('mgr-dash-requests-list').innerHTML;
console.log('Requests label:', label1);
console.log('Has empty state:', listHtml1.includes('No recent requests'));
console.log('Has Priya card:', listHtml1.includes('Priya Sharma'));

if (label1 === 'Recent Requests (0)' && listHtml1.includes('No recent requests') && !listHtml1.includes('Priya Sharma')) {
  console.log('[PASS] Test 1: Card is NOT displayed initially.\n');
} else {
  console.error('[FAIL] Test 1 failed!');
  process.exit(1);
}

// TEST 2: Employee submits a new request (Pending)
console.log('--- TEST 2: Employee Submits Leave/Permission Request ---');
global.window.EMP_LEAVE_REQUESTS.push({
  id: 'leave-new-1',
  employeeName: 'Jack Wilson',
  employeeRole: 'Software Engineer',
  leaveType: 'Casual Leave',
  daysText: '2 Days',
  fromDate: '15-Oct-2026',
  toDate: '16-Oct-2026',
  reason: 'Family trip',
  status: 'pending',
  managerDecisionSubmitted: false
});

const mockDoc2 = createMockDoc();
syncManagerDashboard(mockDoc2);

const label2 = mockDoc2.getElementById('mgr-dash-requests-label').textContent;
const listHtml2 = mockDoc2.getElementById('mgr-dash-requests-list').innerHTML;
console.log('Requests label:', label2);
console.log('Has Jack card:', listHtml2.includes('Jack Wilson'));

if (label2 === 'Recent Requests (0)' && !listHtml2.includes('Jack Wilson')) {
  console.log('[PASS] Test 2: Newly submitted employee request does NOT immediately appear in Recent Requests.\n');
} else {
  console.error('[FAIL] Test 2 failed!');
  process.exit(1);
}

// TEST 3: Manager approves/rejects and submits decision on Priya's request
console.log('--- TEST 3: Manager Rejects Priya Sharma Request & Submits Decision ---');
global.window.PERM_STATE[0].status = 'rejected';
global.window.PERM_STATE[0].managerDecisionSubmitted = true;
global.window.PERM_STATE[0].decisionSubmitted = true;
global.window.PERM_STATE[0].rejectedAt = Date.now();
global.window.MANAGER_SUBMITTED_DECISIONS['perm-init-1'] = true;

const mockDoc3 = createMockDoc();
syncManagerDashboard(mockDoc3);

const label3 = mockDoc3.getElementById('mgr-dash-requests-label').textContent;
const listHtml3 = mockDoc3.getElementById('mgr-dash-requests-list').innerHTML;
console.log('Requests label:', label3);
console.log('Has Priya card:', listHtml3.includes('Priya Sharma'));
console.log('Has Early Going (2 Hours):', listHtml3.includes('Early Going (2 Hours)'));
console.log('Has Rejected status:', listHtml3.includes('Rejected'));
console.log('Has "Personal work" reason:', listHtml3.includes('"Personal work"'));
console.log('Has Active button:', listHtml3.includes('profile-status-pill') || listHtml3.includes('Active'));

if (
  label3 === 'Recent Requests (1)' &&
  listHtml3.includes('Priya Sharma') &&
  listHtml3.includes('Early Going (2 Hours)') &&
  listHtml3.includes('Rejected') &&
  listHtml3.includes('"Personal work"') &&
  !listHtml3.includes('profile-status-pill') &&
  !listHtml3.includes('Active')
) {
  console.log('[PASS] Test 3: Card appears only after manager rejects & submits, and Active button is removed!\n');
} else {
  console.error('[FAIL] Test 3 failed!');
  process.exit(1);
}

// TEST 4: Manager also approves Jack's request & submits decision
console.log('--- TEST 4: Manager Approves Jack Wilson Request & Submits Decision ---');
global.window.EMP_LEAVE_REQUESTS[0].status = 'approved';
global.window.EMP_LEAVE_REQUESTS[0].managerDecisionSubmitted = true;
global.window.EMP_LEAVE_REQUESTS[0].decisionSubmitted = true;
global.window.EMP_LEAVE_REQUESTS[0].approvedAt = Date.now();
global.window.MANAGER_SUBMITTED_DECISIONS['leave-new-1'] = true;

const mockDoc4 = createMockDoc();
syncManagerDashboard(mockDoc4);

const label4 = mockDoc4.getElementById('mgr-dash-requests-label').textContent;
const listHtml4 = mockDoc4.getElementById('mgr-dash-requests-list').innerHTML;
console.log('Requests label:', label4);
console.log('Has Priya card:', listHtml4.includes('Priya Sharma'));
console.log('Has Jack card:', listHtml4.includes('Jack Wilson'));
console.log('Has Active button:', listHtml4.includes('profile-status-pill') || listHtml4.includes('Active'));

if (
  label4 === 'Recent Requests (2)' &&
  listHtml4.includes('Priya Sharma') &&
  listHtml4.includes('Jack Wilson') &&
  !listHtml4.includes('profile-status-pill') &&
  !listHtml4.includes('Active')
) {
  console.log('[PASS] Test 4: Both submitted decisions appear, neither has Active button!\n');
} else {
  console.error('[FAIL] Test 4 failed!');
  process.exit(1);
}

console.log('*** ALL RUNTIME BEHAVIOR TESTS PASSED PERFECTLY! ***');
