const fs = require('fs');
const path = require('path');

const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

let allPassed = true;

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  const content = fs.readFileSync(filePath, 'utf8');

  // Check 1: EMPLOYEE_ALLOWED_SCREENS includes tpl-MyRequests
  const allowedIdx = content.indexOf('EMPLOYEE_ALLOWED_SCREENS =');
  const allowedBlock = content.substring(allowedIdx, allowedIdx + 450);
  if (!allowedBlock.includes('tpl-MyRequests')) {
    console.error(`[FAIL] ${file} EMPLOYEE_ALLOWED_SCREENS missing tpl-MyRequests`);
    allPassed = false;
  } else {
    console.log(`[PASS] ${file} EMPLOYEE_ALLOWED_SCREENS contains tpl-MyRequests`);
  }

  if (!allowedBlock.includes('tpl-LeaveHistory')) {
    console.error(`[FAIL] ${file} EMPLOYEE_ALLOWED_SCREENS missing tpl-LeaveHistory`);
    allPassed = false;
  } else {
    console.log(`[PASS] ${file} EMPLOYEE_ALLOWED_SCREENS contains tpl-LeaveHistory`);
  }

  // Check 2: loadScreen has alias normalization
  const loadScreenIdx = content.indexOf('function loadScreen(tplId');
  const loadScreenBlock = content.substring(loadScreenIdx, loadScreenIdx + 400);
  if (!loadScreenBlock.includes("if (tplId === 'tpl-MyRequests')")) {
    console.error(`[FAIL] ${file} loadScreen missing tpl-MyRequests normalization`);
    allPassed = false;
  } else {
    console.log(`[PASS] ${file} loadScreen normalizes tpl-MyRequests`);
  }

  // Check 3: Simulated authorization check for employee accessing tpl-MyRequests
  // In the real code:
  // if (tplId === 'tpl-MyRequests') tplId = 'tpl-LeaveHistory';
  // check: EMPLOYEE_ALLOWED_SCREENS.indexOf(tplId) !== -1
  const tplId = 'tpl-MyRequests';
  const normalized = tplId === 'tpl-MyRequests' ? 'tpl-LeaveHistory' : tplId;
  const isAllowed = allowedBlock.includes(normalized) || allowedBlock.includes(tplId);
  if (!isAllowed) {
    console.error(`[FAIL] Simulated employee authorization failed for ${file}`);
    allPassed = false;
  } else {
    console.log(`[PASS] Simulated employee authorization succeeded for ${file}`);
  }
});

console.log(allPassed ? '\n=== ALL MY REQUESTS CHECKS PASSED! ===' : '\n=== SOME CHECKS FAILED! ===');
