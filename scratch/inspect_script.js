const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const tplStart = html.indexOf('<template id="tpl-Login">');
const tplEnd = html.indexOf('</template>', tplStart);
const tpl = html.substring(tplStart, tplEnd);
const scriptStart = tpl.indexOf('<script>');
const scriptEnd = tpl.indexOf('</script>', scriptStart);
console.log(tpl.substring(scriptStart, scriptEnd + 9));
