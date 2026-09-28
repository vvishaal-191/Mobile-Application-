const fs = require('fs');

function inspectStandalone(file) {
  if (!fs.existsSync(file)) return console.log(file, 'does not exist');
  const c = fs.readFileSync(file, 'utf8');
  console.log('=== ' + file + ' === (' + c.length + ' bytes)');
  const scripts = c.match(/<script[\s\S]*?<\/script>/g) || [];
  scripts.forEach((s, i) => {
    console.log('--- Script ' + i + ' ---');
    console.log(s.substring(0, 500));
    console.log('...\n' + s.substring(Math.max(0, s.length - 300)));
  });
}

inspectStandalone('EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html');
inspectStandalone('EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html');
inspectStandalone('EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html');
