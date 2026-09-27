const fs = require('fs');

console.log('=== PREPARING FULL UPDATE FOR MANAGER DASHBOARD & LINKED SCREENS ===\n');

const laB64 = fs.readFileSync('scratch/la_b64.txt', 'utf8').trim();
const paB64 = fs.readFileSync('scratch/pa_b64.txt', 'utf8').trim();

// ---------------------------------------------------------------------------------
// 1. UPDATE EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.js
// ---------------------------------------------------------------------------------
const mgrPreviewJsPath = 'EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.js';
if (fs.existsSync(mgrPreviewJsPath)) {
  let js = fs.readFileSync(mgrPreviewJsPath, 'utf8');

  // Update handleCardNav to support tabName and ensure proper fallback navigation
  const newJs = `function openSidebarDrawer() {
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

function handleSidebarNav(screenId, personKey, tabName) {
  closeSidebarDrawer();
  if (screenId === 'tpl-Profile' || screenId === 'Profile') {
    screenId = 'tpl-MyProfile';
  }
  setTimeout(function() {
    handleCardNav(screenId, personKey, tabName);
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

function handleCardNav(screenId, personKey, tabName) {
  const pWin = (window.parent && window.parent !== window) ? window.parent : window;
  if (tabName) {
    pWin.TARGET_LEAVE_TAB = tabName;
  }
  if (pWin.loadScreen) {
    pWin.loadScreen(screenId, personKey || (screenId === 'tpl-LeaveApprovalDetail' ? 'priya' : undefined));
  } else if (typeof loadScreen === 'function') {
    loadScreen(screenId, personKey || (screenId === 'tpl-LeaveApprovalDetail' ? 'priya' : undefined));
  } else {
    const screenMap = {
      'tpl-ManagerDashboard': '../ManagerDashboard/preview.html',
      'tpl-TeamAttendance': '../TeamAttendance/preview.html',
      'tpl-LeaveApprovals': '../LeaveApprovals/preview.html',
      'tpl-LeaveApprovalDetail': '../LeaveApprovalDetail/preview.html',
      'tpl-PermissionApprovals': '../PermissionApprovals/preview.html',
      'tpl-HolidayCalendar': '../HolidayCalendar/preview.html',
      'tpl-Notifications': '../Notifications/preview.html',
      'tpl-MyProfile': '../MyProfile/preview.html'
    };
    if (screenMap[screenId]) {
      let q = personKey ? '?person=' + encodeURIComponent(personKey) : '';
      if (tabName) q += (q ? '&' : '?') + 'tab=' + encodeURIComponent(tabName);
      window.location.href = screenMap[screenId] + q;
    }
  }
}

function openLeaveApprovalsTab(tabName) {
  const pWin = (window.parent && window.parent !== window) ? window.parent : window;
  pWin.TARGET_LEAVE_TAB = tabName;
  handleCardNav('tpl-LeaveApprovals', null, tabName);
}

function openNotificationsFromManager() {
  handleCardNav('tpl-Notifications');
}
`;
  fs.writeFileSync(mgrPreviewJsPath, newJs, 'utf8');
  console.log('[OK] Updated EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.js');
}

