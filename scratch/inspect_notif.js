const fs = require('fs');

function inspect(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(filePath, 'not found');
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const idx = content.indexOf('id="tpl-Notifications"');
  if (idx !== -1) {
    const end = content.indexOf('</template>', idx);
    console.log(filePath, 'tpl-Notifications found at', idx, 'end at', end, 'len:', end - idx);
    const tplContent = content.substring(idx, end);
    const bodyIdx = tplContent.indexOf('<body');
    console.log('Body snippet:', tplContent.substring(bodyIdx, bodyIdx + 500));
  } else {
    console.log(filePath, 'NO tpl-Notifications');
  }
}

inspect('preview_app.html');
inspect('index.html');
inspect('EmergereApp/EmergereApp/preview_app.html');
inspect('EmergereApp/EmergereApp/index.html');
