const fs = require('fs');
const path = require('path');

// Target HTML files
const htmlFiles = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
];

function updateTemplateInContent(content, tplId, transformFn) {
  const startTag = '<template id="' + tplId + '">';
  const startIdx = content.indexOf(startTag);
  if (startIdx === -1) {
    console.log('Template not found: ' + tplId);
    return content;
  }
  const endTag = '</template>';
  const endIdx = content.indexOf(endTag, startIdx);
  if (endIdx === -1) {
    console.log('Template end tag not found: ' + tplId);
    return content;
  }
  const oldTplInner = content.substring(startIdx + startTag.length, endIdx);
  const newTplInner = transformFn(oldTplInner);
  return content.substring(0, startIdx + startTag.length) + newTplInner + content.substring(endIdx);
}

// 1. Transform tpl-LeaveApprovals
function transformLeaveApprovals(inner) {
  const newScript = `<script>
    let currentLeaveTab = 'pending';

    function isPermissionRequest(r) {
      if (!r) return false;
      if (r.isPermission === true || r._isPermCard === true) return true;
      if (r.isPermission === false) return false;
      if (r.permissionType) return true;
      const permTypes = ['early going', 'late coming', 'personal work', 'official work', 'permission'];
      const t = (r.type || r.leaveType || r.permissionType || '').trim().toLowerCase();
      return permTypes.includes(t) || t.includes('early going') || t.includes('late coming');
    }

    function isLeaveRequest(r) {
      if (!r) return false;
      return !isPermissionRequest(r);
    }

    function switchLeaveTab(status, el) {
      currentLeaveTab = status;
      const pills = document.querySelectorAll('.tab-bar-card .tab-pill');
      pills.forEach(p => p.classList.remove('active'));
      if (el) el.classList.add('active');
      renderLeaveApprovals();
    }

    function updateLeaveTabCounts() {
      const store = (window.parent && window.parent.EMP_LEAVE_REQUESTS) ? window.parent : (window.EMP_LEAVE_REQUESTS ? window : (window.parent || window));
      const reqs = (store.EMP_LEAVE_REQUESTS || []).filter(isLeaveRequest);

      let pending = 0, approved = 0, rejected = 0;
      reqs.forEach(r => {
        const s = (r.status || 'pending').toLowerCase();
        if (s === 'approved') approved++;
        else if (s === 'rejected') rejected++;
        else pending++;
      });

      const countPending = document.getElementById('count-pending');
      const countApproved = document.getElementById('count-approved');
      const countRejected = document.getElementById('count-rejected');

      if (countPending) countPending.textContent = pending;
      if (countApproved) countApproved.textContent = approved;
      const wrapApproved = document.getElementById("count-approved-wrap");
      if (wrapApproved) wrapApproved.style.display = approved > 0 ? "inline" : "none";
      if (countRejected) countRejected.textContent = rejected;
    }

    function renderLeaveApprovals() {
      const store = (window.parent && window.parent.EMP_LEAVE_REQUESTS) ? window.parent : (window.EMP_LEAVE_REQUESTS ? window : (window.parent || window));
      const reqs = (store.EMP_LEAVE_REQUESTS || []).filter(isLeaveRequest);
      const listEl = document.getElementById('leave-cards-list');
      const msg = document.getElementById('no-leave-msg');

      const filtered = reqs.filter(r => (r.status || 'pending').toLowerCase() === currentLeaveTab);

      if (filtered.length === 0) {
        if (msg) msg.style.display = 'flex';
        if (listEl) listEl.innerHTML = '';
      } else {
        if (msg) msg.style.display = 'none';
        if (listEl) {
          let html = '';
          filtered.forEach(r => {
            const empName = r.employeeName || r.name || 'Rahul Sharma';
            const empRole = r.employeeRole || r.role || 'Senior Software Engineer';
            const lType = r.leaveType || r.type || 'Casual Leave';
            const dates = r.date || (r.fromDate + (r.toDate ? ' – ' + r.toDate : ''));
            const reason = r.reason || 'Personal work';
            const status = (r.status || 'pending').toLowerCase();
            const badgeClass = status === 'approved' ? 'badge success' : (status === 'rejected' ? 'badge danger' : 'badge warning');

            html += '<div class="approval-card" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen(\\'tpl-LeaveApprovalDetail\\', \\'' + (r.id || 'priya') + '\\')}else if(typeof loadScreen===\\'function\\'){loadScreen(\\'tpl-LeaveApprovalDetail\\', \\'' + (r.id || 'priya') + '\\')}else{window.location.href=\\'../LeaveApprovalDetail/preview.html?person=' + encodeURIComponent(r.id || 'priya') + '\\'}">'
              + '<div class="top-row">'
              + '<div class="emp-row">'
              + '<div class="avatar">' + empName.slice(0, 2).toUpperCase() + '</div>'
              + '<div><div style="font-weight:700; color:#0F172A;">' + empName + '</div><div style="font-size:12px; color:#64748B;">' + empRole + '</div></div>'
              + '</div>'
              + '<span class="' + badgeClass + '">' + status.toUpperCase() + '</span>'
              + '</div>'
              + '<div style="margin: 12px 0 8px; font-size:13px;"><span style="color:#64748B;">' + lType + '</span> • <b>' + dates + '</b></div>'
              + '<div style="font-size:12.5px; color:#475569; background:#F8FAFC; padding:8px 10px; border-radius:8px;">"' + reason + '"</div>'
              + '</div>';
          });
          listEl.innerHTML = html;
        }
      }
    }

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
  </script>`;

  // Replace existing script
  if (inner.indexOf('<script>') !== -1) {
    return inner.replace(/<script[\s\S]*?<\/script>/, newScript);
  } else {
    return inner + '\n' + newScript;
  }
}

