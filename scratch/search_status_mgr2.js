const fs = require('fs');

const c = fs.readFileSync('index.html', 'utf8');
const mgrStart = c.indexOf('id="tpl-ManagerDashboard"');
const mgrEnd = c.indexOf('</template>', mgrStart);
console.log('mgrStart:', mgrStart, 'mgrEnd:', mgrEnd);
const mgrTpl = c.substring(mgrStart, mgrEnd);

console.log('mgrTpl length:', mgrTpl.length);

const matches = mgrTpl.match(/status/gi);
console.log('Matches for status:', matches ? matches.length : 0);

if (matches) {
  let pos = 0;
  while ((pos = mgrTpl.toLowerCase().indexOf('status', pos)) !== -1) {
    console.log('--- status at:', pos);
    console.log(mgrTpl.substring(Math.max(0, pos - 100), Math.min(mgrTpl.length, pos + 150)));
    pos += 6;
  }
}
