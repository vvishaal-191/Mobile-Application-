const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, idx) => {
  if (l.includes('id="tab-profile"') || l.includes('tab-profile')) {
    console.log(`Line ${idx + 1}: ${l.trim()}`);
    console.log(lines.slice(idx, idx + 8).join('\n'));
    console.log('------------------------');
  }
});
