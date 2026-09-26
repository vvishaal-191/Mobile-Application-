const fs = require('fs');

const calBase64 = fs.readFileSync('scratch/cal_b64.txt', 'utf8').trim();
const emptyBase64 = fs.readFileSync('scratch/empty_b64.txt', 'utf8').trim();

// Read current template from EmergereApp/EmergereApp/preview_app.html
const content = fs.readFileSync('EmergereApp/EmergereApp/preview_app.html', 'utf8');
const idx = content.indexOf('id="tpl-LeaveApprovals"');
const endIdx = content.indexOf('</template>', idx);
let tpl = content.substring(idx, endIdx + 11);

// Replace the calendar image src with calBase64
tpl = tpl.replace(/(<div class="header-illustration">\s*<img\s+src=")[^"]+(")/, `$1${calBase64}$2`);

// Replace the empty art image src with emptyBase64
tpl = tpl.replace(/(<div class="empty-art-wrap">\s*<img\s+src=")[^"]+(")/, `$1${emptyBase64}$2`);

fs.writeFileSync('scratch/assembled_new_la_tpl.html', tpl);
console.log('Saved scratch/assembled_new_la_tpl.html, length:', tpl.length);
