const fs = require('fs');
const path = require('path');

const files = [
  'EmergereApp/EmergereApp/src/screens/Login/LoginScreen.jsx',
  'EmergereApp/EmergereApp/src/screens/Login/LoginScreen.styles.js',
  'EmergereApp/EmergereApp/src/screens/Login/preview.html',
  'EmergereApp/EmergereApp/src/screens/Login/preview.css',
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

let allGood = true;

files.forEach(f => {
  const p = path.resolve(f);
  if (!fs.existsSync(p)) {
    console.error(`File missing: ${f}`);
    allGood = false;
    return;
  }
  const content = fs.readFileSync(p, 'utf8');
  
  // Check if OR divider still exists in JSX/HTML
  const hasOrDividerHtml = /<div class="login-or-divider">/.test(content);
  const hasOrDividerJsx = /styles\.orDivider/.test(content);
  
  if (hasOrDividerHtml || hasOrDividerJsx) {
    console.error(`[FAIL] ${f} still has OR divider!`);
    allGood = false;
  } else {
    console.log(`[PASS] ${f} has NO OR divider.`);
  }
});

if (allGood) {
  console.log('\nAll login screen files verified successfully!');
} else {
  console.error('\nSome checks failed!');
  process.exit(1);
}
