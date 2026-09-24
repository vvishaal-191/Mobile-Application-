const fs = require('fs');

const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  let start = -1;
  let end = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('<template id="tpl-LeaveBalance">')) {
      start = i + 1;
    }
    if (start !== -1 && lines[i].includes('</template>') && i + 1 > start) {
      end = i + 1;
      break;
    }
  }
  console.log(`${f}: start = ${start}, end = ${end}, total lines = ${lines.length}`);
});
