const cp = require('child_process');

const content = cp.execSync('git show 691e417:index.html', { maxBuffer: 20 * 1024 * 1024 }).toString();
const regex = /<template\s+id=["']([^"']+)["']/g;
let m;
console.log('Templates in 691e417:');
while ((m = regex.exec(content)) !== null) {
  console.log(' -', m[1], 'at index', m.index);
}
