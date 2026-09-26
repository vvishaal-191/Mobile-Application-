const fs = require('fs');

const newTpl = fs.readFileSync('scratch/assembled_new_la_tpl.html', 'utf8').trim();

const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

files.forEach(filepath => {
  if (!fs.existsSync(filepath)) {
    console.log(filepath, 'not found');
    return;
  }
  const content = fs.readFileSync(filepath, 'utf8');
  const targetStart = '<template id="tpl-LeaveApprovals">';
  const idx = content.indexOf(targetStart);
  if (idx === -1) {
    console.log(filepath, 'template targetStart not found');
    return;
  }
  const endIdx = content.indexOf('</template>', idx);
  if (endIdx === -1) {
    console.log(filepath, 'closing template tag not found');
    return;
  }

  // Check what prefix we have in newTpl
  // newTpl starts with id="tpl-LeaveApprovals"> or <template id="tpl-LeaveApprovals">
  let replacement = newTpl;
  if (!replacement.startsWith('<template')) {
    replacement = '<template ' + replacement;
  }

  const updated = content.substring(0, idx) + replacement + content.substring(endIdx + 11);
  fs.writeFileSync(filepath, updated, 'utf8');
  console.log('Successfully updated', filepath, 'new size:', updated.length);
});
