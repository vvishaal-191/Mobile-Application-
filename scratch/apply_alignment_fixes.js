const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// 1. First, update EmergereApp/EmergereApp/preview/base.css
const baseCssPath = path.join(ROOT, 'EmergereApp/EmergereApp/preview/base.css');
if (fs.existsSync(baseCssPath)) {
  let baseCss = fs.readFileSync(baseCssPath, 'utf8');

  // Add .screen:has(.mgr-header), .screen.has-mgr-header
  if (!baseCss.includes('.has-mgr-header')) {
    baseCss = baseCss.replace(
      /\.screen:has\(\.hc-header-banner\),\s*\.screen\.has-hc-header\s*\{/g,
      `.screen:has(.hc-header-banner),
.screen.has-hc-header,
.screen:has(.mgr-header),
.screen.has-mgr-header {`
    );

    baseCss = baseCss.replace(
      /\.hc-header-banner\s*\{\s*margin-top:\s*0\s*!important;/g,
      `.hc-header-banner,
.mgr-header {
  margin-top: 0 !important;`
    );
    fs.writeFileSync(baseCssPath, baseCss, 'utf8');
    console.log('Updated EmergereApp/EmergereApp/preview/base.css');
  } else {
    console.log('base.css already has .has-mgr-header');
  }
}

// 2. Build the updated template content from scratch/test_manager_dashboard_aligned.html
const alignedContent = fs.readFileSync(path.join(ROOT, 'scratch/test_manager_dashboard_aligned.html'), 'utf8');

const styleMatch = alignedContent.match(/<style>([\s\S]*?)<\/style>/);
const bodyMatch = alignedContent.match(/<body>([\s\S]*?)<\/body>/);

if (!styleMatch || !bodyMatch) {
  console.error('Failed to match style or body in test_manager_dashboard_aligned.html');
  process.exit(1);
}

let styles = styleMatch[1];
let body = bodyMatch[1];

// Clean any comments with "View All"
body = body.replace(/<!--[^-]*?View All[^-]*?-->/gi, '');

// Update .device and body styles for embedded iframe
styles = styles.replace(/body\s*\{[\s\S]*?\}/, `body {
      background: #F8FAFC;
      display: flex;
      justify-content: center;
      align-items: stretch;
      min-height: 100vh;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }`);

styles = styles.replace(/\.device\s*\{[\s\S]*?\}/, `.device {
      width: 100%;
      max-width: 440px;
      height: 100vh;
      height: 100dvh;
      background: #F8FAFC;
      border-radius: 0;
      overflow: hidden;
      position: relative;
      box-shadow: none;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
    }`);

const updatedTemplate = `  <template id="tpl-ManagerDashboard">
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
${styles}
      </style>
    </head>
    <body>
${body}
    </body>
    </html>
  </template>`;

// Function to update global styles in index.html / preview_app.html
function updateGlobalRulesInHtml(content) {
  // Update .screen:not(...) selector
  content = content.replace(
    /:not\(\.has-hc-header\):not\(:has\(\.hc-header-banner\)\)/g,
    ':not(.has-hc-header):not(:has(.hc-header-banner)):not(.has-mgr-header):not(:has(.mgr-header))'
  );

  // Update .screen:has(...) zero padding rule
  content = content.replace(
    /\.screen\.has-hc-header,\s*\.screen:has\(\.hc-header-banner\)\s*\{\s*height:\s*844px\s*!important;\s*padding-top:\s*0\s*!important;\s*\}/g,
    `.screen.has-hc-header,
            .screen:has(.hc-header-banner),
            .screen.has-mgr-header,
            .screen:has(.mgr-header) {
              height: 844px !important;
              padding-top: 0 !important;
            }`
  );

  // Update banner reset list
  content = content.replace(
    /\.hc-header-banner\s*\{\s*margin-top:\s*0\s*!important;\s*border-top-left-radius:\s*0\s*!important;\s*border-top-right-radius:\s*0\s*!important;\s*\}/g,
    `.hc-header-banner,
            .mgr-header {
              margin-top: 0 !important;
              border-top-left-radius: 0 !important;
              border-top-right-radius: 0 !important;
            }`
  );

  return content;
}

// 3. Update the 4 primary HTML files
const htmlFiles = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

htmlFiles.forEach(relPath => {
  const fullPath = path.join(ROOT, relPath);
  if (!fs.existsSync(fullPath)) return;
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace tpl-ManagerDashboard
  const tplRegex = /<template\s+id="tpl-ManagerDashboard">[\s\S]*?<\/template>/;
  if (!tplRegex.test(content)) {
    console.error('Could not find <template id="tpl-ManagerDashboard"> in', relPath);
    return;
  }
  content = content.replace(tplRegex, updatedTemplate.trim());

  // Update global styles
  content = updateGlobalRulesInHtml(content);

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Successfully updated:', relPath);
});

// 4. Update preview.html, preview.css, and preview.js
const previewHtmlPath = path.join(ROOT, 'EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html');
const previewCssPath = path.join(ROOT, 'EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.css');
const previewJsPath = path.join(ROOT, 'EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.js');

if (fs.existsSync(previewHtmlPath)) {
  const previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Manager Dashboard - Preview</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../../../preview/base.css" />
  <link rel="stylesheet" href="./preview.css" />
</head>
<body class="standalone">
${body}
  <script src="../../../preview/shared.js"></script>
  <script src="./preview.js"></script>
</body>
</html>
`;
  fs.writeFileSync(previewHtmlPath, previewHtml, 'utf8');
  fs.writeFileSync(previewCssPath, styles, 'utf8');
  console.log('Successfully updated ManagerDashboard preview.html and preview.css');
}

console.log('All files updated with top alignment and corner balancing!');
