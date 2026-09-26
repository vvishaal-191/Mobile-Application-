const fs = require('fs');

let tpl = fs.readFileSync('scratch/assembled_new_la_tpl.html', 'utf8');
// remove id="tpl-LeaveApprovals"> and </template>
tpl = tpl.replace(/^id="tpl-LeaveApprovals">\s*/, '').replace(/\s*<\/template>$/, '');

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Leave Approvals Test</title>
</head>
<body>
${tpl}
</body>
</html>`;

fs.writeFileSync('scratch/test_preview_la.html', html);
console.log('Saved scratch/test_preview_la.html');
