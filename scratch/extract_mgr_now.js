const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const mgrStart = content.indexOf('id="tpl-ManagerDashboard"');
const mgrEnd = content.indexOf('</template>', mgrStart);
const mgrTpl = content.substring(mgrStart, mgrEnd);

// Save to scratch for analysis
fs.writeFileSync('scratch/current_mgr_tpl_inspect.html', mgrTpl);
console.log('Saved scratch/current_mgr_tpl_inspect.html, length:', mgrTpl.length);
