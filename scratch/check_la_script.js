const fs = require('fs');
const c = fs.readFileSync('preview_app.html', 'utf8');
const laStart = c.indexOf('<template id="tpl-LeaveApprovals">');
const laEnd = c.indexOf('</template>', laStart);
const la = c.substring(laStart, laEnd);
const scripts = la.split('<script>');
console.log('Number of scripts:', scripts.length);
scripts.forEach((s, i) => {
  if (i > 0) {
    console.log(`=== SCRIPT ${i} ===`);
    console.log(s.split('</script>')[0]);
  }
});
