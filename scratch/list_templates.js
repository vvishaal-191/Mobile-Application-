const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');
const regex = /<template\s+id=["']([^"']+)["']/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(match[1]);
}
