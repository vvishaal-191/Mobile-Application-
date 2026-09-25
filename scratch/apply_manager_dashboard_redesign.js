const fs = require('fs');
const path = require('path');

// 1. Load the raw test content
const testContent = fs.readFileSync('scratch/test_manager_dashboard.html', 'utf8');

// Extract head style and body content from testContent
const styleMatch = testContent.match(/<style>([\s\S]*?)<\/style>/);
const bodyMatch = testContent.match(/<body>([\s\S]*?)<\/body>/);

if (!styleMatch || !bodyMatch) {
  console.error('Failed to match style or body from test_manager_dashboard.html');
  process.exit(1);
}

let styles = styleMatch[1];
let body = bodyMatch[1];

// Clean any comments containing "View All"
body = body.replace(/<!--[^-]*?View All[^-]*?-->/gi, '');

// Update .device and body styles for embedded iframe template
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
      background: var(--bg);
      border-radius: 0;
      overflow: hidden;
      position: relative;
      box-shadow: none;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
    }`);

// Assemble template
const templateContent = `  <template id="tpl-ManagerDashboard">
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

// Verify critical IDs
const checks = [
  'class="qbadge" id="manager-dash-leave-badge">0</span>',
  'class="qbadge" id="manager-dash-perm-badge">0</span>',
  'id="mgr-dash-requests-label"',
  'id="mgr-dash-requests-list"',
  'openSidebarDrawer()',
  'class="hamburger-btn"'
];

for (const c of checks) {
  if (!templateContent.includes(c)) {
    console.error('FATAL: Missing critical element:', c);
    process.exit(1);
  }
}

if (/view\s*all/i.test(templateContent)) {
  console.error('FATAL: "View All" was found in template!');
  process.exit(1);
}

console.log('Template content successfully verified!');

// Helper to replace template in an HTML file
function updateHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('Skipping non-existent:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  const tplRegex = /<template\s+id="tpl-ManagerDashboard">[\s\S]*?<\/template>/;
  if (!tplRegex.test(content)) {
    console.error('Could not find <template id="tpl-ManagerDashboard"> in', filePath);
    return;
  }
  content = content.replace(tplRegex, templateContent.trim());
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated:', filePath);
}

// Update the 4 HTML files
updateHtmlFile('index.html');
updateHtmlFile('preview_app.html');
updateHtmlFile('EmergereApp/EmergereApp/index.html');
updateHtmlFile('EmergereApp/EmergereApp/preview_app.html');

console.log('All 4 main HTML template files updated successfully.');
