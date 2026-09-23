const fs = require('fs');
const cp = require('child_process');

const targetReplacement = `            // Synchronize cards in #permission-approvals-list
            if (paList) {
              allPerms.forEach(function (req) {
                var existingCard = paList.querySelector('[data-perm-id="' + req.id + '"]');
                var reqStatus = (req.status || 'pending').toLowerCase();
                var tone = req.type === 'Late Coming' ? 'purple' : req.type === 'Early Going' ? 'warning' : 'info';
                var reqEmpName = req.employeeName || 'Employee';
                var reqEmpInitials = req.employeeInitials || reqEmpName.split(' ').map(function(w){return w[0];}).join('').toUpperCase().slice(0,2);
                var scheduleText = req.schedule || (req.date ? req.date + (req.duration ? ' (' + req.duration + ')' : '') : 'Recent');

                var actionHtml = '';
                if (reqStatus === 'approved') {
                  actionHtml = '<div style="text-align:right;margin-top:8px;"><span class="badge success">Approved</span></div>';
                } else if (reqStatus === 'rejected') {
                  actionHtml = '<div style="text-align:right;margin-top:8px;"><span class="badge danger">Rejected</span></div>';
                } else {
                  actionHtml = '<div class="btn-row"><button class="btn btn-reject" onclick="event.stopPropagation();processPermAction(\\'' + req.id + '\\', \\'rejected\\')">Reject</button><button class="btn btn-approve" onclick="event.stopPropagation();processPermAction(\\'' + req.id + '\\', \\'approved\\')">Approve</button></div>';
                }

                if (existingCard) {
                  existingCard.setAttribute('data-status', reqStatus);
                  var actionWrap = existingCard.querySelector('.card-action-wrap');
                  if (actionWrap) actionWrap.innerHTML = actionHtml;
                } else {
                  var cardDiv = doc.createElement('div');
                  cardDiv.className = 'card approval-card';
                  cardDiv.setAttribute('data-perm-id', req.id);
                  cardDiv.setAttribute('data-status', reqStatus);
                  cardDiv.setAttribute('data-type', req.type || 'Permission');
                  cardDiv.setAttribute('data-date', req.date || '');
                  cardDiv.style.cursor = 'pointer';
                  cardDiv.innerHTML = '<div class="top-row"><div class="emp-row"><div class="avatar">' + reqEmpInitials + '</div><div><b>' + reqEmpName + '</b><p>' + (req.type || 'Permission') + '</p></div></div><span class="badge ' + tone + '">' + (req.type || 'Permission') + '</span></div>'
                    + '<hr/>'
                    + '<div class="detail-row"><span>Schedule</span><b>' + scheduleText + '</b></div>'
                    + '<div class="detail-row"><span>Duration</span><b>' + (req.duration || '2 Hours') + '</b></div>'
                    + '<div class="detail-row"><span>Reason</span><b>' + (req.reason || 'Personal work') + '</b></div>'
                    + '<div class="card-action-wrap">' + actionHtml + '</div>';

                  cardDiv.addEventListener('click', function(e) {
                    if (e.target.tagName !== 'BUTTON') {
                      loadScreen('tpl-LeaveApprovalDetail', 'perm-' + req.id);
                    }
                  });

                  if (noPermMsg) {
                    paList.insertBefore(cardDiv, noPermMsg);
                  } else {
                    paList.appendChild(cardDiv);
                  }
                }
              });
            }

            // Function to sync tab visibility and tab counters
            function syncPermTabs() {
              var cards = paList ? paList.querySelectorAll('.approval-card') : [];
              var pCount = 0, aCount = 0, rCount = 0, curVisible = 0;
              var activeTabEl = doc.querySelector('#perm-approval-tabs .pill.active');
              var curTab = activeTabEl ? (activeTabEl.id.indexOf('approved') !== -1 ? 'approved' : activeTabEl.id.indexOf('rejected') !== -1 ? 'rejected' : 'pending') : 'pending';

              cards.forEach(function (card) {
                var st = (card.getAttribute('data-status') || 'pending').toLowerCase();
                if (st === 'approved') aCount++;
                else if (st === 'rejected') rCount++;
                else pCount++;

                if (st === curTab) {
                  card.style.display = 'block';
                  curVisible++;
                } else {
                  card.style.display = 'none';
                }
              });

              var pEl = doc.getElementById('perm-count-pending');
              var aEl = doc.getElementById('perm-count-approved');
              var rEl = doc.getElementById('perm-count-rejected');
              if (pEl) pEl.textContent = pCount;
              if (aEl) aEl.textContent = aCount;
              if (rEl) rEl.textContent = rCount;

              if (noPermMsg) {
                noPermMsg.style.display = curVisible === 0 ? 'block' : 'none';
              }

              // Update Manager Dashboard Perm Badge
              var mgrPermBadge = doc.getElementById('mgr-perm-badge');
              if (mgrPermBadge) {
                mgrPermBadge.textContent = pCount;
                mgrPermBadge.style.display = pCount > 0 ? 'inline-block' : 'none';
              }
            }

            // Hook tab pills to syncPermTabs
            doc.querySelectorAll('#perm-approval-tabs .pill').forEach(function (pill) {
              pill.addEventListener('click', function () {
                doc.querySelectorAll('#perm-approval-tabs .pill').forEach(function (p) { p.classList.remove('active'); });
                pill.classList.add('active');
                syncPermTabs();
              });
            });

            // Initial sync of tabs and badge
            syncPermTabs();

            // Direct iframe callback to re-run syncPermTabs on actions
            if (frame.contentWindow) {
              frame.contentWindow.syncPermTabs = syncPermTabs;
            }
          }

          // ── Notifications: render dynamic notifications for employee ─────
          if (currentTpl === 'tpl-Notifications') {
            if (window.PERM_NOTIFICATIONS && window.PERM_NOTIFICATIONS.length > 0) {
              var notifContainer = doc.getElementById('notif-container');
              if (notifContainer) {
                window.PERM_NOTIFICATIONS.forEach(function(notif) {
                  var isApprove = notif.status === 'approved';
                  var div = doc.createElement('div');
                  div.className = 'card notif-card unread';
                  div.innerHTML = '<div class="notif-row">'
                    + '<span class="ico-wrap ' + (isApprove ? 'success' : 'danger') + '">' + (isApprove ? '✓' : '✕') + '</span>'
                    + '<div class="notif-text">'
                    + '<p>Permission Request ' + (isApprove ? 'Approved' : 'Rejected') + '</p>'
                    + '<small>Your ' + notif.type + ' permission request for ' + notif.date + ' was ' + (isApprove ? 'Approved ✅' : 'Rejected ❌') + ' by ' + (notif.managerName || (window.USER_PROFILE && window.USER_PROFILE.reportingManager) || 'Your Manager') + '.</small>'
                    + '</div>'
                    + '<span class="dot"></span>'
                    + '<span class="close-item-btn" onclick="removeSingleNotif(this)" title="Delete">✕</span>'
                    + '</div>';
                  notifContainer.insertBefore(div, notifContainer.firstChild);
                });
              }
            }
          }

          // ── Employee Dashboard: sync greeting & role/ID with USER_PROFILE ───
          if (currentTpl === 'tpl-EmployeeDashboard') {
            var prof = window.USER_PROFILE || {};
            var bell = doc.getElementById('dash-bell-btn') || doc.querySelector('.bell');
            if (bell) {
              var hasNewNotif = !!(window.HAS_NEW_NOTIFICATION || (function(){ try { return sessionStorage.getItem('HAS_NEW_NOTIFICATION') === 'true'; }catch(e){ return false; } })());
              if (hasNewNotif) {
                bell.classList.add('has-glow');
              } else {
                bell.classList.remove('has-glow');
              }
            }
            var curEmail = (prof.email || (window.AUTH_USER && window.AUTH_USER.email) || '').toLowerCase();
            var curEmpId = prof.employeeId || (window.AUTH_USER && window.AUTH_USER.empId) || '';
            var curName = prof.name || (window.AUTH_USER && window.AUTH_USER.name) || '';

            var greetingEl = doc.getElementById('dash-greeting') || doc.querySelector('.greeting');
            if (greetingEl && curName) {
              greetingEl.textContent = curName || 'Sneha Reddy';
            }
            var roleTextEl = doc.getElementById('dash-role-text');
            var idTextEl = doc.getElementById('dash-id-text');
            if (roleTextEl && prof.role) roleTextEl.textContent = prof.role;
            if (idTextEl && curEmpId) idTextEl.textContent = curEmpId;
            if (!roleTextEl && greetingEl) {
              var roleMeta = doc.createElement('p');
              roleMeta.className = 'dash-role-meta';
              roleMeta.id = 'dash-role-meta';
              roleMeta.style.cssText = 'padding:0 20px; color:var(--text-secondary); margin:4px 0 0; font-size:13px; font-weight:500;';
              roleMeta.innerHTML = '<span id="dash-role-text">' + (prof.role || 'UI/UX Designer') + '</span> &bull; <span id="dash-id-text">' + (curEmpId || 'EMP-2024-0103') + '</span>';
              greetingEl.insertAdjacentElement('afterend', roleMeta);
            }

            // Remove legacy static cards if any exist
            var sCard1 = doc.getElementById('emp-static-req-1');
            if (sCard1) sCard1.remove();
            var sCard2 = doc.getElementById('emp-static-req-2');
            if (sCard2) sCard2.remove();

            // Locate or create requests list container
            var reqsList = doc.getElementById('emp-dash-requests-list');
            var reqsLabel = doc.getElementById('emp-dash-requests-label') || doc.querySelector('.section-label');
            if (!reqsList && reqsLabel) {
              reqsList = doc.createElement('div');
              reqsList.id = 'emp-dash-requests-list';
              reqsLabel.insertAdjacentElement('afterend', reqsList);
            }

            // Filter requests strictly for currently logged-in employee (ONLY approved or rejected)
            var allReqs = window.EMP_LEAVE_REQUESTS || [];
            var userReqs = allReqs.filter(function(r) {
              if (window.DELETED_REQUEST_IDS && window.DELETED_REQUEST_IDS.indexOf(String(r.id)) !== -1) return false;
              var matchEmail = r.employeeEmail && curEmail && (r.employeeEmail.toLowerCase() === curEmail);
              var matchId = r.employeeId && curEmpId && (r.employeeId.toUpperCase() === curEmpId.toUpperCase());
              var matchName = r.employeeName && curName && (r.employeeName.toLowerCase() === curName.toLowerCase());
              var isUserMatch = matchEmail || matchId || matchName;
              var st = (r.status || '').toLowerCase();
              var isApprovedOrRejected = st === 'approved' || st === 'rejected';
              return isUserMatch && isApprovedOrRejected;
            });

            if (reqsList) {
              reqsList.innerHTML = '';
              userReqs.forEach(function(req) {
                var rStatus = (req.status || 'pending').toLowerCase();
                var sc = rStatus === 'approved' ? 'success' : rStatus === 'rejected' ? 'danger' : 'warning';
                var st = rStatus === 'approved' ? 'Approved' : rStatus === 'rejected' ? 'Rejected' : 'Pending';

                var titleText = (req.leaveType || req.type || 'Request') + ' (' + (req.daysText || req.duration || '1 Day') + ')';
                var dateReasonText = (req.fromDate || req.date || '') + ' \\u2022 ' + (req.reason || 'Personal Work');

                var cardDiv = doc.createElement('div');
                cardDiv.className = 'recent-request-card request-card';
                cardDiv.id = 'emp-req-' + req.id;
                cardDiv.style.marginTop = '8px';
                cardDiv.style.cursor = 'pointer';
                cardDiv.innerHTML = '<div class="recent-request-left">'
                  + '<div class="recent-request-title">' + titleText + '</div>'
                  + '<div class="recent-request-sub">' + dateReasonText + '</div>'
                  + '<div class="recent-request-meta">' + (req.employeeName || curName) + ' \\u2022 ' + (req.employeeId || curEmpId) + '</div>'
                  + '</div>'
                  + '<div class="recent-request-right">'
                  + '<span class="recent-request-badge" style="background:' + (rStatus === 'approved' ? '#DCFCE7' : '#FCE4E4') + '; color:' + (rStatus === 'approved' ? '#16A34A' : '#E5484D') + ';">' + st + '</span>'
                  + '<button type="button" class="recent-request-dismiss-btn" title="Dismiss request" onclick="deleteEmpRequest(this, event, \\'' + req.id + '\\')">'
                  + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#94A3B8" stroke-width="1.8" fill="none"/><line x1="15" y1="9" x2="9" y2="15" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round"/><line x1="9" y1="9" x2="15" y2="15" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round"/></svg>'
                  + '</button>'
                  + '</div>';

                cardDiv.addEventListener('click', function(e) {
                  if (!e.target.closest('.recent-request-dismiss-btn') && !e.target.closest('.btn-cancel-req')) {
                    if (window.PERSON_DATA && window.PERSON_DATA[req.id]) {
                      loadScreen('tpl-LeaveApprovalDetail', req.id);
                    }
                  }
                });
                reqsList.appendChild(cardDiv);
              });

              // DOM Safety Pass: remove any duplicate request cards by rendered text
              var seenDomSigs = {};
              reqsList.querySelectorAll('.req-card').forEach(function(card) {
                var bEl = card.querySelector('b');
                var pEl = card.querySelector('p');
                var textKey = ((bEl ? bEl.textContent : '') + '|' + (pEl ? pEl.textContent : '')).trim().toLowerCase();
                if (textKey && seenDomSigs[textKey]) {
                  card.remove();
                } else if (textKey) {
                  seenDomSigs[textKey] = true;
                }
              });
            }

            var secContainer = doc.getElementById('emp-recent-requests-section');
            if (secContainer) {
              secContainer.style.display = userReqs.length > 0 ? 'block' : 'none';
            }
            if (reqsLabel) {
              reqsLabel.textContent = 'RECENT REQUESTS (' + userReqs.length + ')';
              reqsLabel.style.display = userReqs.length > 0 ? 'block' : 'none';
            }

            if (frame.contentWindow) {
              frame.contentWindow.deleteEmpRequest = window.deleteEmpRequest;
            }
          }`;

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

