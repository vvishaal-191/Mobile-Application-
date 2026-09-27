const fs = require('fs');
const { decodePng } = require('./png_utils.js');

const html = fs.readFileSync('EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html', 'utf8');
const p1 = html.indexOf('class="header-banner-img"');
console.log('p1:', p1);
let b64Start = html.lastIndexOf('base64,', p1);
let b64End = html.indexOf('"', b64Start);
console.log('b64 len:', b64End - b64Start - 7);
const b64 = html.substring(b64Start + 7, b64End);
fs.writeFileSync('scratch/current_pa_banner.png', Buffer.from(b64, 'base64'));

const img = decodePng('scratch/current_pa_banner.png');
console.log('Current banner dimensions:', img.width, 'x', img.height);
