
        function toggleHalfDay(isChecked) {
          var wrap = document.getElementById('half-day-type-wrap');
          var daysBox = document.getElementById('days-count-box');
          if (wrap) wrap.style.display = isChecked ? 'block' : 'none';
          if (isChecked && daysBox) {
            daysBox.textContent = '0.5 Day (Half Day)';
          } else if (!isChecked && daysBox) {
            daysBox.textContent = '1.0 Day (Auto-calculated)';
          }
        }

        function handleApplyLeaveSubmit() {
          var leaveTypeEl = document.getElementById('leave-type-select');
          var fromDateEl = document.getElementById('from-date-display');
          var toDateEl = document.getElementById('to-date-display');
          var daysEl = document.getElementById('days-count-box');
          var managerEl = document.getElementById('leave-manager-select');
          var reasonEl = document.getElementById('leave-reason-text');

          var leaveType = leaveTypeEl ? leaveTypeEl.value : 'Casual Leave';
          var fromDate = fromDateEl ? fromDateEl.value : '07-Sep-2026';
          var toDate = toDateEl ? toDateEl.value : '07-Sep-2026';
          var daysText = daysEl ? daysEl.textContent.replace(' (Auto-calculated)', '') : '1.0 Day';

          // Read employee profile from store
          var store = window.parent || window;
          var empProf = store.USER_PROFILE || {};
          var empName = empProf.name || (store.AUTH_USER && store.AUTH_USER.name) || 'Sneha Reddy';
          var empEmail = (empProf.email || (store.AUTH_USER && store.AUTH_USER.email) || 'sneha@gmail.com').toLowerCase();
          var empInitials = empProf.initials ||
            (empName.trim().split(/\s+/).map(function(w){ return w[0]; }).join('').toUpperCase().slice(0, 2)) || 'SR';
          var empId = empProf.employeeId || (store.AUTH_USER && store.AUTH_USER.empId) || 'EMP-2024-0103';
          var empRole = empProf.role || (store.AUTH_USER && store.AUTH_USER.jobTitle) || 'UI/UX Designer';

          var defaultMgr = empProf.reportingManager ? (empProf.reportingManager.indexOf('(') !== -1 ? empProf.reportingManager : empProf.reportingManager.split(' ')[0] + ' (Reporting Manager)') : 'Vishnu (Reporting Manager)';
          var approvingManager = managerEl ? managerEl.value : defaultMgr;
          var reason = reasonEl ? reasonEl.value.trim() : 'Personal Work';

          var newId = 'leave-' + Date.now();
          var reqObj = {
            id: newId,
            leaveType: leaveType,
            fromDate: fromDate,
            toDate: toDate,
            daysText: daysText,
            reason: reason,
            approvingManager: approvingManager,
            employeeName: empName,
            employeeEmail: empEmail,
            employeeInitials: empInitials,
            employeeId: empId,
            employeeRole: empRole,
            status: 'pending',
            isPermission: false,
            createdAt: Date.now()
          };
          store.lastLeaveRequest = reqObj;
          store.LATEST_LEAVE_REQUEST = reqObj;

          var leavePersonObj = {
            id: newId,
            isPermission: false,
            initials: empInitials,
            name: empName,
            role: empRole || 'Senior Software Engineer',
            empId: empId || 'EMP-2024-0156',
            leaveType: leaveType,
            fromDate: fromDate,
            toDate: toDate,
            totalDays: daysText,
            contact: empProf.phone || '+91 98765 43210',
            emergencyContact: empProf.phone || '+91 98765 43210',
            approvingManager: approvingManager,
            reason: reason || 'Personal work',
            subtitle: leaveType + ' Application',
            appliedPath: empName.split(' ')[0] + ' (Applied)',
            status: 'pending'
          };

          if (!store.PERSON_DATA) store.PERSON_DATA = {};
          store.PERSON_DATA[newId] = leavePersonObj;
          store.PERSON_DATA['priya'] = leavePersonObj;
          store.LATEST_REQUEST = leavePersonObj;
          store.LATEST_LEAVE_REQUEST = leavePersonObj;
          store.SELECTED_PERSON = newId;

          // Also push to EMP_LEAVE_REQUESTS so Employee Dashboard shows it (avoid duplicate)
          if (!store.EMP_LEAVE_REQUESTS) store.EMP_LEAVE_REQUESTS = [];
          var isDupReq = store.EMP_LEAVE_REQUESTS.some(function(r) {
            return r.id === newId || (r.leaveType === leaveType && r.fromDate === fromDate && r.reason === reason);
          });
          if (!isDupReq) {
            store.EMP_LEAVE_REQUESTS.unshift(reqObj);
          }

          // Inject a new pending card at the top of the Leave Approvals list in the template
          var parentDoc = (window.parent && window.parent.document) ? window.parent.document : document;
          var approvalsTpl = parentDoc.getElementById('tpl-LeaveApprovals');
          if (approvalsTpl) {
            var typeClass = leaveType.indexOf('Sick') !== -1 ? 'warning' : leaveType.indexOf('Earned') !== -1 ? 'purple' : 'info';
            var cardHtml = '<div class="card approval-card" data-leave-id="' + newId + '" data-status="pending" style="cursor:pointer;" onclick="if(window.parent&&window.parent.loadScreen)window.parent.loadScreen(\'tpl-LeaveApprovalDetail\', \'' + newId + '\');else if(typeof loadScreen===\'function\')loadScreen(\'tpl-LeaveApprovalDetail\', \'' + newId + '\');">'
              + '<div class="top-row"><div class="emp-row"><div class="avatar">' + empInitials + '</div><div><b>' + empName + '</b><p>' + empId + '</p></div></div><span class="badge ' + typeClass + '">' + leaveType + '</span></div>'
              + '<hr/>'
              + '<div class="detail-row"><span>Duration</span><b>' + daysText + ' (' + fromDate + ' \u2013 ' + toDate + ')</b></div>'
              + '<div class="detail-row"><span>Reason</span><b>' + (reason || 'Not specified') + '</b></div>'
              + '<div class="card-action-wrap" id="action-wrap-' + newId + '">'
              + '<div class="btn-row"><button class="btn btn-reject" onclick="event.stopPropagation();processLeaveAction(\'' + newId + '\', \'rejected\')">Reject</button><button class="btn btn-approve" onclick="event.stopPropagation();processLeaveAction(\'' + newId + '\', \'approved\')">Approve</button></div>'
              + '</div></div>';
            var tplHtml = approvalsTpl.innerHTML;
            if (tplHtml.indexOf(newId) === -1) {
              tplHtml = tplHtml.replace('<div id="leave-approvals-list">', '<div id="leave-approvals-list">' + cardHtml);
              tplHtml = tplHtml.replace(/id="count-pending">[0-9]+/, function(m) {
                var c = parseInt(m.replace('id="count-pending">', ''), 10) || 0;
                return 'id="count-pending">' + (c + 1);
              });
              tplHtml = tplHtml.replace(/id="no-leave-msg"[\s\S]*?style="display:block;/g, 'id="no-leave-msg" style="display:none;');
              approvalsTpl.innerHTML = tplHtml;
            }
            var mgrTpl = parentDoc.getElementById('tpl-ManagerDashboard');
            if (mgrTpl) {
              let mgrHtml = mgrTpl.innerHTML;
              mgrHtml = mgrHtml.replace(/class="qbadge" id="manager-dash-leave-badge">[0-9]+/, function(m) {
                var c = parseInt(m.replace('class="qbadge" id="manager-dash-leave-badge">', ''), 10) || 0;
                return 'class="qbadge" id="manager-dash-leave-badge">' + (c + 1);
              });
              mgrTpl.innerHTML = mgrHtml;
            }
            var liveMgrBadge = parentDoc.getElementById('manager-dash-leave-badge') || document.getElementById('manager-dash-leave-badge');
            if (liveMgrBadge) {
              var curVal = parseInt(liveMgrBadge.textContent, 10) || 0;
              liveMgrBadge.textContent = String(curVal + 1);
            }
          }

          // Show success confirmation popup
          var modal = document.getElementById('leave-success-modal');
          if (modal) {
            modal.classList.add('show');
          } else if (window.parent && window.parent.loadScreen) {
            window.parent.loadScreen('tpl-EmployeeDashboard');
          }
        }

        function closeLeaveSuccessModal() {
          var modal = document.getElementById('leave-success-modal');
          if (modal) modal.classList.remove('show');
          if (window.parent && window.parent.loadScreen) {
            window.parent.loadScreen('tpl-EmployeeDashboard');
          }
        }
        window.closeLeaveSuccessModal = closeLeaveSuccessModal;
      