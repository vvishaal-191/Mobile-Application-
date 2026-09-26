const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('<template id="tpl-ManagerDashboard">');
const end = html.indexOf('</template>', start);
const tpl = html.substring(start, end);
const lines = tpl.split('\n');

for (let i = 1175; i <= 1220 && i < lines.length; i++) {
  console.log(`${i}: ${lines[i]}`);
}
