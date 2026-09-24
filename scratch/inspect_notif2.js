const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');
const idx = content.indexOf('id="tpl-Notifications"');
const end = content.indexOf('</template>', idx);
const tplContent = content.substring(idx, end);

const afterImg = tplContent.indexOf('<h1>Notifications');
console.log('From h1 onwards:');
console.log(tplContent.substring(afterImg - 50, afterImg + 1500));
