const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '..', 'preview_app.html'),
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'preview_app.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'index.html'),
];

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log('NOT FOUND:', f);
    return;
  }
  const content = fs.readFileSync(f, 'utf8');
  const tplStart = content.indexOf('<template id="tpl-MyProfile">');
  const tplEnd = tplStart !== -1 ? content.indexOf('</template>', tplStart) : -1;
  console.log(f, {
    size: content.length,
    tplStart,
    tplEnd,
    tplLen: tplEnd - tplStart
  });
});
