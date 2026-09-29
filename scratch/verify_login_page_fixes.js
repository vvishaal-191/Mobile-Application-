const fs = require('fs');

console.log('=== VERIFYING LOGIN PAGE IMAGE PLACEMENT, CORNER ALIGNMENT & BUTTON NAVIGATION ===\n');

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
assert('login-card-container has negative top margin overlap', css.includes('margin: -32px auto 0;'));
assert('login-card-container has balanced width: calc(100% - 36px)', css.includes('width: calc(100% - 36px);'));

// 2. Verify LoginScreen.jsx & LoginScreen.styles.js
console.log('\n--- Checking LoginScreen.jsx & LoginScreen.styles.js ---');
const jsx = fs.readFileSync('EmergereApp/EmergereApp/src/screens/Login/LoginScreen.jsx', 'utf8');
const styles = fs.readFileSync('EmergereApp/EmergereApp/src/screens/Login/LoginScreen.styles.js', 'utf8');
assert('LoginScreen.jsx contains headerBannerContainer', jsx.includes('styles.headerBannerContainer'));
assert('LoginScreen.jsx contains login-top-header.png Image', jsx.includes("require('../../../assets/login-top-header.png')"));
assert('LoginScreen.jsx does NOT contain bottomWaveContainer', !jsx.includes('styles.bottomWaveContainer'));
assert('LoginScreen.styles.js headerBannerContainer width is 100%', styles.includes("width: '100%'"));
assert('LoginScreen.styles.js formCard has marginTop: -28', styles.includes("marginTop: -28"));
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
  assert(`${f}: does NOT contain bottom wave wrap in HTML`, !content.includes('<div class="login-bottom-wave-wrap">'));
  if (f.endsWith('preview_app.html') || f.endsWith('index.html')) {
    assert(`${f}: does NOT have rogue parent login click interceptor`, !content.includes("loadScreen('tpl-EmployeeDashboard');\n              });\n            }"));
  }
});

// 4. Test Login Button Simulation in preview_app.html and index.html
console.log('\n--- Testing Login Button Behavior & Navigation ---');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const tplStart = indexHtml.indexOf('<template id="tpl-Login">');
const tplEnd = indexHtml.indexOf('</template>', tplStart);
const tplContent = indexHtml.substring(tplStart, tplEnd);

// Extract the login script from tpl-Login
const scriptMatch = tplContent.match(/<script>([\s\S]*?)<\/script>/);
assert('tpl-Login has script tag', !!scriptMatch);

if (scriptMatch) {
  let navTarget = null;
  let authRole = null;
  let authUser = null;

  // Mock DOM and parent window
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

  // Test Case A: Empty fields one-click login
  (function testEmptyClick() {
    navTarget = null; authRole = null; authUser = null;
    let clickHandler = null;

    function createMockEl() {
      return {
        value: '',
        style: {},
        addEventListener: function(event, fn) {}
      };
    }
    const mockDoc = {
      getElementById: function(id) {
        if (id === 'email') return { value: '', style: {}, addEventListener: function() {} };
        if (id === 'password' || id === 'pwd') return { value: '', type: 'password', style: {}, addEventListener: function() {} };
        if (id === 'btn-login-submit' || id === 'btn-login') {
          return {
            style: {},
            addEventListener: function(event, fn) {
              if (event === 'click') clickHandler = fn;
            }
          };
        }
        return createMockEl();
      }
    };

    const fn = new Function('document', 'window', scriptMatch[1]);
    fn(mockDoc, { parent: mockParent, document: mockDoc });

    if (clickHandler) clickHandler();
    assert('Empty credentials click navigates to tpl-EmployeeDashboard', navTarget === 'tpl-EmployeeDashboard');
    assert('Empty credentials click sets authRole to employee', authRole === 'employee');
  })();

  // Test Case B: Manager Login
  (function testManagerClick() {
    navTarget = null; authRole = null; authUser = null;
    let clickHandler = null;

    function createMockEl() {
      return { value: '', style: {}, addEventListener: function() {} };
    }
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
        return createMockEl();
      }
    };

    const fn = new Function('document', 'window', scriptMatch[1]);
    fn(mockDoc, { parent: mockParent, document: mockDoc });

    if (clickHandler) clickHandler();
    assert('Manager credentials click navigates to tpl-ManagerDashboard', navTarget === 'tpl-ManagerDashboard');
    assert('Manager credentials click sets authRole to manager', authRole === 'manager');
  })();

  // Test Case C: Employee Login
  (function testEmployeeClick() {
    navTarget = null; authRole = null; authUser = null;
    let clickHandler = null;

    function createMockEl() {
      return { value: '', style: {}, addEventListener: function() {} };
    }
    const mockDoc = {
      getElementById: function(id) {
        if (id === 'email') return { value: 'jack@gmail.com', style: {}, addEventListener: function() {} };
        if (id === 'password' || id === 'pwd') return { value: 'employee@123', type: 'password', style: {}, addEventListener: function() {} };
        if (id === 'btn-login-submit' || id === 'btn-login') {
          return {
            style: {},
            addEventListener: function(event, fn) {
              if (event === 'click') clickHandler = fn;
            }
          };
        }
        return createMockEl();
      }
    };

    const fn = new Function('document', 'window', scriptMatch[1]);
    fn(mockDoc, { parent: mockParent, document: mockDoc });

    if (clickHandler) clickHandler();
    assert('Employee credentials click navigates to tpl-EmployeeDashboard', navTarget === 'tpl-EmployeeDashboard');
    assert('Employee credentials click sets authRole to employee', authRole === 'employee');
  })();
}

console.log('\n==================================================');
if (allPassed) {
  console.log('✅ ALL VERIFICATIONS PASSED SUCCESSFULLY!');
} else {
  console.log('❌ SOME VERIFICATIONS FAILED!');
  process.exitCode = 1;
}
