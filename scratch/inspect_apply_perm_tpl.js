const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');
const start = content.indexOf('<template id="tpl-ApplyPermission">');
const end = content.indexOf('</template>', start);
console.log('Length of tpl-ApplyPermission:', end - start);
const tpl = content.substring(start, end + 11);

// Look for Date field and script inside tpl
console.log('--- DATE FIELD IN TPL ---');
const dateIdx = tpl.indexOf('Date');
console.log(tpl.substring(dateIdx - 100, dateIdx + 400));

console.log('--- SCRIPT IN TPL ---');
const scriptIdx = tpl.indexOf('<script>');
console.log(tpl.substring(scriptIdx, scriptIdx + 500));
