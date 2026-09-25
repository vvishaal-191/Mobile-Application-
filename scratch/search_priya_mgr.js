const fs = require('fs');

const content = fs.readFileSync('scratch/tpl_manager_dashboard_extracted.html', 'utf8');

// Find all occurrences of priya or employee
const matches = [];
let pos = 0;
while ((pos = content.indexOf('priya', pos)) !== -1) {
  matches.push({ term: 'priya', pos: pos, snippet: content.substring(pos - 40, pos + 100) });
  pos += 5;
}
console.log('Matches in extracted mgr:', matches);
