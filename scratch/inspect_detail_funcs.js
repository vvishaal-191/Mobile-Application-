const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

const start = content.indexOf('id="tpl-LeaveApprovalDetail"');
const end = content.indexOf('</template>', start);
const tplContent = content.substring(start, end);
const lines = tplContent.split('\n');
lines.forEach((l, i) => {
  if (l.includes('function handleDetailLeaveDecision') || l.includes('function getPersonData') || l.includes('isPermission')) {
    console.log(`L${i}: ${l}`);
  }
});
