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
  ['Does not contain login-bottom-wave-wrap', c => !c.includes('login-bottom-wave-wrap')],
  ['Contains login-card-container', c => c.includes('login-card-container')],
  ['Contains email and password inputs', c => c.includes('id="email"') && c.includes('id="password"')],
  ['Contains login button', c => c.includes('btn-login-gradient')],
  ['Contains Forgot Password Modal', c => c.includes('id="forgot-pwd-modal"')]
]);

checkFile('preview.css', 'EmergereApp/EmergereApp/src/screens/Login/preview.css', [
  ['Screen has overflow: hidden !important', c => c.includes('overflow: hidden !important;')],
  ['Screen centers content', c => c.includes('justify-content: center;') && c.includes('align-items: center;')],
  ['login-header-banner-container has display: none !important', c => c.includes('.login-header-banner-container {\n  display: none !important;\n}') || c.includes('.login-header-banner-container {\r\n  display: none !important;\r\n}')],
  ['login-card-container is centered with margin: auto', c => c.includes('margin: auto;')],
  ['login-bottom-wave-wrap has display: none !important', c => c.includes('.login-bottom-wave-wrap {\n  display: none !important;\n}') || c.includes('.login-bottom-wave-wrap {\r\n  display: none !important;\r\n}')]
]);

checkFile('LoginScreen.jsx', 'EmergereApp/EmergereApp/src/screens/Login/LoginScreen.jsx', [
  ['Does not contain login-top-header.png', c => !c.includes('login-top-header.png')],
  ['Does not contain login-bottom-wave.png', c => !c.includes('login-bottom-wave.png')],
  ['Does not contain headerBannerContainer', c => !c.includes('headerBannerContainer')],
  ['Does not contain bottomWaveContainer', c => !c.includes('bottomWaveContainer')],
  ['Does not use ScrollView', c => !c.includes('<ScrollView')],
  ['Uses contentContainer', c => c.includes('styles.contentContainer')],
  ['Contains email and password handlers', c => c.includes('handleLogin') && c.includes('setEmail') && c.includes('setPassword')],
  ['Contains Forgot Password Modal', c => c.includes('showForgotModal')]
]);

checkFile('LoginScreen.styles.js', 'EmergereApp/EmergereApp/src/screens/Login/LoginScreen.styles.js', [
  ['Screen has overflow: hidden', c => c.includes("overflow: 'hidden'")],
  ['contentContainer centers content', c => c.includes("justifyContent: 'center'") && c.includes("alignItems: 'center'")],
  ['formCard width is 100%', c => c.includes("width: '100%'")]
]);

checkFile('preview_app.html', 'preview_app.html', [
  ['tpl-Login does not contain login-header-banner-img', c => {
    const tplMatch = c.match(/<template id="tpl-Login">([\s\S]*?)<\/template>/);
    return tplMatch && !tplMatch[1].includes('login-header-banner-img');
  }],
  ['tpl-Login does not contain login-bottom-wave-wrap HTML element', c => {
    const tplMatch = c.match(/<template id="tpl-Login">([\s\S]*?)<\/template>/);
    return tplMatch && !tplMatch[1].includes('<div class="login-bottom-wave-wrap">');
  }],
  ['tpl-Login contains centered login-card-container', c => {
    const tplMatch = c.match(/<template id="tpl-Login">([\s\S]*?)<\/template>/);
    return tplMatch && tplMatch[1].includes('<div class="login-card-container">');
  }]
]);

checkFile('index.html', 'index.html', [
  ['tpl-Login does not contain login-header-banner-img', c => {
    const tplMatch = c.match(/<template id="tpl-Login">([\s\S]*?)<\/template>/);
    return tplMatch && !tplMatch[1].includes('login-header-banner-img');
  }],
  ['tpl-Login does not contain login-bottom-wave-wrap HTML element', c => {
    const tplMatch = c.match(/<template id="tpl-Login">([\s\S]*?)<\/template>/);
    return tplMatch && !tplMatch[1].includes('<div class="login-bottom-wave-wrap">');
  }],
  ['tpl-Login contains centered login-card-container', c => {
    const tplMatch = c.match(/<template id="tpl-Login">([\s\S]*?)<\/template>/);
    return tplMatch && tplMatch[1].includes('<div class="login-card-container">');
  }]
]);
