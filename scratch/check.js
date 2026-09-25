const fs = require('fs');
const t = fs.readFileSync('scratch/new_leave_history_tpl.html', 'utf8');
console.log('Contains newHeaderCss:', t.includes('.mr-header-top-row'));
console.log('Contains newHeaderHtml:', t.includes('mr-header-top-row'));
console.log('Contains empty base64:', t.includes('data:image/png;base64,') && t.length > 50000);
