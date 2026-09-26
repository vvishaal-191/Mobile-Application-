const fs = require('fs');
const content = fs.readFileSync('EmergereApp/EmergereApp/preview_app.html', 'utf8');
const idx = content.indexOf('id="tpl-LeaveApprovals"');
const endIdx = content.indexOf('</template>', idx);
const tpl = content.substring(idx, endIdx + 11);
fs.writeFileSync('scratch/leave_approvals_template.html', tpl);
console.log('Saved scratch/leave_approvals_template.html, length:', tpl.length);
