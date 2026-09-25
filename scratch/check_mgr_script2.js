const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const start = c.indexOf('<template id="tpl-ManagerDashboard">');
const end = c.indexOf('</template>', start);
const tpl = c.substring(start, end);
const scriptIdx = tpl.indexOf('<script');
console.log('Script in tpl-ManagerDashboard:\n', tpl.substring(scriptIdx));
