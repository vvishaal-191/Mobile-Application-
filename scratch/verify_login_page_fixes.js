const fs = require('fs');

console.log('=== VERIFYING LOGIN PAGE CARD CENTERING & BUTTON NAVIGATION ===\n');

let allPassed = true;
function assert(name, condition) {
  if (condition) {
    console.log('  PASS: ' + name);
  } else {
    console.log('  FAIL: ' + name);
    allPassed = false;
  }
}

// 1. Verify preview.css
console.log('--- Checking preview.css ---');
const css = fs.readFileSync('EmergereApp/EmergereApp/src/screens/Login/preview.css', 'utf8');
assert('Screen has padding: 0 !important', css.includes('padding: 0 !important;'));
assert('Screen has overflow: hidden !important', css.includes('overflow: hidden !important;'));
assert('login-header-banner-container is NOT display: none', !css.includes('.login-header-banner-container {\n  display: none !important;\n}') && !css.includes('.login-header-banner-container {\r\n  display: none !important;\r\n}'));
assert('login-header-banner-container has border-top-left-radius: 40px', css.includes('border-top-left-radius: 40px;'));
assert('login-header-banner-container has border-top-right-radius: 40px', css.includes('border-top-right-radius: 40px;'));
assert('login-card-container is layered above header (z-index: 10)', css.includes('z-index: 10;'));
assert('login-card-container is centered with margin: auto', css.includes('margin: auto;'));
assert('login-card-container has balanced width: calc(100% - 36px)', css.includes('width: calc(100% - 36px);'));
assert('login button text has pointer-events: none', css.includes('pointer-events: none;'));

// 2. Verify LoginScreen.jsx & LoginScreen.styles.js
console.log('\n--- Checking LoginScreen.jsx & LoginScreen.styles.js ---');
const jsx = fs.readFileSync('EmergereApp/EmergereApp/src/screens/Login/LoginScreen.jsx', 'utf8');
const styles = fs.readFileSync('EmergereApp/EmergereApp/src/screens/Login/LoginScreen.styles.js', 'utf8');
assert('LoginScreen.jsx contains headerBannerContainer', jsx.includes('styles.headerBannerContainer'));
assert('LoginScreen.jsx contains login-top-header.png Image', jsx.includes("require('../../../assets/login-top-header.png')"));
assert('LoginScreen.jsx does NOT contain bottomWaveContainer', !jsx.includes('styles.bottomWaveContainer'));
assert('LoginScreen.styles.js headerBannerContainer width is 100%', styles.includes("width: '100%'"));
assert('LoginScreen.styles.js formCard has vertical centering (marginTop/marginBottom: auto)', styles.includes("marginTop: 'auto'") && styles.includes("marginBottom: 'auto'"));
assert('LoginScreen.styles.js formCard width is width - 36', styles.includes("width: width - 36"));

// 3. Verify HTML files (preview.html, preview_app.html, index.html)
console.log('\n--- Checking HTML Files ---');
const htmlFiles = [
  'EmergereApp/EmergereApp/src/screens/Login/preview.html',
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

htmlFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  assert(`${f}: contains login-header-banner-container`, content.includes('login-header-banner-container'));
  assert(`${f}: contains login-header-banner-img`, content.includes('login-header-banner-img'));
  assert(`${f}: contains login-card-container`, content.includes('login-card-container'));
  assert(`${f}: contains onclick="handleLogin()" on button`, content.includes('id="btn-login-submit" class="btn-login-gradient" onclick="handleLogin()"') || content.includes('onclick="handleLogin()"'));
  assert(`${f}: does NOT contain -32px auto 0 margin`, !content.includes('margin: -32px auto 0;'));
  if (f.endsWith('preview_app.html') || f.endsWith('index.html')) {
    assert(`${f}: does NOT have rogue parent login click interceptor`, !content.includes("loadScreen('tpl-EmployeeDashboard');\n              });\n            }"));
  }
});

// 4. Test Standalone preview.js execution
console.log('\n--- Testing Standalone preview.js Execution ---');
const previewJsContent = fs.readFileSync('EmergereApp/EmergereApp/src/screens/Login/preview.js', 'utf8');

(function testStandaloneEmployee() {
  let redirectedUrl = '';
  let storedProfile = null;
  const mockLocation = { pathname: '/EmergereApp/EmergereApp/src/screens/Login/preview.html', set href(val) { redirectedUrl = val; }, get href() { return redirectedUrl; } };
  const mockSession = { setItem: function(k, v) { if (k === 'USER_PROFILE') storedProfile = JSON.parse(v); } };
  const mockDoc = {
    getElementById: function(id) {
      if (id === 'email') return { value: 'john@gmail.com', style: {}, addEventListener: function() {} };
      if (id === 'password' || id === 'pwd') return { value: 'employee@123', type: 'password', style: {}, addEventListener: function() {} };
      if (id === 'btn-login-submit') return { style: {}, addEventListener: function() {} };
      return { value: '', style: {}, addEventListener: function() {} };
    },
    addEventListener: function() {},
    readyState: 'complete'
  };

  const fn = new Function('document', 'window', 'sessionStorage', 'localStorage', previewJsContent);
  const mockWin = { location: mockLocation, parent: null, document: mockDoc };
  mockWin.parent = mockWin; // standalone: parent is window
  fn(mockDoc, mockWin, mockSession, mockSession);

  mockWin.handleLogin();
  assert('Standalone Employee login redirects to ../EmployeeDashboard/preview.html', redirectedUrl === '../EmployeeDashboard/preview.html');
  assert('Standalone Employee login sets session profile for John Doe', storedProfile && storedProfile.name === 'John Doe');
})();