// 2. Transform tpl-PermissionApprovals
function transformPermissionApprovals(inner) {
  const newScript = `<script>
    let currentPermTab = 'pending';

    function isPermissionRequest(r) {
      if (!r) return false;
      if (r.isPermission === true || r._isPermCard === true) return true;
      if (r.isPermission === false) return false;
      if (r.permissionType) return true;
      const permTypes = ['early going', 'late coming', 'personal work', 'official work', 'permission'];
      const t = (r.type || r.leaveType || r.permissionType || '').trim().toLowerCase();
      return permTypes.includes(t) || t.includes('early going') || t.includes('late coming');
    }

    function isLeaveRequest(r) {
      if (!r) return false;
      return !isPermissionRequest(r);
    }

    function switchPermTab(status, el) {
      currentPermTab = status;
      const pills = document.querySelectorAll('.tab-bar-card .tab-pill');
      pills.forEach(p => p.classList.remove('active'));
      if (el) el.classList.add('active');
      renderPermissionApprovals();
    }

    function updatePermTabCounts() {
      const store = (window.parent && (window.parent.PERM_STATE || window.parent.PERMISSION_REQUESTS)) ? window.parent : (window.PERM_STATE ? window : (window.parent || window));
      const rawReqs = (store.PERM_STATE && store.PERM_STATE.length > 0) ? store.PERM_STATE : (store.PERMISSION_REQUESTS || []);
      const reqs = rawReqs.filter(isPermissionRequest);

      let pending = 0, approved = 0, rejected = 0;
      reqs.forEach(r => {
        const s = (r.status || 'pending').toLowerCase();
        if (s === 'approved') approved++;
        else if (s === 'rejected') rejected++;
        else pending++;
      });

      const countPending = document.getElementById('perm-count-pending');
      const countApproved = document.getElementById('perm-count-approved');
      const countRejected = document.getElementById('perm-count-rejected');

      if (countPending) countPending.textContent = pending;
      if (countApproved) countApproved.textContent = approved;
      if (countRejected) countRejected.textContent = rejected;
    }

    function renderPermissionApprovals() {
      const store = (window.parent && (window.parent.PERM_STATE || window.parent.PERMISSION_REQUESTS)) ? window.parent : (window.PERM_STATE ? window : (window.parent || window));
      const rawReqs = (store.PERM_STATE && store.PERM_STATE.length > 0) ? store.PERM_STATE : (store.PERMISSION_REQUESTS || []);
      const reqs = rawReqs.filter(isPermissionRequest);
      const listEl = document.getElementById('perm-cards-list');
      const msg = document.getElementById('no-perm-msg');

      const filtered = reqs.filter(r => (r.status || 'pending').toLowerCase() === currentPermTab);

      if (filtered.length === 0) {
        if (msg) msg.style.display = 'flex';
        if (listEl) listEl.innerHTML = '';
      } else {
        if (msg) msg.style.display = 'none';
        if (listEl) {
          let html = '';
          filtered.forEach(r => {
            const empName = r.employeeName || r.name || 'Priya Sharma';
            const empRole = r.employeeRole || r.role || 'Senior Software Engineer';
            const pType = r.permissionType || r.type || 'Early Going';
            const duration = r.duration || r.totalDays || r.daysText || '2 Hours';
            const date = r.date || r.schedule || r.fromDate || '04-Sep-2026';
            const reason = r.reason || 'Personal work';
            const status = (r.status || 'pending').toLowerCase();
            const badgeClass = status === 'approved' ? 'badge success' : (status === 'rejected' ? 'badge danger' : 'badge warning');

            html += '<div class="approval-card" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen(\\'tpl-LeaveApprovalDetail\\', \\'' + (r.id || 'perm-init-1') + '\\')}else if(typeof loadScreen===\\'function\\'){loadScreen(\\'tpl-LeaveApprovalDetail\\', \\'' + (r.id || 'perm-init-1') + '\\')}else{window.location.href=\\'../LeaveApprovalDetail/preview.html?person=' + encodeURIComponent(r.id || 'perm-init-1') + '\\'}">'
              + '<div class="top-row">'
              + '<div class="emp-row">'
              + '<div class="avatar" style="background:#FEF3C7; color:#D97706;">' + empName.slice(0, 2).toUpperCase() + '</div>'
              + '<div><div style="font-weight:700; color:#0F172A;">' + empName + '</div><div style="font-size:12px; color:#64748B;">' + empRole + '</div></div>'
              + '</div>'
              + '<span class="' + badgeClass + '">' + status.toUpperCase() + '</span>'
              + '</div>'
              + '<div style="margin: 12px 0 8px; font-size:13px;"><span style="color:#64748B;">' + pType + ' (' + duration + ')</span> • <b>' + date + '</b></div>'
              + '<div style="font-size:12.5px; color:#475569; background:#F8FAFC; padding:8px 10px; border-radius:8px;">"' + reason + '"</div>'
              + '</div>';
          });
          listEl.innerHTML = html;
        }
      }
    }

    document.addEventListener('DOMContentLoaded', function() {
      updatePermTabCounts();
      renderPermissionApprovals();
    });
    setTimeout(function() {
      updatePermTabCounts();
      renderPermissionApprovals();
    }, 50);
  </script>`;

  if (inner.indexOf('<script>') !== -1) {
    return inner.replace(/<script[\s\S]*?<\/script>/, newScript);
  } else {
    return inner + '\n' + newScript;
  }
}

