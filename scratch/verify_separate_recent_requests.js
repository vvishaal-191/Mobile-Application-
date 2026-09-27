const fs = require('fs');

console.log('--- STARTING COMPREHENSIVE RECENT REQUESTS VERIFICATION ---');

const previewJsContent = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.js', 'utf8');

// Function to simulate the Manager Dashboard sync
function runSimulation({ empLeaveRequests = [], permState = [], personData = {}, submittedDecisions = {} }) {
  const els = {};
  const mockDoc = {
    getElementById: (id) => {
      if (!els[id]) {
        els[id] = {
          id,
          style: {},
          textContent: '',
          innerHTML: ''
        };
      }
      return els[id];
    }
  };

  const mockWindow = {
    EMP_LEAVE_REQUESTS: empLeaveRequests,
    PERM_STATE: permState,
    PERSON_DATA: personData,
    MANAGER_SUBMITTED_DECISIONS: submittedDecisions,
    document: mockDoc
  };

  // Mock global and window
  const origWindow = global.window;
  const origDoc = global.document;
  global.window = mockWindow;
  global.document = mockDoc;

  // Evaluate syncManagerDashboard from preview.js
  const fnStart = previewJsContent.indexOf('function syncManagerDashboard');
  const fnEnd = previewJsContent.indexOf('document.addEventListener');
  const fnCode = previewJsContent.substring(fnStart, fnEnd);
  
  eval(fnCode);

  syncManagerDashboard(mockDoc);

  global.window = origWindow;
  global.document = origDoc;

  const label = els['mgr-dash-requests-label'] ? els['mgr-dash-requests-label'].textContent : '';
  const html = els['mgr-dash-requests-list'] ? els['mgr-dash-requests-list'].innerHTML : '';
  const cardCount = (html.match(/class="recent-req-item"/g) || []).length;
  const hasEmptyState = html.includes('empty-requests-wrap') && html.includes('No recent requests');

  return { label, html, cardCount, hasEmptyState };
}

// TEST 1: Initial empty state
console.log('\n[TEST 1] Initial empty state');
const t1 = runSimulation({});
console.log('Label:', t1.label);
console.log('Has empty state:', t1.hasEmptyState);
console.log('Card count:', t1.cardCount);
if (t1.label === 'Recent Requests (0)' && t1.hasEmptyState && t1.cardCount === 0) {
  console.log('✅ TEST 1 PASSED: Empty state shown, 0 cards');
} else {
  console.error('❌ TEST 1 FAILED');
  process.exit(1);
}

// TEST 2: Employee submits Leave and Permission requests (both still pending)
console.log('\n[TEST 2] Requests submitted by employee but STILL PENDING (manager has not taken action yet)');
const t2 = runSimulation({
  empLeaveRequests: [
    {
      id: 'leave-1001',
      employeeName: 'John Doe',
      employeeRole: 'UI/UX Designer',
      leaveType: 'Casual Leave',
      duration: '2 Days',
      fromDate: '10-Sep-2026',
      toDate: '11-Sep-2026',
      reason: 'Family occasion',
      status: 'pending'
    },
    // Permission request copy in EMP_LEAVE_REQUESTS
    {
      id: 'perm-2002',
      employeeName: 'John Doe',
      employeeRole: 'UI/UX Designer',
      leaveType: 'Early Going',
      duration: '1 Hour',
      fromDate: '04-Sep-2026',
      toDate: '04-Sep-2026',
      reason: 'Personal work / checkup',
      status: 'pending',
      isPermission: true
    }
  ],
  permState: [
    {
      id: 'perm-2002',
      employeeName: 'John Doe',
      employeeRole: 'UI/UX Designer',
      type: 'Early Going',
      leaveType: 'Early Going',
      duration: '1 Hour',
      date: '04-Sep-2026',
      fromDate: '04-Sep-2026',
      toDate: '04-Sep-2026',
      reason: 'Personal work / checkup',
      status: 'pending',
      isPermission: true
    }
  ]
});
console.log('Label:', t2.label);
console.log('Has empty state:', t2.hasEmptyState);
console.log('Card count:', t2.cardCount);
if (t2.label === 'Recent Requests (0)' && t2.hasEmptyState && t2.cardCount === 0) {
  console.log('✅ TEST 2 PASSED: Pending requests do NOT appear in Recent Requests before action taken');
} else {
  console.error('❌ TEST 2 FAILED');
  process.exit(1);
}

