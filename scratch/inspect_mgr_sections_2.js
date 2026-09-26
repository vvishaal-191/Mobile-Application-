const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('<template id="tpl-ManagerDashboard">');
const end = html.indexOf('</template>', start);
const tpl = html.substring(start, end);
const lines = tpl.split('\n');

console.log('=== Lines 1170 to 1330 ===');
for (let i = 1170; i <= 1330 && i < lines.length; i++) {
  console.log(`${i}: ${lines[i]}`);
}

console.log('=== Lines 1580 to 1660 ===');
for (let i = 1580; i <= 1660 && i < lines.length; i++) {
  console.log(`${i}: ${lines[i]}`);
}
