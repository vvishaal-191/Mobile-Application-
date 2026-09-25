const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    const startIdx = content.indexOf('<template id="tpl-LeaveHistory">');
    const endIdx = content.indexOf('</template>', startIdx);
    console.log(`${f}: start=${startIdx}, end=${endIdx}, len=${content.length}`);
  } else {
    console.log(`${f}: NOT FOUND`);
  }
});