// TEST 3: Manager approves Leave request ONLY
console.log('\n[TEST 3] Manager approves Leave request ONLY');
const t3 = runSimulation({
  empLeaveRequests: [
    {
      id: 'leave-1001',
      employeeName: 'John Doe',
      employeeRole: 'UI/UX Designer',
      leaveType: 'Casual Leave',
      duration: '2 Days',
      fromDate: '10-Sep-2026',
      toDate: '11-Sep-2026',
      reason: 'Family occasion',
      status: 'approved',
      managerDecisionSubmitted: true,
      approvedAt: Date.now()
    }
  ],
  permState: [
    {
      id: 'perm-2002',
      employeeName: 'John Doe',
      employeeRole: 'UI/UX Designer',
      type: 'Early Going',
      leaveType: 'Early Going',
      duration: '1 Hour',
      date: '04-Sep-2026',
      reason: 'Personal work / checkup',
      status: 'pending',
      isPermission: true
    }
  ],
  submittedDecisions: { 'leave-1001': true }
});
console.log('Label:', t3.label);
console.log('Card count:', t3.cardCount);
const t3HasLeaveDetails = t3.html.includes('Casual Leave (2 Days)') && t3.html.includes('Approved') && t3.html.includes('Family occasion');
if (t3.label === 'Recent Requests (1)' && t3.cardCount === 1 && t3HasLeaveDetails) {
  console.log('✅ TEST 3 PASSED: Exactly 1 Leave card displayed with status Approved');
} else {
  console.error('❌ TEST 3 FAILED');
  process.exit(1);
}

// TEST 4: Manager rejects Permission request ONLY
console.log('\n[TEST 4] Manager rejects Permission request ONLY (Matching User Uploaded Image)');
const t4 = runSimulation({
  empLeaveRequests: [],
  permState: [
    {
      id: 'perm-2002',
      employeeName: 'John Doe',
      employeeRole: 'UI/UX Designer',
      employeeInitials: 'JD',
      type: 'Early Going',
      leaveType: 'Early Going',
      duration: '1 Hour',
      date: '04-Sep-2026 – 04-Sep-2026',
      fromDate: '04-Sep-2026',
      toDate: '04-Sep-2026',
      reason: 'Personal work / checkup',
      status: 'rejected',
      managerDecisionSubmitted: true,
      rejectedAt: Date.now(),
      isPermission: true
    }
  ],
  submittedDecisions: { 'perm-2002': true }
});
console.log('Label:', t4.label);
console.log('Card count:', t4.cardCount);
const t4HasPermDetails = t4.html.includes('Early Going (1 Hour)') &&
                         t4.html.includes('04-Sep-2026') &&
                         t4.html.includes('Rejected') &&
                         t4.html.includes('Personal work / checkup') &&
                         t4.html.includes('John Doe') &&
                         t4.html.includes('UI/UX Designer');
if (t4.label === 'Recent Requests (1)' && t4.cardCount === 1 && t4HasPermDetails) {
  console.log('✅ TEST 4 PASSED: Exactly 1 Permission card displayed with status Rejected matching user reference');
} else {
  console.error('❌ TEST 4 FAILED');
  process.exit(1);
}

