const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');
const start = content.indexOf('<template id="tpl-LeaveBalance">');
const end = content.indexOf('</template>', start);
const tpl = content.slice(start, end + 11);

// Replace base64 strings with [BASE64]
const cleaned = tpl.replace(/data:image\/[^;]+;base64,[^"']+/g, '[BASE64]');
fs.writeFileSync('scratch/leave_balance_tpl.html', cleaned);
console.log('Saved scratch/leave_balance_tpl.html, lines:', cleaned.split('\n').length);
