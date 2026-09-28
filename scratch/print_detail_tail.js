const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

const start = content.indexOf('id="tpl-LeaveApprovalDetail"');
const end = content.indexOf('</template>', start);
const tplContent = content.substring(start, end);
const sIdx = tplContent.indexOf('<script>');
const script = tplContent.substring(sIdx);
const lines = script.split('\n');
console.log(lines.slice(80, 160).join('\n'));
