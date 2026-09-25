const fs = require('fs');

console.log('=== VERIFYING MANAGER DASHBOARD & REQUEST DETAIL REDESIGN ===\n');

const filesToTest = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

let allPassed = true;

const requiredIds = [
  'lad-header-title',
  'lad-subtitle',
  'lad-avatar',
  'lad-name',
  'lad-role',
  'lad-empid',
  'lad-section-title',
  'lad-type-label',
  'lad-leavetype',
  'lad-from-label',
  'lad-fromdate',
  'lad-row-todate',
  'lad-to-label',
  'lad-todate',
  'lad-duration-label',
  'lad-totaldays',
  'lad-contact-label',
  'lad-contact',
  'lad-row-contact',
  'lad-reason-label',
  'lad-reason',
  'lad-applied-path',
  'lad-manager-path',
  'lad-remarks-input',
  'lad-char-counter',
  'lad-btn-row',
  'lad-btn-approve',
  'lad-btn-reject'
];

filesToTest.forEach(file => {
  console.log(`Checking file: ${file}`);
  const html = fs.readFileSync(file, 'utf8');

  // 1. Check Manager Dashboard 4th Card
  const hasRequestDetailText = html.includes('Request<br>Detail');
  const hasLeaveApprovalDetailClick = html.includes("handleCardNav('tpl-LeaveApprovalDetail', 'priya')");
  const hasTeamMembersLeft = html.includes('Team<br>Members');

  console.log(`  - Has 'Request<br>Detail' text:`, hasRequestDetailText ? 'PASS' : 'FAIL');
  console.log(`  - Has 'handleCardNav(tpl-LeaveApprovalDetail, priya)':`, hasLeaveApprovalDetailClick ? 'PASS' : 'FAIL');
  console.log(`  - No old 'Team<br>Members':`, !hasTeamMembersLeft ? 'PASS' : 'FAIL (Old text found!)');

  if (!hasRequestDetailText || !hasLeaveApprovalDetailClick || hasTeamMembersLeft) {
    allPassed = false;
  }

  // 2. Check tpl-LeaveApprovalDetail in template
  const tplStart = html.indexOf('<template id="tpl-LeaveApprovalDetail">');
  if (tplStart === -1) {
    console.log(`  - tpl-LeaveApprovalDetail exists: FAIL (Not found)`);
    allPassed = false;
    return;
  }
  const tplEnd = html.indexOf('</template>', tplStart);
  const tplContent = html.substring(tplStart, tplEnd);
  console.log(`  - tpl-LeaveApprovalDetail exists: PASS (length: ${tplContent.length})`);

  let missingIds = [];
  requiredIds.forEach(id => {
    if (!tplContent.includes(`id="${id}"`)) {
      missingIds.push(id);
    }
  });

  if (missingIds.length > 0) {
    console.log(`  - All required IDs present in tpl-LeaveApprovalDetail: FAIL (Missing: ${missingIds.join(', ')})`);
    allPassed = false;
  } else {
    console.log(`  - All required IDs present in tpl-LeaveApprovalDetail: PASS (${requiredIds.length}/${requiredIds.length})`);
  }

  // Check Back Button
  const hasBackBtn = tplContent.includes('back-btn-circle');
  console.log(`  - Back button present with .back-btn-circle:`, hasBackBtn ? 'PASS' : 'FAIL');
  if (!hasBackBtn) allPassed = false;

  // Check RBAC permissions for Manager
  const mgrAllowedMatch = html.match(/MANAGER_ALLOWED_SCREENS\s*=\s*\[([\s\S]*?)\]/);
  if (mgrAllowedMatch) {
    const list = mgrAllowedMatch[1];
    const hasLad = list.includes("'tpl-LeaveApprovalDetail'");
    const hasDash = list.includes("'tpl-ManagerDashboard'");
    console.log(`  - MANAGER_ALLOWED_SCREENS includes tpl-LeaveApprovalDetail:`, hasLad ? 'PASS' : 'FAIL');
    console.log(`  - MANAGER_ALLOWED_SCREENS includes tpl-ManagerDashboard:`, hasDash ? 'PASS' : 'FAIL');
    if (!hasLad || !hasDash) allPassed = false;
  }

  console.log('');
});

// Check standalone preview.html
const ladPreviewFile = 'EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/preview.html';
if (fs.existsSync(ladPreviewFile)) {
  const ladHtml = fs.readFileSync(ladPreviewFile, 'utf8');
  console.log(`Checking standalone: ${ladPreviewFile}`);
  console.log(`  - Has 'Request Detail':`, ladHtml.includes('Request Detail') ? 'PASS' : 'FAIL');
  console.log(`  - Has 'Priya Sharma':`, ladHtml.includes('Priya Sharma') ? 'PASS' : 'FAIL');
  console.log(`  - Has 'Casual Leave':`, ladHtml.includes('Casual Leave') ? 'PASS' : 'FAIL');
  console.log(`  - Has 'Approval Path':`, ladHtml.includes('Approval Path') ? 'PASS' : 'FAIL');
  console.log(`  - Has 'Manager Remarks':`, ladHtml.includes('Manager Remarks') ? 'PASS' : 'FAIL');
}

// Check ManagerDashboard standalone preview.html
const mgrPreviewFile = 'EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html';
if (fs.existsSync(mgrPreviewFile)) {
  const mgrHtml = fs.readFileSync(mgrPreviewFile, 'utf8');
  console.log(`Checking standalone: ${mgrPreviewFile}`);
  console.log(`  - Has 'Request<br>Detail':`, mgrHtml.includes('Request<br>Detail') ? 'PASS' : 'FAIL');
  console.log(`  - Has click to LeaveApprovalDetail:`, mgrHtml.includes("handleCardNav('tpl-LeaveApprovalDetail', 'priya')") ? 'PASS' : 'FAIL');
}

console.log('\nOVERALL RESULT:', allPassed ? 'ALL TESTS PASSED SUCCESSFULLY!' : 'SOME TESTS FAILED!');
