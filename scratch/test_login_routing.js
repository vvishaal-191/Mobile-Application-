const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== TEST: LOGIN ROLE-BASED ROUTING VERIFICATION ===\n');

let allPassed = true;

// 1. Verify bundle files have both templates and sidebar buttons
const bundles = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

bundles.forEach(b => {
  const content = fs.readFileSync(path.join(__dirname, '..', b), 'utf8');
  const hasEmpTpl = content.includes('id="tpl-EmployeeDashboard"');
  const hasMgrTpl = content.includes('id="tpl-ManagerDashboard"');
  const hasLoginTpl = content.includes('id="tpl-Login"');
  const hasEmpBtn = content.includes('data-tpl="tpl-EmployeeDashboard"');
  const hasMgrBtn = content.includes('data-tpl="tpl-ManagerDashboard"');

  if (hasEmpTpl && hasMgrTpl && hasLoginTpl && hasEmpBtn && hasMgrBtn) {
    console.log(`[PASS] ${b}: All templates and sidebar buttons present.`);
  } else {
    console.error(`[FAIL] ${b}: Missing components! EmpTpl=${hasEmpTpl}, MgrTpl=${hasMgrTpl}, EmpBtn=${hasEmpBtn}, MgrBtn=${hasMgrBtn}`);
    allPassed = false;
  }
});

// 2. Test Login logic in index.html tpl-Login
console.log('\n--- Testing tpl-Login script logic from index.html ---');
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const tplLoginMatch = indexHtml.match(/<template id="tpl-Login">([\s\S]*?)<\/template>/);
if (!tplLoginMatch) {
  console.error('[FAIL] Could not extract tpl-Login from index.html');
  process.exit(1);
}

const tplLoginHtml = tplLoginMatch[1];
const scriptMatch = tplLoginHtml.match(/<script>([\s\S]*?)<\/script>/);
if (!scriptMatch) {
  console.error('[FAIL] Could not extract script from tpl-Login');
  process.exit(1);
}

const tplScript = scriptMatch[1];

function runLoginTest(email, password, expectedScreen, expectedRole) {
  let loadedScreen = null;
  let authUser = null;
  let clickListener = null;

  const mockParent = {
    setAuthUser: function(role, prof) {
      authUser = { ...prof, role };
    },
    loadScreen: function(tpl) {
      loadedScreen = tpl;
    },
    navigateScreen: function(scr) {
      loadedScreen = 'tpl-' + scr;
    },
    sessionStorage: {
      setItem: () => {},
      getItem: () => null,
      removeItem: () => {}
    }
  };

  const loginBtnMock = {
    addEventListener: (evt, fn) => {
      if (evt === 'click') clickListener = fn;
    }
  };

  const inputs = {
    'email': { value: email, addEventListener: () => {} },
    'password': { value: password, addEventListener: () => {} },
    'login-auth-err': { style: { display: 'none' }, textContent: '' },
    'email-err': { style: { display: 'none' } },
    'password-err': { style: { display: 'none' } },
    'btn-login-submit': loginBtnMock
  };

  const context = {
    window: {
      parent: mockParent,
      location: { pathname: '', href: '' },
      sessionStorage: {
        setItem: () => {},
        getItem: () => null,
        removeItem: () => {}
      }
    },
    document: {
      getElementById: (id) => inputs[id] || null,
      querySelector: () => loginBtnMock,
      querySelectorAll: () => [],
      addEventListener: () => {}
    },
    console: console,
    alert: (msg) => console.log('ALERT:', msg)
  };

  vm.createContext(context);
  // Execute the script
  vm.runInContext(tplScript, context);

  // Trigger login via click listener
  if (clickListener) {
    clickListener();
  } else if (context.handleLogin) {
    context.handleLogin();
  } else {
    console.error('No login click listener registered!');
  }

  const success = (loadedScreen === expectedScreen) && (authUser && authUser.role === expectedRole);
  if (success) {
    console.log(`[PASS] Login with '${email || '(empty)'}' -> loadedScreen='${loadedScreen}', role='${authUser.role}'`);
  } else {
    console.error(`[FAIL] Login with '${email || '(empty)'}' -> expectedScreen='${expectedScreen}', got='${loadedScreen}', expectedRole='${expectedRole}', got='${authUser ? authUser.role : null}'`);
    allPassed = false;
  }
}

// Test Employee Login (John Doe)
runLoginTest('john@gmail.com', 'employee@123', 'tpl-EmployeeDashboard', 'employee');

