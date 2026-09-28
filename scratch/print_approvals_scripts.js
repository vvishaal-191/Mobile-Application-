const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

function printTemplateScript(tplId) {
  const start = content.indexOf('id="' + tplId + '"');
  if (start === -1) return;
  const end = content.indexOf('</template>', start);
  const tplContent = content.substring(start, end);
  const sIdx = tplContent.indexOf('<script>');
  if (sIdx !== -1) {
    const sEnd = tplContent.indexOf('</script>', sIdx);
    console.log('=== ' + tplId + ' FULL SCRIPT ===');
    console.log(tplContent.substring(sIdx, sEnd + 9));
  }
}

printTemplateScript('tpl-LeaveApprovals');
printTemplateScript('tpl-PermissionApprovals');
