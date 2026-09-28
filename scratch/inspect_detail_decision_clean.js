const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

const start = content.indexOf('id="tpl-LeaveApprovalDetail"');
const end = content.indexOf('</template>', start);
const tplContent = content.substring(start, end);
const sIdx = tplContent.indexOf('function handleDetailLeaveDecision');
console.log(tplContent.substring(sIdx, sIdx + 2500));
