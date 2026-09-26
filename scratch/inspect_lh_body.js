const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');
const idx = content.indexOf('id="tpl-LeaveHistory"');
const endIdx = content.indexOf('</template>', idx);
const tpl = content.substring(idx, endIdx);
const bodyIdx = tpl.indexOf('<body');
console.log(tpl.substring(bodyIdx, bodyIdx + 1500));
