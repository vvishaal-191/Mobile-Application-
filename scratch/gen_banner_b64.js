const fs = require('fs');

const bannerBuf = fs.readFileSync('assets/leave-approvals-header-banner.png');
const bannerBase64 = 'data:image/png;base64,' + bannerBuf.toString('base64');

console.log('Banner base64 length:', bannerBase64.length);
fs.writeFileSync('scratch/banner_b64.txt', bannerBase64);
