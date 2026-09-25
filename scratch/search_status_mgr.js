const fs = require('fs');

const c = fs.readFileSync('index.html', 'utf8');
const mgrStart = c.indexOf('id="tpl-ManagerDashboard"');
const mgrEnd = c.indexOf('</template>', mgrStart);
const mgrTpl = c.substring(mgrStart, mgrEnd);

let pos = 0;
while ((pos = mgrTpl.indexOf('status', pos)) !== -1) {
  console.log('--- status in mgrTpl at:', pos);
  console.log(mgrTpl.substring(Math.max(0, pos - 100), Math.min(mgrTpl.length, pos + 150)));
  pos += 6;
}
