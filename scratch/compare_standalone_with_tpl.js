const fs = require('fs');

const tplFile = 'preview_app.html';
const standalone = 'EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html';

const tplContent = fs.readFileSync(tplFile, 'utf8');
const start = tplContent.indexOf('<template id="tpl-PermissionApprovals">') + '<template id="tpl-PermissionApprovals">'.length;
const end = tplContent.indexOf('</template>', start);
const tplInner = tplContent.substring(start, end).trim();

const standContent = fs.readFileSync(standalone, 'utf8').trim();

console.log('Tpl inner len:', tplInner.length);
console.log('Standalone len:', standContent.length);
console.log('Are they identical?', tplInner === standContent);
