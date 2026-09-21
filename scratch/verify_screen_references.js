const fs = require('fs');
const path = require('path');

console.log('\n--- Checking Asset Files ---');
const mainLogo = fs.readFileSync('assets/emergere-logo.png');
const appMainLogo = fs.readFileSync('EmergereApp/EmergereApp/assets/emergere-logo.png');
const loginLogo = fs.readFileSync('assets/emergere-login-logo.png');
const appLoginLogo = fs.readFileSync('EmergereApp/EmergereApp/assets/emergere-login-logo.png');

console.log('mainLogo length:', mainLogo.length);
console.log('appMainLogo length:', appMainLogo.length);
console.log('loginLogo length:', loginLogo.length);
console.log('appLoginLogo length:', appLoginLogo.length);

if (mainLogo.length === appMainLogo.length && loginLogo.length === appLoginLogo.length) {
  console.log('✓ PASS: Asset files match.');
} else {
  console.error('✗ FAIL: Asset files mismatch.');
}

console.log('\n--- Checking Screen Previews & JSX ---');
const screensDir = 'EmergereApp/EmergereApp/src/screens';
const screens = fs.readdirSync(screensDir);

screens.forEach(screen => {
  const sPath = path.join(screensDir, screen);
  if (!fs.statSync(sPath).isDirectory()) return;

  const files = fs.readdirSync(sPath);
  const htmlFile = files.find(f => f.endsWith('.html'));
  const jsxFile = files.find(f => f.endsWith('.jsx'));

  if (htmlFile) {
    const html = fs.readFileSync(path.join(sPath, htmlFile), 'utf8');
    if (screen === 'Login') {
      if (html.includes('emergere-login-logo.png') && !html.includes('src="../../../assets/emergere-logo.png"')) {
        console.log(`✓ PASS: ${screen}/preview.html uses emergere-login-logo.png`);
      } else {
        console.error(`✗ FAIL: ${screen}/preview.html does not use emergere-login-logo.png`);
      }
    } else {
      if (html.includes('emergere-login-logo.png')) {
        console.error(`✗ FAIL: ${screen}/preview.html inappropriately uses emergere-login-logo.png!`);
      } else if (html.includes('emergere-logo.png')) {
        console.log(`✓ PASS: ${screen}/preview.html uses emergere-logo.png`);
      }
    }
  }

  if (jsxFile) {
    const jsx = fs.readFileSync(path.join(sPath, jsxFile), 'utf8');
    if (screen === 'Login') {
      if (jsx.includes('emergere-login-logo.png')) {
        console.log(`✓ PASS: ${screen}/${jsxFile} uses emergere-login-logo.png`);
      } else {
        console.error(`✗ FAIL: ${screen}/${jsxFile} does not use emergere-login-logo.png`);
      }
    } else {
      if (jsx.includes('emergere-login-logo.png')) {
        console.error(`✗ FAIL: ${screen}/${jsxFile} inappropriately uses emergere-login-logo.png!`);
      } else if (jsx.includes('emergere-logo.png')) {
        console.log(`✓ PASS: ${screen}/${jsxFile} uses emergere-logo.png`);
      }
    }
  }
});

// Check ScreenHeader.jsx
const headerJsx = fs.readFileSync('EmergereApp/EmergereApp/src/components/ScreenHeader.jsx', 'utf8');
if (headerJsx.includes('emergere-logo.png') && !headerJsx.includes('emergere-login-logo.png')) {
  console.log('✓ PASS: ScreenHeader.jsx uses emergere-logo.png');
} else {
  console.error('✗ FAIL: ScreenHeader.jsx error!');
}
