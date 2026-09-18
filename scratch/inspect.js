const fs = require('fs');

const content = fs.readFileSync('EmergereApp/EmergereApp/preview_app.html', 'utf8');
const idx = content.indexOf("if (currentTpl === 'tpl-ManagerDashboard')");
console.log(content.slice(idx + 3500, idx + 6000));
