const fs = require('fs');
const c = fs.readFileSync('preview_app.html', 'utf8');

const regex = /<template[^>]*>/gi;
let m;
while ((m = regex.exec(c)) !== null) {
  console.log(m.index, m[0]);
}
