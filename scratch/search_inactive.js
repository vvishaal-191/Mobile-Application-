const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

// Search for Inactive
let pos = 0;
while ((pos = content.indexOf('Inactive', pos)) !== -1) {
  console.log('--- Inactive at pos:', pos);
  console.log(content.substring(Math.max(0, pos - 150), Math.min(content.length, pos + 150)));
  pos += 8;
}
