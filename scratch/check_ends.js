const fs = require('fs');
const c = fs.readFileSync('preview_app.html', 'utf8');

const laStart = c.indexOf('<template id="tpl-LeaveApprovals">');
const laEnd = c.indexOf('</template>', laStart);
console.log('laEnd:', laEnd);
console.log('Context around laEnd:', JSON.stringify(c.substring(laEnd - 30, laEnd + 60)));

const paStart = c.indexOf('<template id="tpl-PermissionApprovals">');
const paEnd = c.indexOf('</template>', paStart);
console.log('paEnd:', paEnd);
console.log('Context around paEnd:', JSON.stringify(c.substring(paEnd - 30, paEnd + 60)));
