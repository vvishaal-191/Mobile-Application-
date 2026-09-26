const fs = require('fs');
const { applyHtmlFixes } = require('./apply_html_fixes_mod');

const original = fs.readFileSync('index.html', 'utf8');
const transformed = applyHtmlFixes(original);

console.log('Original length:', original.length);
console.log('Transformed length:', transformed.length);
console.log('Diff size:', transformed.length - original.length);

// Verify specific checks:
const checks = [
  { name: 'ApplyPermission 140px', test: transformed.includes('padding-bottom: 140px;') },
  { name: 'ApplyPermission margin 40px', test: transformed.includes('margin: -24px 14px 40px 14px;') },
  { name: 'ApplyPermission submit btn margin-top 20px', test: transformed.includes('margin-top: 20px;\n          margin-bottom: 12px;') },
  { name: 'Team Calendar replaced in Quick Actions', test: transformed.includes('<div class="qa-title">Holiday Calendar</div>') },
  { name: 'Team Calendar replaced in Sidebar', test: transformed.includes('<span class="sidebar-item-label">Holiday Calendar</span>') },
  { name: 'Manager Tab 4 label Holiday Calendar', test: transformed.includes('<span style="white-space:nowrap;font-size:10px;">Holiday Calendar</span>') },
  { name: 'HolidayCalendar Tab 4 active class', test: transformed.includes('<div class="tab nav-tab active" id="tab-history"') },
  { name: 'MANAGER_ALLOWED_SCREENS has Notifications', test: transformed.includes("'tpl-Notifications',\n          'tpl-EmployeeDashboard',") },
  { name: 'No manager restriction alert on history click', test: !transformed.includes("alert('Access Restricted: Manager account is not authorized to access My Requests (History).');") },
  { name: 'Leave submit no longer increments perm badge', test: transformed.includes('// Perm badge updated strictly on permission requests') },
  { name: 'syncManagerDashboard accurate perm count', test: transformed.includes('const notifCount = pendingPerms.length;') },
  { name: 'Manager back button and home tab role aware', test: transformed.includes("window.parent.AUTH_USER.role==='manager')?'tpl-ManagerDashboard':'tpl-EmployeeDashboard'") }
];

checks.forEach(c => {
  console.log((c.test ? 'PASS: ' : 'FAIL: ') + c.name);
});
