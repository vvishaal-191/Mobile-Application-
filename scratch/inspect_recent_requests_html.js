const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');

const mgrStart = c.indexOf('id="tpl-ManagerDashboard"');
const mgrEnd = c.indexOf('</template>', mgrStart);
const mgrTpl = c.substring(mgrStart, mgrEnd);

console.log(mgrTpl.substring(37700, 42000));
