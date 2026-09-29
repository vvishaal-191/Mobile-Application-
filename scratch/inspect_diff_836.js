const cp = require('child_process');

const diff = cp.execSync('git diff 691e417 8361d26 --stat', { maxBuffer: 20 * 1024 * 1024 }).toString();
console.log(diff);
