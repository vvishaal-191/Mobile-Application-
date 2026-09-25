const fs = require('fs');

const c = fs.readFileSync('index.html', 'utf8');
const p = c.indexOf("if (currentTpl === 'tpl-LeaveApprovalDetail') {");
console.log('Start index:', p);

// Find matching closing brace
let depth = 0;
let end = -1;
for (let i = p; i < c.length; i++) {
  if (c[i] === '{') depth++;
  else if (c[i] === '}') {
    depth--;
    if (depth === 0) {
      end = i;
      break;
    }
  }
}
console.log('End index:', end);
console.log(c.substring(p, end + 1));
