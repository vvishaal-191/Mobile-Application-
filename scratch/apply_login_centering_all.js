const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '..', 'preview_app.html'),
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'preview_app.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'index.html'),
];

// First, update scratch/apply_login_redesign_to_htmls.js with the perfected CSS
const syncScriptPath = path.join(__dirname, 'apply_login_redesign_to_htmls.js');
let syncContent = fs.readFileSync(syncScriptPath, 'utf8');

// Replace .screen.neumorphic-login-screen in syncScript
syncContent = syncContent.replace(
  /\.screen\.neumorphic-login-screen\s*\{[\s\S]*?box-sizing:\s*border-box;\s*\}/,
  `.screen.neumorphic-login-screen {
          flex: 1;
          height: 100% !important;
          min-height: 100% !important;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 24px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          position: relative;
          background: var(--nm-bg);
          color: var(--nm-text-main);
          box-sizing: border-box;
        }`
);

// Replace .login-center-container in syncScript
syncContent = syncContent.replace(
  /\.login-center-container\s*\{[\s\S]*?box-sizing:\s*border-box;\s*\}/,
  `.login-center-container {
          width: 100%;
          max-width: 390px;
          margin: auto !important;
          display: flex;
          flex-direction: column;
          align-self: center;
          position: relative;
          z-index: 10;
          box-sizing: border-box;
        }`
);

fs.writeFileSync(syncScriptPath, syncContent, 'utf8');
console.log('Updated scratch/apply_login_redesign_to_htmls.js with centered container CSS');

// Run the sync script to update tpl-Login in all 4 files
require('./apply_login_redesign_to_htmls.js');

// Now update logoGlobalStyle in all 4 files so .screen padding-top: 16px !important doesn't affect login
targetFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace .screen { height: 844px !important; padding-top: 16px !important; } in logoGlobalStyle
  // with .screen:not(.neumorphic-login-screen)
  const oldScreenRule = /\.screen\s*\{\s*height:\s*844px\s*!important;\s*padding-top:\s*16px\s*!important;\s*\}/g;
  if (oldScreenRule.test(content)) {
    content = content.replace(oldScreenRule, `.screen:not(.neumorphic-login-screen) {
              height: 844px !important;
              padding-top: 16px !important;
            }
            .screen.neumorphic-login-screen {
              height: 100% !important;
              min-height: 100% !important;
              padding: 24px !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: center !important;
              align-items: center !important;
              box-sizing: border-box !important;
            }
            .screen.neumorphic-login-screen .login-center-container {
              margin: auto !important;
              align-self: center !important;
            }`);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated logoGlobalStyle in:', file);
  } else {
    console.log('oldScreenRule pattern not found or already replaced in:', file);
  }
});