// 3. Transform tpl-ManagerDashboard
function transformManagerDashboard(inner) {
  // Let's replace syncManagerDashboard inside tpl-ManagerDashboard
  const newSyncFunction = `function syncManagerDashboard(targetDoc) {
      const doc = targetDoc || document;
      if (!doc) return;
      const store = (window.parent && window.parent.EMP_LEAVE_REQUESTS) ? window.parent : (window.EMP_LEAVE_REQUESTS ? window : (window.parent || window));

      function isPermReq(r) {
        if (!r) return false;
        if (r.isPermission === true || r._isPermCard === true) return true;
        if (r.isPermission === false) return false;
        if (r.permissionType) return true;
        const permTypes = ['early going', 'late coming', 'personal work', 'official work', 'permission'];
        const t = (r.leaveType || r.type || r.permissionType || '').trim().toLowerCase();
        return permTypes.includes(t) || t.includes('early going') || t.includes('late coming');
      }

      function isLeaveReq(r) {
        if (!r) return false;
        return !isPermReq(r);
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
        if (!r || !isLeaveReq(r)) return;
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

      if (store.PERMISSION_REQUESTS && Array.isArray(store.PERMISSION_REQUESTS)) {
        store.PERMISSION_REQUESTS.forEach(addPermReq);
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
      // Only requests that have been approved or rejected by the manager appear in Recent Requests.
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
            const empInitials = req.employeeInitials || req.initials || (empName.trim().split(/\\s+/).map(function(w){return w[0];}).join('').toUpperCase().slice(0, 2)) || (isPerm ? 'JD' : 'SR');
            const empRole = req.employeeRole || req.role || (isPerm ? 'UI/UX Designer' : 'Senior Software Engineer');
            const reqType = isPerm ? (req.type || req.permissionType || req.leaveType || 'Early Going') : (req.leaveType || req.type || 'Casual Leave');
            const duration = req.duration || req.daysText || req.totalDays || (isPerm ? '1 Hour' : '2 Days');

            let dates = req.date;
            if (!dates) {
              if (req.fromDate && req.toDate) {
                dates = req.fromDate === req.toDate ? (req.fromDate) : (req.fromDate + ' – ' + req.toDate);
              } else {
                dates = req.fromDate || req.toDate || '04-Sep-2026';
              }
            }

            const reason = req.reason || (isPerm ? 'Personal work / checkup' : "Family function - attending sister's wedding ceremony in Bangalore.");
            const status = (req.status || 'pending').toLowerCase();
            const statusLabel = status === 'approved' ? 'Approved' : (status === 'rejected' ? 'Rejected' : 'Pending');

            const cardKey = req.id || (isPerm ? 'perm-init-1' : 'priya');

            htmlCards += '<div class="recent-req-item" onclick="handleCardNav(\\'tpl-LeaveApprovalDetail\\', \\'' + cardKey + '\\')" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:14px; padding:14px 16px; margin-bottom:12px; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.03); transition:all 0.2s;">'
              + '<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">'
              + '<div style="display:flex; align-items:center; gap:10px;">'
              + '<div style="width:38px; height:38px; border-radius:50%; background:' + (isPerm ? '#D97706' : '#2563EB') + '; color:#FFFFFF; font-weight:700; font-size:14px; display:flex; align-items:center; justify-content:center;">' + empInitials + '</div>'
              + '<div>'
              + '<div style="font-size:14px; font-weight:700; color:#0F172A;">' + empName + '</div>'
              + '<div style="font-size:11.5px; color:#64748B;">' + empRole + '</div>'
              + '</div>'
              + '</div>'
              + '</div>'

              + '<div style="display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom:6px;">'
              + '<span style="background:' + (isPerm ? '#FEF3C7' : '#EFF6FF') + '; color:' + (isPerm ? '#D97706' : '#0066FF') + '; border:1px solid ' + (isPerm ? '#FDE68A' : '#DBEAFE') + '; padding:3px 10px; border-radius:8px; font-weight:600;">' + reqType + ' (' + duration + ')</span>'
              + '<span style="color:#475569; font-weight:500;">' + dates + '</span>'
              + '<span style="margin-left:auto; font-size:11.5px; font-weight:700; padding:3px 10px; border-radius:8px; background:' + (status === 'approved' ? '#DCFCE7' : '#FEE2E2') + '; color:' + (status === 'approved' ? '#15803D' : '#DC2626') + ';">' + statusLabel + '</span>'
              + '</div>'

              + '<div style="font-size:12.5px; color:#475569; background:#F8FAFC; padding:8px 12px; border-radius:8px; line-height:1.4; border-left:3px solid ' + (isPerm ? '#D97706' : '#0066FF') + ';">'
              + '"' + reason + '"'
              + '</div>'
              + '</div>';
          });
          requestsList.innerHTML = htmlCards;
        }
      }
    }`;

  // Replace syncManagerDashboard function in inner
  const syncMatch = inner.match(/function syncManagerDashboard\([\s\S]*?requestsList\.innerHTML = htmlCards;\s*\}\s*\}\s*\}/);
  if (syncMatch) {
    return inner.replace(syncMatch[0], newSyncFunction);
  } else {
    // If not matching regex, replace between function syncManagerDashboard and end of function
    const startSync = inner.indexOf('function syncManagerDashboard');
    if (startSync !== -1) {
      const endSync = inner.indexOf('window.addEventListener(\'DOMContentLoaded\'', startSync);
      if (endSync !== -1) {
        return inner.substring(0, startSync) + newSyncFunction + '\n\n    ' + inner.substring(endSync);
      }
    }
  }
  return inner;
}

