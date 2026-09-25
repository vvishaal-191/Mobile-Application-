const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const start = c.indexOf('<template id="tpl-ManagerDashboard">');
const bodyIdx = c.indexOf('<body>', start);
console.log(c.substring(bodyIdx, bodyIdx + 1500));
