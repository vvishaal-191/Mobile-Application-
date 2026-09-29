const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
console.log('Before count of templates:');
const beforeMatches = content.match(/<template\s+id=["']([^"']+)["']/g) || [];
console.log(beforeMatches.map(m => m.replace(/<template\s+id=/, '').replace(/["']/g, '')));

console.log('Has tpl-EmployeeDashboard:', content.includes('id="tpl-EmployeeDashboard"'));
console.log('Has tpl-ManagerDashboard:', content.includes('id="tpl-ManagerDashboard"'));
console.log('Has tpl-Login:', content.includes('id="tpl-Login"'));
