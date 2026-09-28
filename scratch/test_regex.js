const fs = require('fs');
const html = fs.readFileSync('preview_app.html', 'utf8');

const regex = /<template id="tpl-Login">[\s\S]*?<\/template>/;
const match = html.match(regex);
console.log('Regex match found:', !!match);
if (match) {
  console.log('Match index:', match.index);
  console.log('Match length:', match[0].length);
  console.log('Match starts:', match[0].substring(0, 50));
  console.log('Match ends:', match[0].substring(match[0].length - 50));
}
