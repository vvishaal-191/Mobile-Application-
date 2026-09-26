const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');
const idx = content.indexOf('id="tpl-LeaveApprovals"');
const endIdx = content.indexOf('</template>', idx);
let tpl = content.substring(idx, endIdx);
tpl = tpl.replace(/^id="tpl-LeaveApprovals">\s*/, '');

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

fs.writeFileSync('scratch/test_preview_la.html', html, 'utf8');
console.log('Updated scratch/test_preview_la.html');
