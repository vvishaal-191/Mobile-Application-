const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');
const start = content.indexOf('id="tpl-HolidayCalendar"');
const end = content.indexOf('</template>', start);
const tpl = content.slice(start, end);

const activeIdx = tpl.indexOf('<div class="tab active">');
if (activeIdx !== -1) {
  console.log(JSON.stringify(tpl.slice(activeIdx, activeIdx + 350)));
}
