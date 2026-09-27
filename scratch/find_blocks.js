const fs = require('fs');

const c = fs.readFileSync('preview_app.html', 'utf8');

const regex = /\/\/\s*3\.\s*Recent\s*Requests\s*Section[\s\S]*?requestsList\.innerHTML\s*=\s*htmlCards;\s*\}\s*\}/g;

let m;
let count = 0;
while ((m = regex.exec(c)) !== null) {
  count++;
  console.log(`=== MATCH ${count} (idx: ${m.index}, len: ${m[0].length}) ===`);
  console.log(m[0].slice(0, 200));
  console.log('...');
  console.log(m[0].slice(-200));
}
console.log('Total matches found:', count);
