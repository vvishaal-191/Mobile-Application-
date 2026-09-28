const fs = require('fs');
const content = fs.readFileSync('preview_app.html', 'utf8');

function inspectDetail() {
  const start = content.indexOf('id="tpl-LeaveApprovalDetail"');
  if (start === -1) return console.log('tpl-LeaveApprovalDetail NOT FOUND');
  const end = content.indexOf('</template>', start);
  const tplContent = content.substring(start, end);
  const sIdx = tplContent.indexOf('<script>');
  const sEnd = tplContent.indexOf('</script>', sIdx);
  console.log(tplContent.substring(sIdx, sEnd + 9));
}

inspectDetail();
