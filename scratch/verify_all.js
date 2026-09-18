const fs = require('fs');
const vm = require('vm');

let allPassed = true;
function assert(desc, condition) {
  if (condition) {
    console.log('✓ PASS:', desc);
  } else {
    console.error('✗ FAIL:', desc);
    allPassed = false;
  }
}

const filesToCheck = [
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html',
  'EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/preview.html',
  'EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html'
];

console.log('--- 1. Testing Script Syntax in All Files ---');
filesToCheck.forEach(file => {
  if (!fs.existsSync(file)) {
    assert(file + ' exists', false);
    return;
  }
  const content = fs.readFileSync(file, 'utf8');
  const scripts = content.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi) || [];
  let fileOk = true;
  scripts.forEach((tag, idx) => {
    const code = tag.replace(/<script[\s\S]*?>/i, '').replace(/<\/script>/i, '');
    if (!code.trim()) return;
    try {
      new vm.Script(code);
    } catch (e) {
      console.error(`Syntax error in ${file} script #${idx + 1}:`, e.message);
      fileOk = false;
      allPassed = false;
    }
  });
  assert(`${file} scripts compile cleanly (${scripts.length} scripts)`, fileOk);
});

console.log('\n--- 2. Checking HTML Prototypes for Core Requirements ---');
const mainFiles = [
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'preview_app.html',
  'index.html'
];

mainFiles.forEach(file => {
  const c = fs.readFileSync(file, 'utf8');
  
  // Permission Approvals check
  assert(`${file}: processPermAction saves permission and navigates`, 
    c.includes("store.SELECTED_PERSON = permKey;") && 
    c.includes("store.loadScreen('tpl-LeaveApprovalDetail', permKey);")
  );
  assert(`${file}: processPermAction called on button click with stopPropagation`,
    c.includes("event.stopPropagation();processPermAction('1', 'rejected')") &&
    c.includes("event.stopPropagation();processPermAction('1', 'approved')")
  );
  assert(`${file}: PERSON_DATA pre-populated with perm-1 and perm-2`,
    c.includes("'perm-1': {") && c.includes("'perm-2': {")
  );

  // Request Detail Done button check
  assert(`${file}: Done button navigates to tpl-ManagerDashboard`,
    c.includes("Done →</button>") &&
    c.includes("loadScreen('tpl-ManagerDashboard')")
  );
  assert(`${file}: handleDetailLeaveDecision shows status banner and Done button`,
    c.includes("✓ Approved by Manager") &&
    c.includes("✕ Rejected by Manager")
  );

  // Manager Dashboard immediate status update check
  assert(`${file}: tpl-ManagerDashboard template updated directly on decision`,
    c.includes("mgrTpl.innerHTML = tplHtml;") &&
    c.includes("dash-priya-status-badge")
  );
  assert(`${file}: Manager Dashboard frame listener updates badge for Priya`,
    c.includes("priyaBadge.className = isApp ? 'badge success' : 'badge danger';") &&
    c.includes("priyaBadge.textContent = isApp ? 'Approved' : 'Rejected';")
  );
  assert(`${file}: Manager Dashboard frame listener updates/creates card for Permission decision`,
    c.includes("permDec.status.toLowerCase() !== 'pending'") &&
    c.includes("pbClass = pIsApp ? 'badge success' : 'badge danger'")
  );

  // No applicant overwrite check
  assert(`${file}: applicant name not overwritten with Rahul Sharma during manager review`,
    c.includes("window.AUTH_USER && window.AUTH_USER.role === 'employee' && (p.isSelf || !p.name)")
  );
});

console.log('\n--- 3. Checking Screen Previews ---');
const permPrev = fs.readFileSync('EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html', 'utf8');
assert('PermissionApprovals/preview.html has navigation to Request Detail in processPermAction',
  permPrev.includes("loadScreen('tpl-LeaveApprovalDetail', permKey)") &&
  permPrev.includes("LeaveApprovalDetail/preview.html?permId=")
);
assert('PermissionApprovals/preview.html has card click to Request Detail',
  permPrev.includes("card.addEventListener('click'") &&
  permPrev.includes("tpl-LeaveApprovalDetail")
);

const leaveDetailPrev = fs.readFileSync('EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/preview.html', 'utf8');
assert('LeaveApprovalDetail/preview.html has Done button logic navigating to ManagerDashboard',
  leaveDetailPrev.includes("handleDetailDone") &&
  leaveDetailPrev.includes("ManagerDashboard")
);
assert('LeaveApprovalDetail/preview.html supports Permission specifics and decision banner',
  leaveDetailPrev.includes("PERMISSION SPECIFICS") &&
  leaveDetailPrev.includes("✓ Approved by Manager") &&
  leaveDetailPrev.includes("✕ Rejected by Manager")
);

const mgrDashPrev = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html', 'utf8');
assert('ManagerDashboard/preview.html reflects approved/rejected status',
  mgrDashPrev.includes("dash-priya-status-badge") &&
  mgrDashPrev.includes("priyaStatus")
);

console.log('\n--- 4. Checking React Native Screen ---');
const rnDetail = fs.readFileSync('EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/LeaveApprovalDetailScreen.jsx', 'utf8');
assert('LeaveApprovalDetailScreen.jsx guards employee name override with isDashboardUser check',
  rnDetail.includes("isDashboardUser ? dashboardEmpName : rawPerson.name")
);
assert('LeaveApprovalDetailScreen.jsx has handleDone navigating to ManagerDashboard with finalDecision',
  rnDetail.includes("navigation.navigate('ManagerDashboard'") &&
  rnDetail.includes("newStatus: finalDecision")
);

const rnPerm = fs.readFileSync('EmergereApp/EmergereApp/src/screens/PermissionApprovals/PermissionApprovalsScreen.jsx', 'utf8');
assert('PermissionApprovalsScreen.jsx navigates to LeaveApprovalDetail on Approve/Reject',
  rnPerm.includes("go('LeaveApprovalDetail', { person: updatedItem, decision: 'Approved' })") &&
  rnPerm.includes("go('LeaveApprovalDetail', { person: updatedItem, decision: 'Rejected' })")
);

if (allPassed) {
  console.log('\n========================================');
  console.log('ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
  console.log('========================================');
} else {
  console.error('\nSOME VERIFICATION CHECKS FAILED!');
  process.exit(1);
}
