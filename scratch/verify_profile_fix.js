const fs = require('fs');
const path = require('path');

function assert(msg, condition) {
  if (!condition) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  } else {
    console.log(`PASS: ${msg}`);
  }
}

const htmlFiles = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');

  // Check button onclick in sidebar
  assert(`${f}: sidebar nav has onclick="handleSidebarNav('tpl-MyProfile')"`, 
    content.includes(`<button class="sidebar-nav-item" onclick="handleSidebarNav('tpl-MyProfile')">`));
  assert(`${f}: no old onclick="handleSidebarNav('tpl-Profile')"`, 
    !content.includes(`onclick="handleSidebarNav('tpl-Profile')"`));

  // Check handleSidebarNav normalization
  assert(`${f}: handleSidebarNav normalizes tpl-Profile`, 
    content.includes(`if (screenId === 'tpl-Profile' || screenId === 'Profile')`));

  // Check loadScreen normalization
  assert(`${f}: loadScreen normalizes tpl-Profile`, 
    content.includes(`if (tplId === 'tpl-Profile' || tplId === 'Profile')`));

  // Check EMPLOYEE_ALLOWED_SCREENS has tpl-MyProfile and tpl-Profile
  assert(`${f}: EMPLOYEE_ALLOWED_SCREENS includes tpl-MyProfile`, 
    content.includes(`'tpl-MyProfile'`) && content.includes(`'tpl-Profile'`));

  // Check template exists
  assert(`${f}: template id="tpl-MyProfile" exists`, content.includes(`id="tpl-MyProfile"`));
});

// Check EmployeeDashboard/preview.html
const edPrevHtml = fs.readFileSync('EmergereApp/EmergereApp/src/screens/EmployeeDashboard/preview.html', 'utf8');
assert('EmployeeDashboard/preview.html: uses tpl-MyProfile', 
  edPrevHtml.includes(`handleSidebarNav('../MyProfile/preview.html', 'tpl-MyProfile')`));
assert('EmployeeDashboard/preview.html: no old tpl-Profile', 
  !edPrevHtml.includes(`handleSidebarNav('../Profile/preview.html', 'tpl-Profile')`));

// Check EmployeeDashboard/preview.js
const edPrevJs = fs.readFileSync('EmergereApp/EmergereApp/src/screens/EmployeeDashboard/preview.js', 'utf8');
assert('EmployeeDashboard/preview.js: normalizes tpl-Profile to tpl-MyProfile', 
  edPrevJs.includes(`tplId = 'tpl-MyProfile'`) && edPrevJs.includes(`href = '../MyProfile/preview.html'`));

console.log('\n*** ALL PROFILE FIX VERIFICATIONS PASSED! ***');
