const fs = require('fs');

const content = fs.readFileSync('scratch/current_mgr_tpl_inspect.html', 'utf8');

const scriptMatches = content.match(/<script[\s\S]*?<\/script>/gi);
console.log('Script count in mgrTpl:', scriptMatches ? scriptMatches.length : 0);

if (scriptMatches) {
  scriptMatches.forEach((s, i) => {
    console.log(`=== SCRIPT ${i+1} (${s.length} chars) ===`);
    console.log(s.substring(0, 800));
    console.log('...');
    console.log(s.substring(s.length - 800));
  });
}
