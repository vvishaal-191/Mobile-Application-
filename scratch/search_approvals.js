const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

const terms = ['handleApprove', 'handleReject', 'approveRequest', 'rejectRequest', 'Approve', 'Reject'];
for (const t of terms) {
  let idx = 0;
  let count = 0;
  while ((idx = content.indexOf(t, idx)) !== -1 && count < 3) {
    console.log(`Found ${t} at ${idx}:`);
    console.log(content.substring(idx - 40, idx + 160).replace(/\r?\n/g, ' '));
    idx += t.length;
    count++;
  }
}
