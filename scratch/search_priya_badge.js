const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

let pos = 0;
while ((pos = content.indexOf('dash-priya-status-badge', pos)) !== -1) {
  console.log('dash-priya-status-badge at pos:', pos);
  console.log(content.substring(pos - 60, pos + 150));
  pos += 23;
}
