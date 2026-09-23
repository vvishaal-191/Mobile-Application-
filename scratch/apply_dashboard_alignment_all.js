const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '..', 'preview_app.html'),
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'preview_app.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'index.html'),
];

targetFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error('File not found:', file);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');

  // 1. Update logoGlobalStyle: Ensure .screen:not(.neumorphic-login-screen) does NOT apply padding-top: 16px to has-dash-header
  content = content.replace(
    /\.screen:not\(\.neumorphic-login-screen\)\s*\{\s*height:\s*844px\s*!important;\s*padding-top:\s*16px\s*!important;\s*\}/g,
    `.screen:not(.neumorphic-login-screen):not(.has-dash-header):not(:has(.dash-header)) {
              height: 844px !important;
              padding-top: 16px !important;
            }
            .screen.has-dash-header,
            .screen:has(.dash-header) {
              height: 844px !important;
              padding-top: 0 !important;
            }
            .dash-header {
              margin-top: 0 !important;
              border-top-left-radius: 0 !important;
              border-top-right-radius: 0 !important;
            }`
  );

  // 2. In tpl-EmployeeDashboard, update <div class="screen"> to <div class="screen has-dash-header">
  // We locate template id="tpl-EmployeeDashboard"
  const tplMatch = content.match(/<template\s+id=["']tpl-EmployeeDashboard["']>([\s\S]*?)<\/template>/);
  if (tplMatch) {
    let tplContent = tplMatch[1];
    
    // Add has-dash-header to screen class if not already present
    tplContent = tplContent.replace(
      /<div class="screen">(\s*<!--\s*Header)/g,
      '<div class="screen has-dash-header">$1'
    );

    // Ensure CSS in tpl-EmployeeDashboard includes .screen.has-dash-header
    if (!tplContent.includes('.screen.has-dash-header')) {
      tplContent = tplContent.replace(
        /\.screen\s*\{([\s\S]*?padding-top:\s*0\s*!important;)/,
        '.screen,\n        .screen.has-dash-header {\n$1'
      );
    }

    // Ensure .dash-header has border-top-left-radius: 0 !important; border-top-right-radius: 0 !important;
    if (!tplContent.includes('border-top-left-radius: 0 !important;')) {
      tplContent = tplContent.replace(
        /\.dash-header\s*\{([\s\S]*?margin-top:\s*0\s*!important;)/,
        `.dash-header {
          margin-top: 0 !important;
          border-top-left-radius: 0 !important;
          border-top-right-radius: 0 !important;$1`
      );
    }

    // Ensure hamburger-btn has width: 38px; height: 38px; padding: 0;
    tplContent = tplContent.replace(
      /\.hamburger-btn\s*\{[\s\S]*?padding:\s*4px;[\s\S]*?\}/,
      `.hamburger-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          flex-shrink: 0;
          transition: background 0.15s ease;
        }
        .hamburger-btn:hover {
          background: rgba(255, 255, 255, 0.12);
        }`
    );

    // Ensure header-left-brand has height: 38px
    tplContent = tplContent.replace(
      /\.header-left-brand\s*\{\s*display:\s*flex;\s*align-items:\s*center;\s*gap:\s*12px;\s*\}/,
      `.header-left-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          height: 38px;
        }`
    );

    // Ensure brand-block has height: 38px
    tplContent = tplContent.replace(
      /\.brand-block\s*\{\s*display:\s*flex;\s*align-items:\s*center;\s*gap:\s*10px;\s*\}/,
      `.brand-block {
          display: flex;
          align-items: center;
          gap: 10px;
          height: 38px;
        }`
    );

    // Reassemble template
    const newTplBlock = `<template id="tpl-EmployeeDashboard">${tplContent}</template>`;
    content = content.replace(tplMatch[0], newTplBlock);
    console.log('Successfully updated tpl-EmployeeDashboard in:', file);
  }

  // 3. Ensure dashNoGlowStyle sets border-top radii to 0
  content = content.replace(
    /\.dash-header\s*\{\s*margin-top:\s*0\s*!important;\s*\}/g,
    `.dash-header {
                margin-top: 0 !important;
                border-top-left-radius: 0 !important;
                border-top-right-radius: 0 !important;
              }`
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log('Finished updating:', file);
});
