const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

function findSubmits(tplId) {
  const start = content.indexOf('id="' + tplId + '"');
  if (start === -1) return;
  const end = content.indexOf('</template>', start);
  const tplContent = content.substring(start, end);
  console.log('=== ' + tplId + ' ===');
  const lines = tplContent.split('\n');
  lines.forEach((l, idx) => {
    if (l.includes('handleSubmit') || l.includes('EMP_LEAVE_REQUESTS') || l.includes('PERM_STATE') || l.includes('PERMISSION_REQUESTS') || l.includes('submit')) {
      console.log(`L${idx}: ${l}`);
    }
  });
}

findSubmits('tpl-ApplyLeave');
findSubmits('tpl-ApplyPermission');
findSubmits('tpl-LeaveApprovalDetail');
