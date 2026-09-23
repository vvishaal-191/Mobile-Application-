
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

        function handleDetailLeaveDecision(status) {
          const isApproved = status === 'approved';
          const labelText = isApproved ? 'Approved' : 'Rejected';
          const badgeClass = isApproved ? 'badge success' : 'badge danger';

          const store = window.parent || window;
          const parentDoc = (window.parent && window.parent.document) ? window.parent.document : document;
          const currentPerson = (store.SELECTED_PERSON) || 'priya';

          if (!store.PERSON_DATA) store.PERSON_DATA = {};
          if (store.PERSON_DATA[currentPerson]) {
            store.PERSON_DATA[currentPerson].status = status;
          }

          store.LAST_LEAVE_DECISION = {
            id: currentPerson === 'priya' ? '1' : currentPerson,
            personKey: currentPerson,
            status: status,
            labelText: labelText,
            badgeClass: badgeClass,
            lType: (store.PERSON_DATA[currentPerson] && store.PERSON_DATA[currentPerson].leaveType) || 'Casual Leave'
          };
          store.lastLeaveDecision = store.LAST_LEAVE_DECISION;

          if (store.PERSON_DATA && store.PERSON_DATA[currentPerson] && store.PERSON_DATA[currentPerson].isPermission) {
            store.LAST_PERMISSION_DECISION = {
              id: currentPerson,
              status: status,
              type: store.PERSON_DATA[currentPerson].leaveType || 'Permission',
              date: store.PERSON_DATA[currentPerson].fromDate || '04-Sep-2026'
            };
            if (store.PERM_STATE) {
              store.PERM_STATE.forEach(function(req) {
                if (String(req.id) === String(currentPerson) || req.type === store.PERSON_DATA[currentPerson].leaveType) {
                  req.status = status;
                }
              });
            }
          }

          // 1. Update tpl-ManagerDashboard counters if needed (cards are dynamically populated without duplication)
          const mgrTpl = parentDoc.getElementById('tpl-ManagerDashboard');
          if (mgrTpl) {
            let tplHtml = mgrTpl.innerHTML;
            const pObj = (store.PERSON_DATA && store.PERSON_DATA[currentPerson]) || {};
            if (pObj.isPermission) {
              tplHtml = tplHtml.replace(/class="qbadge" id="manager-dash-perm-badge">[0-9]+/, 'class="qbadge" id="manager-dash-perm-badge">0');
            } else {
              tplHtml = tplHtml.replace(/class="qbadge" id="manager-dash-leave-badge">[0-9]+/, 'class="qbadge" id="manager-dash-leave-badge">0');
            }
            mgrTpl.innerHTML = tplHtml;
          }

          // 2. Update EMP_LEAVE_REQUESTS & PERM_STATE so Employee Dashboard reflects it
          if (store.EMP_LEAVE_REQUESTS && store.EMP_LEAVE_REQUESTS.length > 0) {
            store.EMP_LEAVE_REQUESTS.forEach(function(req) {
              var pData = store.PERSON_DATA && store.PERSON_DATA[currentPerson];
              var idMatch = String(req.id) === String(currentPerson) || ('perm-' + req.id) === String(currentPerson) || String(req.id) === ('perm-' + currentPerson);
              var detailMatch = pData && (req.employeeName === (pData.name || pData.employeeName)) && (req.leaveType === (pData.leaveType || pData.type));
              if (idMatch || detailMatch) {
                req.status = status;
                if (isApproved) req.approvedAt = Date.now();
              }
            });
            var pObjDetail = (store.PERSON_DATA && store.PERSON_DATA[currentPerson]) || {};
            if (typeof store.updateEmploymentStatusAfterApproval === 'function') {
              store.updateEmploymentStatusAfterApproval(pObjDetail.name || pObjDetail.employeeName, pObjDetail.leaveType || pObjDetail.type, status);
            }
          }
          if (store.PERM_STATE && store.PERM_STATE.length > 0) {
            store.PERM_STATE.forEach(function(req) {
              if (String(req.id) === String(currentPerson) || ('perm-' + req.id) === String(currentPerson)) {
                req.status = status;
              }
            });
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
            const pObj = (store.PERSON_DATA && store.PERSON_DATA[currentPerson]) || {};
            const isPermReq = !!(pObj.isPermission || (store.LAST_PERMISSION_DECISION && store.LAST_PERMISSION_DECISION.id === currentPerson));
            if (isPermReq) {
              if (!store.PERM_NOTIFICATIONS) store.PERM_NOTIFICATIONS = [];
              store.PERM_NOTIFICATIONS.unshift({
                status: status,
                type: pObj.leaveType || pObj.type || 'Permission',
                date: pObj.fromDate || pObj.schedule || '04-Sep-2026',
                managerName: (store.USER_PROFILE && store.USER_PROFILE.reportingManager) || 'Your Manager',
                employeeName: pObj.name || 'Employee'
              });
            } else {
              const lType = (pObj.leaveType || pObj.type || 'Casual Leave');
              const fromDate = (pObj.fromDate || 'Sep 10, 2026');
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
                + '<span class="close-item-btn" onclick="this.closest(\'.notif-card\').remove()" title="Delete">✕</span>'
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

          const liveQBadge = parentDoc.getElementById('manager-dash-leave-badge') || document.getElementById('manager-dash-leave-badge');
          if (liveQBadge) {
            liveQBadge.textContent = '2';
          }

          // 5. Update the current Request Detail screen's approval path, banner, and buttons dynamically
          const mgrPath = document.getElementById('lad-manager-path');
          if (mgrPath) {
            mgrPath.className = isApproved ? 'done' : 'danger';
            mgrPath.style.background = isApproved ? '#E3F8EE' : '#FCE4E4';
            mgrPath.style.color = isApproved ? '#1FAE6E' : '#E5484D';
            mgrPath.style.fontWeight = '700';
            mgrPath.style.padding = '3px 10px';
            mgrPath.style.borderRadius = '6px';
            mgrPath.textContent = isApproved ? 'Manager (Approved)' : 'Manager (Rejected)';
          }

          const btnRow = document.getElementById('lad-btn-row');
          if (btnRow) {
            btnRow.innerHTML = '<div style="display:flex;flex-direction:column;gap:10px;width:100%;">'
              + '<div style="text-align:center;padding:12px;border-radius:12px;font-weight:700;font-size:15px;background:' + (isApproved ? '#E3F8EE' : '#FCE4E4') + ';color:' + (isApproved ? '#1FAE6E' : '#E5484D') + ';">'
              + (isApproved ? '✓ Approved by Manager' : '✕ Rejected by Manager')
              + '</div>'
              + '<div style="display:flex;gap:10px;">'
              + '<button class="btn ' + (isApproved ? 'outline-reject' : 'btn-primary') + '" style="flex:1;padding:12px;border-radius:12px;font-size:14px;cursor:pointer;" onclick="handleDetailLeaveDecision(\'' + (isApproved ? 'rejected' : 'approved') + '\')">Change to ' + (isApproved ? 'Reject' : 'Approve') + '</button>'
              + '<button class="btn btn-primary" style="flex:1;padding:12px;border-radius:12px;font-size:14px;cursor:pointer;" onclick="if(window.parent&&window.parent.loadScreen)window.parent.loadScreen(\'tpl-ManagerDashboard\');else if(typeof loadScreen===\'function\')loadScreen(\'tpl-ManagerDashboard\');">Done →</button>'
              + '</div>'
              + '</div>';
          }
        }

      