const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const start = html.indexOf('<template id="tpl-ManagerDashboard">');
const end = html.indexOf('</template>', start);
const tpl = html.substring(start, end);

const scriptMatches = [...tpl.matchAll(/<script[\s\S]*?<\/script>/gi)];
console.log('Number of scripts in tpl-ManagerDashboard:', scriptMatches.length);
scriptMatches.forEach((s, idx) => {
  console.log(`\n=== Script ${idx+1} (length: ${s[0].length}) ===`);
  console.log(s[0].slice(0, 500));
  console.log('...\n' + s[0].slice(-500));
});
