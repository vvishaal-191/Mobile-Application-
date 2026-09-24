const fs = require('fs');

let allPassed = true;

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    allPassed = false;
  } else {
    console.log('PASS:', message);
  }
}

const htmlFiles = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

htmlFiles.forEach(file => {
  console.log(`\n--- Auditing ${file} ---`);
  const content = fs.readFileSync(file, 'utf8');

  // Check tpl-LeaveBalance
  const lbStart = content.indexOf('<template id="tpl-LeaveBalance">');
  const lbEnd = content.indexOf('</template>', lbStart);
  const lbTpl = content.slice(lbStart, lbEnd);

  // Tab-profile in LeaveBalance must NOT be active
  assert(!lbTpl.includes('id="tab-profile" class="tab nav-tab active"'), `${file}: tpl-LeaveBalance tab-profile is not active`);
  assert(!lbTpl.includes('class="tab nav-tab active" id="tab-profile"'), `${file}: tpl-LeaveBalance tab-profile does not have active class`);
  assert(lbTpl.includes('<div class="tab nav-tab" id="tab-profile"'), `${file}: tpl-LeaveBalance tab-profile has standard nav-tab class`);
  assert(!lbTpl.includes('#tab-profile') || !lbTpl.includes('.active-dot-indicator'), `${file}: tpl-LeaveBalance does not contain active-dot-indicator inside tab-profile`);
  assert(lbTpl.includes('loadScreen(\'tpl-MyProfile\')'), `${file}: tpl-LeaveBalance tab-profile navigates to tpl-MyProfile`);

  // Check tpl-MyProfile: tab-profile MUST be active
  const profStart = content.indexOf('<template id="tpl-MyProfile">');
  const profEnd = content.indexOf('</template>', profStart);
  const profTpl = content.slice(profStart, profEnd);
  assert(profTpl.includes('id="tab-profile"') && profTpl.includes('active'), `${file}: tpl-MyProfile tab-profile IS active on Profile screen`);
});

// Check LeaveBalance preview.html
console.log('\n--- Auditing LeaveBalance preview.html ---');
const prevHtml = fs.readFileSync('EmergereApp/EmergereApp/src/screens/LeaveBalance/preview.html', 'utf8');
assert(!prevHtml.includes('class="tab nav-tab active" id="tab-profile"'), 'LeaveBalance preview.html tab-profile is NOT active');
assert(prevHtml.includes('<div class="tab nav-tab" id="tab-profile"'), 'LeaveBalance preview.html tab-profile has standard class');
assert(prevHtml.includes('MyProfile'), 'LeaveBalance preview.html tab-profile navigates to MyProfile');

// Check MyProfile preview.html
console.log('\n--- Auditing MyProfile preview.html ---');
const myProfHtml = fs.readFileSync('EmergereApp/EmergereApp/src/screens/MyProfile/preview.html', 'utf8');
assert(myProfHtml.includes('id="tab-profile"') && myProfHtml.includes('active'), 'MyProfile preview.html tab-profile IS active');

// Check React Native LeaveBalanceScreen.jsx
console.log('\n--- Auditing LeaveBalanceScreen.jsx ---');
const lbJsx = fs.readFileSync('EmergereApp/EmergereApp/src/screens/LeaveBalance/LeaveBalanceScreen.jsx', 'utf8');
assert(!lbJsx.includes('active="Profile"'), 'LeaveBalanceScreen.jsx does NOT have active="Profile"');
assert(lbJsx.includes('<BottomNavBar onNavigate={go} />'), 'LeaveBalanceScreen.jsx has <BottomNavBar onNavigate={go} />');

// Check React Native MyProfileScreen.jsx
console.log('\n--- Auditing MyProfileScreen.jsx ---');
const myProfJsx = fs.readFileSync('EmergereApp/EmergereApp/src/screens/MyProfile/MyProfileScreen.jsx', 'utf8');
assert(myProfJsx.includes('active="Profile"'), 'MyProfileScreen.jsx DOES have active="Profile"');

console.log('\n=============================');
console.log(allPassed ? 'ALL AUDITS PASSED SUCCESSFULLY! ✅' : 'SOME AUDITS FAILED! ❌');
console.log('=============================');
