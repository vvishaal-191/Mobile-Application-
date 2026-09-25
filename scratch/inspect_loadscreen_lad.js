const fs = require('fs');

const c = fs.readFileSync('index.html', 'utf8');
const p = c.indexOf("currentTpl === 'tpl-LeaveApprovalDetail'");
console.log(c.substring(p, p + 2200));
