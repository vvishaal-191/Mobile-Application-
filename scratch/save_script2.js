const fs = require('fs');

const tpl = fs.readFileSync('scratch/current_lad_tpl.html', 'utf8');
const scriptMatches = tpl.match(/<script[\s\S]*?<\/script>/g);
if (scriptMatches && scriptMatches.length >= 2) {
  fs.writeFileSync('scratch/current_lad_script2.js', scriptMatches[1]);
  console.log('Wrote scratch/current_lad_script2.js, length:', scriptMatches[1].length);
}
