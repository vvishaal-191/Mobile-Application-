const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

const start = content.indexOf('id="tpl-LeaveApprovalDetail"');
const end = content.indexOf('</template>', start);
const tplContent = content.substring(start, end);
const lines = tplContent.split('\n');
console.log(lines.slice(940, 1040).join('\n'));
