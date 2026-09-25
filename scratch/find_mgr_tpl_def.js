const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const search = '<template id="tpl-ManagerDashboard">';
const idx = c.indexOf(search);
console.log('Template position:', idx);
if (idx !== -1) {
  const line = c.substring(0, idx).split('\n').length;
  console.log('Template line number:', line);
  const endIdx = c.indexOf('</template>', idx);
  console.log('Template length:', endIdx - idx);
} else {
  // Try regex
  const m = c.match(/<template[^>]+id=["']tpl-ManagerDashboard["']/);
  console.log('Regex match:', m ? m[0] : 'not found');
}
