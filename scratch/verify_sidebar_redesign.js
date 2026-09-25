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

const NAV_LABELS = [
  'Employee Dashboard',
  'My Attendance',
  'Apply Leave',
  'Apply Permission',
  'Leave Balance',
  'My Requests (History)',
  'Holiday Calendar',
  'Notifications',
  'My Profile'
];

htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');

  // Find tpl-EmployeeDashboard
  const tplIdx = content.indexOf('id="tpl-EmployeeDashboard"');
  assert(`${f}: tpl-EmployeeDashboard exists`, tplIdx !== -1);
  const nextTplIdx = content.indexOf('id="tpl-MyAttendance"', tplIdx);
  const tpl = content.slice(tplIdx, nextTplIdx);

  assert(`${f}: sidebar-overlay exists`, tpl.includes('class="sidebar-overlay"'));
  assert(`${f}: sidebar-drawer exists`, tpl.includes('class="sidebar-drawer"'));
  assert(`${f}: sidebar-bg-waves exists`, tpl.includes('class="sidebar-bg-waves"'));
  assert(`${f}: sidebar-close-btn exists with stroke #FFFFFF`, tpl.includes('class="sidebar-close-btn"') && tpl.includes('stroke="#FFFFFF"'));
  assert(`${f}: sidebar-profile-card exists`, tpl.includes('class="sidebar-profile-card"'));
  assert(`${f}: sidebar-avatar-circle exists`, tpl.includes('class="sidebar-avatar-circle"'));
  assert(`${f}: sidebar-logout-btn exists with Log Out`, tpl.includes('class="sidebar-logout-btn"') && tpl.includes('Log Out'));
  assert(`${f}: Employee Dashboard has active class matching Image 2`, tpl.includes('class="sidebar-nav-item active"') && tpl.includes('Employee Dashboard'));

  NAV_LABELS.forEach(label => {
    assert(`${f}: nav item '${label}' exists with icon box & chevron`, 
      tpl.includes(label) && 
      tpl.includes('class="sidebar-item-icon-box"') && 
      tpl.includes('class="sidebar-item-chevron"')
    );
  });

  // Verify navigation functions
  assert(`${f}: openSidebarDrawer function exists`, tpl.includes('function openSidebarDrawer()'));
  assert(`${f}: closeSidebarDrawer function exists`, tpl.includes('function closeSidebarDrawer()'));
  assert(`${f}: handleSidebarNav function exists`, tpl.includes('function handleSidebarNav(screenId)'));
  assert(`${f}: handleSidebarLogout function exists`, tpl.includes('function handleSidebarLogout()'));
});

// Check EmployeeDashboard/preview.html
const edPrevHtml = fs.readFileSync('EmergereApp/EmergereApp/src/screens/EmployeeDashboard/preview.html', 'utf8');
assert('EmployeeDashboard/preview.html: sidebar-bg-waves exists', edPrevHtml.includes('class="sidebar-bg-waves"'));
assert('EmployeeDashboard/preview.html: sidebar-profile-card exists', edPrevHtml.includes('class="sidebar-profile-card"'));
NAV_LABELS.forEach(label => {
  assert(`EmployeeDashboard/preview.html: nav item '${label}' exists with icon box`, edPrevHtml.includes(label) && edPrevHtml.includes('class="sidebar-item-icon-box"'));
});

// Check EmployeeDashboard/preview.css
const edPrevCss = fs.readFileSync('EmergereApp/EmergereApp/src/screens/EmployeeDashboard/preview.css', 'utf8');
assert('EmployeeDashboard/preview.css: 28px radius present', edPrevCss.includes('border-top-right-radius: 28px;\n          border-bottom-right-radius: 28px;'));
assert('EmployeeDashboard/preview.css: active item #DCE9FE present', edPrevCss.includes('.sidebar-nav-item.active {\n          background: #DCE9FE !important;'));
assert('EmployeeDashboard/preview.css: icon box present', edPrevCss.includes('.sidebar-item-icon-box {'));

// Check EmployeeDashboardScreen.jsx
const edJsx = fs.readFileSync('EmergereApp/EmergereApp/src/screens/EmployeeDashboard/EmployeeDashboardScreen.jsx', 'utf8');
assert('EmployeeDashboardScreen.jsx: sidebarItemIconBoxActive present', edJsx.includes('styles.sidebarItemIconBoxActive'));
assert('EmployeeDashboardScreen.jsx: sidebarNavItemActive present', edJsx.includes('styles.sidebarNavItemActive'));
NAV_LABELS.forEach(label => {
  assert(`EmployeeDashboardScreen.jsx: label '${label}' present`, edJsx.includes(label));
});

// Check EmployeeDashboardScreen.styles.js
const edStyles = fs.readFileSync('EmergereApp/EmergereApp/src/screens/EmployeeDashboard/EmployeeDashboardScreen.styles.js', 'utf8');
assert('EmployeeDashboardScreen.styles.js: borderTopRightRadius: 28 present', edStyles.includes('borderTopRightRadius: 28'));
assert('EmployeeDashboardScreen.styles.js: sidebarItemIconBoxActive present', edStyles.includes('sidebarItemIconBoxActive: {'));
assert('EmployeeDashboardScreen.styles.js: sidebarNavItemActive present', edStyles.includes('sidebarNavItemActive: {'));

// Validate SVG paths
htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const pathRegex = /<path[^>]+d=["']([^"']+)["']/g;
  let m;
  let count = 0;
  while ((m = pathRegex.exec(content)) !== null) {
    count++;
    const d = m[1];
    const sMatch = d.match(/s([^a-z]+)z/i);
    if (sMatch) {
      const sArgs = sMatch[1].trim().split(/[\s,-]+/).filter(Boolean);
      assert(`${f} path ${count} has valid s coordinates`, sArgs.length % 4 === 0);
    }
  }
  console.log(`Validated ${count} SVG paths in ${f}: all clean!`);
});

console.log('\n*** ALL SIDEBAR REDESIGN VERIFICATIONS PASSED! ***');
