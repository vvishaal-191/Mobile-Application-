const fs = require('fs');

const files = [
  'EmergereApp/EmergereApp/src/screens/LeaveApprovals/LeaveApprovalsScreen.jsx',
  'EmergereApp/EmergereApp/src/screens/PermissionApprovals/PermissionApprovalsScreen.jsx',
  'EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/LeaveApprovalDetailScreen.jsx',
  'EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html',
  'EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html',
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

let allPassed = true;

// Check React Native files: should NOT have active="Dashboard"
const rnFiles = [
  'EmergereApp/EmergereApp/src/screens/LeaveApprovals/LeaveApprovalsScreen.jsx',
  'EmergereApp/EmergereApp/src/screens/PermissionApprovals/PermissionApprovalsScreen.jsx',
  'EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/LeaveApprovalDetailScreen.jsx'
];
for (const f of rnFiles) {
  const c = fs.readFileSync(f, 'utf8');
  if (c.includes('active="Dashboard"')) {
    console.error(`FAIL: ${f} still has active="Dashboard"`);
    allPassed = false;
  } else {
    console.log(`PASS: ${f} correctly does not highlight Dashboard`);
  }
}

// Check HTML files for tpl-LeaveApprovals and tpl-PermissionApprovals
const htmlBundles = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];
for (const f of htmlBundles) {
  const c = fs.readFileSync(f, 'utf8');
  
  // check tpl-ManagerDashboard has active tab-dashboard
  const mdStart = c.indexOf('<template id="tpl-ManagerDashboard">');
  const mdEnd = c.indexOf('</template>', mdStart);
  const mdContent = c.substring(mdStart, mdEnd);
  if (!mdContent.includes('id="tab-dashboard"') || !mdContent.includes('active')) {
    console.error(`FAIL: ${f} tpl-ManagerDashboard is missing active dashboard tab`);
    allPassed = false;
  } else {
    console.log(`PASS: ${f} tpl-ManagerDashboard has active dashboard tab`);
  }

  // check tpl-LeaveApprovals does NOT have active tab-dashboard
  const laStart = c.indexOf('<template id="tpl-LeaveApprovals">');
  const laEnd = c.indexOf('</template>', laStart);
  const laContent = c.substring(laStart, laEnd);
  if (laContent.includes('id="tab-dashboard"') && laContent.includes('tab nav-tab active')) {
    console.error(`FAIL: ${f} tpl-LeaveApprovals still has active dashboard tab`);
    allPassed = false;
  } else {
    console.log(`PASS: ${f} tpl-LeaveApprovals dashboard tab is NOT active`);
  }

  // check tpl-PermissionApprovals does NOT have active tab-dashboard
  const paStart = c.indexOf('<template id="tpl-PermissionApprovals">');
  const paEnd = c.indexOf('</template>', paStart);
  const paContent = c.substring(paStart, paEnd);
  if (paContent.includes('id="tab-dashboard"') && paContent.includes('tab nav-tab active')) {
    console.error(`FAIL: ${f} tpl-PermissionApprovals still has active dashboard tab`);
    allPassed = false;
  } else {
    console.log(`PASS: ${f} tpl-PermissionApprovals dashboard tab is NOT active`);
  }
}

// Check standalone previews
const standalones = [
  'EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html',
  'EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html'
];
for (const f of standalones) {
  const c = fs.readFileSync(f, 'utf8');
  if (c.includes('tab nav-tab active') && c.includes('id="tab-dashboard"')) {
    console.error(`FAIL: ${f} still has active dashboard tab`);
    allPassed = false;
  } else {
    console.log(`PASS: ${f} dashboard tab is NOT active`);
  }
}

if (allPassed) {
  console.log('\n>>> ALL CHECKS PASSED PERFECTLY! <<<');
}
