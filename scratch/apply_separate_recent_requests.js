const fs = require('fs');
const path = require('path');

// 1. The clean, robust syncManagerDashboard function
const newSyncManagerDashboardFn = `function syncManagerDashboard(targetDoc) {
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
            const empInitials = req.employeeInitials || req.initials || (empName.trim().split(/\\s+/).map(function(w){return w[0];}).join('').toUpperCase().slice(0, 2)) || (isPerm ? 'JD' : 'SR');
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

            htmlCards += '<div class="recent-req-item" onclick="handleCardNav(\\'tpl-LeaveApprovalDetail\\', \\'' + cardKey + '\\')" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:14px; padding:14px 16px; margin-bottom:12px; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.03); transition:all 0.2s;">'
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
    }`;

// 2. The robust handleDetailLeaveDecision function for LeaveApprovalDetail
const newHandleDetailLeaveDecisionFn = `function handleDetailLeaveDecision(status) {
          const isApproved = status === 'approved';
          const labelText = isApproved ? 'Approved' : 'Rejected';
          const badgeClass = isApproved ? 'badge success' : 'badge danger';

          const store = window.parent || window;
          const parentDoc = (window.parent && window.parent.document) ? window.parent.document : document;
          const currentPerson = (store.SELECTED_PERSON) || 'priya';

          if (!store.PERSON_DATA) store.PERSON_DATA = {};
          if (store.PERSON_DATA[currentPerson]) {
            store.PERSON_DATA[currentPerson].status = status;
            store.PERSON_DATA[currentPerson].managerDecisionSubmitted = true;
            store.PERSON_DATA[currentPerson].decisionSubmitted = true;
            if (isApproved) store.PERSON_DATA[currentPerson].approvedAt = Date.now();
            else store.PERSON_DATA[currentPerson].rejectedAt = Date.now();
          }

          if (typeof activeRecord !== 'undefined' && activeRecord) {
            activeRecord.status = status;
            activeRecord.managerDecisionSubmitted = true;
            activeRecord.decisionSubmitted = true;
            if (isApproved) activeRecord.approvedAt = Date.now();
            else activeRecord.rejectedAt = Date.now();
          }

          if (!store.MANAGER_SUBMITTED_DECISIONS) store.MANAGER_SUBMITTED_DECISIONS = {};
          store.MANAGER_SUBMITTED_DECISIONS[currentPerson] = true;
          store.MANAGER_SUBMITTED_DECISIONS[String(currentPerson)] = true;
          if (String(currentPerson).startsWith('perm-')) {
            store.MANAGER_SUBMITTED_DECISIONS[String(currentPerson).replace(/^perm-/, '')] = true;
          } else {
            store.MANAGER_SUBMITTED_DECISIONS['perm-' + currentPerson] = true;
          }
          if (currentPerson === 'priya' || currentPerson === '1') {
            store.MANAGER_SUBMITTED_DECISIONS['priya'] = true;
            store.MANAGER_SUBMITTED_DECISIONS['1'] = true;
          }

          const pData = (store.PERSON_DATA && store.PERSON_DATA[currentPerson]) || (typeof activeRecord !== 'undefined' ? activeRecord : null);
          const isPerm = !!(
            (pData && pData.isPermission) ||
            String(currentPerson).startsWith('perm-') ||
            (pData && pData.type && (pData.type.includes('Going') || pData.type.includes('Coming'))) ||
            (pData && pData.leaveType && (pData.leaveType.includes('Going') || pData.leaveType.includes('Coming')))
          );

          if (isPerm) {
            store.LAST_PERMISSION_DECISION = {
              id: currentPerson,
              status: status,
              type: (pData && (pData.leaveType || pData.type)) || 'Permission',
              date: (pData && (pData.fromDate || pData.date)) || '04-Sep-2026',
              managerDecisionSubmitted: true,
              decisionSubmitted: true,
              approvedAt: isApproved ? Date.now() : null,
              rejectedAt: !isApproved ? Date.now() : null
            };
            if (store.PERM_STATE && Array.isArray(store.PERM_STATE)) {
              store.PERM_STATE.forEach(function(req) {
                var idMatch = String(req.id) === String(currentPerson) || ('perm-' + req.id) === String(currentPerson) || String(req.id) === ('perm-' + currentPerson);
                var detailMatch = pData && (req.employeeName === (pData.name || pData.employeeName));
                if (idMatch || detailMatch || req.id === 'perm-init-1') {
                  req.status = status;
                  req.managerDecisionSubmitted = true;
                  req.decisionSubmitted = true;
                  if (isApproved) req.approvedAt = Date.now();
                  else req.rejectedAt = Date.now();
                  store.MANAGER_SUBMITTED_DECISIONS[req.id] = true;
                }
              });
            }
            if (store.EMP_LEAVE_REQUESTS && Array.isArray(store.EMP_LEAVE_REQUESTS)) {
              store.EMP_LEAVE_REQUESTS.forEach(function(req) {
                var idMatch = String(req.id) === String(currentPerson) || ('perm-' + req.id) === String(currentPerson) || String(req.id) === ('perm-' + currentPerson);
                if (idMatch) {
                  req.status = status;
                  req.managerDecisionSubmitted = true;
                  req.decisionSubmitted = true;
                  if (isApproved) req.approvedAt = Date.now();
                  else req.rejectedAt = Date.now();
                  store.MANAGER_SUBMITTED_DECISIONS[req.id] = true;
                }
              });
            }
          } else {
            store.LAST_LEAVE_DECISION = {
              id: currentPerson === 'priya' ? '1' : currentPerson,
              personKey: currentPerson,
              status: status,
              managerDecisionSubmitted: true,
              decisionSubmitted: true,
              approvedAt: isApproved ? Date.now() : null,
              rejectedAt: !isApproved ? Date.now() : null,
              labelText: labelText,
              badgeClass: badgeClass,
              lType: (pData && (pData.leaveType || pData.type)) || 'Casual Leave'
            };
            store.lastLeaveDecision = store.LAST_LEAVE_DECISION;

            if (store.EMP_LEAVE_REQUESTS && Array.isArray(store.EMP_LEAVE_REQUESTS)) {
              store.EMP_LEAVE_REQUESTS.forEach(function(req) {
                var idMatch = String(req.id) === String(currentPerson) || (currentPerson === 'priya' && String(req.id) === '1') || (currentPerson === '1' && String(req.id) === '1');
                var detailMatch = pData && (req.employeeName === (pData.name || pData.employeeName)) && (req.leaveType === (pData.leaveType || pData.type));
                if (idMatch || detailMatch) {
                  req.status = status;
                  req.managerDecisionSubmitted = true;
                  req.decisionSubmitted = true;
                  if (isApproved) req.approvedAt = Date.now();
                  else req.rejectedAt = Date.now();
                  store.MANAGER_SUBMITTED_DECISIONS[req.id] = true;
                }
              });
              if (typeof store.updateEmploymentStatusAfterApproval === 'function') {
                store.updateEmploymentStatusAfterApproval((pData && (pData.name || pData.employeeName)), (pData && (pData.leaveType || pData.type)), status);
              }
            }
          }

          // Trigger syncManagerDashboard if available
          if (typeof store.syncManagerDashboard === 'function') {
            try { store.syncManagerDashboard(parentDoc); } catch(e){}
          }
          if (typeof syncManagerDashboard === 'function') {
            try { syncManagerDashboard(parentDoc); } catch(e){}
          }

          // 1. Update tpl-ManagerDashboard counters if needed
          const mgrTpl = parentDoc.getElementById('tpl-ManagerDashboard');
          if (mgrTpl) {
            let tplHtml = mgrTpl.innerHTML;
            if (isPerm) {
              tplHtml = tplHtml.replace(/class="qbadge" id="manager-dash-perm-badge">[0-9]+/, 'class="qbadge" id="manager-dash-perm-badge">0');
            } else {
              tplHtml = tplHtml.replace(/class="qbadge" id="manager-dash-leave-badge">[0-9]+/, 'class="qbadge" id="manager-dash-leave-badge">0');
            }
            mgrTpl.innerHTML = tplHtml;
          }

          // Mark new notification & trigger subtle glow on Employee Dashboard
          store.HAS_NEW_NOTIFICATION = true;
          try { store.sessionStorage.setItem('HAS_NEW_NOTIFICATION', 'true'); } catch (e) {}
          if (typeof window !== 'undefined') {
            window.HAS_NEW_NOTIFICATION = true;
            try { sessionStorage.setItem('HAS_NEW_NOTIFICATION', 'true'); } catch (e) {}
          }
          const detailLiveBell = parentDoc.getElementById('dash-bell-btn') || parentDoc.querySelector('.dash-top .bell');
          if (detailLiveBell) detailLiveBell.classList.add('has-glow');

          // Inject notification into tpl-Notifications template if not present
          const notifTpl = parentDoc.getElementById('tpl-Notifications');
          if (notifTpl) {
            if (isPerm) {
              if (!store.PERM_NOTIFICATIONS) store.PERM_NOTIFICATIONS = [];
              store.PERM_NOTIFICATIONS.unshift({
                status: status,
                type: (pData && (pData.leaveType || pData.type)) || 'Permission',
                date: (pData && (pData.fromDate || pData.schedule || pData.date)) || '04-Sep-2026',
                managerName: (store.USER_PROFILE && store.USER_PROFILE.reportingManager) || 'Your Manager',
                employeeName: (pData && pData.name) || 'Employee'
              });
            } else {
              const lType = (pData && (pData.leaveType || pData.type)) || 'Casual Leave';
              const fromDate = (pData && (pData.fromDate || 'Sep 10, 2026'));
              const icoClass = isApproved ? 'success' : 'danger';
              const icoChar = isApproved ? '✓' : '✕';
              const msgText = isApproved
                ? 'Your ' + lType + ' request for ' + fromDate + ' has been <b>Approved</b> by the Manager'
                : 'Your ' + lType + ' request for ' + fromDate + ' has been <b>Rejected</b> by the Manager';
              const notifCard = '<div class="card notif-card unread" id="dynamic-leave-notif-' + currentPerson + '">'
                + '<div class="notif-row">'
                + '<span class="ico-wrap ' + icoClass + '">' + icoChar + '</span>'
                + '<div class="notif-text"><p>' + msgText + '</p><small>Just now</small></div>'
                + '<span class="dot"></span>'
                + '<span class="close-item-btn" onclick="this.closest(\\\'.notif-card\\\').remove()" title="Delete">✕</span>'
                + '</div></div>';
              let notifHtml = notifTpl.innerHTML;
              if (notifHtml.indexOf('dynamic-leave-notif-' + currentPerson) === -1) {
                notifHtml = notifHtml.replace('<div id="notif-container">', '<div id="notif-container">' + notifCard);
                notifTpl.innerHTML = notifHtml;
              }
            }
          }

          // 4. Update status on live Manager Dashboard if rendered
          const priyaMgrBadge = parentDoc.getElementById('dash-priya-status-badge') || document.getElementById('dash-priya-status-badge');
          if (priyaMgrBadge && (currentPerson === 'priya' || currentPerson === '1')) {
            priyaMgrBadge.className = badgeClass;
            priyaMgrBadge.textContent = labelText;
          }

          const liveEmpBadge = parentDoc.getElementById('emp-dash-casual-leave-badge') || document.getElementById('emp-dash-casual-leave-badge');
          if (liveEmpBadge) {
            liveEmpBadge.className = badgeClass;
            liveEmpBadge.textContent = labelText;
          }

          // 5. Update the current Request Detail screen approval path and buttons
          const mgrPath = document.getElementById('lad-manager-path');
          if (mgrPath) {
            mgrPath.className = 'step-pill ' + (isApproved ? 'applied' : 'pending');
            mgrPath.style.background = isApproved ? '#DCFCE7' : '#FEE2E2';
            mgrPath.style.color = isApproved ? '#15803D' : '#DC2626';
            mgrPath.textContent = isApproved ? 'Approved' : 'Rejected';
          }

          const btnRow = document.getElementById('lad-btn-row');
          if (btnRow) {
            btnRow.innerHTML = '<div style="display:flex;flex-direction:column;gap:10px;width:100%;">'
              + '<div style="text-align:center;padding:12px;border-radius:12px;font-weight:700;font-size:14px;background:' + (isApproved ? '#DCFCE7' : '#FEE2E2') + ';color:' + (isApproved ? '#15803D' : '#DC2626') + ';border:1px solid ' + (isApproved ? '#86EFAC' : '#FCA5A5') + ';">'
              + (isApproved ? '✓ Approved by Manager' : '✕ Rejected by Manager')
              + '</div>'
              + '<div style="display:flex;gap:10px;">'
              + '<button class="btn-action ' + (isApproved ? 'btn-reject' : 'btn-approve') + '" style="flex:1;height:40px;font-size:13px;" onclick="handleDetailLeaveDecision(\\\'' + (isApproved ? 'rejected' : 'approved') + '\\\')">Change to ' + (isApproved ? 'Reject' : 'Approve') + '</button>'
              + '<button class="btn-action" style="flex:1;height:40px;font-size:13px;background:#1D68F2;color:#FFFFFF;border:none;" onclick="handleDetailBackNav()">Done →</button>'
              + '</div>'
              + '</div>';
          }
        }`;

