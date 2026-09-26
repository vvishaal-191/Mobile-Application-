const fs = require('fs');

const content = fs.readFileSync('EmergereApp/EmergereApp/preview_app.html', 'utf8');
const idx = content.indexOf('id="tpl-LeaveApprovals"');
const endIdx = content.indexOf('</template>', idx);
const tpl = content.substring(idx, endIdx);

const scriptIdx = tpl.indexOf('<script>');
if (scriptIdx !== -1) {
  console.log(tpl.substring(scriptIdx));
}
