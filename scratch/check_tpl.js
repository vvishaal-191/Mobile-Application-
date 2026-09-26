const fs = require('fs');

function checkFile(filepath) {
  if (!fs.existsSync(filepath)) {
    console.log(filepath, 'does not exist');
    return;
  }
  const content = fs.readFileSync(filepath, 'utf8');
  const idx = content.indexOf('id="tpl-LeaveApprovals"');
  if (idx !== -1) {
    const endIdx = content.indexOf('</template>', idx);
    console.log(filepath, 'found tpl-LeaveApprovals at char', idx, 'length', endIdx - idx);
    // Find line number
    const lineNum = content.substring(0, idx).split('\n').length;
    console.log('Starts at line:', lineNum);
    const endLineNum = content.substring(0, endIdx).split('\n').length;
    console.log('Ends at line:', endLineNum);
  } else {
    console.log(filepath, 'tpl-LeaveApprovals NOT found');
  }
}

checkFile('preview_app.html');
checkFile('index.html');
checkFile('EmergereApp/EmergereApp/preview_app.html');
checkFile('EmergereApp/EmergereApp/index.html');
