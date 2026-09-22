const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');
const start = content.indexOf('id="tpl-HolidayCalendar"');
const end = content.indexOf('</template>', start);
const tpl = content.slice(start, end);

const match = tpl.indexOf('<div class="bottom-nav">');
if (match !== -1) {
  console.log(tpl.slice(match, match + 2500));
}
