const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

let pos = 0;
while ((pos = content.indexOf('profile-emp-status', pos)) !== -1) {
  console.log('profile-emp-status at:', pos);
  console.log(content.substring(Math.max(0, pos - 150), Math.min(content.length, pos + 250)));
  pos += 18;
}
