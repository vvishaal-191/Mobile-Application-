const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

function inspectCards(tplId) {
  const start = content.indexOf('id="' + tplId + '"');
  if (start === -1) return;
  const end = content.indexOf('</template>', start);
  const tplContent = content.substring(start, end);
  const bodyEnd = tplContent.indexOf('<script>');
  console.log('=== HTML CARDS IN ' + tplId + ' ===');
  console.log(tplContent.substring(0, bodyEnd === -1 ? 1000 : bodyEnd));
}

inspectCards('tpl-LeaveApprovals');
inspectCards('tpl-PermissionApprovals');
