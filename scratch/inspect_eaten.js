const cp = require('child_process');

const content691 = cp.execSync('git show 691e417:index.html', { maxBuffer: 20 * 1024 * 1024 }).toString();
const tplEmpStart = content691.indexOf('<template id="tpl-EmployeeDashboard">');
const tplEmpEnd = content691.indexOf('</template>', tplEmpStart);
console.log('tpl-EmployeeDashboard in 691e417 starts at:', tplEmpStart, 'ends at:', tplEmpEnd, 'length:', tplEmpEnd - tplEmpStart);

// Let's check how tpl-Login ended in 691e417
const tplLoginStart = content691.indexOf('<template id="tpl-Login">');
const firstEndTpl = content691.indexOf('</template>', tplLoginStart);
console.log('First </template> after tpl-Login is at:', firstEndTpl);
console.log('Is firstEndTpl BEFORE tplEmpStart?', firstEndTpl < tplEmpStart);
