const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'preview_app.html');
const content = fs.readFileSync(file, 'utf8');
const tplStart = content.indexOf('<template id="tpl-MyProfile">');
const tplEnd = content.indexOf('</template>', tplStart);
const tplContent = content.substring(tplStart, tplEnd + '</template>'.length);

console.log('=== START (1500 chars) ===');
console.log(tplContent.substring(0, 1500));
console.log('=== END (1500 chars) ===');
console.log(tplContent.substring(tplContent.length - 1500));
