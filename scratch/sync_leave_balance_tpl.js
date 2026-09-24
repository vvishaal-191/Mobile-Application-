const fs = require('fs');

const newTpl = fs.readFileSync('scratch/new_leave_balance_tpl.html', 'utf8').trim();

const targetFiles = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

targetFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  const tplStartStr = '<template id="tpl-LeaveBalance">';
  const tplEndStr = '</template>';
  const startIdx = content.indexOf(tplStartStr);
  if (startIdx === -1) {
    console.error(`Error: Could not find ${tplStartStr} in ${file}`);
    return;
  }
  const endIdx = content.indexOf(tplEndStr, startIdx);
  if (endIdx === -1) {
    console.error(`Error: Could not find ${tplEndStr} in ${file}`);
    return;
  }

  const before = content.slice(0, startIdx);
  const after = content.slice(endIdx + tplEndStr.length);
  content = before + newTpl + after;

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Successfully updated tpl-LeaveBalance in ${file}`);
});
