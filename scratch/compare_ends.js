const fs = require('fs');

const oldTpl = fs.readFileSync('scratch/leave_history_tpl.html', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const startIdx = indexHtml.indexOf('<template id="tpl-LeaveHistory">');
const endIdx = indexHtml.indexOf('</template>', startIdx);
const actualContent = indexHtml.substring(startIdx, endIdx);

console.log('oldTpl ends with:', JSON.stringify(oldTpl.slice(-30)));
console.log('actualContent ends with:', JSON.stringify(actualContent.slice(-30)));
console.log('oldTpl === actualContent:', oldTpl === actualContent);
