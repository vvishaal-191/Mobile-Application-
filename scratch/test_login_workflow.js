const fs = require('fs');

console.log('================================================================');
console.log('🧪 TESTING LOGIN SCREEN WORKFLOW & INTEGRATION');
console.log('================================================================\n');

let pass = 0;
let fail = 0;

function check(cond, msg) {
  if (cond) {
    console.log('  ✅ PASS: ' + msg);
    pass++;
  } else {
    console.error('  ❌ FAIL: ' + msg);
    fail++;
  }
}

const htmlAndJsxFiles = [
  'EmergereApp/EmergereApp/src/screens/Login/preview.html',
  'EmergereApp/EmergereApp/src/screens/Login/LoginScreen.jsx',
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

htmlAndJsxFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  check(c.length > 500, `${f} exists and has valid content (${c.length} bytes)`);
  check(c.includes('Welcome') && (c.includes('Back') || c.includes('accent-sky') || c.includes('headerTitleAccent')), `${f} contains Welcome Back title`);
  check(c.includes('Sign in to continue'), `${f} contains exact subtitle 'Sign in to continue'`);
  check(c.includes('Username or Email') && c.includes('Password'), `${f} contains Username or Email and Password fields`);
  check(c.includes('Remember Me') && c.includes('Forgot Password?'), `${f} contains Remember Me and Forgot Password options`);
  check(c.includes('Login'), `${f} contains Login button`);
  check(c.includes('OR'), `${f} contains OR divider`);
});

const styleFiles = [
  'EmergereApp/EmergereApp/src/screens/Login/preview.css',
  'EmergereApp/EmergereApp/src/screens/Login/LoginScreen.styles.js'
];

styleFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  check(c.length > 500, `${f} exists (${c.length} bytes)`);
  check(c.includes('login') || c.includes('header'), `${f} contains login styling`);
  check(c.includes('logoCard') || c.includes('login-logo-card'), `${f} contains logo card styling`);
  check(c.includes('orLine') || c.includes('or-line') || c.includes('orDivider') || c.includes('or-divider'), `${f} contains OR divider styling`);
});

console.log('\n================================================================');
console.log(`📊 LOGIN TESTS SUMMARY: ${pass} Passed, ${fail} Failed`);
console.log('================================================================');

if (fail > 0) process.exit(1);
