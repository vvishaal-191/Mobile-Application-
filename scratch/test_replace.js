const fs = require('fs');
const { tplContent } = require('./build_template');

const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log('File does not exist:', file);
    return;
  }
  const content = fs.readFileSync(file, 'utf8');
  const startTag = '<template id="tpl-EmployeeDashboard">';
  const start = content.indexOf(startTag);
  if (start === -1) {
    console.error('Could not find start in', file);
    return;
  }
  const end = content.indexOf('</template>', start) + '</template>'.length;
  console.log(file, ': start =', start, ', end =', end, ', old len =', end - start, ', new len =', tplContent.length);
});
