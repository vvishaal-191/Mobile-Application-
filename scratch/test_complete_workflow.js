const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== VERIFYING COMPLETE LOGIN WORKFLOW AND CENTERING ===\n');

let allPassed = true;
function assert(name, condition) {
  if (condition) {
    console.log('PASS: ' + name);
  } else {
    console.error('FAIL: ' + name);
    allPassed = false;
  }
}

// 1. Check all target bundle files exist
const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/src/screens/Login/preview.html',
  'EmergereApp/EmergereApp/src/screens/Login/preview.js',
  'EmergereApp/EmergereApp/src/screens/Login/preview.css'
];

files.forEach(f => {
  const p = path.join(__dirname, '..', f);
  assert(`File exists: ${f}`, fs.existsSync(p));
});

// 2. Verify preview.css centering
const css = fs.readFileSync(path.join(__dirname, '../EmergereApp/EmergereApp/src/screens/Login/preview.css'), 'utf8');
assert('preview.css has card margin: auto for perfect center alignment', css.includes('margin: auto;'));

// 3. Verify preview_app.html & index.html bundle files
const appHtml = fs.readFileSync(path.join(__dirname, '../preview_app.html'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

[appHtml, indexHtml].forEach((content, i) => {
  const docName = i === 0 ? 'preview_app.html' : 'index.html';
  assert(`${docName} has onclick="handleLogin()" on button`, content.includes('id="btn-login-submit" class="btn-login-gradient" onclick="handleLogin()"'));
  assert(`${docName} tpl-Login has navigateAfterLogin for ManagerDashboard`, content.includes("navigateAfterLogin('ManagerDashboard', 'manager'"));
  assert(`${docName} tpl-Login has navigateAfterLogin for EmployeeDashboard`, content.includes("navigateAfterLogin('EmployeeDashboard', 'employee'"));
  assert(`${docName} outer styles have margin: auto for login-card-container`, content.replace(/\r\n/g, '\n').includes(".login-card-container {\n  width: calc(100% - 36px);\n  max-width: 374px;\n  margin: auto;"));
});

// 4. Verify LoginScreen.styles.js has auto margins for center alignment
const rnStyles = fs.readFileSync(path.join(__dirname, '../EmergereApp/EmergereApp/src/screens/Login/LoginScreen.styles.js'), 'utf8');
assert('LoginScreen.styles.js formCard has vertical centering (marginTop/marginBottom: auto)', rnStyles.includes("marginTop: 'auto'") && rnStyles.includes("marginBottom: 'auto'"));

// 5. Test standalone browser redirection simulation in preview.js
const prevJs = fs.readFileSync(path.join(__dirname, '../EmergereApp/EmergereApp/src/screens/Login/preview.js'), 'utf8');

(function testStandaloneSimulation() {
  let redirectedUrl = '';
  const fakeStorage = {};
  const mockLocation = {
    pathname: '/EmergereApp/EmergereApp/src/screens/Login/preview.html',
    set href(val) { redirectedUrl = val; },
    get href() { return redirectedUrl; }
  };
  const mockWindow = {
    location: mockLocation,
    parent: null,
    sessionStorage: { setItem: (k, v) => { fakeStorage[k] = v; }, getItem: (k) => fakeStorage[k] },
    localStorage: { setItem: (k, v) => { fakeStorage[k] = v; }, getItem: (k) => fakeStorage[k] }
  };
  mockWindow.parent = mockWindow;

  const domMocks = {
    'email': { value: 'john@gmail.com', style: {}, addEventListener: () => {} },
    'password': { value: 'employee@123', type: 'password', style: {}, addEventListener: () => {} },
    'btn-login-submit': { style: {}, onclick: null, addEventListener: () => {} },
    'login-auth-err': { style: { display: 'none' }, textContent: '', addEventListener: () => {} },
    'password-err': { style: { display: 'none' }, addEventListener: () => {} },
    'email-err': { style: { display: 'none' }, addEventListener: () => {} }
  };

  const context = vm.createContext({
    window: mockWindow,
    document: {
      getElementById: (id) => domMocks[id] || { style: {}, addEventListener: () => {} },
      addEventListener: () => {},
      readyState: 'complete'
    },
    sessionStorage: mockWindow.sessionStorage,
    localStorage: mockWindow.localStorage,
    alert: (msg) => console.log('MOCK ALERT:', msg),
    console: console
  });

  vm.runInContext(prevJs, context);

  // A. Simulate John Doe (Employee)
  context.handleLogin();
  assert('Employee Login (john@gmail.com) redirected to ../EmployeeDashboard/preview.html', redirectedUrl === '../EmployeeDashboard/preview.html');
  const storedEmp = JSON.parse(fakeStorage['USER_PROFILE'] || '{}');
  assert('Employee profile correctly stored in session for John Doe', storedEmp.name === 'John Doe');

  // B. Simulate Vishnu Kumar (Manager)
  domMocks['email'].value = 'vishnu@gmail.com';
  domMocks['password'].value = 'manager@123';
  context.handleLogin();
  assert('Manager Login (vishnu@gmail.com) redirected to ../ManagerDashboard/preview.html', redirectedUrl === '../ManagerDashboard/preview.html');
  const storedMgr = JSON.parse(fakeStorage['USER_PROFILE'] || '{}');
  assert('Manager profile correctly stored in session for Vishnu Kumar', storedMgr.name === 'Vishnu Kumar');
})();

console.log('\n=== FINAL VERIFICATION RESULT:', allPassed ? 'ALL TESTS PASSED!' : 'SOME TESTS FAILED!');
if (!allPassed) process.exitCode = 1;
