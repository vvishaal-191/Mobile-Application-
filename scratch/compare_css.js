const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

const leaveStart = content.indexOf('id="tpl-ApplyLeave"');
const leaveEnd = content.indexOf('</template>', leaveStart);
const leaveHtml = content.substring(leaveStart, leaveEnd);

const permStart = content.indexOf('id="tpl-ApplyPermission"');
const permEnd = content.indexOf('</template>', permStart);
const permHtml = content.substring(permStart, permEnd);

console.log('--- LEAVE CSS (top 1500 chars) ---');
const lStyle = leaveHtml.substring(leaveHtml.indexOf('<style>') + 7, leaveHtml.indexOf('</style>'));
console.log(lStyle.substring(0, 1500));

console.log('--- PERM CSS (top 1500 chars) ---');
const pStyle = permHtml.substring(permHtml.indexOf('<style>') + 7, permHtml.indexOf('</style>'));
console.log(pStyle.substring(0, 1500));
