const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');
let idx = 0;
while ((idx = content.indexOf('profile-header-banner', idx)) !== -1) {
  const lineStart = content.lastIndexOf('\n', idx);
  const lineEnd = content.indexOf('\n', idx);
  console.log('Found at', idx, ':', content.substring(lineStart, lineEnd).trim());
  idx += 21;
}
