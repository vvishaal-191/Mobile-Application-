const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('<template id="tpl-HolidayCalendar">');
const end = html.indexOf('</template>', start);
const tpl = html.substring(start, end);
const lines = tpl.split('\n');
lines.forEach((l, i) => {
  if (l.includes('bottom-nav') || l.includes('nav-tab') || l.includes('tab-history') || l.includes('tab-dashboard') || l.includes('active')) {
    if (l.includes('class=') || l.includes('id=') || l.includes('div') || l.includes('span')) {
      console.log(i, ':', l.trim().slice(0, 140));
    }
  }
});
