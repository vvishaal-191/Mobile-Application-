const fs = require('fs');

function inspectBody(filepath) {
  const content = fs.readFileSync(filepath, 'utf8');
  const idx = content.indexOf('id="tpl-LeaveApprovals"');
  const endIdx = content.indexOf('</template>', idx);
  const tpl = content.substring(idx, endIdx);
  const bodyIdx = tpl.indexOf('<body');
  console.log('===', filepath, '===');
  const lines = tpl.substring(bodyIdx).split('\n').slice(0, 100);
  lines.forEach((l, i) => {
    if (l.includes('data:image')) {
      console.log(`${i}: <data:image base64 truncated>`);
    } else {
      console.log(`${i}: ${l.trim()}`);
    }
  });
}

inspectBody('preview_app.html');
inspectBody('EmergereApp/EmergereApp/preview_app.html');
