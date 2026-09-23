
        function calcPermDuration() {
          var durationInput = document.getElementById('perm-duration-input');
          var startInput = document.getElementById('perm-start-time');
          var endInput = document.getElementById('perm-end-time');
          if (startInput && endInput && startInput.value && endInput.value) {
            var sParts = startInput.value.split(':').map(Number);
            var eParts = endInput.value.split(':').map(Number);
            var diff = (eParts[0] * 60 + eParts[1]) - (sParts[0] * 60 + sParts[1]);
            if (diff < 0) diff += 24 * 60;
            var hours = Math.floor(diff / 60);
            var mins = diff % 60;
            var text = '';
            if (hours > 0 && mins > 0) text = hours + ' Hr ' + mins + ' Mins';
            else if (hours > 0) text = hours + ' Hour' + (hours > 1 ? 's' : '');
            else text = mins + ' Mins';
            if (durationInput) durationInput.value = text;
          } else if (durationInput && !durationInput.value) {
            durationInput.value = '2 Hours';
          }
        }
        window.calcPermDuration = calcPermDuration;

        function handleApplyPermissionSubmit() {
          var permDateInput  = document.getElementById('perm-date-input');
          var permTypeSelect = document.getElementById('perm-type-select');
          var durationInput  = document.getElementById('perm-duration-input');
          var reasonText     = document.getElementById('perm-reason-text');
          var permManagerEl  = document.getElementById('perm-manager-select');

          var rawDate   = permDateInput  ? permDateInput.value  : '2026-09-04';
          var months    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          var dp = rawDate.split('-');
          var fmtDate = dp.length === 3 ? (dp[2] + '-' + (months[parseInt(dp[1],10)-1]||'Sep') + '-' + dp[0]) : rawDate;

          var pType     = permTypeSelect ? permTypeSelect.value : 'Early Going';
          var pDuration = durationInput  ? (durationInput.value.trim() || '2 Hours') : '2 Hours';
          var pReason   = reasonText     ? (reasonText.value.trim()   || 'Personal work / checkup') : 'Personal work / checkup';

          var newId = 'perm-' + Date.now();
          var parentWin = window.parent || window;
          var permProf = parentWin.USER_PROFILE || {};
          var permEmpName = permProf.name || (parentWin.AUTH_USER && parentWin.AUTH_USER.name) || 'Sneha Reddy';
          var permEmpEmail = (permProf.email || (parentWin.AUTH_USER && parentWin.AUTH_USER.email) || 'sneha@gmail.com').toLowerCase();
          var permEmpInitials = permProf.initials || (permEmpName.split(' ').map(function(w){return w[0];}).join('').toUpperCase().slice(0,2)) || 'SR';
          var permEmpId = permProf.employeeId || (parentWin.AUTH_USER && parentWin.AUTH_USER.empId) || 'EMP-2024-0103';
          var permEmpRole = permProf.role || (parentWin.AUTH_USER && parentWin.AUTH_USER.jobTitle) || 'UI/UX Designer';
          var defPermMgr = permProf.reportingManager ? (permProf.reportingManager.indexOf('(') !== -1 ? permProf.reportingManager : permProf.reportingManager.split(' ')[0] + ' (Reporting Manager)') : 'Vishnu (Reporting Manager)';
          var pManager = permManagerEl ? permManagerEl.value : defPermMgr;

          var entry = {
            id: newId,
            type: pType,
            leaveType: pType,
            permissionType: pType,
            date: fmtDate,
            fromDate: fmtDate,
            toDate: fmtDate,
            duration: pDuration,
            daysText: pDuration,
            reason: pReason,
            status: 'pending',
            isPermission: true,
            employeeName: permEmpName,
            employeeEmail: permEmpEmail,
            employeeInitials: permEmpInitials,
            employeeId: permEmpId,
            employeeRole: permEmpRole,
            approvingManager: pManager,
            createdAt: Date.now()
          };
          if (!parentWin.PERM_STATE) parentWin.PERM_STATE = [];
          var existsPerm = parentWin.PERM_STATE.some(function(p){ return p.type === pType && p.date === fmtDate && p.reason === pReason; });
          if (!existsPerm) {
            parentWin.PERM_STATE.unshift(entry);
          }

          if (!parentWin.EMP_LEAVE_REQUESTS) parentWin.EMP_LEAVE_REQUESTS = [];
          var existsEmpReq = parentWin.EMP_LEAVE_REQUESTS.some(function(r){ return r.leaveType === pType && r.fromDate === fmtDate && r.reason === pReason; });
          if (!existsEmpReq) {
            parentWin.EMP_LEAVE_REQUESTS.unshift({ id: newId, leaveType: pType, fromDate: fmtDate, daysText: pDuration, reason: pReason, isPermission: true, employeeName: permEmpName, employeeEmail: permEmpEmail, employeeId: permEmpId, employeeRole: permEmpRole, status: 'pending' });
          }

          var permPersonObj = {
            id: newId,
            isPermission: true,
            type: pType,
            leaveType: pType,
            permissionType: pType,
            name: permEmpName,
            initials: permEmpInitials,
            role: permProf.role || 'Senior Software Engineer',
            empId: permEmpId,
            employeeId: permEmpId,
            employeeName: permEmpName,
            employeeInitials: permEmpInitials,
            status: 'pending',
            date: fmtDate,
            fromDate: fmtDate,
            toDate: fmtDate,
            duration: pDuration,
            totalDays: pDuration,
            reason: pReason,
            approvingManager: pManager,
            contact: pManager,
            emergencyContact: pManager,
            subtitle: pType + ' Application',
            appliedPath: permEmpName.split(' ')[0] + ' (Applied)'
          };
          if (!parentWin.PERSON_DATA) parentWin.PERSON_DATA = {};
          parentWin.PERSON_DATA[newId] = permPersonObj;
          parentWin.PERSON_DATA['priya'] = permPersonObj;
          parentWin.LATEST_REQUEST = permPersonObj;
          parentWin.LATEST_PERMISSION_REQUEST = permPersonObj;
          parentWin.SELECTED_PERSON = newId;

          var modal = document.getElementById('perm-success-modal');
          if (modal) {
            modal.classList.add('show');
          } else if (parentWin.loadScreen) {
            parentWin.loadScreen('tpl-EmployeeDashboard');
          }
        }
        window.handleApplyPermissionSubmit = handleApplyPermissionSubmit;

        function closePermSuccessModal() {
          var modal = document.getElementById('perm-success-modal');
          if (modal) modal.classList.remove('show');
          var parentWin = window.parent || window;
          if (parentWin.loadScreen) {
            parentWin.loadScreen('tpl-EmployeeDashboard');
          } else if (typeof loadScreen === 'function') {
            loadScreen('tpl-EmployeeDashboard');
          }
        }
        window.closePermSuccessModal = closePermSuccessModal;

        document.querySelectorAll('.bottom-nav .tab').forEach((t) => t.addEventListener('click', () => setActiveNav(t)));
      