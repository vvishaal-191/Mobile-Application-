const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

const checks = [
  { name: 'openNotificationsFromManager', str: 'function openNotificationsFromManager() {\n      handleCardNav(\'tpl-Notifications\');\n    }' },
  { name: 'getActiveLeaveInfo global hook', str: 'window.getActiveLeaveInfo = getActiveLeaveInfo;' },
  { name: 'loadScreen hook', str: "if (currentTpl === 'tpl-LeaveApprovalDetail') {" },
  { name: 'handleApplyPermissionSubmit newId', str: "var newId = 'perm-' + Date.now();" },
  { name: 'leave submit badge logic', str: "var liveMgrBadge = parentDoc.getElementById('manager-dash-leave-badge') || document.getElementById('manager-dash-leave-badge');" },
  { name: 'updateLiveProfileStatusUI oldStatusLogic', str: "empStatusEl.className = 'badge danger';" },
  { name: 'profile-status-pill CSS', str: '.profile-status-pill {' }
];

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log(f, 'DOES NOT EXIST');
    return;
  }
  const content = fs.readFileSync(f, 'utf8');
  console.log('--- Checking', f);
  checks.forEach(c => {
    console.log(' ', c.name, ':', content.includes(c.str));
  });
});
