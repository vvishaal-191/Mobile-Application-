const fs = require('fs');

const files = [
  'EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html',
  'EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html',
  'EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/preview.html',
  'EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const c = fs.readFileSync(f, 'utf8');
  const bNav = c.indexOf('class="bottom-nav');
  console.log(`=== ${f} ===`);
  if (bNav !== -1) {
    console.log(c.substring(bNav, bNav + 600));
  } else {
    console.log('No bottom-nav found');
  }
});
