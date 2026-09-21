const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, idx) => {
  if (l.includes('id="tpl-EmployeeDashboard"')) {
    console.log('Template on line:', idx + 1);
    for (let k = idx; k < idx + 400; k++) {
      if (lines[k].includes('brand') || lines[k].includes('dash-top') || lines[k].includes('<img')) {
        console.log(k + 1, lines[k].slice(0, 100));
      }
    }
  }
});