// 4. Transform tpl-ApplyPermission (remove EMP_LEAVE_REQUESTS push)
function transformApplyPermission(inner) {
  // In handleApplyPermissionSubmit, remove the push to EMP_LEAVE_REQUESTS
  let res = inner;
  res = res.replace(/if \(!parentWin\.EMP_LEAVE_REQUESTS\) parentWin\.EMP_LEAVE_REQUESTS = \[\];\s*var existsEmpReq = parentWin\.EMP_LEAVE_REQUESTS\.some[\s\S]*?parentWin\.EMP_LEAVE_REQUESTS\.unshift\([^)]+\);\s*\}/g, '');
  return res;
}

// Apply to all 4 main html bundle files
htmlFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  console.log('Processing bundle file:', file);
  let content = fs.readFileSync(file, 'utf8');
  content = updateTemplateInContent(content, 'tpl-LeaveApprovals', transformLeaveApprovals);
  content = updateTemplateInContent(content, 'tpl-PermissionApprovals', transformPermissionApprovals);
  content = updateTemplateInContent(content, 'tpl-ManagerDashboard', transformManagerDashboard);
  content = updateTemplateInContent(content, 'tpl-ApplyPermission', transformApplyPermission);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated:', file);
});

// Also update standalone screen preview.html files
const standaloneLA = path.resolve('EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html');
if (fs.existsSync(standaloneLA)) {
  let c = fs.readFileSync(standaloneLA, 'utf8');
  c = transformLeaveApprovals(c);
  fs.writeFileSync(standaloneLA, c, 'utf8');
  console.log('Updated standalone LeaveApprovals preview.html');
}

