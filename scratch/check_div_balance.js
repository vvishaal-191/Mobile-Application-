const fs = require('fs');
for (const file of ['index.html', 'EmergereApp/EmergereApp/index.html', 'preview_app.html', 'EmergereApp/EmergereApp/preview_app.html']) {
  const content = fs.readFileSync(file, 'utf8');
  const start = content.indexOf('<template id="tpl-ApplyPermission">');
  const end = content.indexOf('</template>', start);
  const tpl = content.substring(start, end);
  
  const openDivs = (tpl.match(/<div[\s>]/g) || []).length;
  const closeDivs = (tpl.match(/<\/div>/g) || []).length;
  console.log(file, 'openDivs:', openDivs, 'closeDivs:', closeDivs, openDivs === closeDivs ? 'BALANCED' : 'MISMATCH');
}
