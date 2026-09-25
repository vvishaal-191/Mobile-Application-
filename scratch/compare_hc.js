const fs = require('fs');

function getTpl(path) {
  const content = fs.readFileSync(path, 'utf8');
  const start = content.indexOf('id="tpl-HolidayCalendar"');
  if (start === -1) return null;
  const end = content.indexOf('id="tpl-Notifications"', start);
  return content.slice(start, end !== -1 ? end : start + 5000);
}

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

files.forEach(f => {
  const tpl = getTpl(f);
  console.log(f, tpl ? `Found, length ${tpl.length}` : 'NOT found');
});

const t1 = getTpl(files[0]);
const t2 = getTpl(files[1]);
console.log('index vs preview_app match:', t1 === t2);
