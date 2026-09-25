const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const newTpl = fs.readFileSync('scratch/new_leave_history_tpl.html', 'utf8');

const startIdx = indexHtml.indexOf('<template id="tpl-LeaveHistory">');
const endIdx = indexHtml.indexOf('</template>', startIdx);

const replaced = indexHtml.substring(0, startIdx) + newTpl + indexHtml.substring(endIdx);

const newStart = replaced.indexOf('<template id="tpl-LeaveHistory">');
const newEnd = replaced.indexOf('</template>', newStart);
const nextTpl = replaced.indexOf('<template id="tpl-HolidayCalendar">');

console.log('newStart:', newStart);
console.log('newEnd:', newEnd);
console.log('nextTpl:', nextTpl);
console.log('Valid structure:', newStart < newEnd && newEnd < nextTpl);
console.log('newEnd + </template>.length + indentation == nextTpl:', replaced.substring(newEnd, nextTpl));
