const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

const regex = /(?:window\.)?(EMP_LEAVE_REQUESTS|PERM_STATE|PERMISSION_REQUESTS)\s*=\s*\[/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const idx = match.index;
  console.log('Match at char ' + idx + ':');
  console.log(content.substring(idx, Math.min(content.length, idx + 400)));
  console.log('------------------------------------');
}