// TEST 5: Manager approves/rejects BOTH a Leave request AND a Permission request
console.log('\n[TEST 5] Manager approves Leave AND rejects Permission -> TWO SEPARATE CARDS');
const t5 = runSimulation({
  empLeaveRequests: [
    {
      id: 'leave-1001',
      employeeName: 'John Doe',
      employeeRole: 'UI/UX Designer',
      employeeInitials: 'JD',
      leaveType: 'Casual Leave',
      duration: '2 Days',
      fromDate: '10-Sep-2026',
      toDate: '11-Sep-2026',
      reason: "Family function - attending sister's wedding ceremony in Bangalore.",
      status: 'approved',
      managerDecisionSubmitted: true,
      approvedAt: Date.now() - 1000
    },
    {
      id: 'perm-2002',
      employeeName: 'John Doe',
      employeeRole: 'UI/UX Designer',
      leaveType: 'Early Going',
      duration: '1 Hour',
      fromDate: '04-Sep-2026',
      toDate: '04-Sep-2026',
      reason: 'Personal work / checkup',
      status: 'rejected',
      isPermission: true
    }
  ],
  permState: [
    {
      id: 'perm-2002',
      employeeName: 'John Doe',
      employeeRole: 'UI/UX Designer',
      employeeInitials: 'JD',
      type: 'Early Going',
      leaveType: 'Early Going',
      duration: '1 Hour',
      date: '04-Sep-2026 – 04-Sep-2026',
      fromDate: '04-Sep-2026',
      toDate: '04-Sep-2026',
      reason: 'Personal work / checkup',
      status: 'rejected',
      managerDecisionSubmitted: true,
      rejectedAt: Date.now(),
      isPermission: true
    }
  ],
  submittedDecisions: { 'leave-1001': true, 'perm-2002': true }
});
console.log('Label:', t5.label);
console.log('Card count:', t5.cardCount);
const hasCard1Leave = t5.html.includes('Casual Leave (2 Days)') && t5.html.includes('Approved');
const hasCard2Perm = t5.html.includes('Early Going (1 Hour)') && t5.html.includes('Rejected');

if (t5.label === 'Recent Requests (2)' && t5.cardCount === 2 && hasCard1Leave && hasCard2Perm) {
  console.log('✅ TEST 5 PASSED: Two separate cards rendered - one for Leave (Approved) and one for Permission (Rejected)!');
} else {
  console.error('❌ TEST 5 FAILED: Label is', t5.label, 'Card count is', t5.cardCount, 'Leave card?', hasCard1Leave, 'Perm card?', hasCard2Perm);
  process.exit(1);
}

// TEST 6: Manager approves BOTH Leave AND Permission
console.log('\n[TEST 6] Manager approves BOTH Leave AND Permission -> TWO SEPARATE CARDS, BOTH APPROVED');
const t6 = runSimulation({
  empLeaveRequests: [
    {
      id: 'leave-1001',
      employeeName: 'John Doe',
      employeeRole: 'UI/UX Designer',
      employeeInitials: 'JD',
      leaveType: 'Casual Leave',
      duration: '2 Days',
      fromDate: '10-Sep-2026',
      toDate: '11-Sep-2026',
      reason: "Family function",
      status: 'approved',
      managerDecisionSubmitted: true,
      approvedAt: Date.now() - 1000
    }
  ],
  permState: [
    {
      id: 'perm-2002',
      employeeName: 'John Doe',
      employeeRole: 'UI/UX Designer',
      employeeInitials: 'JD',
      type: 'Early Going',
      duration: '1 Hour',
      date: '04-Sep-2026 – 04-Sep-2026',
      fromDate: '04-Sep-2026',
      toDate: '04-Sep-2026',
      reason: 'Personal work / checkup',
      status: 'approved',
      managerDecisionSubmitted: true,
      approvedAt: Date.now(),
      isPermission: true
    }
  ],
  submittedDecisions: { 'leave-1001': true, 'perm-2002': true }
});
console.log('Label:', t6.label);
console.log('Card count:', t6.cardCount);
const approvedCount = (t6.html.match(/Approved/g) || []).length;
if (t6.label === 'Recent Requests (2)' && t6.cardCount === 2 && approvedCount >= 2) {
  console.log('✅ TEST 6 PASSED: Two separate cards rendered, both showing Approved!');
} else {
  console.error('❌ TEST 6 FAILED');
  process.exit(1);
}

console.log('\n=========================================');
console.log('ALL TESTS PASSED WITH 100% SUCCESS!');
console.log('=========================================');
