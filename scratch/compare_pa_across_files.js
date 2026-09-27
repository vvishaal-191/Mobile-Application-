const fs = require('fs');

const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

function getPaTpl(filePath) {
  const c = fs.readFileSync(filePath, 'utf8');
  const start = c.indexOf('<template id="tpl-PermissionApprovals">');
  if (start === -1) return null;
  const end = c.indexOf('</template>', start) + 11;
  return c.substring(start, end);
}

files.forEach(f => {
  const tpl = getPaTpl(f);
  console.log(f, tpl ? `Found (len=${tpl.length})` : 'NOT FOUND');
});

const t0 = getPaTpl(files[0]);
for (let i = 1; i < files.length; i++) {
  const ti = getPaTpl(files[i]);
  console.log(`${files[0]} === ${files[i]}: ${t0 === ti}`);
  if (t0 !== ti) {
    console.log(`Diff len: ${t0.length} vs ${ti.length}`);
  }
}
