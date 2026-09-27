const fs = require('fs');

const tplFile = 'preview_app.html';
const standalone = 'EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html';

const tplContent = fs.readFileSync(tplFile, 'utf8');
const start = tplContent.indexOf('<template id="tpl-PermissionApprovals">') + '<template id="tpl-PermissionApprovals">'.length;
const end = tplContent.indexOf('</template>', start);
const tplInner = tplContent.substring(start, end).trim();
const standContent = fs.readFileSync(standalone, 'utf8').trim();

// Compare headers / head / body structure
console.log('--- Standalone head ---');
const standHead = standContent.substring(0, standContent.indexOf('</head>'));
console.log(standHead.substring(0, 500));

console.log('--- Template head ---');
const tplHead = tplInner.substring(0, tplInner.indexOf('</head>'));
console.log(tplHead.substring(0, 500));
