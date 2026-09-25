const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const permTplStart = content.indexOf('id="tpl-ApplyPermission"');
const submitPos = content.indexOf('function handleApplyPermissionSubmit', permTplStart);
console.log(content.substring(submitPos, submitPos + 3500));
