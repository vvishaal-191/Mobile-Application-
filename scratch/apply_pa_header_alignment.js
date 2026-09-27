const fs = require('fs');

console.log('=== APPLYING PERMISSION APPROVALS HEADER UPWARD ALIGNMENT FIX ===\n');

// 1. Update EmergereApp/EmergereApp/preview/base.css
const baseCssPath = 'EmergereApp/EmergereApp/preview/base.css';
if (fs.existsSync(baseCssPath)) {
  let baseCss = fs.readFileSync(baseCssPath, 'utf8');
  
  const targetSelectors = `.screen:has(.dash-header),
.screen.has-dash-header,
.screen:has(.al-header-banner),
.screen.has-al-header,
.screen:has(.perm-header-banner),
.screen.has-perm-header,
.screen:has(.profile-header-banner),
.screen.has-profile-header,
.screen:has(.mr-header-banner),
.screen.has-mr-header,
.screen:has(.lb-header-banner),
.screen.has-lb-header,
.screen:has(.hc-header-banner),
.screen.has-hc-header,
.screen:has(.la-header-banner),
.screen.has-la-header,
.screen:has(.mgr-header),
.screen.has-mgr-header {
  padding-top: 0 !important;
}

.dash-header,
.al-header-banner,
.perm-header-banner,
.profile-header-banner,
.mr-header-banner,
.lb-header-banner,
.hc-header-banner,
.la-header-banner,
.mgr-header {
  margin-top: 0 !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  width: 100% !important;
}`;

  const replacementSelectors = `.screen:has(.dash-header),
.screen.has-dash-header,
.screen:has(.al-header-banner),
.screen.has-al-header,
.screen:has(.perm-header-banner),
.screen.has-perm-header,
.screen:has(.profile-header-banner),
.screen.has-profile-header,
.screen:has(.mr-header-banner),
.screen.has-mr-header,
.screen:has(.lb-header-banner),
.screen.has-lb-header,
.screen:has(.hc-header-banner),
.screen.has-hc-header,
.screen:has(.la-header-banner),
.screen.has-la-header,
.screen:has(.la-header-banner-wrap),
.screen:has(.pa-header-banner),
.screen.has-pa-header,
.screen:has(.pa-header-banner-wrap),
.screen:has(.mgr-header),
.screen.has-mgr-header {
  padding-top: 0 !important;
}

.dash-header,
.al-header-banner,
.perm-header-banner,
.profile-header-banner,
.mr-header-banner,
.lb-header-banner,
.hc-header-banner,
.la-header-banner,
.la-header-banner-wrap,
.pa-header-banner,
.pa-header-banner-wrap,
.mgr-header {
  margin-top: 0 !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  width: 100% !important;
}`;

  if (baseCss.includes(targetSelectors)) {
    baseCss = baseCss.replace(targetSelectors, replacementSelectors);
    fs.writeFileSync(baseCssPath, baseCss, 'utf8');
    console.log('[OK] Updated EmergereApp/EmergereApp/preview/base.css');
  } else {
    console.log('[WARN] targetSelectors not found in base.css');
  }
}

// 2. Update EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.css
const paPreviewCssPath = 'EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.css';
const newPaPreviewCss = `/* Reuses ../LeaveApprovals/preview.css for card/detail/btn-row layout */

/* Permission Approvals - Flush Header Banner matching overall layout */
.screen,
.screen.has-pa-header,
.screen.has-perm-header,
.screen.has-la-header,
.screen.has-mr-header {
  background: var(--bg, #F8FAFC) !important;
  padding-top: 0 !important;
  margin-top: 0 !important;
  padding-bottom: 96px;
  min-height: 100vh;
  box-sizing: border-box;
  position: relative;
}

.pa-header-banner-wrap,
.pa-header-banner,
.perm-header-banner,
.la-header-banner {
  position: relative;
  width: 100% !important;
  margin: 0 !important;
  margin-top: 0 !important;
  border-top-left-radius: 0 !important;
  border-top-right-radius: 0 !important;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;
  box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22);
  background: #0066FF;
}
`;
fs.writeFileSync(paPreviewCssPath, newPaPreviewCss, 'utf8');
console.log('[OK] Updated EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.css');

