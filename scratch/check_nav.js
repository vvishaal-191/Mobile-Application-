const fs = require('fs');

const tpl = fs.readFileSync('scratch/new_leave_history_tpl.html', 'utf8');

console.log('Contains handleRequestsBackNav:', tpl.includes('handleRequestsBackNav'));
const fnIdx = tpl.indexOf('function handleRequestsBackNav');
if (fnIdx !== -1) {
  console.log('Definition of handleRequestsBackNav:', tpl.substring(fnIdx, fnIdx + 400));
} else {
  console.log('Searching for back button handler...');
  const match = tpl.match(/function\s+\w*back\w*\s*\([^)]*\)\s*\{[^}]*\}/gi);
  console.log('Matches:', match);
}

console.log('Contains requests-header-banner.png:', tpl.includes('requests-header-banner.png'));
console.log('Contains requests-header-art:', tpl.includes('requests-header-art'));
