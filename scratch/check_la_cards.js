const fs = require('fs');
const c = fs.readFileSync('preview_app.html', 'utf8');
const laStart = c.indexOf('<template id="tpl-LeaveApprovals">');
const laEnd = c.indexOf('</template>', laStart);
const la = c.substring(laStart, laEnd);

const regex = /<div class="approval-card[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/g;
let m;
let count = 0;
while ((m = regex.exec(la)) !== null) {
  count++;
  console.log(`--- Card ${count} ---`);
  console.log(m[0].slice(0, 300));
}
console.log('Total approval cards:', count);
