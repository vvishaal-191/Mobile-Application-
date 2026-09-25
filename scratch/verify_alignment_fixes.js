const fs = require('fs');
const http = require('http');

let allPassed = true;
function assert(cond, msg) {
  if (cond) {
    console.log('  PASS:', msg);
  } else {
    console.error('  FAIL:', msg);
    allPassed = false;
  }
}

console.log('=== 1. Checking base.css ===');
const baseCss = fs.readFileSync('EmergereApp/EmergereApp/preview/base.css', 'utf8');
assert(baseCss.includes('.has-mgr-header'), 'base.css includes .has-mgr-header in padding-top: 0 rule');
assert(baseCss.includes('.mgr-header'), 'base.css includes .mgr-header in banner reset rule');

console.log('\n=== 2. Checking HTML Template Files ===');
const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

files.forEach(f => {
  console.log(`Checking ${f}...`);
  const c = fs.readFileSync(f, 'utf8');

  // Check global style exclusion
  assert(c.includes(':not(.has-mgr-header):not(:has(.mgr-header))'), 'Global style excludes mgr-header from 16px padding');
  assert(c.includes('.screen.has-mgr-header'), 'Global style includes .screen.has-mgr-header for 0px padding');
  assert(c.includes('.mgr-header'), 'Global style includes .mgr-header in banner reset');

  // Check template content
  const start = c.indexOf('id="tpl-ManagerDashboard"');
  const end = c.indexOf('</template>', start);
  const tpl = c.slice(start, end);

  assert(tpl.includes('<div class="screen has-mgr-header">'), 'Template uses class="screen has-mgr-header"');
  assert(tpl.includes('border-bottom-left-radius: 28px'), 'Banner has border-bottom-left-radius: 28px');
  assert(tpl.includes('border-bottom-right-radius: 28px'), 'Banner has border-bottom-right-radius: 28px');
  assert(/class="qbadge" id="manager-dash-leave-badge">[0-9]+/.test(tpl), 'Leave badge regex matches');
  assert(/class="qbadge" id="manager-dash-perm-badge">[0-9]+/.test(tpl), 'Perm badge regex matches');
  assert(tpl.includes('id="mgr-dash-requests-label"'), 'Requests label exists');
  assert(tpl.includes('id="mgr-dash-requests-list"'), 'Requests list exists');
  assert(!/view\s*all/i.test(tpl), 'No View All in template');
  assert(tpl.includes('preserveAspectRatio="none"'), 'SVG wave uses preserveAspectRatio="none" for clean scaling');
});

console.log('\n=== 3. Checking Standalone Preview ===');
const prevHtml = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html', 'utf8');
assert(prevHtml.includes('class="screen has-mgr-header"'), 'preview.html uses has-mgr-header');
assert(!/view\s*all/i.test(prevHtml), 'preview.html has no View All');

const prevCss = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.css', 'utf8');
assert(prevCss.includes('padding-top: 0 !important;'), 'preview.css sets padding-top: 0');
assert(prevCss.includes('border-bottom-left-radius: 28px'), 'preview.css has border-bottom-left-radius: 28px');

console.log('\n=== 4. Checking React Native Screen ===');
const stylesJs = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/ManagerDashboardScreen.styles.js', 'utf8');
assert(stylesJs.includes('borderBottomLeftRadius: 28'), 'styles.js has borderBottomLeftRadius: 28');
assert(stylesJs.includes('borderBottomRightRadius: 28'), 'styles.js has borderBottomRightRadius: 28');
assert(stylesJs.includes('borderTopLeftRadius: 0'), 'styles.js has borderTopLeftRadius: 0');
assert(stylesJs.includes('borderTopRightRadius: 0'), 'styles.js has borderTopRightRadius: 0');

console.log('\n=== 5. Checking HTTP Server Endpoints ===');
const urls = [
  'http://localhost:3000/index.html',
  'http://localhost:3000/preview_app.html',
  'http://localhost:3000/EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html',
  'http://localhost:3000/scratch/test_manager_dashboard_aligned.html'
];

let done = 0;
urls.forEach(u => {
  http.get(u, res => {
    assert(res.statusCode === 200, `HTTP GET ${u} returned ${res.statusCode}`);
    done++;
    if (done === urls.length) {
      console.log('\n================================');
      if (allPassed) {
        console.log('ALL ALIGNMENT & BALANCE CHECKS PASSED PERFECTLY!');
      } else {
        console.error('SOME CHECKS FAILED!');
        process.exit(1);
      }
    }
  }).on('error', e => {
    console.error('HTTP error on ' + u, e.message);
    allPassed = false;
    done++;
    if (done === urls.length) process.exit(1);
  });
});
