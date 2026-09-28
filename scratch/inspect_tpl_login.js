const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../preview_app.html'), 'utf8');

const tplMatch = content.match(/<template id="tpl-Login">([\s\S]*?)<\/template>/);
if (tplMatch) {
  console.log('Template length:', tplMatch[0].length);
  console.log('Template snippet (first 300 chars):', tplMatch[0].substring(0, 300));
}

const styleMatch = content.match(/\/\* Login Screen Exact Design Reference Styles[\s\S]*?(?=\/\*|body|\.screen|#tpl-|<style|$)/);
if (styleMatch) {
  console.log('Style match length:', styleMatch[0].length);
  console.log('Style snippet:', styleMatch[0].substring(0, 200));
}
