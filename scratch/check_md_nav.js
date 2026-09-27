const fs = require('fs');
const c = fs.readFileSync('preview_app.html', 'utf8');
const mdStart = c.indexOf('<template id="tpl-ManagerDashboard">');
const mdEnd = c.indexOf('</template>', mdStart);
const md = c.substring(mdStart, mdEnd);

const lines = md.split('\n');
lines.forEach((line, i) => {
  if (line.includes('tpl-LeaveApprovals') || line.includes('tpl-PermissionApprovals') || line.includes('Approved') || line.includes('Rejected')) {
    if (line.includes('onclick') || line.includes('loadScreen') || line.includes('function') || line.includes('TARGET_')) {
      console.log(`L${i}: ${line.trim()}`);
    }
  }
});
