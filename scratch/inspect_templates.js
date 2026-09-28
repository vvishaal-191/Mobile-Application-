const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

function inspectTemplate(tplId) {
  const start = content.indexOf('id="' + tplId + '"');
  if (start === -1) {
    console.log(tplId, 'NOT FOUND');
    return;
  }
  const end = content.indexOf('</template>', start);
  console.log('=== ' + tplId + ' === (Length: ' + (end - start) + ')');
  const tplContent = content.substring(start, end);
  const scripts = tplContent.match(/<script[\s\S]*?<\/script>/g) || [];
  console.log('Script count:', scripts.length);
  scripts.forEach((s, idx) => {
    console.log('--- Script ' + idx + ' (lines ' + s.split('\n').length + '): ---');
    console.log(s.substring(0, 400));
    console.log('...\n' + s.substring(Math.max(0, s.length - 300)));
  });
}

inspectTemplate('tpl-LeaveApprovals');
inspectTemplate('tpl-PermissionApprovals');
inspectTemplate('tpl-ManagerDashboard');
inspectTemplate('tpl-ApplyLeave');
inspectTemplate('tpl-ApplyPermission');
