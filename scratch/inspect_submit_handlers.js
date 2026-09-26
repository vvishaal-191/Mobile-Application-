const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

console.log('--- handleApplyPermissionSubmit ---');
let startPerm = 0;
lines.forEach((l, i) => {
  if (l.includes('function handleApplyPermissionSubmit')) startPerm = i;
});
if (startPerm > 0) {
  lines.slice(startPerm, startPerm + 80).forEach((l, i) => console.log((startPerm + 1 + i) + ': ' + l));
}

console.log('--- handleApplyLeaveSubmit ---');
let startLeave = 0;
lines.forEach((l, i) => {
  if (l.includes('function handleApplyLeaveSubmit')) startLeave = i;
});
if (startLeave > 0) {
  lines.slice(startLeave, startLeave + 80).forEach((l, i) => console.log((startLeave + 1 + i) + ': ' + l));
}
