const fs = require('fs');
const c = fs.readFileSync('preview_app.html', 'utf8');

const paIdx = c.indexOf('<template id="tpl-PermissionApprovals">');
const paEnd = c.indexOf('</template>', paIdx);
console.log('PermissionApprovals end index:', paEnd);
console.log('After PermissionApprovals:', JSON.stringify(c.substring(paEnd, paEnd + 100)));
