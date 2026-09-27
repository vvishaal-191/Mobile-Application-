const fs = require('fs');

const pApp = fs.readFileSync('preview_app.html', 'utf8');

// Find EMP_LEAVE_REQUESTS definition
const idx = pApp.indexOf('window.EMP_LEAVE_REQUESTS =');
if (idx !== -1) {
  console.log('window.EMP_LEAVE_REQUESTS definition:');
  console.log(pApp.substring(idx, idx + 1000));
} else {
  console.log('window.EMP_LEAVE_REQUESTS = not found');
}

// Find any other initial leave requests
const m = pApp.match(/EMP_LEAVE_REQUESTS\s*=\s*\[[\s\S]*?\];/);
if (m) {
  console.log('\nFound EMP_LEAVE_REQUESTS array:');
  console.log(m[0].slice(0, 1000));
}
