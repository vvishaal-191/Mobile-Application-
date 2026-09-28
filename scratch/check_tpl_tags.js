const fs = require('fs');
const html = fs.readFileSync('preview_app.html', 'utf8');

const start = html.indexOf('<template id="tpl-Login">');
const nextTpl = html.indexOf('<template id="tpl-MyAttendance">');
console.log('start:', start, 'nextTpl:', nextTpl);

// Find </template> between start and nextTpl
let end = html.indexOf('</template>', start);
console.log('end:', end);
while (end !== -1 && end < nextTpl) {
  console.log('Found </template> at:', end);
  end = html.indexOf('</template>', end + 1);
}
