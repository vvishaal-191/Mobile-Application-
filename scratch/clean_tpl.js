const fs = require('fs');
const content = fs.readFileSync('scratch/leave_approvals_template.html', 'utf8');

// Replace long base64 with a short token
const cleaned = content.replace(/src="data:image\/[^;]+;base64,[^"]+"/g, 'src="[BASE64_IMAGE]"');
fs.writeFileSync('scratch/leave_approvals_clean.html', cleaned);
console.log('Cleaned length:', cleaned.length);

const lines = cleaned.split('\n');
console.log('Total lines:', lines.length);
