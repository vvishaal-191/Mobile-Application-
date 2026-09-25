const fs = require('fs');
const http = require('http');

let allPassed = true;

function assert(condition, message) {
  if (condition) {
    console.log('  PASS:', message);
  } else {
    console.error('  FAIL:', message);
    allPassed = false;
  }
}

console.log('=== 1. Checking HTML Templates ===');
const htmlFiles = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

htmlFiles.forEach((file) => {
  console.log(`Checking ${file}...`);
  const content = fs.readFileSync(file, 'utf8');
  const start = content.indexOf('id="tpl-ManagerDashboard"');
  assert(start !== -1, 'Template tpl-ManagerDashboard exists');
  const end = content.indexOf('</template>', start);
  assert(end !== -1, 'Template has closing tag');
  const tpl = content.slice(start, end);

  assert(/class="qbadge" id="manager-dash-leave-badge">[0-9]+/.test(tpl), 'Leave badge regex matches exact pattern');
  assert(/class="qbadge" id="manager-dash-perm-badge">[0-9]+/.test(tpl), 'Perm badge regex matches exact pattern');
  assert(tpl.includes('id="mgr-dash-requests-label"'), 'Requests label id exists');
  assert(tpl.includes('id="mgr-dash-requests-list"'), 'Requests list id exists');
  assert(!/view\s*all/i.test(tpl), '"View All" does NOT exist in template');
  assert(tpl.includes('class="hamburger-btn"'), 'Hamburger button exists');
  assert(tpl.includes('openSidebarDrawer()'), 'openSidebarDrawer() call exists');
  assert(tpl.includes('id="sidebar-overlay"'), 'Sidebar overlay exists');
  assert(tpl.includes('MANAGER'), 'Role badge MANAGER exists');
  assert(tpl.includes('Rahul Sharma'), 'Manager name Rahul Sharma exists');
});

console.log('\n=== 2. Checking Standalone Preview Files ===');
const previewHtml = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html', 'utf8');
assert(!/view\s*all/i.test(previewHtml), 'Standalone preview does NOT contain "View All"');
assert(previewHtml.includes('class="hamburger-btn"'), 'Standalone preview has hamburger-btn');
assert(previewHtml.includes('openSidebarDrawer()'), 'Standalone preview has openSidebarDrawer()');
assert(previewHtml.includes('id="manager-dash-leave-badge"'), 'Standalone preview has leave badge');
assert(previewHtml.includes('id="manager-dash-perm-badge"'), 'Standalone preview has perm badge');

console.log('\n=== 3. Checking React Native Screen Files ===');
const jsx = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/ManagerDashboardScreen.jsx', 'utf8');
assert(!/view\s*all/i.test(jsx), 'React Native JSX does NOT contain "View All"');
assert(jsx.includes('setSidebarVisible(true)'), 'React Native hamburger opens sidebar modal');
assert(jsx.includes('Rahul Sharma'), 'React Native has Rahul Sharma');
assert(jsx.includes('MANAGER'), 'React Native has MANAGER badge');

console.log('\n=== 4. Checking HTTP Server Endpoints ===');
const urls = [
  'http://localhost:3000/index.html',
  'http://localhost:3000/preview_app.html',
  'http://localhost:3000/EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html'
];

let checked = 0;
urls.forEach((url) => {
  http.get(url, (res) => {
    assert(res.statusCode === 200, `HTTP GET ${url} returned ${res.statusCode}`);
    checked++;
    if (checked === urls.length) {
      console.log('\n================================');
      if (allPassed) {
        console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY!');
      } else {
        console.error('SOME CHECKS FAILED!');
        process.exit(1);
      }
    }
  }).on('error', (e) => {
    console.error(`HTTP GET ${url} error:`, e.message);
    allPassed = false;
    checked++;
    if (checked === urls.length) process.exit(1);
  });
});
