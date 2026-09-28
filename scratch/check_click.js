const fs = require('fs');
const html = fs.readFileSync('preview_app.html', 'utf8');
const tplStart = html.indexOf('<template id="tpl-Login">');
const tplEnd = html.indexOf('</template>', tplStart);
const tpl = html.substring(tplStart, tplEnd);

const clickIdx = tpl.indexOf('loginBtn.addEventListener');
if (clickIdx !== -1) {
  console.log(tpl.substring(clickIdx, clickIdx + 1200));
} else {
  console.log('loginBtn.addEventListener NOT found!');
}
