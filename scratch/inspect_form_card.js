const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');
const start = content.indexOf('<template id="tpl-ApplyPermission">');
const end = content.indexOf('</template>', start);
const tpl = content.substring(start, end + 11);

const formIdx = tpl.indexOf('form-card');
console.log('--- FORM CARD ---');
console.log(tpl.substring(formIdx, formIdx + 1500));
