const fs = require('fs');
const c = fs.readFileSync('preview_app.html', 'utf8');
const start = c.indexOf('<template id="tpl-LeaveApprovalDetail">');
const end = c.indexOf('</template>', start);
const lad = c.substring(start, end);
console.log('LAD length:', lad.length);
const scriptMatches = lad.match(/<script[\s\S]*?<\/script>/g);
if (scriptMatches) {
  scriptMatches.forEach((s, i) => {
    console.log(`=== LAD SCRIPT ${i} ===`);
    console.log(s);
  });
} else {
  console.log('No scripts found in LAD');
}
