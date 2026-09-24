const fs = require('fs');
const content = fs.readFileSync('EmergereApp/EmergereApp/preview_app.html', 'utf8');
const regex = /<template\s+id=["']tpl-ApplyPermission["']>([\s\S]*?)<\/template>/i;
const match = content.match(regex);
if (match) {
  console.log('Found tpl-ApplyPermission, length:', match[0].length);
  fs.writeFileSync('scratch/perm_tpl.html', match[0]);
} else {
  console.log('Not matched for ApplyPermission');
}

const leaveRegex = /<template\s+id=["']tpl-ApplyLeave["']>([\s\S]*?)<\/template>/i;
const leaveMatch = content.match(leaveRegex);
if (leaveMatch) {
  console.log('Found tpl-ApplyLeave, length:', leaveMatch[0].length);
  fs.writeFileSync('scratch/leave_tpl.html', leaveMatch[0]);
} else {
  console.log('Not matched for ApplyLeave');
}
