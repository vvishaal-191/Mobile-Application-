const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const start = c.indexOf('<template id="tpl-ManagerDashboard">');
const end = c.indexOf('</template>', start);
console.log('Start:', start, 'End:', end);
const tplContent = c.substring(start, end + 11);
fs.writeFileSync('scratch/tpl_manager_dashboard_extracted.html', tplContent, 'utf8');
console.log('Saved to scratch/tpl_manager_dashboard_extracted.html, size:', tplContent.length);
