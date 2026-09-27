const fs = require('fs');

const laB64 = fs.readFileSync('scratch/la_b64.txt', 'utf8').trim();
const paB64 = fs.readFileSync('scratch/pa_b64.txt', 'utf8').trim();

function updateFile(filePath, transforms) {
  if (!fs.existsSync(filePath)) {
    console.log('[SKIP] Not found:', filePath);
    return;
  }
  let c = fs.readFileSync(filePath, 'utf8');
  transforms.forEach(t => {
    c = t(c, filePath);
  });
  fs.writeFileSync(filePath, c, 'utf8');
  console.log('[OK] Updated', filePath);
}

// ---------------------------------------------------------------------------------
// TRANSFORM 1: Manager Dashboard (Template or standalone)
// ---------------------------------------------------------------------------------
function transformManagerDashboard(content) {
  let c = content;

  // 1. Approved & Rejected buttons
  c = c.replace(/<div class="stat-item stat-approved"[^>]*>/g, `<div class="stat-item stat-approved" onclick="openLeaveApprovalsTab('approved')">`);
  c = c.replace(/<div class="stat-item stat-rejected"[^>]*>/g, `<div class="stat-item stat-rejected" onclick="openLeaveApprovalsTab('rejected')">`);

  // 2. Recent Requests filter in syncManagerDashboard
  // Replace the label and rendering block
  c = c.replace(
    /(\/\/\s*3\.\s*Recent\s*Requests\s*Section[^\n]*\r?\n\s*const\s+requestsLabel\s*=\s*doc\.getElementById\('mgr-dash-requests-label'\);\r?\n\s*const\s+requestsList\s*=\s*doc\.getElementById\('mgr-dash-requests-list'\);)/,
    `// 3. Recent Requests Section (matching Image 1)
      // Only requests that have been approved or rejected by the manager appear in Recent Requests.
      // Newly submitted pending requests do not appear here until approved/rejected.
      const processedRequests = allRequests.filter(function(r) {
        const s = (r.status || '').toLowerCase();
        return s === 'approved' || s === 'rejected';
      });

      const requestsLabel = doc.getElementById('mgr-dash-requests-label');
      const requestsList = doc.getElementById('mgr-dash-requests-list');`
  );

  c = c.replace(
    /requestsLabel\.textContent\s*=\s*'Recent Requests \('\s*\+\s*allRequests\.length\s*\+\s*'\)';/,
    `requestsLabel.textContent = 'Recent Requests (' + processedRequests.length + ')';`
  );

  c = c.replace(
    /if\s*\(\s*allRequests\.length\s*===\s*0\s*\)\s*\{/,
    `if (processedRequests.length === 0) {`
  );

  c = c.replace(
    /allRequests\.forEach\(function\(req\)\s*\{/,
    `processedRequests.forEach(function(req) {`
  );

  // 3. Ensure openLeaveApprovalsTab function exists
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

  // 4. Ensure handleCardNav supports tabName
  c = c.replace(
    /function handleCardNav\(screenId, personKey[^\)]*\)\s*\{[\s\S]*?loadScreen\(screenId, personKey \|\| \(screenId === ['"]tpl-LeaveApprovalDetail['"] \? ['"]priya['"] : undefined\)\);\s*\}\s*\}/,
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

  return c;
}

// ---------------------------------------------------------------------------------
// TRANSFORM 2: Leave Approvals (Template or standalone)
// ---------------------------------------------------------------------------------
function transformLeaveApprovals(content) {
  let c = content;

  // 1. Banner update with clean background image + selectable text overlay
  const laBannerRegex = /<div class="la-header-banner-wrap[^"]*" id="la-header-banner"[^>]*>[\s\S]*?<\/div>/;
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
  c = c.replace(laBannerRegex, newLaBanner);

  // 2. Un-highlight Home icon in bottom nav
  const laHomeRegex = /<div class="tab nav-tab active" id="tab-dashboard">[\s\S]*?<span>Dashboard<\/span>[\s\S]*?<\/div>/;
  const newHomeTab = `<div class="tab nav-tab" id="tab-dashboard" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}else{window.location.href='../ManagerDashboard/preview.html'}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z"></path>
            </svg>
            <span>Dashboard</span>
          </div>`;
  c = c.replace(laHomeRegex, newHomeTab);

  // 3. Tab initialization logic
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
    const sEnd = c.lastIndexOf('</script>');
    if (sEnd !== -1) {
      c = c.substring(0, sEnd) + initScript + c.substring(sEnd);
    }
  }

  // 4. Text selection CSS
  if (!c.includes('header-banner-text-overlay')) {
    c = c.replace(
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

  return c;
}

// ---------------------------------------------------------------------------------
// TRANSFORM 3: Permission Approvals (Template or standalone)
// ---------------------------------------------------------------------------------
function transformPermissionApprovals(content) {
  let c = content;

  // 1. Banner update with clean background image + selectable text overlay
  const paBannerRegex = /<div class="pa-header-banner-wrap[^"]*" id="pa-header-banner"[^>]*>[\s\S]*?<\/div>/;
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
  c = c.replace(paBannerRegex, newPaBanner);

  // 2. Un-highlight Home icon in bottom nav
  const paHomeRegex = /<div class="tab nav-tab active" id="tab-dashboard">[\s\S]*?<span>Dashboard<\/span>[\s\S]*?<\/div>/;
  const newHomeTab = `<div class="tab nav-tab" id="tab-dashboard" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}else{window.location.href='../ManagerDashboard/preview.html'}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z"></path>
            </svg>
            <span>Dashboard</span>
          </div>`;
  c = c.replace(paHomeRegex, newHomeTab);

  // 3. Text selection CSS
  if (!c.includes('header-banner-text-overlay')) {
    c = c.replace(
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

  return c;
}

// ---------------------------------------------------------------------------------
// TRANSFORM 4: Leave Approval Detail (Template or standalone)
// ---------------------------------------------------------------------------------
function transformLeaveApprovalDetail(content) {
  let c = content;
  c = c.replace(/<div class="nav-tab active" id="tab-dashboard"/g, `<div class="nav-tab" id="tab-dashboard"`);
  return c;
}

// ---------------------------------------------------------------------------------
// TRANSFORM 5: Global App Files (contain multiple <template id="...">)
// ---------------------------------------------------------------------------------
function transformAppHtml(content) {
  let c = content;

  function updateTemplateInContent(html, tplId, transformFn) {
    const startTag = `<template id="${tplId}">`;
    const startIdx = html.indexOf(startTag);
    if (startIdx === -1) return html;
    const endIdx = html.indexOf('</template>', startIdx);
    if (endIdx === -1) return html;

    const before = html.substring(0, startIdx + startTag.length);
    const inner = html.substring(startIdx + startTag.length, endIdx);
    const after = html.substring(endIdx);

    const updatedInner = transformFn(inner);
    return before + updatedInner + after;
  }

  c = updateTemplateInContent(c, 'tpl-ManagerDashboard', transformManagerDashboard);
  c = updateTemplateInContent(c, 'tpl-LeaveApprovals', transformLeaveApprovals);
  c = updateTemplateInContent(c, 'tpl-PermissionApprovals', transformPermissionApprovals);
  c = updateTemplateInContent(c, 'tpl-LeaveApprovalDetail', transformLeaveApprovalDetail);

  return c;
}

// Apply to standalone files:
updateFile('EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html', [transformManagerDashboard]);
updateFile('EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html', [transformLeaveApprovals]);
updateFile('EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html', [transformPermissionApprovals]);
updateFile('EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/preview.html', [transformLeaveApprovalDetail]);

// Apply to all app HTML bundles:
const appFiles = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];
appFiles.forEach(f => updateFile(f, [transformAppHtml]));

console.log('\n=== CLEAN FIXES APPLIED ===');
