function openSidebarDrawer() {
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) overlay.classList.add('open');
  const pWin = (window.parent && window.parent !== window) ? window.parent : window;
  const prof = pWin.USER_PROFILE || window.USER_PROFILE || {};
  const nameEl = document.getElementById('sidebar-name');
  const initialsEl = document.getElementById('sidebar-initials');
  const curName = prof.name || (window.AUTH_USER && window.AUTH_USER.name) || 'Rahul Sharma';
  if (nameEl) nameEl.textContent = curName;
  if (initialsEl) {
    const parts = curName.trim().split(/\s+/);
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


function syncManagerDashboard(targetDoc) {
      const doc = targetDoc || document;
      if (!doc) return;
      const store = (window.parent && window.parent.EMP_LEAVE_REQUESTS) ? window.parent : (window.EMP_LEAVE_REQUESTS ? window : (window.parent || window));

      function isPermReq(r) {
        if (!r) return false;
        if (r.isPermission === true) return true;
        const t = (r.leaveType || r.type || r.permissionType || '').toLowerCase();
        return t.includes('permission') || t.includes('early going') || t.includes('late coming');
      }

      const submittedMap = store.MANAGER_SUBMITTED_DECISIONS || {};
      function isDecidedAndSubmitted(r) {
        if (!r) return false;
        const s = (r.status || '').toLowerCase();
        const isDecided = (s === 'approved' || s === 'rejected');
        if (!isDecided) return false;
        const isSubmitted = r.managerDecisionSubmitted === true ||
                            r.decisionSubmitted === true ||
                            !!submittedMap[r.id] ||
                            (r.id && !!submittedMap[String(r.id).replace(/^perm-/, '')]) ||
                            (r.id && !!submittedMap['perm-' + r.id]) ||
                            !!r.approvedAt ||
                            !!r.rejectedAt;
        return isSubmitted;
      }

      // 1. Completely separate Leave Requests and Permission Requests into distinct collections
      const leaveMap = {};
      const permMap = {};

      function addLeaveReq(r) {
        if (!r || isPermReq(r)) return;
        const key = r.id || ((r.employeeName || r.name || 'emp') + '_' + (r.leaveType || r.type || 'leave') + '_' + (r.fromDate || r.date || '') + '_' + (r.reason || ''));
        if (!leaveMap[key]) {
          leaveMap[key] = r;
        } else {
          if (!isDecidedAndSubmitted(leaveMap[key]) && isDecidedAndSubmitted(r)) {
            leaveMap[key] = r;
          }
        }
      }

      function addPermReq(r) {
        if (!r || !isPermReq(r)) return;
        const cleanId = r.id ? String(r.id).replace(/^perm-/, '') : null;
        const key = cleanId || ((r.employeeName || r.name || 'emp') + '_' + (r.leaveType || r.type || r.permissionType || 'perm') + '_' + (r.date || r.fromDate || '') + '_' + (r.reason || ''));
        if (!permMap[key]) {
          permMap[key] = r;
        } else {
          if (!isDecidedAndSubmitted(permMap[key]) && isDecidedAndSubmitted(r)) {
            permMap[key] = r;
          }
        }
      }

      if (store.EMP_LEAVE_REQUESTS && Array.isArray(store.EMP_LEAVE_REQUESTS)) {
        store.EMP_LEAVE_REQUESTS.forEach(function(r) {
          if (isPermReq(r)) addPermReq(r);
          else addLeaveReq(r);
        });
      }

      if (store.PERM_STATE && Array.isArray(store.PERM_STATE)) {
        store.PERM_STATE.forEach(addPermReq);
      }

      if (store.PERSON_DATA && typeof store.PERSON_DATA === 'object') {
        Object.keys(store.PERSON_DATA).forEach(function(k) {
          const p = store.PERSON_DATA[k];
          if (p && typeof p === 'object') {
            if (isPermReq(p)) addPermReq(p);
            else if (p.leaveType && p.status && p.status !== 'pending') addLeaveReq(p);
          }
        });
      }

      const allLeaves = Object.values(leaveMap);
      const allPerms = Object.values(permMap);

      const pendingLeaves = allLeaves.filter(function(r) {
        return (r.status || 'pending').toLowerCase() === 'pending';
      });

      const pendingPerms = allPerms.filter(function(r) {
        return (r.status || 'pending').toLowerCase() === 'pending';
      });

      const totalPending = pendingLeaves.length + pendingPerms.length;

      // 2. Notification Counts:
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
        statPending.textContent = String(18 + totalPending);
      }

      // 3. Recent Requests Section
      // Only requests that have been approved or rejected by the manager AND submitted appear in Recent Requests.
      // Newly submitted pending requests do not appear here until approved/rejected and submitted.
      const processedLeaves = allLeaves.filter(isDecidedAndSubmitted);
      const processedPerms = allPerms.filter(isDecidedAndSubmitted);

      // Separate Leave cards and Permission cards - NEVER combine them into a single card
      const processedRequests = [];
      processedLeaves.forEach(function(l) { processedRequests.push(Object.assign({}, l, { _isPermCard: false })); });
      processedPerms.forEach(function(p) { processedRequests.push(Object.assign({}, p, { _isPermCard: true })); });

      processedRequests.sort(function(a, b) {
        const tA = a.approvedAt || a.rejectedAt || a.createdAt || 0;
        const tB = b.approvedAt || b.rejectedAt || b.createdAt || 0;
        return tB - tA;
      });

      const requestsLabel = doc.getElementById('mgr-dash-requests-label');
      const requestsList = doc.getElementById('mgr-dash-requests-list');

      if (requestsLabel) {
        requestsLabel.textContent = 'Recent Requests (' + processedRequests.length + ')';
      }

      if (requestsList) {
        if (processedRequests.length === 0) {
          requestsList.innerHTML = '<div class="empty-requests-wrap">'
            + '<svg width="100" height="85" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg">'
            + '<defs>'
            + '<linearGradient id="docGrad" x1="0" y1="0" x2="0" y2="1">'
            + '<stop offset="0%" stop-color="#EFF6FF"/>'
            + '<stop offset="100%" stop-color="#DBEAFE"/>'
            + '</linearGradient>'
            + '</defs>'
            + '<rect x="25" y="10" width="46" height="58" rx="8" fill="url(#docGrad)" stroke="#BFDBFE" stroke-width="1.5"/>'
            + '<line x1="33" y1="22" x2="57" y2="22" stroke="#93C5FD" stroke-width="2.5" stroke-linecap="round"/>'
            + '<line x1="33" y1="30" x2="63" y2="30" stroke="#93C5FD" stroke-width="2.5" stroke-linecap="round"/>'
            + '<line x1="33" y1="38" x2="52" y2="38" stroke="#93C5FD" stroke-width="2.5" stroke-linecap="round"/>'
            + '<line x1="33" y1="46" x2="45" y2="46" stroke="#93C5FD" stroke-width="2.5" stroke-linecap="round"/>'
            + '<circle cx="58" cy="52" r="14" fill="#FFFFFF" stroke="#0066FF" stroke-width="3"/>'
            + '<circle cx="58" cy="52" r="10" fill="#E0F2FE" fill-opacity="0.4"/>'
            + '<line x1="68" y1="62" x2="78" y2="72" stroke="#0066FF" stroke-width="3.5" stroke-linecap="round"/>'
            + '<path d="M18 28 L20 22 L22 28 L28 30 L22 32 L20 38 L18 32 L12 30 Z" fill="#93C5FD" opacity="0.7"/>'
            + '<path d="M76 16 L77.5 12 L79 16 L83 17.5 L79 19 L77.5 23 L76 19 L72 17.5 Z" fill="#93C5FD" opacity="0.6"/>'
            + '</svg>'
            + '<div class="empty-title">No recent requests</div>'
            + '<div class="empty-desc">New leave or permission requests from your team will appear here.</div>'
            + '</div>';
        } else {
          let htmlCards = '';
          processedRequests.forEach(function(req) {
            const isPerm = req._isPermCard === true || isPermReq(req);
            const empName = req.employeeName || req.name || (isPerm ? 'John Doe' : 'Sneha Reddy');
            const empInitials = req.employeeInitials || req.initials || (empName.trim().split(/\s+/).map(function(w){return w[0];}).join('').toUpperCase().slice(0, 2)) || (isPerm ? 'JD' : 'SR');
            const empRole = req.employeeRole || req.role || (isPerm ? 'UI/UX Designer' : 'Senior Software Engineer');
            const reqType = isPerm ? (req.type || req.permissionType || req.leaveType || 'Early Going') : (req.leaveType || req.type || 'Casual Leave');
            const duration = req.duration || req.daysText || req.totalDays || (isPerm ? '1 Hour' : '2 Days');

            let dates = req.date;
            if (!dates) {
              if (req.fromDate && req.toDate) {
                dates = req.fromDate === req.toDate ? (req.fromDate + ' – ' + req.toDate) : (req.fromDate + ' – ' + req.toDate);
              } else {
                dates = req.fromDate || req.toDate || '04-Sep-2026';
              }
            }

            const reason = req.reason || (isPerm ? 'Personal work / checkup' : "Family function - attending sister's wedding ceremony in Bangalore.");
            const status = (req.status || 'pending').toLowerCase();
            const statusLabel = status === 'approved' ? 'Approved' : (status === 'rejected' ? 'Rejected' : 'Pending');

            const cardKey = req.id || (isPerm ? 'perm-init-1' : 'priya');

            htmlCards += '<div class="recent-req-item" onclick="handleCardNav(\'tpl-LeaveApprovalDetail\', \'' + cardKey + '\')" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:14px; padding:14px 16px; margin-bottom:12px; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.03); transition:all 0.2s;">'
              + '<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">'
              + '<div style="display:flex; align-items:center; gap:10px;">'
              + '<div style="width:38px; height:38px; border-radius:50%; background:#2563EB; color:#FFFFFF; font-weight:700; font-size:14px; display:flex; align-items:center; justify-content:center;">' + empInitials + '</div>'
              + '<div>'
              + '<div style="font-size:14px; font-weight:700; color:#0F172A;">' + empName + '</div>'
              + '<div style="font-size:11.5px; color:#64748B;">' + empRole + '</div>'
              + '</div>'
              + '</div>'
              + '</div>'

              + '<div style="display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom:6px;">'
              + '<span style="background:#EFF6FF; color:#0066FF; border:1px solid #DBEAFE; padding:3px 10px; border-radius:8px; font-weight:600;">' + reqType + ' (' + duration + ')</span>'
              + '<span style="color:#475569; font-weight:500;">' + dates + '</span>'
              + '<span style="margin-left:auto; font-size:11.5px; font-weight:700; padding:3px 10px; border-radius:8px; background:' + (status === 'approved' ? '#DCFCE7' : '#FEE2E2') + '; color:' + (status === 'approved' ? '#15803D' : '#DC2626') + ';">' + statusLabel + '</span>'
              + '</div>'

              + '<div style="font-size:12.5px; color:#475569; background:#F8FAFC; padding:8px 12px; border-radius:8px; line-height:1.4; border-left:3px solid #0066FF;">'
              + '"' + reason + '"'
              + '</div>'
              + '</div>';
          });
          requestsList.innerHTML = htmlCards;
        }
      }
    }

document.addEventListener('DOMContentLoaded', function() { syncManagerDashboard(document); });
setTimeout(function() { syncManagerDashboard(document); }, 50);
