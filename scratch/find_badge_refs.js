const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

lines.forEach((l, i) => {
  if (l.includes('manager-dash-perm-badge') || l.includes('manager-dash-leave-badge') || l.includes('MGR_NOTIFICATION_COUNT')) {
    console.log((i+1) + ': ' + l.trim());
  }
});
