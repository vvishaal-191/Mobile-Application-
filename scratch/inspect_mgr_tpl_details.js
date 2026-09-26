const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('<template id="tpl-ManagerDashboard">');
const end = html.indexOf('</template>', start);
console.log('ManagerDashboard range:', start, end, 'length:', end - start);
const tpl = html.substring(start, end);
const lines = tpl.split('\n');
lines.forEach((l, i) => {
  if (l.includes('Team Calendar') || l.includes('Holiday Calendar') || l.includes('qa-calendar') || l.includes('tab-history') || l.includes('Calendar') || l.includes('Permission Approvals') || l.includes('bottom-nav') || l.includes('nav-tab')) {
    console.log('Line', i, ':', l.trim().slice(0, 150));
  }
});
