const fs = require('fs');
const html = fs.readFileSync('preview_app.html', 'utf8');

const tplIdx = html.indexOf('id="tpl-Login"');
console.log('tpl-Login at:', tplIdx);
const scriptIdx = html.indexOf('<script>', tplIdx);
console.log('script at:', scriptIdx);
console.log(html.substring(scriptIdx, scriptIdx + 2000));
