const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Search for apply leave submission
let pos = 0;
while ((pos = content.indexOf('manager-dash-leave-badge', pos)) !== -1) {
  console.log('manager-dash-leave-badge at:', pos);
  console.log(content.substring(Math.max(0, pos - 100), Math.min(content.length, pos + 250)));
  pos += 24;
}

pos = 0;
while ((pos = content.indexOf('manager-dash-perm-badge', pos)) !== -1) {
  console.log('manager-dash-perm-badge at:', pos);
  console.log(content.substring(Math.max(0, pos - 100), Math.min(content.length, pos + 250)));
  pos += 23;
}
