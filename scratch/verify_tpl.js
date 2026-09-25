const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const oldTpl = fs.readFileSync('scratch/leave_history_tpl.html', 'utf8');
const newTpl = fs.readFileSync('scratch/new_leave_history_tpl.html', 'utf8');

const startIdx = indexHtml.indexOf('<template id="tpl-LeaveHistory">');
const endIdx = indexHtml.indexOf('</template>', startIdx) + '</template>'.length;
const actualTplInIndex = indexHtml.substring(startIdx, endIdx);

console.log('oldTpl length:', oldTpl.length);
console.log('actualTplInIndex length:', actualTplInIndex.length);
console.log('Equal:', oldTpl === actualTplInIndex);
console.log('Starts with <template id="tpl-LeaveHistory"> in newTpl:', newTpl.startsWith('<template id="tpl-LeaveHistory">'));
console.log('Ends with </template> in newTpl:', newTpl.endsWith('</template>'));