const startMarker = "// Synchronize cards in #permission-approvals-list";
const endMarker = "// ── My Profile: populate with USER_PROFILE ───────────────────────";

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.log('Skipping missing:', f);
    return;
  }
  let content = fs.readFileSync(f, 'utf8');
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);

  if (startIdx === -1 || endIdx === -1) {
    console.error('Could not find markers in:', f, { startIdx, endIdx });
    return;
  }

  const before = content.substring(0, startIdx);
  const after = content.substring(endIdx);

  const updated = before + targetReplacement + '\n\n          ' + after;
  fs.writeFileSync(f, updated, 'utf8');
  console.log('Successfully repaired:', f);
});

// Also fix scratch/apply_redesign_to_htmls.js step 5 so it won't corrupt again if run
if (fs.existsSync('scratch/apply_redesign_to_htmls.js')) {
  let scriptContent = fs.readFileSync('scratch/apply_redesign_to_htmls.js', 'utf8');
  // Disable the broken regex replacement in step 5
  scriptContent = scriptContent.replace(
    'const cardBlockRegex = /var cardDiv = doc\\.createElement\\(\'div\'\\);[\\s\\S]*?reqsList\\.appendChild\\(cardDiv\\);/;\n  if (cardBlockRegex.test(content)) {',
    '// Step 5 regex disabled to avoid corrupting permission-approvals\n  if (false) {'
  );
  fs.writeFileSync('scratch/apply_redesign_to_htmls.js', scriptContent, 'utf8');
  console.log('Successfully patched scratch/apply_redesign_to_htmls.js');
}
