const cp = require('child_process');

const content691 = cp.execSync('git show 691e417:index.html', { maxBuffer: 50 * 1024 * 1024 }).toString();
const start = content691.indexOf('<template id="tpl-EmployeeDashboard">');
const end = content691.indexOf('</template>', start) + '</template>'.length;
const tplEmp = content691.substring(start, end);

console.log('Found tpl-EmployeeDashboard in 691e417, length:', tplEmp.length);
console.log('Starts with:', tplEmp.substring(0, 200));
console.log('Ends with:', tplEmp.substring(tplEmp.length - 200));

// Also check the sidebar button in 691e417
const btnStart = content691.indexOf('<button class="nav-btn" data-tpl="tpl-EmployeeDashboard">');
console.log('Sidebar button exists in 691e417:', btnStart !== -1);
if (btnStart !== -1) {
  console.log(content691.substring(btnStart, btnStart + 150));
}
