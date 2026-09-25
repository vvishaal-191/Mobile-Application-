const fs = require('fs');

const testContent = fs.readFileSync('scratch/test_manager_dashboard.html', 'utf8');

// Extract style
const styleMatch = testContent.match(/<style>([\s\S]*?)<\/style>/);
const bodyMatch = testContent.match(/<body>([\s\S]*?)<\/body>/);

let cssContent = styleMatch[1];
let bodyContent = bodyMatch[1];

// Clean any comments with View All
bodyContent = bodyContent.replace(/<!--[^-]*?View All[^-]*?-->/gi, '');

// For standalone preview, add standalone body support
cssContent = `/* preview/base.css tokens override and screen-specific styling */
${cssContent}
`;

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
${bodyContent}
  <script src="../../../preview/shared.js"></script>
  <script src="./preview.js"></script>
</body>
</html>
`;

const previewJs = `function openSidebarDrawer() {
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) overlay.classList.add('open');
  const pWin = (window.parent && window.parent !== window) ? window.parent : window;
  const prof = pWin.USER_PROFILE || window.USER_PROFILE || {};
  const nameEl = document.getElementById('sidebar-name');
  const initialsEl = document.getElementById('sidebar-initials');
  const curName = prof.name || (window.AUTH_USER && window.AUTH_USER.name) || 'Rahul Sharma';
  if (nameEl) nameEl.textContent = curName;
  if (initialsEl) {
    const parts = curName.trim().split(/\\s+/);
    initialsEl.textContent = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : curName.slice(0, 2).toUpperCase();
  }
}

function closeSidebarDrawer() {
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) overlay.classList.remove('open');
}

function handleSidebarNav(screenId) {
  closeSidebarDrawer();
  if (screenId === 'tpl-Profile' || screenId === 'Profile') {
    screenId = 'tpl-MyProfile';
  }
  setTimeout(function() {
    const pWin = (window.parent && window.parent !== window) ? window.parent : window;
    if (pWin.loadScreen) {
      pWin.loadScreen(screenId);
    } else if (typeof loadScreen === 'function') {
      loadScreen(screenId);
    } else {
      const screenMap = {
        'tpl-ManagerDashboard': '../ManagerDashboard/preview.html',
        'tpl-TeamAttendance': '../TeamAttendance/preview.html',
        'tpl-LeaveApprovals': '../LeaveApprovals/preview.html',
        'tpl-PermissionApprovals': '../PermissionApprovals/preview.html',
        'tpl-HolidayCalendar': '../HolidayCalendar/preview.html',
        'tpl-Notifications': '../Notifications/preview.html',
        'tpl-MyProfile': '../MyProfile/preview.html'
      };
      if (screenMap[screenId]) window.location.href = screenMap[screenId];
    }
  }, 120);
}

function handleSidebarLogout() {
  closeSidebarDrawer();
  setTimeout(function() {
    const pWin = (window.parent && window.parent !== window) ? window.parent : window;
    if (pWin.logout) {
      pWin.logout();
    } else if (pWin.loadScreen) {
      pWin.loadScreen('tpl-Login');
    } else {
      window.location.href = '../Login/preview.html';
    }
  }, 100);
}

function handleCardNav(screenId) {
  handleSidebarNav(screenId);
}

function openNotificationsFromManager() {
  handleSidebarNav('tpl-Notifications');
}
`;

fs.writeFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html', previewHtml, 'utf8');
fs.writeFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.css', cssContent, 'utf8');
fs.writeFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.js', previewJs, 'utf8');

console.log('ManagerDashboard preview files updated successfully.');
