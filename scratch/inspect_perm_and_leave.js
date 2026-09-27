const fs = require('fs');

const pApp = fs.readFileSync('preview_app.html', 'utf8');

// Find PERM_STATE occurrences
const permMatches = [];
let idx = 0;
while ((idx = pApp.indexOf('PERM_STATE', idx)) !== -1) {
  const lineStart = pApp.lastIndexOf('\n', idx);
  const lineEnd = pApp.indexOf('\n', idx);
  permMatches.push(pApp.substring(lineStart + 1, lineEnd).trim());
  idx += 10;
}
console.log('--- PERM_STATE lines ---');
console.log(permMatches.slice(0, 15));

// Find EMP_LEAVE_REQUESTS occurrences
const leaveMatches = [];
idx = 0;
while ((idx = pApp.indexOf('EMP_LEAVE_REQUESTS', idx)) !== -1) {
  const lineStart = pApp.lastIndexOf('\n', idx);
  const lineEnd = pApp.indexOf('\n', idx);
  leaveMatches.push(pApp.substring(lineStart + 1, lineEnd).trim());
  idx += 18;
}
console.log('\n--- EMP_LEAVE_REQUESTS lines ---');
console.log(leaveMatches.slice(0, 15));
