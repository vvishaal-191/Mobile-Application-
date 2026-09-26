const fs = require('fs');
const path = require('path');

function applyHtmlFixes(content) {
  let updated = content;

  // ==========================================
  // FIX 1: Apply Permission Spacing (Requirements 1, 2, 3)
  // ==========================================
  // In tpl-ApplyPermission styles:
  // 1. .screen padding-bottom: 96px -> 140px
  updated = updated.replace(
    /(\.screen\s*\{\s*background:\s*var\(--perm-bg\)\s*!important;\s*padding-bottom:\s*)96px;/g,
    '$1140px;'
  );
  // Also check .screen, .screen.has-perm-header
  updated = updated.replace(
    /(\.screen,\s*\.screen\.has-perm-header,\s*\.screen\.has-al-header\s*\{[\s\S]*?padding-bottom:\s*)96px;/g,
    '$1140px;'
  );

  // 2. .perm-form-card margin and padding
  updated = updated.replace(
    /\.perm-form-card\s*\{\s*margin:\s*-24px 14px 20px 14px;\s*background:\s*#FFFFFF;\s*border-radius:\s*26px;\s*padding:\s*22px 16px 24px 16px;/g,
    '.perm-form-card {\n          margin: -24px 14px 40px 14px;\n          background: #FFFFFF;\n          border-radius: 26px;\n          padding: 22px 16px 32px 16px;'
  );

  // 3. .perm-submit-btn margin-top and margin-bottom
  updated = updated.replace(
    /\.perm-submit-btn\s*\{([\s\S]*?)margin-top:\s*6px;/g,
    '.perm-submit-btn {$1margin-top: 20px;\n          margin-bottom: 12px;'
  );

  // ==========================================
  // FIX 2: Manager Dashboard Notification Count (Requirements 4, 5, 6)
  // ==========================================
  // 1. In handleApplyLeaveSubmit, remove the block incrementing manager-dash-perm-badge
  const leavePermBadgeBlockRegex = /if\s*\(mgrTpl\)\s*\{\s*var\s*mgrHtml2\s*=\s*mgrTpl\.innerHTML;\s*mgrHtml2\s*=\s*mgrHtml2\.replace\(\/class="qbadge" id="manager-dash-perm-badge">\[0-9]\+\/,\s*function\(m\)\s*\{[\s\S]*?\}\);\s*mgrTpl\.innerHTML\s*=\s*mgrHtml2;\s*\}\s*var\s*livePermBadge\s*=\s*parentDoc\.getElementById\('manager-dash-perm-badge'\)[\s\S]*?livePermBadge\.textContent\s*=\s*String\(curP\s*\+\s*1\);\s*\}/g;
  updated = updated.replace(leavePermBadgeBlockRegex, '// Perm badge updated strictly on permission requests');

  // Also in handleApplyPermissionSubmit: remove the manual + 1 increment before syncManagerDashboard
  updated = updated.replace(
    /parentWin\.MGR_NOTIFICATION_COUNT\s*=\s*\(parentWin\.MGR_NOTIFICATION_COUNT\s*\|\|\s*0\)\s*\+\s*1;\s*var\s*mgrTpl\s*=\s*parentDoc\.getElementById\('tpl-ManagerDashboard'\);\s*if\s*\(mgrTpl\)\s*\{\s*var\s*mgrHtml\s*=\s*mgrTpl\.innerHTML;\s*mgrHtml\s*=\s*mgrHtml\.replace\(\/class="qbadge" id="manager-dash-perm-badge">\[0-9]\+\/,\s*function\(m\)\s*\{[\s\S]*?\}\);\s*mgrTpl\.innerHTML\s*=\s*mgrHtml;\s*\}\s*var\s*livePermBadge\s*=\s*parentDoc\.getElementById\('manager-dash-perm-badge'\)[\s\S]*?livePermBadge\.textContent\s*=\s*String\(curPermVal\s*\+\s*1\);\s*\}/g,
    '// Notification count accurately synchronized by syncManagerDashboard'
  );

  // 2. Rewrite syncManagerDashboard function in both occurrences
  const newSyncMgrBody = `function syncManagerDashboard(targetDoc) {
      const doc = targetDoc || document;
      if (!doc) return;
      const store = (window.parent && window.parent.EMP_LEAVE_REQUESTS) ? window.parent : (window.EMP_LEAVE_REQUESTS ? window : (window.parent || window));

      // 1. Gather all leave and permission requests with composite deduplication
      const allRequests = [];
      const seenKeys = {};

      function addReq(r) {
        if (!r) return;
        const key = r.id || (
          (r.employeeName || r.name || '') + '_' +
          (r.leaveType || r.type || r.permissionType || '') + '_' +
          (r.fromDate || r.date || '') + '_' +
          (r.reason || '')
        );
        if (key && !seenKeys[key]) {
          seenKeys[key] = true;
          if (r.id) seenKeys[r.id] = true;
          allRequests.push(r);
        }
      }

      if (store.EMP_LEAVE_REQUESTS && Array.isArray(store.EMP_LEAVE_REQUESTS)) {
        store.EMP_LEAVE_REQUESTS.forEach(addReq);
      }
      if (store.PERM_STATE && Array.isArray(store.PERM_STATE)) {
        store.PERM_STATE.forEach(addReq);
      }

      function isPermReq(r) {
        if (r.isPermission === true) return true;
        const t = (r.leaveType || r.type || r.permissionType || '').toLowerCase();
        return t.includes('permission') || t.includes('early going') || t.includes('late coming');
      }

      const pendingPerms = allRequests.filter(function(r) {
        return isPermReq(r) && (r.status || 'pending').toLowerCase() === 'pending';
      });

      const pendingLeaves = allRequests.filter(function(r) {
        return !isPermReq(r) && (r.status || 'pending').toLowerCase() === 'pending';
      });

      const totalPending = allRequests.filter(function(r) {
        return (r.status || 'pending').toLowerCase() === 'pending';
      });

      // 2. Notification Counts:
      // Permission Approvals card (Image 2) displays accurate count of pending permission requests
      const permBadge = doc.getElementById('manager-dash-perm-badge');
      if (permBadge) {
        const notifCount = pendingPerms.length;
        permBadge.textContent = String(notifCount);
        permBadge.style.display = notifCount > 0 ? 'inline-flex' : 'none';
      }

      const leaveBadge = doc.getElementById('manager-dash-leave-badge');
      if (leaveBadge) {
        leaveBadge.textContent = String(pendingLeaves.length);
        leaveBadge.style.display = pendingLeaves.length > 0 ? 'inline-flex' : 'none';
      }

      // Sync template HTML
      const parentDoc = (window.parent && window.parent.document) ? window.parent.document : (doc.ownerDocument || document);
      const mgrTpl = parentDoc && parentDoc.getElementById ? parentDoc.getElementById('tpl-ManagerDashboard') : null;
      if (mgrTpl && mgrTpl.innerHTML) {
        let mgrHtml = mgrTpl.innerHTML;
        mgrHtml = mgrHtml.replace(/class="qbadge" id="manager-dash-perm-badge">[0-9]+/, 'class="qbadge" id="manager-dash-perm-badge">' + pendingPerms.length);
        mgrHtml = mgrHtml.replace(/class="qbadge" id="manager-dash-leave-badge">[0-9]+/, 'class="qbadge" id="manager-dash-leave-badge">' + pendingLeaves.length);
        mgrTpl.innerHTML = mgrHtml;
      }

      store.MGR_NOTIFICATION_COUNT = pendingPerms.length;

      const statPending = doc.getElementById('mgr-stat-pending');
      if (statPending) {
        statPending.textContent = String(18 + totalPending.length);
      }`;

  // Replace syncManagerDashboard in both places
  const syncRegex = /function syncManagerDashboard\(targetDoc\)\s*\{[\s\S]*?const statPending = doc\.getElementById\('mgr-stat-pending'\);\s*if \(statPending\) \{\s*statPending\.textContent = String\(18 \+ totalPending\.length\);\s*\}\s*(\}\s*)?/g;
  updated = updated.replace(syncRegex, newSyncMgrBody + '\n    }');

  // ==========================================
  // FIX 3: Bottom Navigation Bar & Calendar Labels (Requirements 7, 8)
  // ==========================================
  // 1. In tpl-ManagerDashboard: Replace "Team Calendar" with "Holiday Calendar" in Quick Actions
  updated = updated.replace(
    /<!-- 4\. Team Calendar -->\s*<div class="qa-card qa-calendar" onclick="handleCardNav\('tpl-HolidayCalendar'\)">([\s\S]*?)<div class="qa-title">Team Calendar<\/div>/g,
    '<!-- 4. Holiday Calendar -->\n          <div class="qa-card qa-calendar" onclick="handleCardNav(\'tpl-HolidayCalendar\')">$1<div class="qa-title">Holiday Calendar</div>'
  );

  // 2. In tpl-ManagerDashboard sidebar drawer: Replace "Team Calendar" with "Holiday Calendar"
  updated = updated.replace(
    /<!-- 5\. Team Calendar -->\s*<button class="sidebar-nav-item" onclick="handleSidebarNav\('tpl-HolidayCalendar'\)">([\s\S]*?)<span class="sidebar-item-label">Team Calendar<\/span>/g,
    '<!-- 5. Holiday Calendar -->\n          <button class="sidebar-nav-item" onclick="handleSidebarNav(\'tpl-HolidayCalendar\')">$1<span class="sidebar-item-label">Holiday Calendar</span>'
  );

  // 3. In tpl-ManagerDashboard bottom nav: Update Tab 4 from Calendar (clock icon) to Holiday Calendar (calendar icon)
  const oldMgrTab4 = `<div class="nav-tab" id="tab-history" onclick="handleCardNav('tpl-HolidayCalendar')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
          <polyline points="12 7 12 12 15 15"></polyline>
        </svg>
        <span>Calendar</span>
      </div>`;

  const newMgrTab4 = `<div class="nav-tab" id="tab-history" onclick="handleCardNav('tpl-HolidayCalendar')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span style="white-space:nowrap;font-size:10px;">Holiday Calendar</span>
      </div>`;

  updated = updated.replace(oldMgrTab4, newMgrTab4);

  // 4. In tpl-HolidayCalendar bottom nav: Highlight Tab 4 with active class, calendar icon, and Holiday Calendar label
  const oldHcTab4 = `<div class="tab nav-tab" id="tab-history" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-LeaveHistory')}else if(typeof loadScreen==='function'){loadScreen('tpl-LeaveHistory')}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <polyline points="12 7 12 12 15 15"></polyline>
            </svg>
            <span>History</span>
          </div>`;

  const newHcTab4 = `<div class="tab nav-tab active" id="tab-history" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-HolidayCalendar')}else if(typeof loadScreen==='function'){loadScreen('tpl-HolidayCalendar')}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span style="white-space:nowrap;font-size:10px;color:#0066FF;font-weight:700;">Holiday Calendar</span>
          </div>`;

  updated = updated.replace(oldHcTab4, newHcTab4);

  // ==========================================
  // FIX 4: Navigation and Access Restrictions (Requirements 9, 10, 11)
  // ==========================================
  // 1. In MANAGER_ALLOWED_SCREENS, add 'tpl-Notifications' and 'tpl-EmployeeDashboard'
  updated = updated.replace(
    /'tpl-LeaveBalance',\s*'tpl-HolidayCalendar',/g,
    "'tpl-LeaveBalance',\n          'tpl-HolidayCalendar',\n          'tpl-Notifications',\n          'tpl-EmployeeDashboard',"
  );

  // 2. In loadScreen: normalize manager navigation
  const oldLoadScreenNormalize = `if (tplId === 'tpl-Dashboard') {
            tplId = (window.AUTH_USER && window.AUTH_USER.role === 'manager') ? 'tpl-ManagerDashboard' : 'tpl-EmployeeDashboard';
          }`;

  const newLoadScreenNormalize = `if (window.AUTH_USER && window.AUTH_USER.role === 'manager') {
            if (tplId === 'tpl-EmployeeDashboard' || tplId === 'tpl-Dashboard') {
              tplId = 'tpl-ManagerDashboard';
            }
            if (tplId === 'tpl-LeaveHistory' || tplId === 'tpl-History') {
              tplId = 'tpl-HolidayCalendar';
            }
          } else {
            if (tplId === 'tpl-Dashboard') {
              tplId = 'tpl-EmployeeDashboard';
            }
          }`;

  updated = updated.replace(oldLoadScreenNormalize, newLoadScreenNormalize);

  // 3. In loadScreen restriction check: handle manager gracefully without errors
  const oldMgrRestrCheck = `if (window.AUTH_USER.role === 'manager' && MANAGER_ALLOWED_SCREENS.indexOf(tplId) === -1) {
              if (tplId === 'tpl-LeaveHistory') {
                alert('Access Restricted: Manager account is not authorized to access My Requests (History).');
              } else {
                alert('Access Restricted: Manager account is not authorized to access this employee-only screen.');
              }
              return;
            }`;

  const newMgrRestrCheck = `if (window.AUTH_USER.role === 'manager' && MANAGER_ALLOWED_SCREENS.indexOf(tplId) === -1) {
              if (tplId === 'tpl-LeaveHistory' || tplId === 'tpl-History') {
                loadScreen('tpl-HolidayCalendar');
                return;
              }
              if (tplId === 'tpl-EmployeeDashboard' || tplId === 'tpl-Dashboard') {
                loadScreen('tpl-ManagerDashboard');
                return;
              }
              alert('Access Restricted: Manager account is not authorized to access this employee-only screen.');
              return;
            }`;

  updated = updated.replace(oldMgrRestrCheck, newMgrRestrCheck);

  // 4. In tabs.forEach click delegation (around line 18698):
  const oldTabHistoryRestr = `} else if (key === 'history' && window.AUTH_USER && window.AUTH_USER.role === 'manager') {
                    alert('Access Restricted: Manager account is not authorized to access My Requests (History).');
                  } else {`;

  const newTabHistoryRestr = `} else if ((key === 'history' || key === 'calendar') && window.AUTH_USER && window.AUTH_USER.role === 'manager') {
                    loadScreen('tpl-HolidayCalendar');
                  } else {`;

  updated = updated.replace(oldTabHistoryRestr, newTabHistoryRestr);

  // 5. In backBtns.forEach delegation (around line 18714): ensure all back buttons route managers to tpl-ManagerDashboard
  const oldBackBtnQuery = `var backBtns = doc.querySelectorAll('.back-btn, [class*="back"]');`;
  const newBackBtnQuery = `var backBtns = doc.querySelectorAll('.back-btn, [class*="back"], .hc-back-btn, .lb-back-btn, .perm-back-btn');`;
  updated = updated.replace(oldBackBtnQuery, newBackBtnQuery);

  // 6. In tpl-HolidayCalendar back button and dashboard tab inline handlers
  const oldHcBackBtn = `<button class="hc-back-btn" title="Back" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-EmployeeDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-EmployeeDashboard')}else{window.history.back()}">`;
  const newHcBackBtn = `<button class="hc-back-btn" title="Back" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen((window.parent.AUTH_USER&&window.parent.AUTH_USER.role==='manager')?'tpl-ManagerDashboard':'tpl-EmployeeDashboard')}else if(typeof loadScreen==='function'){loadScreen((window.AUTH_USER&&window.AUTH_USER.role==='manager')?'tpl-ManagerDashboard':'tpl-EmployeeDashboard')}else{window.history.back()}">`;
  updated = updated.replace(oldHcBackBtn, newHcBackBtn);

  const oldHcDashTab = `<div class="tab nav-tab" id="tab-dashboard" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-EmployeeDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-EmployeeDashboard')}">`;
  const newHcDashTab = `<div class="tab nav-tab" id="tab-dashboard" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen((window.parent.AUTH_USER&&window.parent.AUTH_USER.role==='manager')?'tpl-ManagerDashboard':'tpl-EmployeeDashboard')}else if(typeof loadScreen==='function'){loadScreen((window.AUTH_USER&&window.AUTH_USER.role==='manager')?'tpl-ManagerDashboard':'tpl-EmployeeDashboard')}">`;
  updated = updated.replace(oldHcDashTab, newHcDashTab);

  return updated;
}

module.exports = { applyHtmlFixes };
