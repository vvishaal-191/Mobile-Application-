const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');

const p = content.indexOf("currentTpl === 'tpl-ManagerDashboard'");
if (p !== -1) {
  console.log(content.substring(p, p + 2500));
} else {
  console.log("currentTpl === 'tpl-ManagerDashboard' not found, searching for tpl-ManagerDashboard in loadScreen");
  let pos = content.indexOf('function loadScreen(');
  while ((pos = content.indexOf('tpl-ManagerDashboard', pos)) !== -1) {
    console.log('at pos:', pos);
    console.log(content.substring(pos - 50, pos + 200));
    pos += 20;
  }
}