(function testStandaloneManager() {
  let redirectedUrl = '';
  let storedProfile = null;
  const mockLocation = { pathname: '/EmergereApp/EmergereApp/src/screens/Login/preview.html', set href(val) { redirectedUrl = val; }, get href() { return redirectedUrl; } };
  const mockSession = { setItem: function(k, v) { if (k === 'USER_PROFILE') storedProfile = JSON.parse(v); } };
  const mockDoc = {
    getElementById: function(id) {
      if (id === 'email') return { value: 'vishnu@gmail.com', style: {}, addEventListener: function() {} };
      if (id === 'password' || id === 'pwd') return { value: 'manager@123', type: 'password', style: {}, addEventListener: function() {} };
      if (id === 'btn-login-submit') return { style: {}, addEventListener: function() {} };
      return { value: '', style: {}, addEventListener: function() {} };
    },
    addEventListener: function() {},
    readyState: 'complete'
  };

  const fn = new Function('document', 'window', 'sessionStorage', 'localStorage', previewJsContent);
  const mockWin = { location: mockLocation, parent: null, document: mockDoc };
  mockWin.parent = mockWin;
  fn(mockDoc, mockWin, mockSession, mockSession);

  mockWin.handleLogin();
  assert('Standalone Manager login redirects to ../ManagerDashboard/preview.html', redirectedUrl === '../ManagerDashboard/preview.html');
  assert('Standalone Manager login sets session profile for Vishnu Kumar', storedProfile && storedProfile.name === 'Vishnu Kumar');
})();

// 5. Test Bundle Mode Navigation in index.html tpl-Login
console.log('\n--- Testing Bundle Mode Navigation in index.html ---');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const tplStart = indexHtml.indexOf('<template id="tpl-Login">');
const tplEnd = indexHtml.indexOf('</template>', tplStart);
const tplContent = indexHtml.substring(tplStart, tplEnd);
const scriptMatch = tplContent.match(/<script>([\s\S]*?)<\/script>/);
assert('tpl-Login has script tag', !!scriptMatch);

if (scriptMatch) {
  let navTarget = null;
  let authRole = null;
  let authUser = null;

  const mockParent = {
    setAuthUser: function(role, user) {
      authRole = role;
      authUser = user;
    },
    loadScreen: function(screen) {
      navTarget = screen;
    },
    navigateScreen: function(screen) {
      navTarget = screen;
    }
  };

  // Bundle Test A: Manager Login
  (function testBundleManager() {
    navTarget = null; authRole = null; authUser = null;
    let clickHandler = null;

    const mockDoc = {
      getElementById: function(id) {
        if (id === 'email') return { value: 'vishnu@gmail.com', style: {}, addEventListener: function() {} };
        if (id === 'password' || id === 'pwd') return { value: 'manager@123', type: 'password', style: {}, addEventListener: function() {} };
        if (id === 'btn-login-submit' || id === 'btn-login') {
          return {
            style: {},
            addEventListener: function(event, fn) {
              if (event === 'click') clickHandler = fn;
            }
          };
        }
        return { value: '', style: {}, addEventListener: function() {} };
      }
    };

    const fn = new Function('document', 'window', scriptMatch[1]);
    fn(mockDoc, { parent: mockParent, document: mockDoc });

    if (clickHandler) clickHandler();
    assert('Bundle Manager credentials click navigates to tpl-ManagerDashboard', navTarget === 'tpl-ManagerDashboard');
    assert('Bundle Manager credentials click sets authRole to manager', authRole === 'manager');
  })();

  // Bundle Test B: Employee Login
  (function testBundleEmployee() {
    navTarget = null; authRole = null; authUser = null;
    let clickHandler = null;

    const mockDoc = {
      getElementById: function(id) {
        if (id === 'email') return { value: 'john@gmail.com', style: {}, addEventListener: function() {} };
        if (id === 'password' || id === 'pwd') return { value: 'employee@123', type: 'password', style: {}, addEventListener: function() {} };
        if (id === 'btn-login-submit' || id === 'btn-login') {
          return {
            style: {},
            addEventListener: function(event, fn) {
              if (event === 'click') clickHandler = fn;
            }
          };
        }
        return { value: '', style: {}, addEventListener: function() {} };
      }
    };

    const fn = new Function('document', 'window', scriptMatch[1]);
    fn(mockDoc, { parent: mockParent, document: mockDoc });

    if (clickHandler) clickHandler();
    assert('Bundle Employee credentials click navigates to tpl-EmployeeDashboard', navTarget === 'tpl-EmployeeDashboard');
    assert('Bundle Employee credentials click sets authRole to employee', authRole === 'employee');
  })();
}

console.log('\n==================================================');
if (allPassed) {
  console.log('✅ ALL VERIFICATIONS PASSED SUCCESSFULLY!');
} else {
  console.log('❌ SOME VERIFICATIONS FAILED!');
  process.exitCode = 1;
}