// 3. Update EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html
const paPreviewHtmlPath = 'EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html';
if (fs.existsSync(paPreviewHtmlPath)) {
  let paHtml = fs.readFileSync(paPreviewHtmlPath, 'utf8');

  // Replace screen CSS
  paHtml = paHtml.replace(
    /\.screen\s*\{\s*flex:\s*1;\s*overflow-y:\s*auto;\s*padding-top:\s*0\s*!important;\s*padding-bottom:\s*96px;\s*background:\s*var\(--bg\)\s*!important;\s*-webkit-overflow-scrolling:\s*touch;\s*scrollbar-width:\s*none\s*!important;\s*\}/,
    `.screen,
    .screen.has-pa-header,
    .screen.has-perm-header,
    .screen.has-la-header,
    .screen.has-mr-header {
      flex: 1;
      overflow-y: auto;
      padding-top: 0 !important;
      margin-top: 0 !important;
      padding-bottom: 96px;
      background: var(--bg) !important;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none !important;
    }`
  );

  // Replace pa-header-banner-wrap CSS
  paHtml = paHtml.replace(
    /\/\*\s*=====\s*HEADER BANNER MATCHING IMAGE 2\s*=====\s*\*\/\s*\.pa-header-banner-wrap\s*\{[\s\S]*?background:\s*#0066FF;\s*\}/,
    `/* ===== HEADER BANNER MATCHING IMAGE 2 ===== */
    .pa-header-banner-wrap,
    .pa-header-banner,
    .perm-header-banner,
    .la-header-banner {
      position: relative;
      width: 100%;
      margin: 0 !important;
      margin-top: 0 !important;
      overflow: hidden;
      border-top-left-radius: 0 !important;
      border-top-right-radius: 0 !important;
      border-bottom-left-radius: 28px;
      border-bottom-right-radius: 28px;
      box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22);
      background: #0066FF;
    }`
  );

  // Replace screen div and banner div in body
  paHtml = paHtml.replace(
    /<div class="screen">\s*<!-- Royal Blue Gradient Header Banner matching Image 2 -->\s*<div class="pa-header-banner-wrap" id="pa-header-banner">/,
    `<div class="screen has-pa-header has-perm-header has-la-header has-mr-header" style="background:#F8FAFC !important; padding-top:0 !important; padding-bottom:96px;">
      <!-- Royal Blue Gradient Header Banner matching Image 2 -->
      <div class="pa-header-banner-wrap pa-header-banner perm-header-banner la-header-banner" id="pa-header-banner" style="position: relative; width: 100%; overflow: hidden; border-top-left-radius: 0 !important; border-top-right-radius: 0 !important; border-bottom-left-radius: 28px; border-bottom-right-radius: 28px; box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22); background: #0066FF; margin: 0 !important; margin-top: 0 !important;">`
  );

  // Ensure header-banner-img has explicit inline display styles
  paHtml = paHtml.replace(
    /alt="Permission Approvals" class="header-banner-img"\s*\/>/,
    `alt="Permission Approvals" class="header-banner-img" style="width: 100%; height: auto; display: block;" />`
  );

  // Ensure back button has explicit positioning
  paHtml = paHtml.replace(
    /<button\s+class="back-btn-hitbox"[\s\S]*?aria-label="Go Back"\s*><\/button>/,
    `<button
          class="back-btn-hitbox"
          onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}else{window.history.back()}"
          title="Go Back"
          aria-label="Go Back"
          style="position: absolute; left: 14px; top: 22px; width: 44px; height: 44px; border-radius: 50%; background: transparent; border: none; cursor: pointer; z-index: 10; -webkit-tap-highlight-color: transparent;"
        ></button>`
  );

  fs.writeFileSync(paPreviewHtmlPath, paHtml, 'utf8');
  console.log('[OK] Updated EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html');
}

// 4. Function to update HTML app files (preview_app.html, index.html, EmergereApp/EmergereApp/preview_app.html, EmergereApp/EmergereApp/index.html)
function updateAppHtml(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('[SKIP] File not found:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // A. In tpl-PermissionApprovals:
  // Update screen style
  content = content.replace(
    /\.screen\s*\{\s*flex:\s*1;\s*overflow-y:\s*auto;\s*padding-top:\s*0\s*!important;\s*padding-bottom:\s*96px;\s*background:\s*var\(--bg\)\s*!important;\s*-webkit-overflow-scrolling:\s*touch;\s*-ms-overflow-style:\s*none\s*!important;\s*scrollbar-width:\s*none\s*!important;\s*\}/,
    `.screen,
        .screen.has-pa-header,
        .screen.has-perm-header,
        .screen.has-la-header,
        .screen.has-mr-header {
          flex: 1;
          overflow-y: auto;
          padding-top: 0 !important;
          margin-top: 0 !important;
          padding-bottom: 96px;
          background: var(--bg) !important;
          -webkit-overflow-scrolling: touch;
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }`
  );

  // Update banner style
  content = content.replace(
    /\/\*\s*=====\s*HEADER BANNER MATCHING IMAGE 2\s*=====\s*\*\/\s*\.pa-header-banner-wrap\s*\{[\s\S]*?background:\s*#0066FF;\s*\}/,
    `/* ===== HEADER BANNER MATCHING IMAGE 2 ===== */
        .pa-header-banner-wrap,
        .pa-header-banner,
        .perm-header-banner,
        .la-header-banner {
          position: relative;
          width: 100%;
          margin: 0 !important;
          margin-top: 0 !important;
          overflow: hidden;
          border-top-left-radius: 0 !important;
          border-top-right-radius: 0 !important;
          border-bottom-left-radius: 28px;
          border-bottom-right-radius: 28px;
          box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22);
          background: #0066FF;
        }`
  );

  // Update screen div and banner div inside tpl-PermissionApprovals
  content = content.replace(
    /<div class="screen">\s*<!-- Royal Blue Gradient Header Banner matching Image 2 -->\s*<div class="pa-header-banner-wrap" id="pa-header-banner">/,
    `<div class="screen has-pa-header has-perm-header has-la-header has-mr-header" style="background:#F8FAFC !important; padding-top:0 !important; padding-bottom:96px;">
          <!-- Royal Blue Gradient Header Banner matching Image 2 -->
          <div class="pa-header-banner-wrap pa-header-banner perm-header-banner la-header-banner" id="pa-header-banner" style="position: relative; width: 100%; overflow: hidden; border-top-left-radius: 0 !important; border-top-right-radius: 0 !important; border-bottom-left-radius: 28px; border-bottom-right-radius: 28px; box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22); background: #0066FF; margin: 0 !important; margin-top: 0 !important;">`
  );

  // Ensure header-banner-img has explicit inline display styles
  content = content.replace(
    /alt="Permission Approvals" class="header-banner-img"\s*\/>/,
    `alt="Permission Approvals" class="header-banner-img" style="width: 100%; height: auto; display: block;" />`
  );

  // Ensure back button in tpl-PermissionApprovals has explicit inline styles
  content = content.replace(
    /<button\s+class="back-btn-hitbox"\s+onclick="if\(window\.parent&&window\.parent\.loadScreen\)\{window\.parent\.loadScreen\('tpl-ManagerDashboard'\)\}else if\(typeof loadScreen==='function'\)\{loadScreen\('tpl-ManagerDashboard'\)\}else if\(typeof navTo==='function'\)\{navTo\('Dashboard'\)\}"\s+title="Go Back"\s+aria-label="Go Back"\s*><\/button>/,
    `<button
              class="back-btn-hitbox"
              onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}"
              title="Go Back"
              aria-label="Go Back"
              style="position: absolute; left: 14px; top: 22px; width: 44px; height: 44px; border-radius: 50%; background: transparent; border: none; cursor: pointer; z-index: 10; -webkit-tap-highlight-color: transparent;"
            ></button>`
  );

  // B. In injected iframe styles:
  // Replace the :not(...) selector globally
  content = content.replaceAll(
    `:not(.has-mr-header):not(:has(.mr-header-banner)):not(.has-lb-header):not(:has(.lb-header-banner)):not(.has-hc-header):not(:has(.hc-header-banner)):not(.has-mgr-header):not(:has(.mgr-header))`,
    `:not(.has-mr-header):not(:has(.mr-header-banner)):not(.has-lb-header):not(:has(.lb-header-banner)):not(.has-hc-header):not(:has(.hc-header-banner)):not(.has-la-header):not(:has(.la-header-banner-wrap)):not(:has(.la-header-banner)):not(.has-pa-header):not(:has(.pa-header-banner-wrap)):not(:has(.pa-header-banner)):not(.has-mgr-header):not(:has(.mgr-header))`
  );

  // Replace the zero-padding classes
  content = content.replaceAll(
    `            .screen.has-hc-header,
            .screen:has(.hc-header-banner),
            .screen.has-mgr-header,
            .screen:has(.mgr-header) {`,
    `            .screen.has-hc-header,
            .screen:has(.hc-header-banner),
            .screen.has-la-header,
            .screen:has(.la-header-banner-wrap),
            .screen:has(.la-header-banner),
            .screen.has-pa-header,
            .screen:has(.pa-header-banner-wrap),
            .screen:has(.pa-header-banner),
            .screen.has-mgr-header,
            .screen:has(.mgr-header) {`
  );

  // Replace the zero-margin classes
  content = content.replaceAll(
    `            .hc-header-banner,
            .mgr-header {
              margin-top: 0 !important;
              border-top-left-radius: 0 !important;
              border-top-right-radius: 0 !important;
            }`,
    `            .hc-header-banner,
            .la-header-banner-wrap,
            .la-header-banner,
            .pa-header-banner-wrap,
            .pa-header-banner,
            .mgr-header {
              margin-top: 0 !important;
              border-top-left-radius: 0 !important;
              border-top-right-radius: 0 !important;
            }`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('[OK] Updated', filePath);
}

['preview_app.html', 'index.html', 'EmergereApp/EmergereApp/preview_app.html', 'EmergereApp/EmergereApp/index.html'].forEach(updateAppHtml);

console.log('\n=== FIX APPLICATION COMPLETE ===');
