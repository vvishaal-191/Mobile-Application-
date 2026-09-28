const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

const start = content.indexOf('id="tpl-ManagerDashboard"');
const end = content.indexOf('</template>', start);
const tplContent = content.substring(start, end);
const sIdx = tplContent.indexOf('<script>');
const sEnd = tplContent.indexOf('</script>', sIdx);
console.log(tplContent.substring(sIdx, sEnd + 9));
