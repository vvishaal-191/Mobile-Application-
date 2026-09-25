const fs = require('fs');

const tpl = fs.readFileSync('scratch/current_lad_tpl.html', 'utf8');
const scriptMatches = tpl.match(/<script[\s\S]*?<\/script>/g);
if (scriptMatches) {
  scriptMatches.forEach((s, i) => {
    console.log(`=== SCRIPT ${i+1} (${s.length} chars) ===`);
    console.log(s.substring(0, 500));
    console.log('...');
    console.log(s.substring(s.length - 500));
  });
}
