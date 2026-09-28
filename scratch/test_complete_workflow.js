const fs = require('fs');
const path = require('path');

console.log('=== VERIFYING LOGIN WORKFLOW AND ALIGNMENT ===');

// 1. Check all target bundle files exist and contain updated login template
const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/src/screens/Login/preview.html',
  'EmergereApp/EmergereApp/src/screens/Login/preview.js',
  'EmergereApp/EmergereApp/src/screens/Login/preview.css'
];

let allPassed = true;

files.forEach(f => {
  const p = path.join(__dirname, '..', f);
  if (!fs.existsSync(p)) {
    console.error('File missing:', f);
    allPassed = false;
  } else {
    console.log('File found:', f);
  }
});

// 2. Verify preview.css centering
const css = fs.readFileSync(path.join(__dirname, '../EmergereApp/EmergereApp/src/screens/Login/preview.css'), 'utf8');
if (css.includes('margin: auto 20px;')) {
  console.log('PASS: preview.css has margin: auto 20px for center alignment');
} else {
  console.error('FAIL: preview.css missing margin: auto 20px');
  allPassed = false;
}

// 3. Verify preview_app.html contains navigateScreen and message listener
const appHtml = fs.readFileSync(path.join(__dirname, '../preview_app.html'), 'utf8');
if (appHtml.includes('window.navigateScreen = navigateScreen;') && appHtml.includes('window.addEventListener(\'message\'')) {
  console.log('PASS: preview_app.html exposes navigateScreen and listens to message events');
} else {
  console.error('FAIL: preview_app.html missing navigateScreen or message listener');
  allPassed = false;
}

// 4. Verify preview_app.html tpl-Login has setAuthUser and loadScreen calls
if (appHtml.includes('pWin.setAuthUser(\'manager\'') && appHtml.includes('pWin.loadScreen(\'tpl-ManagerDashboard\'')) {
  console.log('PASS: preview_app.html tpl-Login navigates to ManagerDashboard for manager');
} else {
  console.error('FAIL: preview_app.html tpl-Login missing manager navigation');
  allPassed = false;
}

if (appHtml.includes('pWin.setAuthUser(\'employee\'') && appHtml.includes('pWin.loadScreen(\'tpl-EmployeeDashboard\'')) {
  console.log('PASS: preview_app.html tpl-Login navigates to EmployeeDashboard for employee');
} else {
  console.error('FAIL: preview_app.html tpl-Login missing employee navigation');
  allPassed = false;
}

// 5. Verify preview.js has correct password input id and navigation
const prevJs = fs.readFileSync(path.join(__dirname, '../EmergereApp/EmergereApp/src/screens/Login/preview.js'), 'utf8');
if (prevJs.includes("document.getElementById('password') || document.getElementById('pwd')") &&
    prevJs.includes("pWin.loadScreen('tpl-ManagerDashboard')") &&
    prevJs.includes("pWin.loadScreen('tpl-EmployeeDashboard')")) {
  console.log('PASS: preview.js has password element fallback and proper navigation');
} else {
  console.error('FAIL: preview.js missing password element or navigation');
  allPassed = false;
}

// 6. Verify LoginScreen.styles.js has updated aspect ratio and centered card
const rnStyles = fs.readFileSync(path.join(__dirname, '../EmergereApp/EmergereApp/src/screens/Login/LoginScreen.styles.js'), 'utf8');
if (rnStyles.includes("height: width * 0.583") && rnStyles.includes("marginVertical: 'auto'")) {
  console.log('PASS: LoginScreen.styles.js has updated aspect ratio and auto margin for center alignment');
} else {
  console.error('FAIL: LoginScreen.styles.js missing aspect ratio or marginVertical');
  allPassed = false;
}

// 7. Verify simulation of handleLogin in preview.js
const vm = require('vm');
const fakeStorage = {};
const mockWindow = {
  sessionStorage: {
    setItem: (k, v) => { fakeStorage[k] = v; },
    getItem: (k) => fakeStorage[k],
    removeItem: (k) => { delete fakeStorage[k]; }
  },
  parent: null,
  currentLoadedScreen: null,
  authUser: null,
  setAuthUser: function(role, user) {
    this.authUser = { ...user, role };
  },
  loadScreen: function(tpl) {
    this.currentLoadedScreen = tpl;
  }
};
mockWindow.parent = mockWindow;

const domMocks = {
  'email': { value: 'vishnu@gmail.com' },
  'password': { value: 'manager@123' },
  'login-auth-err': { style: { display: 'none' }, textContent: '' },
  'password-err': { style: { display: 'none' } },
  'email-err': { style: { display: 'none' } }
};

const context = vm.createContext({
  window: mockWindow,
  document: {
    getElementById: (id) => domMocks[id] || null,
    addEventListener: () => {}
  },
  alert: (msg) => console.log('MOCK ALERT:', msg),
  console: console
});

vm.runInContext(prevJs, context);

// Test Manager Login
context.handleLogin();
if (mockWindow.currentLoadedScreen === 'tpl-ManagerDashboard' && mockWindow.authUser && mockWindow.authUser.role === 'manager') {
  console.log('PASS: Simulation of Manager Login navigated to tpl-ManagerDashboard successfully!');
} else {
  console.error('FAIL: Manager Login simulation failed:', mockWindow.currentLoadedScreen, mockWindow.authUser);
  allPassed = false;
}

// Test Employee Login
domMocks['email'].value = 'john@gmail.com';
domMocks['password'].value = 'employee@123';
context.handleLogin();
if (mockWindow.currentLoadedScreen === 'tpl-EmployeeDashboard' && mockWindow.authUser && mockWindow.authUser.role === 'employee') {
  console.log('PASS: Simulation of Employee Login navigated to tpl-EmployeeDashboard successfully!');
} else {
  console.error('FAIL: Employee Login simulation failed:', mockWindow.currentLoadedScreen, mockWindow.authUser);
  allPassed = false;
}

console.log('\n=== FINAL VERIFICATION RESULT:', allPassed ? 'ALL TESTS PASSED!' : 'SOME TESTS FAILED!');
