const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');
const start = content.indexOf('<template id="tpl-ApplyPermission">');
const end = content.indexOf('</template>', start);
const tpl = content.substring(start, end + 11);

// Find the HTML part of form
const htmlStart = tpl.indexOf('<div class="perm-form-card">');
console.log('--- HTML FORM START ---');
console.log(tpl.substring(htmlStart, htmlStart + 1200));

// Find script tags
const scriptStart = tpl.indexOf('<script>');
console.log('--- SCRIPT START ---');
console.log(tpl.substring(scriptStart, scriptStart + 2000));
