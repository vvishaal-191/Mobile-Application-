const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('<template id="tpl-HolidayCalendar">');
const end = html.indexOf('</template>', start);
const tpl = html.substring(start, end);

const lines = tpl.split('\n');
lines.forEach((l, i) => {
  if (l.includes('hc-header-title') || l.includes('header-title') || l.includes('Holiday Calendar')) {
    console.log(i, ':', l.trim().slice(0, 140));
  }
});
