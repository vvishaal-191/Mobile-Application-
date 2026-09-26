const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

let start = 0, end = 0;
lines.forEach((l, i) => {
  if (l.includes('<template id="tpl-HolidayCalendar"')) start = i;
  if (start > 0 && end === 0 && i > start && l.includes('</template>')) end = i;
});
console.log('start:', start + 1, 'end:', end + 1);
lines.slice(end - 45, end + 1).forEach((l, i) => console.log((end - 44 + i) + ': ' + l));