// Function to replace syncManagerDashboard in a string
function replaceSyncInString(content) {
  const pattern = /function syncManagerDashboard\s*\([^)]*\)\s*\{[\s\S]*?\n    \}/g;
  let matches = 0;
  let res = content.replace(pattern, () => {
    matches++;
    return newSyncManagerDashboardFn;
  });
  return { res, matches };
}

// Function to replace handleDetailLeaveDecision in a string
function replaceDecisionInString(content) {
  const pattern = /function handleDetailLeaveDecision\s*\([^)]*\)\s*\{[\s\S]*?\n        \}/g;
  let matches = 0;
  let res = content.replace(pattern, () => {
    matches++;
    return newHandleDetailLeaveDecisionFn;
  });
  return { res, matches };
}

// 1. Update preview.js
const previewJsPath = 'EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.js';
let pjs = fs.readFileSync(previewJsPath, 'utf8');
const pjsMatch = replaceSyncInString(pjs);
if (pjsMatch.matches > 0) {
  fs.writeFileSync(previewJsPath, pjsMatch.res, 'utf8');
  console.log('[OK] Updated preview.js, replaced matches:', pjsMatch.matches);
} else {
  console.log('[WARN] No matches for syncManagerDashboard in preview.js');
}

// 2. Update LeaveApprovalDetail/preview.html
const ladHtmlPath = 'EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/preview.html';
let lad = fs.readFileSync(ladHtmlPath, 'utf8');
const ladPattern = /function handleDetailLeaveDecision\s*\([^)]*\)\s*\{[\s\S]*?\n    \}/;
if (ladPattern.test(lad)) {
  lad = lad.replace(ladPattern, newHandleDetailLeaveDecisionFn.replace(/\n        /g, '\n    '));
  fs.writeFileSync(ladHtmlPath, lad, 'utf8');
  console.log('[OK] Updated LeaveApprovalDetail/preview.html');
} else {
  console.log('[WARN] No matches in LeaveApprovalDetail/preview.html');
}

// 3. Update preview_app.html, index.html, EmergereApp/EmergereApp/preview_app.html, EmergereApp/EmergereApp/index.html
const htmlFiles = [
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'preview_app.html',
  'index.html'
];

htmlFiles.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  let sMatch = replaceSyncInString(c);
  c = sMatch.res;
  let dMatch = replaceDecisionInString(c);
  c = dMatch.res;
  fs.writeFileSync(f, c, 'utf8');
  console.log('[OK] Updated', f, '- sync matches:', sMatch.matches, ', decision matches:', dMatch.matches);
});
