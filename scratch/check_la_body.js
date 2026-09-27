const fs = require('fs');
const c = fs.readFileSync('preview_app.html', 'utf8');
const laStart = c.indexOf('<template id="tpl-LeaveApprovals">');
const laEnd = c.indexOf('</template>', laStart);
const la = c.substring(laStart, laEnd);
const bodyIdx = la.indexOf('<body');
const sIdx = la.indexOf('<script');
console.log(la.substring(bodyIdx, sIdx).slice(0, 2500));
