const fs = require('fs');

console.log('=== VERIFYING ALL 6 USER REQUIREMENTS ===\n');

const appFiles = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

appFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  console.log(`Checking ${f}:`);

  // Req 1: Recent requests filtering
  const hasProcessedReq = c.includes('const processedRequests = allRequests.filter');
  const hasFilteredLabel = c.includes("'Recent Requests (' + processedRequests.length + ')'");
  const hasFilteredRender = c.includes('processedRequests.forEach(function(req) {');
  console.log(`  1. Recent requests filtered for approved/rejected: ${hasProcessedReq && hasFilteredLabel && hasFilteredRender}`);

  // Req 2 & 3: Approved / Rejected navigation
  const hasStatApproved = c.includes('openLeaveApprovalsTab(\'approved\')');
  const hasStatRejected = c.includes('openLeaveApprovalsTab(\'rejected\')');
  const hasOpenFn = c.includes('function openLeaveApprovalsTab(tabName)');
  const hasInitTab = c.includes('function initLeaveApprovalsTab()');
  console.log(`  2. Approved button navigates with 'approved' tab: ${hasStatApproved && hasOpenFn}`);
  console.log(`  3. Rejected button navigates with 'rejected' tab: ${hasStatRejected && hasOpenFn}`);
  console.log(`     Leave Approvals init handler present: ${hasInitTab}`);

  // Req 4: Quick actions
  const hasLeaveQa = c.includes('qa-leave" onclick="handleCardNav(\'tpl-LeaveApprovals\')');
  const hasPermQa = c.includes('qa-perm" onclick="handleCardNav(\'tpl-PermissionApprovals\')');
  console.log(`  4. Quick Actions Leave & Perm buttons: ${hasLeaveQa && hasPermQa}`);

  // Req 5: Bottom nav Home icon unhighlighted on subpages
  // In Leave Approvals:
  const laTpl = c.substring(c.indexOf('id="tpl-LeaveApprovals"'), c.indexOf('</template>', c.indexOf('id="tpl-LeaveApprovals"')));
  const laHomeActive = laTpl.includes('id="tab-dashboard" class="tab nav-tab active"') || laTpl.includes('class="tab nav-tab active" id="tab-dashboard"');
  // In Permission Approvals:
  const paTpl = c.substring(c.indexOf('id="tpl-PermissionApprovals"'), c.indexOf('</template>', c.indexOf('id="tpl-PermissionApprovals"')));
  const paHomeActive = paTpl.includes('id="tab-dashboard" class="tab nav-tab active"') || paTpl.includes('class="tab nav-tab active" id="tab-dashboard"');
  // In Leave Approval Detail:
  const ladTpl = c.substring(c.indexOf('id="tpl-LeaveApprovalDetail"'), c.indexOf('</template>', c.indexOf('id="tpl-LeaveApprovalDetail"')));
  const ladHomeActive = ladTpl.includes('class="nav-tab active" id="tab-dashboard"');
  // In Manager Dashboard:
  const mgrTpl = c.substring(c.indexOf('id="tpl-ManagerDashboard"'), c.indexOf('</template>', c.indexOf('id="tpl-ManagerDashboard"')));
  const mgrHomeActive = mgrTpl.includes('class="nav-tab active" id="tab-dashboard"');

  console.log(`  5. Bottom nav Home icon states:`);
  console.log(`     Leave Approvals Home NOT active: ${!laHomeActive}`);
  console.log(`     Permission Approvals Home NOT active: ${!paHomeActive}`);
  console.log(`     Request Detail Home NOT active: ${!ladHomeActive}`);
  console.log(`     Manager Dashboard Home IS active: ${mgrHomeActive}`);

  // Req 6: Text selection on banners
  const laHasText = laTpl.includes('class="header-banner-title"') && laTpl.includes('Leave Approvals') && laTpl.includes('Manage Team Requests');
  const paHasText = paTpl.includes('class="header-banner-title"') && paTpl.includes('Permission Approvals') && paTpl.includes('Short-duration Passes');
  const hasUserSelectCss = laTpl.includes('user-select: text !important') && paTpl.includes('user-select: text !important');
  console.log(`  6. Header text selectable & copyable:`);
  console.log(`     Leave Approvals text overlay: ${laHasText}`);
  console.log(`     Permission Approvals text overlay: ${paHasText}`);
  console.log(`     user-select: text !important enabled: ${hasUserSelectCss}`);
});

console.log('\n=== STANDALONE FILES CHECK ===');
const standLa = fs.readFileSync('EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html', 'utf8');
const standPa = fs.readFileSync('EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html', 'utf8');
const standLad = fs.readFileSync('EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/preview.html', 'utf8');
const standMgr = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html', 'utf8');

console.log('LeaveApprovals preview.html Home NOT active:', !standLa.includes('class="tab nav-tab active" id="tab-dashboard"'));
console.log('PermissionApprovals preview.html Home NOT active:', !standPa.includes('class="tab nav-tab active" id="tab-dashboard"'));
console.log('LeaveApprovalDetail preview.html Home NOT active:', !standLad.includes('class="nav-tab active" id="tab-dashboard"'));
console.log('ManagerDashboard preview.html Home IS active:', standMgr.includes('class="nav-tab active" id="tab-dashboard"'));
console.log('ManagerDashboard preview.html has Recent Requests filter:', standMgr.includes('const processedRequests = allRequests.filter'));
console.log('ManagerDashboard preview.html has Approved click handler:', standMgr.includes('openLeaveApprovalsTab(\'approved\')'));
console.log('ManagerDashboard preview.html has Rejected click handler:', standMgr.includes('openLeaveApprovalsTab(\'rejected\')'));
console.log('LeaveApprovals preview.html has selectable text:', standLa.includes('header-banner-title') && standLa.includes('Leave Approvals'));
console.log('PermissionApprovals preview.html has selectable text:', standPa.includes('header-banner-title') && standPa.includes('Permission Approvals'));

console.log('\n=== VERIFICATION COMPLETE ===');
