const fs = require('fs');
const { applyHtmlFixes } = require('./apply_html_fixes_mod');
const html = fs.readFileSync('index.html', 'utf8');
const transformed = applyHtmlFixes(html);
const lines = transformed.split('\n');

console.log('--- Search for Team Calendar in transformed ---');
lines.forEach((l, i) => {
  if (l.includes('Team Calendar')) console.log((i+1) + ': ' + l.trim());
});

console.log('--- Search for tab-dashboard in ApplyPermission ---');
let inPerm = false;
lines.forEach((l, i) => {
  if (l.includes('<template id="tpl-ApplyPermission"')) inPerm = true;
  if (inPerm && l.includes('</template>')) inPerm = false;
  if (inPerm && (l.includes('tab-dashboard') || l.includes('perm-back-btn') || l.includes('back-btn'))) {
    console.log((i+1) + ': ' + l.trim());
  }
});
