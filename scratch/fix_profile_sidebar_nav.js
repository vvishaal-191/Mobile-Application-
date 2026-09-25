const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/vishaal.poobalan/Downloads/files (7)';

// 1. Update scratch/apply_exact_sidebar_update.js and scratch/apply_sidebar_redesign.js
['scratch/apply_exact_sidebar_update.js', 'scratch/apply_sidebar_redesign.js'].forEach(scriptPath => {
  const fullPath = path.join(ROOT, scriptPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    content = content.replace(
      /navClick\('tpl-Profile',\s*'..\/Profile\/preview\.html'\)/g,
      "navClick('tpl-MyProfile', '../MyProfile/preview.html')"
    );
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Updated ${scriptPath}`);
  }
});

// 2. Update the 4 primary HTML files:
const htmlFiles = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

htmlFiles.forEach(relPath => {
  const fullPath = path.join(ROOT, relPath);
  let content = fs.readFileSync(fullPath, 'utf8');

  // A. Fix the button onclick in sidebar nav
  content = content.replace(
    /onclick="handleSidebarNav\('tpl-Profile'\)"/g,
    `onclick="handleSidebarNav('tpl-MyProfile')"`
  );

  // B. Update handleSidebarNav to normalize tpl-Profile -> tpl-MyProfile
  content = content.replace(
    /(function\s+handleSidebarNav\s*\(\s*screenId\s*\)\s*\{[\r\n\s]*closeSidebarDrawer\(\);)/g,
    `function handleSidebarNav(screenId) {\r\n          closeSidebarDrawer();\r\n          if (screenId === 'tpl-Profile' || screenId === 'Profile') {\r\n            screenId = 'tpl-MyProfile';\r\n          }`
  );

  // C. Update loadScreen to normalize tpl-Profile -> tpl-MyProfile
  if (!content.includes(`tplId === 'tpl-Profile'`)) {
    content = content.replace(
      /(function\s+loadScreen\s*\(\s*tplId,\s*personKey\s*\)\s*\{[\r\n\s]*\/\/ Normalize screen aliases[\r\n\s]*if\s*\(\s*tplId\s*===\s*'tpl-MyRequests'\s*\)\s*\{[\r\n\s]*tplId\s*=\s*'tpl-LeaveHistory';[\r\n\s]*\})/,
      `$1\r\n          if (tplId === 'tpl-Profile' || tplId === 'Profile') {\r\n            tplId = 'tpl-MyProfile';\r\n          }`
    );
  }

  // D. Update EMPLOYEE_ALLOWED_SCREENS to include 'tpl-Profile'
  if (!content.includes(`'tpl-Profile'`)) {
    content = content.replace(
      /('tpl-MyProfile')([\r\n\s]*\];)/,
      `$1,\r\n          'tpl-Profile'$2`
    );
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`✓ Updated primary file ${relPath}`);
});

// 3. Update EmergereApp/EmergereApp/src/screens/EmployeeDashboard/preview.html
const edPrevHtmlPath = path.join(ROOT, 'EmergereApp/EmergereApp/src/screens/EmployeeDashboard/preview.html');
let edPrevHtml = fs.readFileSync(edPrevHtmlPath, 'utf8');
edPrevHtml = edPrevHtml.replace(
  /handleSidebarNav\('\.\.\/Profile\/preview\.html',\s*'tpl-Profile'\)/g,
  `handleSidebarNav('../MyProfile/preview.html', 'tpl-MyProfile')`
);
fs.writeFileSync(edPrevHtmlPath, edPrevHtml, 'utf8');
console.log('✓ Updated EmployeeDashboard/preview.html');

// 4. Update EmergereApp/EmergereApp/src/screens/EmployeeDashboard/preview.js
const edPrevJsPath = path.join(ROOT, 'EmergereApp/EmergereApp/src/screens/EmployeeDashboard/preview.js');
let edPrevJs = fs.readFileSync(edPrevJsPath, 'utf8');
if (!edPrevJs.includes(`tplId = 'tpl-MyProfile'`)) {
  edPrevJs = edPrevJs.replace(
    /(function\s+handleSidebarNav\s*\(\s*href,\s*tplId\s*\)\s*\{[\r\n\s]*closeSidebarDrawer\(\);)/,
    `$1\r\n  if (tplId === 'tpl-Profile' || tplId === 'Profile') {\r\n    tplId = 'tpl-MyProfile';\r\n  }\r\n  if (href === '../Profile/preview.html') {\r\n    href = '../MyProfile/preview.html';\r\n  }`
  );
  fs.writeFileSync(edPrevJsPath, edPrevJs, 'utf8');
  console.log('✓ Updated EmployeeDashboard/preview.js');
}

console.log('\nAll profile navigation fixes applied successfully!');
