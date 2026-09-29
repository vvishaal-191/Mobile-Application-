const cp = require('child_process');

['f48a693', '3d4cc1e', '691e417', '8361d26', '4ed5a86', 'HEAD'].forEach(c => {
  try {
    const out = cp.execSync('git show ' + c + ':index.html', { maxBuffer: 20 * 1024 * 1024 }).toString();
    console.log(c, 'has tpl-EmployeeDashboard:', out.includes('id="tpl-EmployeeDashboard"'));
  } catch(e) {
    console.log(c, 'error', e.message);
  }
});
