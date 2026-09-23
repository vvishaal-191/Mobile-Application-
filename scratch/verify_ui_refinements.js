const fs = require('fs');
const path = require('path');

let pass = 0;
let fail = 0;

function assert(desc, condition) {
  if (condition) {
    console.log('  PASS:', desc);
    pass++;
  } else {
    console.error('  FAIL:', desc);
    fail++;
  }
}

console.log('=== VERIFYING EMPLOYEE DASHBOARD UI REFINEMENTS ===\n');

// 1. Check all HTML bundle files
const htmlFiles = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'scratch/test_preview.html',
];

htmlFiles.forEach(file => {
  console.log(`Checking HTML: ${file}`);
  const content = fs.readFileSync(file, 'utf8');

  // Requirement 1: Container cards alignment & consistent spacing
  assert(`${file}: screen padding-top 0 is specified`, content.includes('padding-top: 0 !important;'));
  assert(`${file}: dash-header margin-top 0 is specified`, content.includes('margin-top: 0 !important;'));
  assert(`${file}: dash-action-grid margin is 14px 16px`, content.includes('margin: 14px 16px 14px 16px;'));
  assert(`${file}: dash-action-card has uniform height 126px`, content.includes('height: 126px;'));

  // Requirement 2: Header title replaced with "Dashboard" and circle indicator below it
  assert(`${file}: Has header-dashboard-title with Dashboard`, content.includes('header-dashboard-title') && content.includes('Dashboard'));
  

  // Requirement 3: Use logo from third image on Employee Dashboard
  assert(`${file}: Header brand has logo image`, content.includes('brand-logo-img'));

  // Requirement 4: Sidebar has Mobile Application and third image logo
  assert(`${file}: Hamburger button calls openSidebarDrawer()`, content.includes('openSidebarDrawer()'));
  assert(`${file}: Sidebar overlay exists`, content.includes('id="sidebar-overlay"') || content.includes('sidebar-overlay'));
  assert(`${file}: Sidebar header has Mobile Application`, content.includes('Mobile Application'));
  assert(`${file}: Sidebar brand has logo image`, content.includes('sidebar-logo'));
  assert(`${file}: Sidebar has EMPLOYEE badge`, content.includes('EMPLOYEE'));
  assert(`${file}: Sidebar has Log Out button`, content.includes('Log Out') && content.includes('handleSidebarLogout'));

  // Requirement 5: Recent Requests displayed ONLY on approved/rejected requests
  assert(`${file}: Recent requests section exists`, content.includes('recent-requests-section'));
  assert(`${file}: Recent requests section is hidden by default (display: none)`, content.includes('id="emp-recent-requests-section" style="display: none;"') || content.includes('display: none; /* Hidden by default */'));
  assert(`${file}: syncDashboardRequests filters for approved or rejected requests only`, content.includes("st === 'approved' || st === 'rejected'"));

  // Requirement 6: Functionality and workflow intact
  assert(`${file}: Profile has clean greeting without duplicate Hello`, !content.includes('Hello, Hello,'));
  assert(`${file}: Greeting title has Sneha Reddy`, content.includes('id="dash-greeting"') && content.includes('Sneha Reddy'));
  assert(`${file}: Apply Leave button intact`, content.includes('btn-action-leave'));
  assert(`${file}: Apply Permission button intact`, content.includes('btn-action-perm'));
  assert(`${file}: My Requests button intact`, content.includes('btn-action-reqs'));
  assert(`${file}: Holiday Calendar button intact`, content.includes('btn-action-holiday'));
  assert(`${file}: Leave Balances card intact`, content.includes('dash-leave-balance-card'));
  console.log('');
});

// Check standalone preview screen files
console.log('Checking EmployeeDashboard screen files:');
const prevHtml = fs.readFileSync('EmergereApp/EmergereApp/src/screens/EmployeeDashboard/preview.html', 'utf8');
const prevCss = fs.readFileSync('EmergereApp/EmergereApp/src/screens/EmployeeDashboard/preview.css', 'utf8');
const prevJs = fs.readFileSync('EmergereApp/EmergereApp/src/screens/EmployeeDashboard/preview.js', 'utf8');

assert('preview.html: header has Dashboard title', prevHtml.includes('header-dashboard-title') && prevHtml.includes('Dashboard'));

assert('preview.html: header uses tech-circuit-logo.png', prevHtml.includes('tech-circuit-logo.png'));
assert('preview.html: sidebar uses tech-circuit-logo.png', prevHtml.includes('sidebar-logo') && prevHtml.includes('tech-circuit-logo.png'));
assert('preview.html: recent-requests-section is hidden by default', prevHtml.includes('id="emp-recent-requests-section" style="display: none;"'));
assert('preview.css: dash-action-grid has margin: 14px 16px', prevCss.includes('margin: 14px 16px 14px 16px;'));
assert('preview.css: dash-action-card has height: 126px', prevCss.includes('height: 126px;'));
assert('preview.css: recent-requests-section display is none', prevCss.includes('display: none; /* Shown ONLY when approved or rejected request exists */'));
assert('preview.js: syncDashboardRequests filters for approved or rejected', prevJs.includes("st === 'approved' || st === 'rejected'"));

// 2. Check React Native files
console.log('\nChecking React Native implementation:');
const rnScreenFile = 'EmergereApp/EmergereApp/src/screens/EmployeeDashboard/EmployeeDashboardScreen.jsx';
const rnStylesFile = 'EmergereApp/EmergereApp/src/screens/EmployeeDashboard/EmployeeDashboardScreen.styles.js';

const rnScreen = fs.readFileSync(rnScreenFile, 'utf8');
const rnStyles = fs.readFileSync(rnStylesFile, 'utf8');

assert('RN Screen: INITIAL_REQUESTS is empty by default', rnScreen.includes('const INITIAL_REQUESTS = [];'));
assert('RN Screen: uses tech-circuit-logo in header brand', rnScreen.includes('tech-circuit-logo.png'));
assert('RN Screen: has headerDashboardTitle and headerDashboardCircle', rnScreen.includes('headerDashboardTitle') && rnScreen.includes('headerDashboardCircle'));
assert('RN Screen: uses tech-circuit-logo in sidebar', rnScreen.includes('tech-circuit-logo.png'));
assert('RN Screen: recent requests filtered for approved or rejected only', rnScreen.includes("st === 'approved' || st === 'rejected'"));
assert('RN Styles: has headerDashboardTitle styles', rnStyles.includes('headerDashboardTitle:'));
assert('RN Styles: has headerDashboardCircle styles', rnStyles.includes('headerDashboardCircle:'));
assert('RN Styles: actionCard has height 126', rnStyles.includes('height: 126,'));
assert('RN Styles: actionGrid has marginHorizontal 16 and marginTop 14', rnStyles.includes('marginHorizontal: 16,') && rnStyles.includes('marginTop: 14,'));

console.log(`\n=== SUMMARY: ${pass} passed, ${fail} failed ===\n`);
if (fail > 0) process.exit(1);
