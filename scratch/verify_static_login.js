const fs = require('fs');

function checkFile(name, path, checks) {
  const content = fs.readFileSync(path, 'utf8');
  console.log('Testing ' + name + '...');
  for (const [desc, condition] of checks) {
    const passed = condition(content);
    console.log((passed ? '  PASS: ' : '  FAIL: ') + desc);
    if (!passed) process.exitCode = 1;
  }
}

checkFile('preview.html', 'EmergereApp/EmergereApp/src/screens/Login/preview.html', [
  ['Does not contain login-header-banner-container', c => !c.includes('login-header-banner-container')],
  ['Contains login-card-container', c => c.includes('login-card-container')],
  ['Contains email and password inputs', c => c.includes('id="email"') && c.includes('id="password"')],
  ['Contains login button', c => c.includes('btn-login-gradient')],
  ['Contains bottom waves', c => c.includes('login-bottom-wave-wrap')]
]);

checkFile('preview.css', 'EmergereApp/EmergereApp/src/screens/Login/preview.css', [
  ['Screen has overflow: hidden !important', c => c.includes('overflow: hidden !important;')],
  ['login-header-banner-container has display: none !important', c => c.includes('display: none !important;')],
  ['login-card-container has margin: auto 20px', c => c.includes('margin: auto 20px;')]
]);

checkFile('LoginScreen.jsx', 'EmergereApp/EmergereApp/src/screens/Login/LoginScreen.jsx', [
  ['Does not contain login-top-header.png', c => !c.includes('login-top-header.png')],
  ['Does not contain headerBannerContainer', c => !c.includes('headerBannerContainer')],
  ['Does not use ScrollView', c => !c.includes('<ScrollView')],
  ['Uses contentContainer', c => c.includes('styles.contentContainer')],
  ['Contains email and password handlers', c => c.includes('handleLogin') && c.includes('setEmail') && c.includes('setPassword')]
]);

checkFile('LoginScreen.styles.js', 'EmergereApp/EmergereApp/src/screens/Login/LoginScreen.styles.js', [
  ['Screen has overflow: hidden', c => c.includes("overflow: 'hidden'")],
  ['contentContainer exists', c => c.includes('contentContainer:')],
  ['formCard marginTop is auto', c => c.includes("marginTop: 'auto'")]
]);

checkFile('preview_app.html', 'preview_app.html', [
  ['tpl-Login does not contain login-header-banner-img', c => {
    const tplMatch = c.match(/<template id="tpl-Login">([\s\S]*?)<\/template>/);
    return tplMatch && !tplMatch[1].includes('login-header-banner-img');
  }]
]);

checkFile('index.html', 'index.html', [
  ['tpl-Login does not contain login-header-banner-img', c => {
    const tplMatch = c.match(/<template id="tpl-Login">([\s\S]*?)<\/template>/);
    return tplMatch && !tplMatch[1].includes('login-header-banner-img');
  }]
]);
