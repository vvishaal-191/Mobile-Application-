const fs = require('fs');

console.log('Testing Manager Dashboard stat-members and LeaveApprovalDetail in index.html');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// Check manager allowed screens
const mgrAllowedMatch = indexHtml.match(/MANAGER_ALLOWED_SCREENS\s*=\s*\[([\s\S]*?)\]/);
if (mgrAllowedMatch) {
  const allowed = mgrAllowedMatch[1];
  console.log('Manager has tpl-LeaveApprovalDetail:', allowed.includes('tpl-LeaveApprovalDetail'));
  console.log('Manager has tpl-ManagerDashboard:', allowed.includes('tpl-ManagerDashboard'));
} else {
  console.log('MANAGER_ALLOWED_SCREENS not found');
}

// Check stat-members in Manager Dashboard
const statMembersMatch = indexHtml.indexOf('stat-members');
console.log('stat-members pos in index.html:', statMembersMatch);

// Check current tpl-LeaveApprovalDetail
const ladTplPos = indexHtml.indexOf('id="tpl-LeaveApprovalDetail"');
console.log('tpl-LeaveApprovalDetail pos in index.html:', ladTplPos);
