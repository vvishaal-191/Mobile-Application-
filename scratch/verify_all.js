const fs = require('fs');
const http = require('http');

console.log('=== VERIFYING EXACT DESIGN IMPLEMENTATION ===\n');

const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html',
  'EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html'
];

let allPassed = true;

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.error(`[FAIL] File missing: ${f}`);
    allPassed = false;
    return;
  }
  const c = fs.readFileSync(f, 'utf8');
  console.log(`Checking ${f} (size: ${c.length} bytes)...`);

  const checks = [];
  if (f.endsWith('LeaveApprovals/preview.html')) {
    checks.push({ name: 'Header Banner', ok: c.includes('alt="Leave Approvals"') });
    checks.push({ name: 'Empty Card Title', ok: c.includes('No leave requests found') });
    checks.push({ name: 'Pending Tab', ok: c.includes('Pending (<span id="count-pending">') });
    checks.push({ name: 'Bottom Nav active dashboard', ok: c.includes('dashboard-pill-wrap') });
    checks.push({ name: 'Bottom Wave Decor', ok: c.includes('page-bottom-wave-decor') });
  } else if (f.endsWith('PermissionApprovals/preview.html')) {
    checks.push({ name: 'Header Banner', ok: c.includes('alt="Permission Approvals"') });
    checks.push({ name: 'Empty Card Title', ok: c.includes('No permission requests found') });
    checks.push({ name: 'Pending Tab', ok: c.includes('Pending (<span id="perm-count-pending">') });
    checks.push({ name: 'Bottom Nav active dashboard', ok: c.includes('dashboard-pill-wrap') });
    checks.push({ name: 'Bottom Wave Decor', ok: c.includes('page-bottom-wave-decor') });
  } else {
    checks.push({ name: 'tpl-LeaveApprovals exists', ok: c.includes('<template id="tpl-LeaveApprovals">') });
    checks.push({ name: 'tpl-PermissionApprovals exists', ok: c.includes('<template id="tpl-PermissionApprovals">') });
    checks.push({ name: 'LA Empty Card Title', ok: c.includes('No leave requests found') });
    checks.push({ name: 'PA Empty Card Title', ok: c.includes('No permission requests found') });
    checks.push({ name: 'Dashboard Pill Wrap', ok: c.includes('dashboard-pill-wrap') });
    checks.push({ name: 'Bottom Wave Decor', ok: c.includes('page-bottom-wave-decor') });
  }

  checks.forEach(chk => {
    if (chk.ok) {
      console.log(`  [PASS] ${chk.name}`);
    } else {
      console.error(`  [FAIL] ${chk.name}`);
      allPassed = false;
    }
  });
});

console.log('\n=== TESTING DEV SERVER HTTP 200 ===');
const req = http.get('http://localhost:3000/preview_app.html', (res) => {
  console.log(`HTTP Status: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Received ${data.length} bytes from http://localhost:3000/preview_app.html`);
    const hasLA = data.includes('No leave requests found');
    const hasPA = data.includes('No permission requests found');
    console.log(`Server serves updated Leave Approvals: ${hasLA}`);
    console.log(`Server serves updated Permission Approvals: ${hasPA}`);
    if (allPassed && res.statusCode === 200 && hasLA && hasPA) {
      console.log('\n*** ALL VERIFICATION CHECKS PASSED PERFECTLY! ***');
    } else {
      console.error('\n*** SOME VERIFICATION CHECKS FAILED! ***');
    }
  });
});

req.on('error', (e) => {
  console.error(`Server request error: ${e.message}`);
});
