const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const start = c.indexOf('<template id="tpl-ManagerDashboard">');
const headerEnd = c.indexOf('</div></div>', start);
console.log(c.substring(headerEnd, headerEnd + 2500));
