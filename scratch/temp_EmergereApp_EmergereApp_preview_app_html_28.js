
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

        let currentPermTab = 'pending';

        function switchPermTab(status, el) {
          currentPermTab = status;
          const pills = el.parentElement.querySelectorAll('.pill');
          pills.forEach(p => p.classList.remove('active'));
          el.classList.add('active');
          renderPermissionApprovals();
        }

        function formatTime12H(time24) {
          if (!time24) return '';
          const [hStr, mStr] = time24.split(':');
          let h = parseInt(hStr, 10);
          const m = mStr || '00';
          const ampm = h >= 12 ? 'PM' : 'AM';
          h = h % 12;
          if (h === 0) h = 12;
          const hDisplay = h < 10 ? '0' + h : h;
          return `${hDisplay}:${m} ${ampm}`;
        }

        function formatDateDisplay(dateStr) {
          if (!dateStr) return '04-Sep-2026';
          const parts = dateStr.split('-');
          if (parts.length === 3) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const year = parts[0];
            const monthIdx = parseInt(parts[1], 10) - 1;
            const day = parts[2];
            if (months[monthIdx]) {
              return `${day}-${months[monthIdx]}-${year}`;
            }
          }
          return dateStr;
        }

        function calcPermDuration() {
          const startVal = document.getElementById('perm-start-time') ? document.getElementById('perm-start-time').value : '15:00';
          const endVal = document.getElementById('perm-end-time') ? document.getElementById('perm-end-time').value : '17:00';
          const durationBox = document.getElementById('perm-duration-box');
          if (!durationBox) return;

          if (startVal && endVal) {
            const [sH, sM] = startVal.split(':').map(Number);
            const [eH, eM] = endVal.split(':').map(Number);
            let startMin = sH * 60 + sM;
            let endMin = eH * 60 + eM;
            let diff = endMin - startMin;
            if (diff < 0) diff += 24 * 60;
            const hours = Math.floor(diff / 60);
            const mins = diff % 60;
            let text = '';
            if (hours > 0 && mins > 0) text = `${hours} Hr ${mins} Mins`;
            else if (hours > 0) text = `${hours} Hour${hours > 1 ? 's' : ''}`;
            else text = `${mins} Mins`;
            durationBox.textContent = `${text} (Auto-calculated)`;
          } else {
            durationBox.textContent = 'Auto-calculated';
          }
        }

        function syncPermTime(type, val) {
            const displayId = type === 'start' ? 'perm-start-time-display' : 'perm-end-time-display';
            const displayEl = document.getElementById(displayId);
            if (displayEl && val) {
              displayEl.value = formatTime12H(val);
            }
            calcPermDuration();
          }

          function openTimePicker(pickerId) {
            const picker = document.getElementById(pickerId);
            if (picker) {
              if (typeof picker.showPicker === 'function') {
                try {
                  picker.showPicker();
                } catch (e) {
                  picker.click();
                }
              } else {
                picker.click();
              }
            }
          }

          let lastPermRequest = null;

          function handleApplyPermissionSubmit() {
            const permDateInput = document.getElementById('perm-date-input');
            const permTypeSelect = document.getElementById('perm-type-select');
            const startTimeInput = document.getElementById('perm-start-time');
            const endTimeInput = document.getElementById('perm-end-time');
            const durationInput = document.getElementById('perm-duration-input') || document.getElementById('perm-duration-box');
            const reasonText = document.getElementById('perm-reason-text');

            const rawDate = permDateInput ? permDateInput.value : '2026-09-04';
            const formattedDate = formatDateDisplay(rawDate);
            const pType = permTypeSelect ? permTypeSelect.value : 'Early Going';
            const startTimeDisplay = document.getElementById('perm-start-time-display');
            const endTimeDisplay = document.getElementById('perm-end-time-display');
            const rawStart = startTimeInput ? startTimeInput.value : '15:00';
            const rawEnd = endTimeInput ? endTimeInput.value : '17:00';
            const pStart = startTimeDisplay ? startTimeDisplay.value : formatTime12H(rawStart);
            const pEnd = endTimeDisplay ? endTimeDisplay.value : formatTime12H(rawEnd);
            const pDuration = durationInput ? (durationInput.value ? durationInput.value.trim() : durationInput.textContent.replace(' (Auto-calculated)', '')) : '2 Hours';
            const pReason = reasonText ? (reasonText.value.trim() || 'Personal work / checkup') : 'Personal work / checkup';
             // Read employee profile from parent window
            const store = window.parent || window;
            const empProf = (store.USER_PROFILE) || {};
            const empName = empProf.name || 'Employee';
            const empInitials = empProf.initials ||
              (empName.trim().split(/\s+/).map(function(w){ return w[0]; }).join('').toUpperCase().slice(0, 2)) || 'PS';
            const empId = empProf.employeeId || 'EMP-2024-0156';
            const managerSelect = document.getElementById('perm-manager-select');
            const defPermMgr = empProf.reportingManager ? (empProf.reportingManager.split(' ')[0]) : 'Vishnu';
            const pManager = managerSelect ? managerSelect.value : defPermMgr;

            const newId = 'perm-' + Date.now();

            lastPermRequest = {
              id: newId,
              type: pType,
              date: formattedDate,
              start: pStart,
              end: pEnd,
              duration: pDuration,
              reason: pReason,
              status: 'pending',
              employeeName: empName,
              employeeInitials: empInitials,
              employeeId: empId,
              approvingManager: pManager
            };

            const permPersonObj = {
              id: newId,
              isPermission: true,
              type: pType,
              leaveType: pType,
              permissionType: pType,
              date: formattedDate,
              fromDate: formattedDate,
              toDate: formattedDate,
              start: pStart,
              end: pEnd,
              schedule: formattedDate + ' (' + pStart + ' - ' + pEnd + ')',
              duration: pDuration,
              totalDays: pDuration,
              reason: pReason,
              status: 'pending',
              employeeName: empName,
              name: empName,
              employeeInitials: empInitials,
              initials: empInitials,
              employeeId: empId,
              empId: empId,
              role: empProf.role || 'Senior Software Engineer',
              approvingManager: pManager,
              contact: pManager,
              emergencyContact: pManager,
              subtitle: pType + ' Application',
              appliedPath: empName.split(' ')[0] + ' (Applied)'
            };
            if (!store.PERSON_DATA) store.PERSON_DATA = {};
            store.PERSON_DATA[newId] = permPersonObj;
            store.PERSON_DATA['priya'] = permPersonObj;
            store.LATEST_REQUEST = permPersonObj;
            store.LATEST_PERMISSION_REQUEST = permPersonObj;
            store.SELECTED_PERSON = newId;

            // Push to shared PERM_STATE so PermissionApprovals template can use it (avoid duplicate)
            if (!store.PERM_STATE) store.PERM_STATE = [];
            var isDupPerm = store.PERM_STATE.some(function(p) { return p.type === pType && p.date === formattedDate && p.reason === pReason; });
            if (!isDupPerm) {
              store.PERM_STATE.unshift(lastPermRequest);
            }

            // Also push to EMP_LEAVE_REQUESTS so Employee Dashboard shows it (avoid duplicate)
            if (!store.EMP_LEAVE_REQUESTS) store.EMP_LEAVE_REQUESTS = [];
            var isDupEmpPerm = store.EMP_LEAVE_REQUESTS.some(function(r) { return r.leaveType === pType && r.fromDate === formattedDate && r.reason === pReason; });
            if (!isDupEmpPerm) {
              store.EMP_LEAVE_REQUESTS.unshift({
                id: newId,
                leaveType: pType,
                fromDate: formattedDate,
                daysText: pDuration,
                reason: pReason,
                isPermission: true,
                employeeName: empName,
                status: 'pending'
              });
            }

            // Prepend card to #permission-approvals-list
            const listContainer = document.getElementById('permission-approvals-list');
            if (listContainer) {
              const badgeTone = pType === 'Late Coming' ? 'purple' : pType === 'Early Going' ? 'warning' : 'info';
              const newCardHtml = `
    <div class="card approval-card" data-perm-id="${newId}" data-status="pending" data-type="${pType}" data-date="${formattedDate}" style="cursor:pointer;" onclick="if(window.parent&&window.parent.loadScreen)window.parent.loadScreen('tpl-LeaveApprovalDetail', '${newId}');else if(typeof loadScreen==='function')loadScreen('tpl-LeaveApprovalDetail', '${newId}');">
      <div class="top-row"><div class="emp-row"><div class="avatar">${empInitials}</div><div><b>${empName}</b><p>${pType}</p></div></div><span class="badge ${badgeTone}">${pType}</span></div>
      <hr/>
      <div class="detail-row"><span>Schedule</span><b>${formattedDate} (${pStart} - ${pEnd})</b></div>
      <div class="detail-row"><span>Duration</span><b>${pDuration}</b></div>
      <div class="detail-row"><span>Reason</span><b>${pReason}</b></div>
      <div class="card-action-wrap">
        <div class="btn-row">
          <button class="btn btn-reject" onclick="event.stopPropagation();processPermAction('${newId}', 'rejected')">Reject</button>
          <button class="btn btn-approve" onclick="event.stopPropagation();processPermAction('${newId}', 'approved')">Approve</button>
        </div>
      </div>
    </div>`;
              listContainer.insertAdjacentHTML('afterbegin', newCardHtml);
            }

            updatePermTabCounts();
            currentPermTab = 'pending';
            renderPermissionApprovals();

            if (window.parent && window.parent.loadScreen) {
              window.parent.loadScreen('tpl-PermissionApprovals');
            } else if (typeof loadScreen === 'function') {
              loadScreen('tpl-PermissionApprovals');
            }
          }

          function processPermAction(id, newStatus) {
            const card = document.querySelector(`#permission-approvals-list .approval-card[data-perm-id="${id}"]`);
            let pName = 'Employee';
            let pInitials = 'PS';
            let pRole = 'Senior Software Engineer';
            let pEmpId = 'EMP-2024-0156';
            let pType = 'Late Coming';
            let pSchedule = 'Sep 04 (10:00 - 10:30 AM)';
            let pDuration = '30 Mins';
            let pReason = 'Doctor appointment checkup';

            if (card) {
              card.setAttribute('data-status', newStatus);
              pName = card.querySelector('.emp-row b') ? card.querySelector('.emp-row b').textContent.trim() : pName;
              pInitials = card.querySelector('.avatar') ? card.querySelector('.avatar').textContent.trim() : pInitials;
              pType = card.getAttribute('data-type') || (card.querySelector('.emp-row p') ? card.querySelector('.emp-row p').textContent.trim() : pType);
              const schedEl = card.querySelector('.detail-row:nth-child(3) b');
              const durEl = card.querySelector('.detail-row:nth-child(4) b');
              const rsnEl = card.querySelector('.detail-row:nth-child(5) b');
              if (schedEl) pSchedule = schedEl.textContent.trim();
              if (durEl) pDuration = durEl.textContent.trim();
              if (rsnEl) pReason = rsnEl.textContent.trim();
              if (id === '2' || pName.indexOf('Deepak') !== -1) {
                pRole = 'QA Engineer';
                pEmpId = 'EMP-2024-0102';
              }
              const actionWrap = card.querySelector('.card-action-wrap');
              if (actionWrap) {
                if (newStatus === 'approved') {
                  actionWrap.innerHTML = '<div style="text-align:right; margin-top:8px;"><span class="badge success">Approved</span></div>';
                } else {
                  actionWrap.innerHTML = '<div style="text-align:right; margin-top:8px;"><span class="badge danger">Rejected</span></div>';
                }
              }
            } else if (typeof lastPermRequest !== 'undefined' && lastPermRequest && lastPermRequest.id === id) {
              pName = lastPermRequest.employeeName || pName;
              pInitials = lastPermRequest.employeeInitials || pInitials;
              pRole = 'Senior Software Engineer';
              pEmpId = lastPermRequest.employeeId || pEmpId;
              pType = lastPermRequest.type;
              pSchedule = lastPermRequest.date + (lastPermRequest.start ? ' (' + lastPermRequest.start + ' - ' + lastPermRequest.end + ')' : '');
              pDuration = lastPermRequest.duration;
              pReason = lastPermRequest.reason;
            }

            updatePermTabCounts();
            renderPermissionApprovals();

            const store = window.parent || window;
            const defMgr = (store.USER_PROFILE && store.USER_PROFILE.reportingManager) ? store.USER_PROFILE.reportingManager + ' (Team Lead)' : 'Rahul Sharma (Operations Manager)';
            const permKey = 'perm-' + id;

            const permPersonObj = {
              id: id,
              permKey: permKey,
              isPermission: true,
              name: pName,
              initials: pInitials,
              role: pRole,
              empId: pEmpId,
              type: pType,
              leaveType: pType,
              permissionType: pType,
              schedule: pSchedule,
              fromDate: pSchedule,
              toDate: pSchedule,
              duration: pDuration,
              totalDays: pDuration,
              reason: pReason,
              status: newStatus,
              approvingManager: defMgr,
              contact: '+91 98765 22003',
              emergencyContact: '+91 98765 22003',
              subtitle: pType + ' Application',
              appliedPath: pName.split(' ')[0] + ' (Applied)'
            };

            if (!store.PERSON_DATA) store.PERSON_DATA = {};
            store.PERSON_DATA[permKey] = permPersonObj;
            store.PERSON_DATA[id] = permPersonObj;
            store.SELECTED_PERSON = permKey;

            // Persist decision globally
            store.LAST_PERMISSION_DECISION = permPersonObj;
            store.LAST_LEAVE_DECISION = permPersonObj;

            if (store.PERM_STATE) {
              store.PERM_STATE.forEach(function (req) {
                if (String(req.id) === String(id)) req.status = newStatus;
              });
            }

            if (!store.EMP_LEAVE_REQUESTS) store.EMP_LEAVE_REQUESTS = [];
            var foundEmpReq = false;
            store.EMP_LEAVE_REQUESTS.forEach(function (r) {
              if (r.id === id || (r.isPermission && r.leaveType === pType)) {
                r.status = newStatus;
                foundEmpReq = true;
              }
            });
            if (!foundEmpReq) {
              store.EMP_LEAVE_REQUESTS.unshift({
                id: id,
                leaveType: pType,
                fromDate: pSchedule,
                daysText: pDuration,
                reason: pReason,
                isPermission: true,
                status: newStatus,
                employeeName: pName
              });
            }

            // Add notification to PERM_NOTIFICATIONS
            if (!store.PERM_NOTIFICATIONS) store.PERM_NOTIFICATIONS = [];
            store.PERM_NOTIFICATIONS.unshift({
              status: newStatus,
              type: pType,
              date: pSchedule,
              managerName: (store.USER_PROFILE && store.USER_PROFILE.reportingManager) || 'Your Manager',
              employeeName: pName
            });

            // Mark new notification & trigger subtle glow on Employee Dashboard
            store.HAS_NEW_NOTIFICATION = true;
            try { store.sessionStorage.setItem('HAS_NEW_NOTIFICATION', 'true'); } catch (e) {}
            if (typeof window !== 'undefined') {
              window.HAS_NEW_NOTIFICATION = true;
              try { sessionStorage.setItem('HAS_NEW_NOTIFICATION', 'true'); } catch (e) {}
            }
            const permLiveBell = (window.parent && window.parent.document ? window.parent.document : document).getElementById('dash-bell-btn') || (window.parent && window.parent.document ? window.parent.document : document).querySelector('.dash-top .bell');
            if (permLiveBell) permLiveBell.classList.add('has-glow');

            // Direct navigation to Request Detail page!
            if (store.loadScreen) {
              store.loadScreen('tpl-LeaveApprovalDetail', permKey);
            } else if (window.parent && window.parent.loadScreen) {
              window.parent.loadScreen('tpl-LeaveApprovalDetail', permKey);
            } else if (typeof loadScreen === 'function') {
              loadScreen('tpl-LeaveApprovalDetail', permKey);
            }
          }

          function updatePermTabCounts() {
            const pending = document.querySelectorAll('#permission-approvals-list .approval-card[data-status="pending"]').length;
            const approved = document.querySelectorAll('#permission-approvals-list .approval-card[data-status="approved"]').length;
            const rejected = document.querySelectorAll('#permission-approvals-list .approval-card[data-status="rejected"]').length;

            const countPending = document.getElementById('perm-count-pending');
            const countApproved = document.getElementById('perm-count-approved');
            const countRejected = document.getElementById('perm-count-rejected');

            if (countPending) countPending.textContent = pending;
            if (countApproved) countApproved.textContent = approved;
            if (countRejected) countRejected.textContent = rejected;
          }

          function renderPermissionApprovals() {
            let visibleCount = 0;
            const cards = document.querySelectorAll('#permission-approvals-list .approval-card');
            cards.forEach(card => {
              const status = card.getAttribute('data-status');
              if (status === currentPermTab) {
                card.style.display = 'block';
                visibleCount++;
              } else {
                card.style.display = 'none';
              }
            });

            const msg = document.getElementById('no-perm-msg');
            if (msg) {
              msg.style.display = visibleCount === 0 ? 'block' : 'none';
            }
          }

      