const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const start = content.indexOf('<template id="tpl-LeaveHistory">');
const end = content.indexOf('</template>', start);
const tpl = content.slice(start, end);

fs.writeFileSync('scratch/leave_history_tpl.html', tpl, 'utf8');
console.log('Saved tpl-LeaveHistory to scratch/leave_history_tpl.html. Length:', tpl.length);
