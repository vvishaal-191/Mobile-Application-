const fs = require('fs');

const calBuf = fs.readFileSync('assets/leave-approvals-cal.png');
const calBase64 = 'data:image/png;base64,' + calBuf.toString('base64');

const emptyBuf = fs.readFileSync('assets/leave-approvals-empty.png');
const emptyBase64 = 'data:image/png;base64,' + emptyBuf.toString('base64');

console.log('Calendar base64 length:', calBase64.length);
console.log('Empty illustration base64 length:', emptyBase64.length);

fs.writeFileSync('scratch/cal_b64.txt', calBase64);
fs.writeFileSync('scratch/empty_b64.txt', emptyBase64);
