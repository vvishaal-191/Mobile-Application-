const fs = require('fs');

const content = fs.readFileSync('preview_app.html', 'utf8');
const idx = content.indexOf('id="tpl-LeaveHistory"');
if (idx !== -1) {
  const end = content.indexOf('</template>', idx);
  console.log('tpl-LeaveHistory found at', idx, 'end at', end, 'length:', end - idx);
  const tpl = content.substring(idx, end);
  const scriptIdx = tpl.indexOf('<script>');
  console.log('Tpl start snippet:');
  console.log(tpl.substring(0, 500));
  if (scriptIdx !== -1) {
    console.log('Script snippet:');
    console.log(tpl.substring(scriptIdx, scriptIdx + 800));
  }
} else {
  console.log('tpl-LeaveHistory not found!');
}
