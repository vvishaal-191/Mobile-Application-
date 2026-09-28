const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

const start = content.indexOf('id="tpl-LeaveApprovals"');
const end = content.indexOf('</template>', start);
const tplContent = content.substring(start, end);
console.log(tplContent.substring(0, 1500));
