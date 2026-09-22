const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');
const start = content.indexOf('id="tpl-HolidayCalendar"');
const end = content.indexOf('</template>', start);
const tpl = content.slice(start, end);

const scripts = tpl.match(/<script[\s\S]*?<\/script>/gi) || [];
scripts.forEach((s, idx) => {
  console.log(`Script ${idx + 1}:`, s.slice(0, 300));
});
