const fs = require('fs');

console.log('--- Testing runtime behavior simulation ---');

// Extract syncManagerDashboard from index.html
const indexHtml = fs.readFileSync('index.html', 'utf8');
const match = indexHtml.match(/function syncManagerDashboard\(targetDoc\)\s*\{[\s\S]*?statPending\.textContent = String\(18 \+ totalPending\.length\);\s*\}\s*\}/);

if (!match) {
  console.error('Could not extract syncManagerDashboard from index.html');
  process.exit(1);
}

// Create a simulated DOM and store
const store = {
  EMP_LEAVE_REQUESTS: [],
  PERM_STATE: [],
  MGR_NOTIFICATION_COUNT: 0
};

const fakeDoc = {
  elements: {},
  getElementById(id) {
    if (!this.elements[id]) {
      this.elements[id] = { textContent: '0', style: {} };
    }
    return this.elements[id];
  }
};

global.document = fakeDoc;
global.window = {
  parent: store,
  document: fakeDoc,
  EMP_LEAVE_REQUESTS: store.EMP_LEAVE_REQUESTS,
  PERM_STATE: store.PERM_STATE
};

const syncFn = new Function('targetDoc', match[0] + '\n return syncManagerDashboard(targetDoc);');

// Test 1: Initially 0
syncFn(fakeDoc);
console.log('Initial perm badge:', fakeDoc.getElementById('manager-dash-perm-badge').textContent);
if (fakeDoc.getElementById('manager-dash-perm-badge').textContent !== '0') {
  console.error('FAIL: Expected initial perm badge to be 0');
  process.exit(1);
}

// Test 2: Employee submits 1 permission request
const permReq1 = {
  id: 'perm-1001',
  type: 'Early Going',
  leaveType: 'Early Going',
  permissionType: 'Early Going',
  date: '04-Sep-2026',
  duration: '2 Hours',
  reason: 'Doctor appointment',
  status: 'pending',
  isPermission: true,
  employeeName: 'Sneha Reddy'
};
store.PERM_STATE.unshift(permReq1);
store.EMP_LEAVE_REQUESTS.unshift(permReq1);

syncFn(fakeDoc);
console.log('Perm badge after 1 permission request:', fakeDoc.getElementById('manager-dash-perm-badge').textContent);
if (fakeDoc.getElementById('manager-dash-perm-badge').textContent !== '1') {
  console.error('FAIL: Expected perm badge to be 1 for 1 permission request');
  process.exit(1);
}

// Test 3: Employee submits 1 leave request
const leaveReq1 = {
  id: 'leave-2001',
  leaveType: 'Casual Leave',
  fromDate: '07-Sep-2026',
  toDate: '08-Sep-2026',
  daysText: '2.0 Days',
  reason: 'Family function',
  status: 'pending',
  isPermission: false,
  employeeName: 'Sneha Reddy'
};
store.EMP_LEAVE_REQUESTS.unshift(leaveReq1);

syncFn(fakeDoc);
console.log('Perm badge after 1 leave request added:', fakeDoc.getElementById('manager-dash-perm-badge').textContent);
console.log('Leave badge after 1 leave request added:', fakeDoc.getElementById('manager-dash-leave-badge').textContent);
if (fakeDoc.getElementById('manager-dash-perm-badge').textContent !== '1') {
  console.error('FAIL: Leave request should NOT increment perm badge! Expected 1, got ' + fakeDoc.getElementById('manager-dash-perm-badge').textContent);
  process.exit(1);
}
if (fakeDoc.getElementById('manager-dash-leave-badge').textContent !== '1') {
  console.error('FAIL: Expected leave badge to be 1');
  process.exit(1);
}

// Test 4: Duplicate permission submission attempt (same ID and details)
store.PERM_STATE.unshift({ ...permReq1 });
store.EMP_LEAVE_REQUESTS.unshift({ ...permReq1 });
syncFn(fakeDoc);
console.log('Perm badge after duplicate attempt:', fakeDoc.getElementById('manager-dash-perm-badge').textContent);
if (fakeDoc.getElementById('manager-dash-perm-badge').textContent !== '1') {
  console.error('FAIL: Duplicate should be deduplicated! Expected 1, got ' + fakeDoc.getElementById('manager-dash-perm-badge').textContent);
  process.exit(1);
}

console.log('SUCCESS: All runtime simulation checks passed!');
