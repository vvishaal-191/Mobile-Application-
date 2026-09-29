const cp = require('child_process');

const diff = cp.execSync('git diff 691e417 8361d26 -- index.html', { maxBuffer: 50 * 1024 * 1024 }).toString();
const lines = diff.split('\n');
console.log('Total diff lines:', lines.length);
// Find where deletions occurred
lines.forEach((l, i) => {
  if (l.startsWith('---') || l.startsWith('+++') || l.startsWith('@@')) {
    console.log(l);
  }
  if (l.includes('tpl-EmployeeDashboard')) {
    console.log('Diff line', i, ':', l);
  }
});
