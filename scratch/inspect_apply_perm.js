const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

let start = 0, end = 0;
lines.forEach((l, i) => {
  if (l.includes('<template id="tpl-ApplyPermission"')) start = i;
  if (start > 0 && end === 0 && i > start && l.includes('</template>')) end = i;
});
console.log('ApplyPermission lines:', start + 1, 'to', end + 1);

for (let i = start; i < end; i++) {
  const l = lines[i];
  if (l.includes('.screen') || l.includes('.perm-submit-btn') || l.includes('Submit Request') || l.includes('.perm-form-card') || l.includes('.bottom-nav')) {
    console.log((i+1) + ': ' + l);
  }
}
