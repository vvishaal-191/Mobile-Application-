const fs = require('fs');

const c = fs.readFileSync('preview_app.html', 'utf8');

function inspectTemplate(tplId) {
  const start = c.indexOf('<template id="' + tplId + '">');
  if (start === -1) {
    console.log(tplId, 'NOT FOUND');
    return;
  }
  const end = c.indexOf('</template>', start);
  const content = c.substring(start + ('<template id="' + tplId + '">').length, end).trim();
  console.log('=== ' + tplId + ' ===');
  console.log('Length:', content.length);
  console.log('Starts with:', content.slice(0, 150));
  console.log('Ends with:', content.slice(-150));
}

inspectTemplate('tpl-LeaveApprovals');
inspectTemplate('tpl-PermissionApprovals');
inspectTemplate('tpl-ManagerDashboard');
inspectTemplate('tpl-LeaveBalance');

// Also inspect loadScreen function in preview_app.html
const lsMatch = c.match(/function loadScreen[\s\S]*?\{[\s\S]*?\n\}/);
if (lsMatch) {
  console.log('=== loadScreen function ===\n', lsMatch[0]);
} else {
  const lsIdx = c.indexOf('loadScreen');
  console.log('=== loadScreen context ===\n', c.substring(lsIdx, lsIdx + 500));
}
