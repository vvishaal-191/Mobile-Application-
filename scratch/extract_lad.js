const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const tplStart = content.indexOf('<template id="tpl-LeaveApprovalDetail">');
const tplEnd = content.indexOf('</template>', tplStart);

console.log('tplStart:', tplStart, 'tplEnd:', tplEnd, 'Length:', tplEnd - tplStart);
const tpl = content.substring(tplStart, tplEnd + 11);
fs.writeFileSync(path.join(__dirname, 'current_lad_tpl.html'), tpl, 'utf8');
console.log('Saved to current_lad_tpl.html');
