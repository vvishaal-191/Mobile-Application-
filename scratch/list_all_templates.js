const fs = require('fs');
const html = fs.readFileSync('preview_app.html', 'utf8');

const regex = /<template\s+id="([^"]+)">/g;
let m;
while ((m = regex.exec(html)) !== null) {
  console.log('Template:', m[1], 'at index:', m.index);
}