// Test Employee Login (Jack Ryan)
runLoginTest('jack@gmail.com', 'employee@123', 'tpl-EmployeeDashboard', 'employee');

// Test Employee Login (Sneha Reddy)
runLoginTest('sneha@gmail.com', 'employee@123', 'tpl-EmployeeDashboard', 'employee');

// Test Manager Login (Vishnu Kumar)
runLoginTest('vishnu@gmail.com', 'manager@123', 'tpl-ManagerDashboard', 'manager');

// Test Manager Login (Ram Prasad)
runLoginTest('ram@gmail.com', 'manager@123', 'tpl-ManagerDashboard', 'manager');

// Test Manager Login (Rahul Sharma)
runLoginTest('rahul@gmail.com', 'manager@123', 'tpl-ManagerDashboard', 'manager');

// Test Default click (empty credentials defaults to demo employee)
runLoginTest('', '', 'tpl-EmployeeDashboard', 'employee');

// 3. Test standalone preview.js
console.log('\n--- Testing standalone preview.js ---');
const prevJsCode = fs.readFileSync(path.join(__dirname, '../EmergereApp/EmergereApp/src/screens/Login/preview.js'), 'utf8');

function runStandaloneTest(email, password, expectedUrl, expectedRole) {
  let redirectedHref = null;
  const storage = {};

  const mockWin = {
    location: {
      get href() { return redirectedHref; },
      set href(val) { redirectedHref = val; }
    },
    sessionStorage: {
      setItem: (k, v) => { storage[k] = v; },
      getItem: (k) => storage[k] || null,
      removeItem: (k) => { delete storage[k]; }
    }
  };
  mockWin.parent = mockWin; // standalone: parent is window

  const inputs = {
    'email': { value: email, addEventListener: () => {} },
    'password': { value: password, addEventListener: () => {} },
    'login-auth-err': { style: { display: 'none' }, textContent: '' },
    'email-err': { style: { display: 'none' } },
    'password-err': { style: { display: 'none' } },
    'btn-login-submit': { addEventListener: () => {} }
  };

  const context = {
    window: mockWin,
    document: {
      getElementById: (id) => inputs[id] || null,
      querySelector: () => inputs['btn-login-submit'],
      querySelectorAll: () => [],
      addEventListener: () => {}
    },
    console: console,
    alert: (msg) => console.log('ALERT:', msg)
  };

  vm.createContext(context);
  vm.runInContext(prevJsCode, context);

  context.handleLogin();

  const savedAuth = storage['AUTH_USER'] ? JSON.parse(storage['AUTH_USER']) : null;
  const success = (redirectedHref === expectedUrl) && (savedAuth && savedAuth.role === expectedRole);
  if (success) {
    console.log(`[PASS] Standalone '${email}' -> redirect='${redirectedHref}', savedRole='${savedAuth.role}'`);
  } else {
    console.error(`[FAIL] Standalone '${email}' -> expected='${expectedUrl}', got='${redirectedHref}', expectedRole='${expectedRole}', got='${savedAuth ? savedAuth.role : null}'`);
    allPassed = false;
  }
}

// Standalone Employee
runStandaloneTest('john@gmail.com', 'employee@123', '../EmployeeDashboard/preview.html', 'employee');

// Standalone Manager
runStandaloneTest('vishnu@gmail.com', 'manager@123', '../ManagerDashboard/preview.html', 'manager');

// 4. Test real loadScreen in index.html DOM
console.log('\n--- Testing real loadScreen in index.html ---');
const empTplInIndex = indexHtml.includes('<template id="tpl-EmployeeDashboard">');
const mgrTplInIndex = indexHtml.includes('<template id="tpl-ManagerDashboard">');
console.log(`[${empTplInIndex ? 'PASS' : 'FAIL'}] <template id="tpl-EmployeeDashboard"> is present in index.html DOM: ${empTplInIndex}`);
console.log(`[${mgrTplInIndex ? 'PASS' : 'FAIL'}] <template id="tpl-ManagerDashboard"> is present in index.html DOM: ${mgrTplInIndex}`);

if (!empTplInIndex || !mgrTplInIndex) allPassed = false;

console.log('\n=============================================');
console.log('FINAL RESULT:', allPassed ? 'ALL TESTS PASSED SUCCESSFULLY!' : 'SOME TESTS FAILED!');
console.log('=============================================');
