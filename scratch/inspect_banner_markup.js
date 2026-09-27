const fs = require('fs');

const c1 = fs.readFileSync('EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html', 'utf8');
const c2 = fs.readFileSync('preview_app.html', 'utf8');
const m1 = c1.match(/<div class="pa-header-banner-wrap"[\s\S]*?<\/div>/);
const m2 = c2.match(/<div class="pa-header-banner-wrap"[\s\S]*?<\/div>/);
console.log('preview.html banner:');
console.log(m1 ? m1[0].replace(/data:image\/[^;]+;base64,[^"]+/, 'data:...[BASE64]...') : 'not found');
console.log('\npreview_app.html banner:');
console.log(m2 ? m2[0].replace(/data:image\/[^;]+;base64,[^"]+/, 'data:...[BASE64]...') : 'not found');
