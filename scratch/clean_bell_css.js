const fs = require('fs');

const cssPath = 'EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.css';
if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');
  css = css.replace(/\.mgr-bell-btn[\s\S]*?\.mgr-bell-dot[^{]*\{[\s\S]*?\}/, '');
  fs.writeFileSync(cssPath, css, 'utf8');
  console.log('[OK] Cleaned bell CSS from preview.css');
}

const appFiles = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

appFiles.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');
  const tplStart = content.indexOf('<template id="tpl-ManagerDashboard">');
  if (tplStart !== -1) {
    const tplEnd = content.indexOf('</template>', tplStart);
    let mgrTpl = content.substring(tplStart, tplEnd);
    mgrTpl = mgrTpl.replace(/\.mgr-bell-btn[\s\S]*?\.mgr-bell-dot[^{]*\{[\s\S]*?\}/, '');
    mgrTpl = mgrTpl.replace(/\.mgr-bell-btn:focus-visible[\s\S]*?,/, '');
    mgrTpl = mgrTpl.replace(/,\s*\.mgr-bell-btn:focus-visible/, '');
    content = content.substring(0, tplStart) + mgrTpl + content.substring(tplEnd);
    fs.writeFileSync(f, content, 'utf8');
    console.log('[OK] Cleaned bell CSS from', f);
  }
});
