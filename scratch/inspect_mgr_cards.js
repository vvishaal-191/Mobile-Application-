const fs = require('fs');
const c = fs.readFileSync('preview_app.html', 'utf8');
const mgrIdx = c.indexOf('id="tpl-ManagerDashboard"');
const nextTpl = c.indexOf('</template>', mgrIdx);
const mgrContent = c.substring(mgrIdx, nextTpl);

const lines = mgrContent.split('\n');
lines.forEach((l, i) => {
  if (/approved|rejected|pending requests|request detail|quick actions/i.test(l) && !l.includes('base64')) {
    console.log((i + 1) + ': ' + l.trim());
  }
});