const standalonePA = path.resolve('EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html');
if (fs.existsSync(standalonePA)) {
  let c = fs.readFileSync(standalonePA, 'utf8');
  c = transformPermissionApprovals(c);
  fs.writeFileSync(standalonePA, c, 'utf8');
  console.log('Updated standalone PermissionApprovals preview.html');
}

const standaloneMD = path.resolve('EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html');
if (fs.existsSync(standaloneMD)) {
  let c = fs.readFileSync(standaloneMD, 'utf8');
  c = transformManagerDashboard(c);
  fs.writeFileSync(standaloneMD, c, 'utf8');
  console.log('Updated standalone ManagerDashboard preview.html');
}

const standaloneMDJs = path.resolve('EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.js');
if (fs.existsSync(standaloneMDJs)) {
  let c = fs.readFileSync(standaloneMDJs, 'utf8');
  c = transformManagerDashboard(c);
  fs.writeFileSync(standaloneMDJs, c, 'utf8');
  console.log('Updated standalone ManagerDashboard preview.js');
}

const standaloneAP = path.resolve('EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.html');
if (fs.existsSync(standaloneAP)) {
  let c = fs.readFileSync(standaloneAP, 'utf8');
  c = transformApplyPermission(c);
  fs.writeFileSync(standaloneAP, c, 'utf8');
  console.log('Updated standalone ApplyPermission preview.html');
}
