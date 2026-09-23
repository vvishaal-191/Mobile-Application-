
        function filterHistory(cat, el) {
          const pills = el.parentElement.querySelectorAll('.pill');
          pills.forEach(p => p.classList.remove('active'));
          el.classList.add('active');

          const cards = document.querySelectorAll('.req-card');
          cards.forEach(card => {
            const type = card.getAttribute('data-type');
            if (cat === 'all' || type === cat) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        }
        document.querySelectorAll('.bottom-nav .tab').forEach((t) => t.addEventListener('click', () => setActiveNav(t)));

        let currentLeaveTab = 'pending';

        function switchLeaveTab(status, el) {
          currentLeaveTab = status;
          const pills = el.parentElement.querySelectorAll('.pill');
          pills.forEach(p => p.classList.remove('active'));
          el.classList.add('active');
          renderLeaveApprovals();
        }

        function processLeaveAction(id, newStatus) {
          const store = window.parent || window;
          const parentDoc = (window.parent && window.parent.document) ? window.parent.document : document;

          // 1. Identify target personKey and request info
          let personKey = id;
          const pData = (store.PERSON_DATA && store.PERSON_DATA[personKey]) || {};
          const lType = pData.leaveType || pData.type || 'Casual Leave';
          const fromDate = pData.fromDate || 'Sep 10, 2026';
          const empName = pData.name || pData.employeeName || 'Employee';

          const isApproved = newStatus === 'approved';
          const labelText = isApproved ? 'Approved' : 'Rejected';
          const badgeClass = isApproved ? 'badge success' : 'badge danger';
          const icoClass = isApproved ? 'success' : 'danger';
          const icoChar = isApproved ? '✓' : '✕';

          // 2. Mark card in local DOM if card exists
          const card = document.querySelector(`.approval-card[data-leave-id="${id}"]`);
          if (card) {
            card.setAttribute('data-status', newStatus);
            const wrap = card.querySelector('.card-action-wrap');
            if (wrap) {
              wrap.innerHTML = '<div style="text-align:right; margin-top:8px;"><span class="' + badgeClass + '">' + labelText + '</span></div>';
            }
          }

          // 3. Save global decision state
          if (pData) {
            pData.status = newStatus;
          }
          if (pData && isApproved) {
            pData.approvedAt = Date.now();
          }
          store.LAST_LEAVE_DECISION = {
            id: id,
            personKey: personKey,
            status: newStatus,
            labelText: labelText,
            badgeClass: badgeClass,
            lType: lType,
            fromDate: fromDate,
            empName: empName,
            approvedAt: isApproved ? Date.now() : null
          };
          store.lastLeaveDecision = store.LAST_LEAVE_DECISION;

          // 4. Update EMP_LEAVE_REQUESTS store
          if (store.EMP_LEAVE_REQUESTS && store.EMP_LEAVE_REQUESTS.length > 0) {
            store.EMP_LEAVE_REQUESTS.forEach(function(req) {
              if (String(req.id) === String(id) || (req.employeeName === empName && req.leaveType === lType)) {
                req.status = newStatus;
                if (isApproved) req.approvedAt = Date.now();
              }
            });
            if (typeof store.updateEmploymentStatusAfterApproval === 'function') {
              store.updateEmploymentStatusAfterApproval(empName, lType, newStatus);
            }
          }

          // 5. Update EMP_STATUS_UPDATES
          store.EMP_STATUS_UPDATES = store.EMP_STATUS_UPDATES || [];
          store.EMP_STATUS_UPDATES = store.EMP_STATUS_UPDATES.filter(function(u) { return String(u.id) !== String(id); });
          store.EMP_STATUS_UPDATES.push({ id: id, status: newStatus, lType: lType, fromDate: fromDate });

          // 6. Update tpl-ManagerDashboard template counter & Quick Actions
          const mgrTpl = parentDoc.getElementById('tpl-ManagerDashboard');
          if (mgrTpl) {
            let mgrHtml = mgrTpl.innerHTML;
            var pendingLeavesCount = (store.EMP_LEAVE_REQUESTS || []).filter(function(r){ return !r.isPermission && (r.status || 'pending').toLowerCase() === 'pending'; }).length;
            mgrHtml = mgrHtml.replace(/class="qbadge" id="manager-dash-leave-badge">[0-9]+/, 'class="qbadge" id="manager-dash-leave-badge">' + pendingLeavesCount);
            mgrTpl.innerHTML = mgrHtml;
          }

          // Update on live Manager Dashboard if rendered
          const liveMgrCount = parentDoc.getElementById('manager-dash-leave-badge') || document.getElementById('manager-dash-leave-badge');
          if (liveMgrCount) {
            var livePendingLeaves = (store.EMP_LEAVE_REQUESTS || []).filter(function(r){ return !r.isPermission && (r.status || 'pending').toLowerCase() === 'pending'; }).length;
            liveMgrCount.textContent = String(livePendingLeaves);
          }

          // 7. Inject notification into tpl-Notifications template
          const notifTpl = parentDoc.getElementById('tpl-Notifications');
          if (notifTpl) {
            const msgText = isApproved
              ? 'Your ' + lType + ' request for ' + fromDate + ' has been <b>Approved</b> by the Manager'
              : 'Your ' + lType + ' request for ' + fromDate + ' has been <b>Rejected</b> by the Manager';
            const notifCard = '<div class="card notif-card unread" id="dynamic-leave-notif-' + id + '">'
              + '<div class="notif-row">'
              + '<span class="ico-wrap ' + icoClass + '">' + icoChar + '</span>'
              + '<div class="notif-text"><p>' + msgText + '</p><small>Just now</small></div>'
              + '<span class="dot"></span>'
              + '<span class="close-item-btn" onclick="this.closest(\'.notif-card\').remove()" title="Delete">✕</span>'
              + '</div></div>';
            let notifHtml = notifTpl.innerHTML;
            if (notifHtml.indexOf('dynamic-leave-notif-' + id) === -1) {
              notifHtml = notifHtml.replace('<div id="notif-container">', '<div id="notif-container">' + notifCard);
              notifTpl.innerHTML = notifHtml;
            }
          }

          // Mark new notification & trigger subtle glow on Employee Dashboard
          store.HAS_NEW_NOTIFICATION = true;
          try { store.sessionStorage.setItem('HAS_NEW_NOTIFICATION', 'true'); } catch (e) {}
          if (typeof window !== 'undefined') {
            window.HAS_NEW_NOTIFICATION = true;
            try { sessionStorage.setItem('HAS_NEW_NOTIFICATION', 'true'); } catch (e) {}
          }
          const liveBell = parentDoc.getElementById('dash-bell-btn') || parentDoc.querySelector('.dash-top .bell');
          if (liveBell) liveBell.classList.add('has-glow');

          // 8. Update Leave Tab counts & re-render current tab
          if (typeof updateLeaveTabCounts === 'function') {
            updateLeaveTabCounts();
          }
          if (typeof renderLeaveApprovals === 'function') {
            renderLeaveApprovals();
          }

          // 9. Direct navigation to the Request Detail page!
          if (store.loadScreen) {
            store.loadScreen('tpl-LeaveApprovalDetail', personKey);
          } else if (window.parent && window.parent.loadScreen) {
            window.parent.loadScreen('tpl-LeaveApprovalDetail', personKey);
          } else if (typeof loadScreen === 'function') {
            loadScreen('tpl-LeaveApprovalDetail', personKey);
          }
        }

        function goToNotificationsAfterLeave(status) {
          if (window.parent && window.parent.loadScreen) {
            window.parent.loadScreen('tpl-Notifications');
          }
        }


        function updateLeaveTabCounts() {
          const pending = document.querySelectorAll('.approval-card[data-status="pending"]').length;
          const approved = document.querySelectorAll('.approval-card[data-status="approved"]').length;
          const rejected = document.querySelectorAll('.approval-card[data-status="rejected"]').length;

          const countPending = document.getElementById('count-pending');
          const countApproved = document.getElementById('count-approved');
          const countRejected = document.getElementById('count-rejected');

          if (countPending) countPending.textContent = pending;
          if (countApproved) countApproved.textContent = approved;
          if (countRejected) countRejected.textContent = rejected;
        }

        function renderLeaveApprovals() {
          let visibleCount = 0;
          const cards = document.querySelectorAll('.approval-card');
          cards.forEach(card => {
            const status = card.getAttribute('data-status');
            if (status === currentLeaveTab) {
              card.style.display = 'block';
              visibleCount++;
            } else {
              card.style.display = 'none';
            }
          });

          const msg = document.getElementById('no-leave-msg');
          if (msg) {
            msg.style.display = visibleCount === 0 ? 'block' : 'none';
          }
        }

      