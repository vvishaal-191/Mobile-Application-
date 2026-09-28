const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

function printScript(tplId) {
  const start = content.indexOf('id="' + tplId + '"');
  if (start === -1) return;
  const end = content.indexOf('</template>', start);
  const tplContent = content.substring(start, end);
  const scripts = tplContent.match(/<script[\s\S]*?<\/script>/g) || [];
  console.log('====================================');
  console.log('=== TEMPLATE: ' + tplId + ' ===');
  scripts.forEach((s, idx) => {
    console.log('--- SCRIPT ' + idx + ' ---');
    console.log(s);
  });
}

printScript('tpl-LeaveApprovals');
printScript('tpl-PermissionApprovals');
printScript('tpl-ManagerDashboard');
