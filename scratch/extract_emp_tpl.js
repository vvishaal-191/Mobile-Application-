const fs = require('fs');
const cp = require('child_process');

const content691 = cp.execSync('git show 691e417:index.html', { maxBuffer: 50 * 1024 * 1024 }).toString();
const start = content691.indexOf('<template id="tpl-EmployeeDashboard">');
const end = content691.indexOf('</template>', start) + '</template>'.length;
const tplEmp = content691.substring(start, end);

fs.writeFileSync('scratch/tpl_employee_dashboard_restored.html', tplEmp, 'utf8');
console.log('Saved scratch/tpl_employee_dashboard_restored.html, size:', tplEmp.length);