// ---------------------------------------------------------------------------------
// 2. UPDATE EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html
// ---------------------------------------------------------------------------------
const mgrPreviewHtmlPath = 'EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html';
if (fs.existsSync(mgrPreviewHtmlPath)) {
  let html = fs.readFileSync(mgrPreviewHtmlPath, 'utf8');

  // Update Approved and Rejected onclick handlers
  html = html.replace(
    /<div class="stat-item stat-approved"[^>]*>/,
    `<div class="stat-item stat-approved" onclick="openLeaveApprovalsTab('approved')">`
  );
  html = html.replace(
    /<div class="stat-item stat-rejected"[^>]*>/,
    `<div class="stat-item stat-rejected" onclick="openLeaveApprovalsTab('rejected')">`
  );

  // Update Recent Requests filtering in syncManagerDashboard:
  // Only display approved or rejected requests in Recent Requests!
  const targetRecentReq = `      // 3. Recent Requests Section (matching Image 3)
      const requestsLabel = doc.getElementById('mgr-dash-requests-label');
      const requestsList = doc.getElementById('mgr-dash-requests-list');

      if (requestsLabel) {
        requestsLabel.textContent = 'Recent Requests (' + allRequests.length + ')';
      }

      if (requestsList) {
        if (allRequests.length === 0) {`;

  const newRecentReq = `      // 3. Recent Requests Section (matching Image 1)
      // Only requests that have been approved or rejected by the manager appear in Recent Requests.
      // Newly submitted pending requests do not appear here until approved/rejected.
      const processedRequests = allRequests.filter(function(r) {
        const s = (r.status || '').toLowerCase();
        return s === 'approved' || s === 'rejected';
      });

      const requestsLabel = doc.getElementById('mgr-dash-requests-label');
      const requestsList = doc.getElementById('mgr-dash-requests-list');

      if (requestsLabel) {
        requestsLabel.textContent = 'Recent Requests (' + processedRequests.length + ')';
      }

      if (requestsList) {
        if (processedRequests.length === 0) {`;

  if (html.includes(targetRecentReq)) {
    html = html.replace(targetRecentReq, newRecentReq);
    html = html.replace(`allRequests.forEach(function(req) {`, `processedRequests.forEach(function(req) {`);
  } else {
    // If not exact match, regex replace
    html = html.replace(
      /\/\/ 3\. Recent Requests Section[\s\S]*?if\s*\(requestsList\)\s*\{\s*if\s*\(allRequests\.length === 0\)\s*\{/,
      newRecentReq
    );
    html = html.replace(`allRequests.forEach(function(req) {`, `processedRequests.forEach(function(req) {`);
  }

  // Ensure openLeaveApprovalsTab function is defined in inline script
  if (!html.includes('function openLeaveApprovalsTab')) {
    html = html.replace(
      `function openNotificationsFromManager() {`,
      `function openLeaveApprovalsTab(tabName) {
      const pWin = (window.parent && window.parent !== window) ? window.parent : window;
      pWin.TARGET_LEAVE_TAB = tabName;
      handleCardNav('tpl-LeaveApprovals', null, tabName);
    }

    function openNotificationsFromManager() {`
    );
  }

  // Ensure handleCardNav supports tabName parameter
  html = html.replace(
    /function handleCardNav\(screenId, personKey\)\s*\{[\s\S]*?loadScreen\(screenId, personKey \|\| \(screenId === ['"]tpl-LeaveApprovalDetail['"] \? ['"]priya['"] : undefined\)\);\s*\}\s*\}/,
    `function handleCardNav(screenId, personKey, tabName) {
      const pWin = (window.parent && window.parent !== window) ? window.parent : window;
      if (tabName) {
        pWin.TARGET_LEAVE_TAB = tabName;
      }
      if (pWin.loadScreen) {
        pWin.loadScreen(screenId, personKey || (screenId === 'tpl-LeaveApprovalDetail' ? 'priya' : undefined));
      } else if (typeof loadScreen === 'function') {
        loadScreen(screenId, personKey || (screenId === 'tpl-LeaveApprovalDetail' ? 'priya' : undefined));
      } else {
        const screenMap = {
          'tpl-ManagerDashboard': '../ManagerDashboard/preview.html',
          'tpl-TeamAttendance': '../TeamAttendance/preview.html',
          'tpl-LeaveApprovals': '../LeaveApprovals/preview.html',
          'tpl-LeaveApprovalDetail': '../LeaveApprovalDetail/preview.html',
          'tpl-PermissionApprovals': '../PermissionApprovals/preview.html',
          'tpl-HolidayCalendar': '../HolidayCalendar/preview.html',
          'tpl-Notifications': '../Notifications/preview.html',
          'tpl-MyProfile': '../MyProfile/preview.html'
        };
        if (screenMap[screenId]) {
          let q = personKey ? '?person=' + encodeURIComponent(personKey) : '';
          if (tabName) q += (q ? '&' : '?') + 'tab=' + encodeURIComponent(tabName);
          window.location.href = screenMap[screenId] + q;
        }
      }
    }`
  );

  // Fix handleSidebarNav signature in inline script if needed
  html = html.replace(
    /function handleSidebarNav\(screenId\)\s*\{/,
    `function handleSidebarNav(screenId, personKey, tabName) {`
  );

  fs.writeFileSync(mgrPreviewHtmlPath, html, 'utf8');
  console.log('[OK] Updated EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html');
}

// ---------------------------------------------------------------------------------
// 3. UPDATE EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html
// ---------------------------------------------------------------------------------
const laPreviewHtmlPath = 'EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html';
if (fs.existsSync(laPreviewHtmlPath)) {
  let html = fs.readFileSync(laPreviewHtmlPath, 'utf8');

  // Replace banner with clean background image and selectable text overlay
  const laBannerTarget = /<div class="la-header-banner-wrap" id="la-header-banner" style="[^"]*">[\s\S]*?<\/div>/;
  const newLaBanner = `<div class="la-header-banner-wrap pa-header-banner perm-header-banner la-header-banner" id="la-header-banner" style="position: relative; width: 100%; overflow: hidden; border-top-left-radius: 0 !important; border-top-right-radius: 0 !important; border-bottom-left-radius: 28px; border-bottom-right-radius: 28px; box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22); background: #0066FF; margin: 0 !important; margin-top: 0 !important;">
    <img src="data:image/png;base64,${laB64}" alt="Leave Approvals" class="header-banner-img" style="width: 100%; height: auto; display: block;" />
    <button
      class="back-btn-hitbox"
      onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}else{window.location.href='../ManagerDashboard/preview.html'}"
      title="Go Back"
      aria-label="Go Back"
      style="position: absolute; left: 14px; top: 22px; width: 44px; height: 44px; border-radius: 50%; background: transparent; border: none; cursor: pointer; z-index: 10; -webkit-tap-highlight-color: transparent;"
    ></button>
    <div class="header-banner-text-overlay" style="position: absolute; left: 66px; top: 0; bottom: 0; right: 110px; display: flex; flex-direction: column; justify-content: center; z-index: 6; pointer-events: auto; user-select: text !important; -webkit-user-select: text !important;">
      <h1 class="header-banner-title" style="margin: 0; font-size: 20px; font-weight: 800; color: #FFFFFF; line-height: 1.25; letter-spacing: -0.2px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; user-select: text !important; -webkit-user-select: text !important; cursor: text;">Leave Approvals</h1>
      <p class="header-banner-subtitle" style="margin: 3px 0 0; font-size: 13px; font-weight: 500; color: rgba(255, 255, 255, 0.85); line-height: 1.2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; user-select: text !important; -webkit-user-select: text !important; cursor: text;">Manage Team Requests</p>
    </div>
  </div>`;
  html = html.replace(laBannerTarget, newLaBanner);

  // Un-highlight Home icon in bottom nav
  const laOldHomeTab = /<div class="tab nav-tab active" id="tab-dashboard">[\s\S]*?<\/div>\s*<span>Dashboard<\/span>\s*<span class="active-dot-indicator"><\/span>\s*<\/div>/;
  const laNewHomeTab = `<div class="tab nav-tab" id="tab-dashboard" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}else{window.location.href='../ManagerDashboard/preview.html'}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z"></path>
            </svg>
            <span>Dashboard</span>
          </div>`;
  html = html.replace(laOldHomeTab, laNewHomeTab);

  // Add text selection CSS & tab initialization logic
  if (!html.includes('initLeaveApprovalsTab')) {
    html = html.replace(
      '</head>',
      `  <style>
    .header-banner-text-overlay,
    .header-banner-title,
    .header-banner-subtitle {
      user-select: text !important;
      -webkit-user-select: text !important;
      cursor: text;
    }
    .header-banner-text-overlay *::selection {
      background: rgba(255, 255, 255, 0.35) !important;
      color: #FFFFFF !important;
    }
  </style>
</head>`
    );

    const initScript = `
        function initLeaveApprovalsTab() {
          const pWin = (window.parent && window.parent !== window) ? window.parent : window;
          let targetTab = pWin.TARGET_LEAVE_TAB;
          pWin.TARGET_LEAVE_TAB = null;
          if (!targetTab) {
            try {
              const params = new URLSearchParams(window.location.search);
              targetTab = params.get('tab');
            } catch(e) {}
          }
          if (targetTab === 'approved' || targetTab === 'rejected' || targetTab === 'pending') {
            const pill = document.getElementById('tab-pill-' + targetTab);
            if (pill) {
              switchLeaveTab(targetTab, pill);
              return;
            }
          }
          updateLeaveTabCounts();
          renderLeaveApprovals();
        }
        document.addEventListener('DOMContentLoaded', initLeaveApprovalsTab);
        setTimeout(initLeaveApprovalsTab, 50);
`;
    html = html.replace('</script>', initScript + '      </script>');
  }

  fs.writeFileSync(laPreviewHtmlPath, html, 'utf8');
  console.log('[OK] Updated EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html');
}

// ---------------------------------------------------------------------------------
// 4. UPDATE EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html
// ---------------------------------------------------------------------------------
const paPreviewHtmlPath = 'EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html';
if (fs.existsSync(paPreviewHtmlPath)) {
  let html = fs.readFileSync(paPreviewHtmlPath, 'utf8');

  // Replace banner with clean background image and selectable text overlay
  const paBannerTarget = /<div class="pa-header-banner-wrap[^"]*" id="pa-header-banner"[^>]*>[\s\S]*?<\/div>/;
  const newPaBanner = `<div class="pa-header-banner-wrap pa-header-banner perm-header-banner la-header-banner" id="pa-header-banner" style="position: relative; width: 100%; overflow: hidden; border-top-left-radius: 0 !important; border-top-right-radius: 0 !important; border-bottom-left-radius: 28px; border-bottom-right-radius: 28px; box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22); background: #0066FF; margin: 0 !important; margin-top: 0 !important;">
        <img src="data:image/png;base64,${paB64}" alt="Permission Approvals" class="header-banner-img" style="width: 100%; height: auto; display: block;" />
        <button
          class="back-btn-hitbox"
          onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}else{window.history.back()}"
          title="Go Back"
          aria-label="Go Back"
          style="position: absolute; left: 14px; top: 22px; width: 44px; height: 44px; border-radius: 50%; background: transparent; border: none; cursor: pointer; z-index: 10; -webkit-tap-highlight-color: transparent;"
        ></button>
        <div class="header-banner-text-overlay" style="position: absolute; left: 66px; top: 0; bottom: 0; right: 110px; display: flex; flex-direction: column; justify-content: center; z-index: 6; pointer-events: auto; user-select: text !important; -webkit-user-select: text !important;">
          <h1 class="header-banner-title" style="margin: 0; font-size: 20px; font-weight: 800; color: #FFFFFF; line-height: 1.25; letter-spacing: -0.2px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; user-select: text !important; -webkit-user-select: text !important; cursor: text;">Permission Approvals</h1>
          <p class="header-banner-subtitle" style="margin: 3px 0 0; font-size: 13px; font-weight: 500; color: rgba(255, 255, 255, 0.85); line-height: 1.2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; user-select: text !important; -webkit-user-select: text !important; cursor: text;">Short-duration Passes</p>
        </div>
      </div>`;
  html = html.replace(paBannerTarget, newPaBanner);

  // Un-highlight Home icon in bottom nav
  const paOldHomeTab = /<div class="tab nav-tab active" id="tab-dashboard">[\s\S]*?<\/div>\s*<span>Dashboard<\/span>\s*<span class="active-dot-indicator"><\/span>\s*<\/div>/;
  const paNewHomeTab = `<div class="tab nav-tab" id="tab-dashboard" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}else{window.location.href='../ManagerDashboard/preview.html'}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z"></path>
        </svg>
        <span>Dashboard</span>
      </div>`;
  html = html.replace(paOldHomeTab, paNewHomeTab);

  if (!html.includes('header-banner-text-overlay')) {
    html = html.replace(
      '</head>',
      `  <style>
    .header-banner-text-overlay,
    .header-banner-title,
    .header-banner-subtitle {
      user-select: text !important;
      -webkit-user-select: text !important;
      cursor: text;
    }
    .header-banner-text-overlay *::selection {
      background: rgba(255, 255, 255, 0.35) !important;
      color: #FFFFFF !important;
    }
  </style>
</head>`
    );
  }

  fs.writeFileSync(paPreviewHtmlPath, html, 'utf8');
  console.log('[OK] Updated EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html');
}

// ---------------------------------------------------------------------------------
// 5. UPDATE EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/preview.html
// ---------------------------------------------------------------------------------
const ladPreviewHtmlPath = 'EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/preview.html';
if (fs.existsSync(ladPreviewHtmlPath)) {
  let html = fs.readFileSync(ladPreviewHtmlPath, 'utf8');

  // Un-highlight Home icon in bottom nav (remove active class)
  html = html.replace(
    /<div class="nav-tab active" id="tab-dashboard"/,
    `<div class="nav-tab" id="tab-dashboard"`
  );

  fs.writeFileSync(ladPreviewHtmlPath, html, 'utf8');
  console.log('[OK] Updated EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/preview.html');
}

// ---------------------------------------------------------------------------------
// 6. UPDATE APP HTML BUNDLES (preview_app.html, index.html, etc.)
// ---------------------------------------------------------------------------------
const appFiles = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

appFiles.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');

  // A. In tpl-ManagerDashboard:
  // Update stat-approved and stat-rejected onclicks
  c = c.replace(
    /<div class="stat-item stat-approved"[^>]*>/,
    `<div class="stat-item stat-approved" onclick="openLeaveApprovalsTab('approved')">`
  );
  c = c.replace(
    /<div class="stat-item stat-rejected"[^>]*>/,
    `<div class="stat-item stat-rejected" onclick="openLeaveApprovalsTab('rejected')">`
  );

  // Update Recent Requests in tpl-ManagerDashboard syncManagerDashboard
  const targetRecentReq = `      // 3. Recent Requests Section (matching Image 3)
      const requestsLabel = doc.getElementById('mgr-dash-requests-label');
      const requestsList = doc.getElementById('mgr-dash-requests-list');

      if (requestsLabel) {
        requestsLabel.textContent = 'Recent Requests (' + allRequests.length + ')';
      }

      if (requestsList) {
        if (allRequests.length === 0) {`;

  const newRecentReq = `      // 3. Recent Requests Section (matching Image 1)
      // Only requests that have been approved or rejected by the manager appear in Recent Requests.
      // Newly submitted pending requests do not appear here until approved/rejected.
      const processedRequests = allRequests.filter(function(r) {
        const s = (r.status || '').toLowerCase();
        return s === 'approved' || s === 'rejected';
      });

      const requestsLabel = doc.getElementById('mgr-dash-requests-label');
      const requestsList = doc.getElementById('mgr-dash-requests-list');

      if (requestsLabel) {
        requestsLabel.textContent = 'Recent Requests (' + processedRequests.length + ')';
      }

      if (requestsList) {
        if (processedRequests.length === 0) {`;

  if (c.includes(targetRecentReq)) {
    c = c.replace(targetRecentReq, newRecentReq);
    // Replace allRequests.forEach inside requestsList block
    const reqListIdx = c.indexOf(`requestsLabel.textContent = 'Recent Requests (' + processedRequests.length + ')';`);
    if (reqListIdx !== -1) {
      const nextEach = c.indexOf(`allRequests.forEach(function(req) {`, reqListIdx);
      if (nextEach !== -1 && nextEach - reqListIdx < 3000) {
        c = c.substring(0, nextEach) + `processedRequests.forEach(function(req) {` + c.substring(nextEach + `allRequests.forEach(function(req) {`.length);
      }
    }
  }

  // Ensure openLeaveApprovalsTab and handleCardNav in tpl-ManagerDashboard
  if (!c.includes('function openLeaveApprovalsTab(')) {
    c = c.replace(
      `function openNotificationsFromManager() {`,
      `function openLeaveApprovalsTab(tabName) {
      const pWin = (window.parent && window.parent !== window) ? window.parent : window;
      pWin.TARGET_LEAVE_TAB = tabName;
      handleCardNav('tpl-LeaveApprovals', null, tabName);
    }

    function openNotificationsFromManager() {`
    );
  }

  c = c.replace(
    /function handleCardNav\(screenId, personKey\)\s*\{[\s\S]*?loadScreen\(screenId, personKey \|\| \(screenId === ['"]tpl-LeaveApprovalDetail['"] \? ['"]priya['"] : undefined\)\);\s*\}\s*\}/,
    `function handleCardNav(screenId, personKey, tabName) {
      const pWin = (window.parent && window.parent !== window) ? window.parent : window;
      if (tabName) {
        pWin.TARGET_LEAVE_TAB = tabName;
      }
      if (pWin.loadScreen) {
        pWin.loadScreen(screenId, personKey || (screenId === 'tpl-LeaveApprovalDetail' ? 'priya' : undefined));
      } else if (typeof loadScreen === 'function') {
        loadScreen(screenId, personKey || (screenId === 'tpl-LeaveApprovalDetail' ? 'priya' : undefined));
      } else {
        const screenMap = {
          'tpl-ManagerDashboard': '../ManagerDashboard/preview.html',
          'tpl-TeamAttendance': '../TeamAttendance/preview.html',
          'tpl-LeaveApprovals': '../LeaveApprovals/preview.html',
          'tpl-LeaveApprovalDetail': '../LeaveApprovalDetail/preview.html',
          'tpl-PermissionApprovals': '../PermissionApprovals/preview.html',
          'tpl-HolidayCalendar': '../HolidayCalendar/preview.html',
          'tpl-Notifications': '../Notifications/preview.html',
          'tpl-MyProfile': '../MyProfile/preview.html'
        };
        if (screenMap[screenId]) {
          let q = personKey ? '?person=' + encodeURIComponent(personKey) : '';
          if (tabName) q += (q ? '&' : '?') + 'tab=' + encodeURIComponent(tabName);
          window.location.href = screenMap[screenId] + q;
        }
      }
    }`
  );

  // B. In tpl-LeaveApprovals:
  // Update banner to clean background + selectable text
  const laBannerTarget = /<div class="la-header-banner-wrap[^"]*" id="la-header-banner" style="[^"]*">[\s\S]*?<\/div>/;
  const newLaBanner = `<div class="la-header-banner-wrap pa-header-banner perm-header-banner la-header-banner" id="la-header-banner" style="position: relative; width: 100%; overflow: hidden; border-top-left-radius: 0 !important; border-top-right-radius: 0 !important; border-bottom-left-radius: 28px; border-bottom-right-radius: 28px; box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22); background: #0066FF; margin: 0 !important; margin-top: 0 !important;">
            <img src="data:image/png;base64,${laB64}" alt="Leave Approvals" class="header-banner-img" style="width: 100%; height: auto; display: block;" />
            <button
              class="back-btn-hitbox"
              onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}else{window.location.href='../ManagerDashboard/preview.html'}"
              title="Go Back"
              aria-label="Go Back"
              style="position: absolute; left: 14px; top: 22px; width: 44px; height: 44px; border-radius: 50%; background: transparent; border: none; cursor: pointer; z-index: 10; -webkit-tap-highlight-color: transparent;"
            ></button>
            <div class="header-banner-text-overlay" style="position: absolute; left: 66px; top: 0; bottom: 0; right: 110px; display: flex; flex-direction: column; justify-content: center; z-index: 6; pointer-events: auto; user-select: text !important; -webkit-user-select: text !important;">
              <h1 class="header-banner-title" style="margin: 0; font-size: 20px; font-weight: 800; color: #FFFFFF; line-height: 1.25; letter-spacing: -0.2px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; user-select: text !important; -webkit-user-select: text !important; cursor: text;">Leave Approvals</h1>
              <p class="header-banner-subtitle" style="margin: 3px 0 0; font-size: 13px; font-weight: 500; color: rgba(255, 255, 255, 0.85); line-height: 1.2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; user-select: text !important; -webkit-user-select: text !important; cursor: text;">Manage Team Requests</p>
            </div>
          </div>`;
  c = c.replace(laBannerTarget, newLaBanner);

  // Un-highlight Home icon in tpl-LeaveApprovals bottom nav
  const laOldHomeTab = /<div class="tab nav-tab active" id="tab-dashboard">[\s\S]*?<\/div>\s*<span>Dashboard<\/span>\s*<span class="active-dot-indicator"><\/span>\s*<\/div>/;
  const laNewHomeTab = `<div class="tab nav-tab" id="tab-dashboard" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}else{window.location.href='../ManagerDashboard/preview.html'}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z"></path>
            </svg>
            <span>Dashboard</span>
          </div>`;
  c = c.replace(laOldHomeTab, laNewHomeTab);

  // Add initLeaveApprovalsTab in tpl-LeaveApprovals script if not present
  if (!c.includes('function initLeaveApprovalsTab(')) {
    const initScript = `
        function initLeaveApprovalsTab() {
          const pWin = (window.parent && window.parent !== window) ? window.parent : window;
          let targetTab = pWin.TARGET_LEAVE_TAB;
          pWin.TARGET_LEAVE_TAB = null;
          if (!targetTab) {
            try {
              const params = new URLSearchParams(window.location.search);
              targetTab = params.get('tab');
            } catch(e) {}
          }
          if (targetTab === 'approved' || targetTab === 'rejected' || targetTab === 'pending') {
            const pill = document.getElementById('tab-pill-' + targetTab);
            if (pill) {
              switchLeaveTab(targetTab, pill);
              return;
            }
          }
          updateLeaveTabCounts();
          renderLeaveApprovals();
        }
        document.addEventListener('DOMContentLoaded', initLeaveApprovalsTab);
        setTimeout(initLeaveApprovalsTab, 50);
`;
    // Insert into tpl-LeaveApprovals script
    const laTplIdx = c.indexOf('id="tpl-LeaveApprovals"');
    const laTplEnd = c.indexOf('</template>', laTplIdx);
    const laScriptEnd = c.lastIndexOf('</script>', laTplEnd);
    c = c.substring(0, laScriptEnd) + initScript + c.substring(laScriptEnd);
  }

  // C. In tpl-PermissionApprovals:
  // Update banner to clean background + selectable text
  const paBannerTarget = /<div class="pa-header-banner-wrap[^"]*" id="pa-header-banner"[^>]*>[\s\S]*?<\/div>/;
  const newPaBanner = `<div class="pa-header-banner-wrap pa-header-banner perm-header-banner la-header-banner" id="pa-header-banner" style="position: relative; width: 100%; overflow: hidden; border-top-left-radius: 0 !important; border-top-right-radius: 0 !important; border-bottom-left-radius: 28px; border-bottom-right-radius: 28px; box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22); background: #0066FF; margin: 0 !important; margin-top: 0 !important;">
            <img src="data:image/png;base64,${paB64}" alt="Permission Approvals" class="header-banner-img" style="width: 100%; height: auto; display: block;" />
            <button
              class="back-btn-hitbox"
              onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}else{window.history.back()}"
              title="Go Back"
              aria-label="Go Back"
              style="position: absolute; left: 14px; top: 22px; width: 44px; height: 44px; border-radius: 50%; background: transparent; border: none; cursor: pointer; z-index: 10; -webkit-tap-highlight-color: transparent;"
            ></button>
            <div class="header-banner-text-overlay" style="position: absolute; left: 66px; top: 0; bottom: 0; right: 110px; display: flex; flex-direction: column; justify-content: center; z-index: 6; pointer-events: auto; user-select: text !important; -webkit-user-select: text !important;">
              <h1 class="header-banner-title" style="margin: 0; font-size: 20px; font-weight: 800; color: #FFFFFF; line-height: 1.25; letter-spacing: -0.2px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; user-select: text !important; -webkit-user-select: text !important; cursor: text;">Permission Approvals</h1>
              <p class="header-banner-subtitle" style="margin: 3px 0 0; font-size: 13px; font-weight: 500; color: rgba(255, 255, 255, 0.85); line-height: 1.2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; user-select: text !important; -webkit-user-select: text !important; cursor: text;">Short-duration Passes</p>
            </div>
          </div>`;
  c = c.replace(paBannerTarget, newPaBanner);

  // Un-highlight Home icon in tpl-PermissionApprovals bottom nav
  const paOldHomeTab = /<div class="tab nav-tab active" id="tab-dashboard">[\s\S]*?<\/div>\s*<span>Dashboard<\/span>\s*<span class="active-dot-indicator"><\/span>\s*<\/div>/;
  const paNewHomeTab = `<div class="tab nav-tab" id="tab-dashboard" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}else{window.location.href='../ManagerDashboard/preview.html'}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z"></path>
            </svg>
            <span>Dashboard</span>
          </div>`;
  c = c.replace(paOldHomeTab, paNewHomeTab);

  // D. In tpl-LeaveApprovalDetail:
  // Un-highlight Home icon
  c = c.replace(
    /<div class="nav-tab active" id="tab-dashboard" onclick="handleDetailBackNav\(\)">/,
    `<div class="nav-tab" id="tab-dashboard" onclick="handleDetailBackNav()">`
  );

  // E. In global styles: add text selection styling for header banners
  if (!c.includes('.header-banner-text-overlay')) {
    c = c.replaceAll(
      `.pa-header-banner-wrap,
            .pa-header-banner,`,
      `.pa-header-banner-wrap,
            .pa-header-banner,
            .header-banner-text-overlay,
            .header-banner-title,
            .header-banner-subtitle {
              user-select: text !important;
              -webkit-user-select: text !important;
              cursor: text;
            }
            .header-banner-text-overlay *::selection {
              background: rgba(255, 255, 255, 0.35) !important;
              color: #FFFFFF !important;
            }
            .pa-header-banner-wrap,
            .pa-header-banner,`
    );
  }

  fs.writeFileSync(f, c, 'utf8');
  console.log('[OK] Updated', f);
});

console.log('\n=== ALL USER REQUESTS APPLIED SUCCESSFULLY ===');
