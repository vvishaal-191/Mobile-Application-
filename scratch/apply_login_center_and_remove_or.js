const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '..', 'preview_app.html'),
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'preview_app.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'index.html'),
];

targetFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update .screen.login-redesign-screen to justify-content: space-between
  content = content.replace(
    /\.screen\.login-redesign-screen\s*\{[\s\S]*?box-sizing:\s*border-box;\s*\}/g,
    `.screen.login-redesign-screen {
  background: var(--lgn-bg);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}`
  );

  // 2. Update .login-card-container to margin: auto 20px
  content = content.replace(
    /\.login-card-container\s*\{[\s\S]*?box-sizing:\s*border-box;\s*\}/g,
    `.login-card-container {
  margin: auto 20px;
  padding: 24px 20px 24px 20px;
  background: rgba(255, 255, 255, 0.96);
  border-radius: 28px;
  box-shadow: 0 16px 40px rgba(0, 70, 200, 0.09), 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1.2px solid rgba(226, 232, 240, 0.9);
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}`
  );

  // 3. Update .login-or-divider in CSS to display: none !important
  content = content.replace(
    /\.login-or-divider\s*\{[\s\S]*?letter-spacing:\s*1px;\s*\}/g,
    `.login-or-divider {
  display: none !important;
}`
  );

  // 4. Remove the HTML <!-- OR Section Divider --> and <div class="login-or-divider"> block
  const orHtmlRegex = /\s*<!--\s*OR\s*(?:Section\s*)?Divider\s*-->\s*<div class="login-or-divider">[\s\S]*?<\/div>/g;
  content = content.replace(orHtmlRegex, '');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated login centering and removed OR divider in: ${filePath}`);
});
