
      document.addEventListener('DOMContentLoaded', function () {
        var currentTpl = 'tpl-Login';

        // ── Shared Permission-Request State ─────────────────────────────
        // Each entry: { id, type, date, duration, reason, status ('pending'|'approved'|'rejected') }
        if (!window.PERM_STATE) {
          window.PERM_STATE = [];
        }

        window.deleteEmpRequest = function (btn, e, reqId) {
          if (e) {
            e.stopPropagation();
            e.preventDefault();
          }
          var card = btn ? btn.closest('.request-card') : null;
          var docRef = card ? card.ownerDocument : document;
          var winRef = docRef.defaultView || window;
          var pWin = (winRef.parent && winRef.parent !== winRef) ? winRef.parent : winRef;
          var cardId = reqId || (card ? card.id.replace('emp-req-', '') : '');

          if (pWin.EMP_LEAVE_REQUESTS) {
            pWin.EMP_LEAVE_REQUESTS = pWin.EMP_LEAVE_REQUESTS.filter(function(r) {
              return String(r.id) !== String(cardId) && ('emp-req-' + r.id) !== (card ? card.id : '');
            });
          }
          if (winRef.EMP_LEAVE_REQUESTS) {
            winRef.EMP_LEAVE_REQUESTS = winRef.EMP_LEAVE_REQUESTS.filter(function(r) {
              return String(r.id) !== String(cardId) && ('emp-req-' + r.id) !== (card ? card.id : '');
            });
          }

          if (cardId) {
            pWin.DELETED_REQUEST_IDS = pWin.DELETED_REQUEST_IDS || [];
            if (pWin.DELETED_REQUEST_IDS.indexOf(cardId) === -1) pWin.DELETED_REQUEST_IDS.push(cardId);
            winRef.DELETED_REQUEST_IDS = winRef.DELETED_REQUEST_IDS || [];
            if (winRef.DELETED_REQUEST_IDS.indexOf(cardId) === -1) winRef.DELETED_REQUEST_IDS.push(cardId);
          }

          if (card) {
            card.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.92) translateY(-8px)';
            setTimeout(function() {
              card.remove();
              var allCards = docRef.querySelectorAll('.request-card, .recent-request-card');
              var secContainer = docRef.getElementById('emp-recent-requests-section');
              if (secContainer && allCards.length <= 1) secContainer.style.display = 'none';
              var count = allCards.length;
              var label = docRef.getElementById('emp-dash-requests-label') || docRef.querySelector('.section-label');
              if (label) {
                label.textContent = 'RECENT REQUESTS (' + count + ')';
              }
            }, 220);
          }
        };

        // ── Shared User Profile State ──────────────────────────────────
        var savedProfile = null;
        try {
          savedProfile = JSON.parse(sessionStorage.getItem('USER_PROFILE'));
        } catch (e) {}

        if (!window.USER_PROFILE) {
          window.USER_PROFILE = savedProfile || {
            name: 'Priya Sharma',
            role: 'Senior Software Engineer',
            employeeId: 'EMP-2024-0156',
            initials: 'PS',
            department: 'IT',
            team: 'Development',
            reportingManager: 'Rahul Sharma',
            workLocation: 'Bangalore',
            joiningDate: 'Mar 15, 2022',
            email: 'john@gmail.com',
            phone: '+91 98765 43210'
          };
        }

        function toggleSidebar() {
          var sb = document.getElementById('sidebar');
          var ov = document.getElementById('sidebar-overlay');
          if (sb) sb.classList.toggle('open');
          if (ov) ov.classList.toggle('open');
        }
        window.toggleSidebar = toggleSidebar;
        window.toggleMobileMenu = toggleSidebar;

        function openSidebar() {
          var sb = document.getElementById('sidebar');
          var ov = document.getElementById('sidebar-overlay');
          if (sb) sb.classList.add('open');
          if (ov) ov.classList.add('open');
        }
        window.openSidebar = openSidebar;

        function closeSidebar() {
          var sb = document.getElementById('sidebar');
          var ov = document.getElementById('sidebar-overlay');
          if (sb) sb.classList.remove('open');
          if (ov) ov.classList.remove('open');
        }
        window.closeSidebar = closeSidebar;
        window.closeMobileMenu = closeSidebar;

        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') closeSidebar();
        });

        var SELECTED_PERSON = 'priya';
        var PERSON_DATA = {
          'priya': {
            initials: 'PS',
            name: 'Priya Sharma',
            role: 'Senior Software Engineer',
            empId: 'EMP-2024-0156',
            leaveType: 'Casual Leave',
            fromDate: 'Sep 10, 2026',
            toDate: 'Sep 11, 2026',
            totalDays: '2 Days',
            contact: '+91 98765 43210',
            reason: "Family function - attending sister's wedding ceremony in Bangalore.",
            subtitle: 'Casual Leave Application',
            appliedPath: 'Priya (Applied)'
          },
          'sneha': {
            initials: 'SG',
            name: 'Sneha Gupta',
            role: 'Product Designer',
            empId: 'EMP-2024-0210',
            leaveType: 'Earned Leave',
            fromDate: 'Sep 15, 2026',
            toDate: 'Sep 19, 2026',
            totalDays: '5 Days',
            contact: '+91 91234 56789',
            reason: 'Personal leave - annual family vacation to Kerala with family.',
            subtitle: 'Earned Leave Application',
            appliedPath: 'Sneha (Applied)'
          },
          'amit': {
            initials: 'AP',
            name: 'Amit Patel',
            role: 'Backend Engineer',
            empId: 'EMP-2024-0089',
            leaveType: 'Sick Leave',
            fromDate: 'Sep 12, 2026',
            toDate: 'Sep 12, 2026',
            totalDays: '1 Day',
            contact: '+91 99887 76655',
            reason: 'Medical appointment & doctor advised rest.',
            subtitle: 'Sick Leave Application',
            appliedPath: 'Amit (Applied)'
          }
        };
        window.PERSON_DATA = PERSON_DATA;

        var EMPLOYEE_ALLOWED_SCREENS = [
          'tpl-Login',
          'tpl-EmployeeDashboard',
          'tpl-MyAttendance',
          'tpl-ApplyLeave',
          'tpl-ApplyPermission',
          'tpl-LeaveBalance',
          'tpl-LeaveHistory',
          'tpl-HolidayCalendar',
          'tpl-Notifications',
          'tpl-MyProfile'
        ];

        var MANAGER_ALLOWED_SCREENS = [
          'tpl-Login',
          'tpl-ManagerDashboard',
          'tpl-TeamAttendance',
          'tpl-LeaveApprovals',
          'tpl-LeaveApprovalDetail',
          'tpl-PermissionApprovals',
          'tpl-MyAttendance',
          'tpl-ApplyLeave',
          'tpl-ApplyPermission',
          'tpl-LeaveBalance',
          'tpl-HolidayCalendar',
          'tpl-MyProfile'
        ];

        window.AUTH_USER = null;

        function updateNavRBAC() {
          var userBox = document.getElementById('sidebar-user-box');
          var avatarEl = document.getElementById('sidebar-user-avatar');
          var nameEl = document.getElementById('sidebar-user-name');
          var roleBadgeEl = document.getElementById('sidebar-user-role-badge');

          if (window.AUTH_USER) {
            if (userBox) userBox.style.display = 'block';
            if (nameEl) nameEl.textContent = window.AUTH_USER.name || 'User';
            if (avatarEl) avatarEl.textContent = window.AUTH_USER.initials || 'U';
            if (roleBadgeEl) {
              if (window.AUTH_USER.role === 'manager') {
                roleBadgeEl.textContent = 'MANAGER';
                roleBadgeEl.style.background = '#EEF2FF';
                roleBadgeEl.style.color = '#4F46E5';
              } else {
                roleBadgeEl.textContent = 'EMPLOYEE';
                roleBadgeEl.style.background = '#E3F8EE';
                roleBadgeEl.style.color = '#1FAE6E';
              }
            }

            document.querySelectorAll('.nav-btn').forEach(function (btn) {
              var screenTpl = btn.getAttribute('data-tpl');
              if (screenTpl === 'tpl-Login') {
                btn.style.display = 'none';
                return;
              }
              if (window.AUTH_USER.role === 'employee') {
                if (EMPLOYEE_ALLOWED_SCREENS.indexOf(screenTpl) !== -1) {
                  btn.style.display = 'block';
                  btn.removeAttribute('disabled');
                  btn.style.opacity = '1';
                } else {
                  btn.style.display = 'none';
                }
              } else if (window.AUTH_USER.role === 'manager') {
                if (MANAGER_ALLOWED_SCREENS.indexOf(screenTpl) !== -1) {
                  btn.style.display = 'block';
                  btn.removeAttribute('disabled');
                  btn.style.opacity = '1';
                } else {
                  btn.style.display = 'none';
                }
              }
            });
          } else {
            if (userBox) userBox.style.display = 'none';
            document.querySelectorAll('.nav-btn').forEach(function (btn) {
              btn.style.display = 'block';
              btn.removeAttribute('disabled');
              btn.style.opacity = '1';
            });
          }
        }
        window.updateNavRBAC = updateNavRBAC;

        function setAuthUser(role, userObj) {
          window.AUTH_USER = Object.assign({}, userObj, { role: role, jobTitle: userObj.role });
          if (role === 'employee') {
            window.USER_PROFILE = {
              name: userObj.name || 'John Doe',
              role: userObj.role || 'Senior Software Engineer',
              employeeId: userObj.empId || userObj.employeeId || 'EMP-2024-0101',
              initials: userObj.initials || 'JD',
              email: userObj.email || 'john@gmail.com',
              department: 'Engineering',
              team: 'Mobile Development',
              reportingManager: userObj.reportingManager || 'Vishnu Kumar',
              workLocation: 'Bangalore - Tech Park',
              joiningDate: '15-Jan-2024',
              phone: userObj.phone || '+91 98765 11001'
            };
            var activeLeaveOnLogin = typeof getActiveLeaveInfo === 'function' ? getActiveLeaveInfo(window.USER_PROFILE) : { isInactive: false };
            window.EMPLOYMENT_STATUS = activeLeaveOnLogin.isInactive ? 'Inactive' : 'Active';
          } else if (role === 'manager') {
            window.USER_PROFILE = {
              name: userObj.name || 'Vishnu Kumar',
              role: userObj.role || 'Engineering Lead / Manager',
              employeeId: userObj.empId || userObj.employeeId || 'MGR-2024-0010',
              initials: userObj.initials || 'VK',
              email: userObj.email || 'vishnu@gmail.com',
              department: 'Engineering',
              team: 'Engineering Leadership',
              reportingManager: 'Board of Directors',
              workLocation: 'Bangalore - Tech Park',
              joiningDate: '01-Jun-2022',
              phone: userObj.phone || '+91 98765 22001'
            };
          }
          try {
            sessionStorage.setItem('USER_PROFILE', JSON.stringify(window.USER_PROFILE));
          } catch (e) {}
          updateNavRBAC();
          try {
            var frame = document.getElementById('frame');
            if (frame && frame.contentWindow) {
              frame.contentWindow.AUTH_USER = window.AUTH_USER;
              frame.contentWindow.USER_PROFILE = window.USER_PROFILE;
            }
          } catch(e) {}
        }
        window.setAuthUser = setAuthUser;

        function logoutUser() {
          window.AUTH_USER = null;
          try {
            sessionStorage.removeItem('USER_PROFILE');
          } catch (e) {}
          updateNavRBAC();
          loadScreen('tpl-Login');
        }
        window.logoutUser = logoutUser;

        function loadScreen(tplId, personKey) {
          if (tplId === 'tpl-Login') {
            window.AUTH_USER = null;
            try {
              sessionStorage.removeItem('USER_PROFILE');
            } catch (e) {}
            if (typeof updateNavRBAC === 'function') updateNavRBAC();
          } else if (!window.AUTH_USER) {
            alert('Please login to access this screen.');
            loadScreen('tpl-Login');
            return;
          }
          if (window.AUTH_USER && tplId !== 'tpl-Login') {
            if (window.AUTH_USER.role === 'employee' && EMPLOYEE_ALLOWED_SCREENS.indexOf(tplId) === -1) {
              alert('Access Restricted: Employee account is not authorized to access Manager screens.');
              return;
            }
            if (window.AUTH_USER.role === 'manager' && MANAGER_ALLOWED_SCREENS.indexOf(tplId) === -1) {
              if (tplId === 'tpl-LeaveHistory') {
                alert('Access Restricted: Manager account is not authorized to access My Requests (History).');
              } else {
                alert('Access Restricted: Manager account is not authorized to access this employee-only screen.');
              }
              return;
            }
          }

          if (personKey) {
            SELECTED_PERSON = personKey;
          }
          var tpl = document.getElementById(tplId);
          if (!tpl) return;
          currentTpl = tplId;
          var frame = document.getElementById('frame');
          frame.srcdoc = tpl.innerHTML;
          document.querySelectorAll('.nav-btn').forEach(function (b) {
            b.classList.toggle('active', b.getAttribute('data-tpl') === tplId);
          });
          closeMobileMenu();
        }
        window.loadScreen = loadScreen;
        window.EMPLOYMENT_STATUS = 'Active';
        window.SIMULATED_DATE_OFFSET_DAYS = 0;

        function isInactiveLeaveType(leaveType) {
          if (!leaveType) return false;
          var lt = String(leaveType).toLowerCase().trim();
          return lt.indexOf('casual') !== -1 ||
                 lt.indexOf('sick') !== -1 ||
                 lt.indexOf('comp-off') !== -1 ||
                 lt.indexOf('comp off') !== -1 ||
                 lt.indexOf('compensatory') !== -1;
        }
        window.isInactiveLeaveType = isInactiveLeaveType;

        function parseLeaveDate(dateStr) {
          if (!dateStr) return null;
          if (dateStr instanceof Date) return new Date(dateStr.getFullYear(), dateStr.getMonth(), dateStr.getDate());
          var s = String(dateStr).trim();
          if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
            var p = s.split('-');
            return new Date(parseInt(p[0], 10), parseInt(p[1], 10) - 1, parseInt(p[2], 10));
          }
          var monthMap = { jan:0, feb:1, mar:2, apr:3, may:4, jun:5, jul:6, aug:7, sep:8, oct:9, nov:10, dec:11 };
          var dmyMatch = s.match(/^(\d{1,2})[-/ ]([A-Za-z]{3,9})[-/ ](\d{4})$/);
          if (dmyMatch) {
            var day = parseInt(dmyMatch[1], 10);
            var monKey = dmyMatch[2].substring(0, 3).toLowerCase();
            var yr = parseInt(dmyMatch[3], 10);
            if (monthMap[monKey] !== undefined) {
              return new Date(yr, monthMap[monKey], day);
            }
          }
          var mdyMatch = s.match(/^([A-Za-z]{3,9})\s+(\d{1,2}),?\s+(\d{4})$/);
          if (mdyMatch) {
            var monKey2 = mdyMatch[1].substring(0, 3).toLowerCase();
            var day2 = parseInt(mdyMatch[2], 10);
            var yr2 = parseInt(mdyMatch[3], 10);
            if (monthMap[monKey2] !== undefined) {
              return new Date(yr2, monthMap[monKey2], day2);
            }
          }
          var parsed = new Date(s);
          if (!isNaN(parsed.getTime())) {
            return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
          }
          return null;
        }
        window.parseLeaveDate = parseLeaveDate;

        function getActiveLeaveInfo(employee) {
          var emp = employee || window.USER_PROFILE || (window.AUTH_USER && window.AUTH_USER.role === 'employee' ? window.AUTH_USER : null) || {};
          var empName = (emp.name || '').trim().toLowerCase();
          var empId = (emp.employeeId || emp.empId || '').trim().toLowerCase();
          var empEmail = (emp.email || '').trim().toLowerCase();

          var allReqs = (window.EMP_LEAVE_REQUESTS || []).slice();
          if (window.PERSON_DATA) {
            Object.keys(window.PERSON_DATA).forEach(function(k) {
              var p = window.PERSON_DATA[k];
              if (p && !p.isPermission && !allReqs.some(function(r) { return String(r.id) === String(p.id); })) {
                allReqs.push(p);
              }
            });
          }

          var simOffsetDays = window.SIMULATED_DATE_OFFSET_DAYS || 0;
          var now = new Date();
          if (simOffsetDays !== 0) {
            now = new Date(now.getTime() + simOffsetDays * 24 * 60 * 60 * 1000);
          }
          now.setHours(0, 0, 0, 0);

          for (var i = 0; i < allReqs.length; i++) {
            var r = allReqs[i];
            if (r.isPermission) continue;
            var status = String(r.status || '').toLowerCase().trim();
            if (status !== 'approved') continue;

            var lType = r.leaveType || r.type || '';
            if (!isInactiveLeaveType(lType)) continue;

            var rName = (r.employeeName || r.name || '').trim().toLowerCase();
            var rId = (r.employeeId || r.empId || '').trim().toLowerCase();
            var rEmail = (r.employeeEmail || r.email || '').trim().toLowerCase();

            var matches = false;
            if (empId && rId && empId === rId) matches = true;
            else if (empEmail && rEmail && empEmail === rEmail) matches = true;
            else if (empName && rName && empName === rName) matches = true;
            else if (!rName && !rId && (!empName || empName === 'sneha reddy' || empName === 'priya sharma')) matches = true;

            if (!matches) continue;

            var startDate = parseLeaveDate(r.fromDate);
            var endDate = parseLeaveDate(r.toDate) || startDate;

            var days = 1;
            if (r.daysText) {
              var m = r.daysText.match(/(\d+(\.\d+)?)/);
              if (m) days = Math.round(parseFloat(m[1])) || 1;
            } else if (r.totalDays) {
              var m2 = String(r.totalDays).match(/(\d+(\.\d+)?)/);
              if (m2) days = Math.round(parseFloat(m2[1])) || 1;
            } else if (startDate && endDate) {
              days = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            }
            if (days < 1) days = 1;

            if (startDate && (!endDate || endDate < startDate)) {
              endDate = new Date(startDate.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
            }

            var isWithin = false;
            if (startDate && endDate) {
              isWithin = (now >= startDate && now <= endDate);
            }

            if (!isWithin && r.approvedAt) {
              var approvedDay = new Date(r.approvedAt);
              approvedDay.setHours(0, 0, 0, 0);
              var approvedEndDay = new Date(approvedDay.getTime() + (days - 1) * 24 * 60 * 60 * 1000);
              if (now >= approvedDay && now <= approvedEndDay) {
                isWithin = true;
              }
            }

            if (isWithin) {
              var nextWorkingDate = new Date(endDate.getTime() + 24 * 60 * 60 * 1000);
              if (endDate.getDay() === 5) {
                nextWorkingDate = new Date(endDate.getTime() + 3 * 24 * 60 * 60 * 1000);
              } else if (endDate.getDay() === 6) {
                nextWorkingDate = new Date(endDate.getTime() + 2 * 24 * 60 * 60 * 1000);
              }
              var monthsArr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
              var nextWkStr = nextWorkingDate.getDate() + ' ' + monthsArr[nextWorkingDate.getMonth()];

              return {
                isInactive: true,
                leaveType: lType,
                days: days,
                fromDate: r.fromDate,
                toDate: r.toDate,
                nextWorkingDayStr: nextWkStr,
                request: r
              };
            }
          }

          return { isInactive: false };
        }
        window.getActiveLeaveInfo = getActiveLeaveInfo;

        function computeEmploymentStatus(employee) {
          var leaveInfo = getActiveLeaveInfo(employee);
          return leaveInfo.isInactive ? 'Inactive' : 'Active';
        }
        window.computeEmploymentStatus = computeEmploymentStatus;

        function updateLiveProfileStatusUI(docRef) {
          var targetDoc = docRef;
          if (!targetDoc) {
            var frame = document.getElementById('frame');
            targetDoc = frame && (frame.contentDocument || (frame.contentWindow && frame.contentWindow.document));
          }
          if (!targetDoc) return;

          var empStatusEl = targetDoc.getElementById('profile-emp-status');
          if (!empStatusEl) {
            var badges = targetDoc.querySelectorAll('.status-card .badge, .status-row .badge');
            if (badges.length > 0) empStatusEl = badges[0];
          }

          var currentEmp = window.USER_PROFILE || (window.AUTH_USER && window.AUTH_USER.role === 'employee' ? window.AUTH_USER : null) || {};
          var leaveInfo = getActiveLeaveInfo(currentEmp);
          var isLeaveInactive = leaveInfo.isInactive;
          var finalStatus = isLeaveInactive ? 'Inactive' : (window.CHECKED_IN === false ? 'Inactive' : 'Active');
          window.EMPLOYMENT_STATUS = finalStatus;

          if (empStatusEl) {
            empStatusEl.textContent = finalStatus;
            if (finalStatus === 'Active') {
              empStatusEl.className = 'badge success';
              empStatusEl.style.background = 'var(--success-bg, #E3F8EE)';
              empStatusEl.style.color = 'var(--success, #1FAE6E)';
            } else {
              empStatusEl.className = 'badge danger';
              empStatusEl.style.background = 'var(--danger-bg, #FEECEE)';
              empStatusEl.style.color = 'var(--danger, #E5484D)';
            }
          }

          var statusCard = targetDoc.querySelector('.status-card');
          var bannerEl = targetDoc.getElementById('profile-leave-banner');
          if (!bannerEl && statusCard) {
            bannerEl = targetDoc.createElement('div');
            bannerEl.id = 'profile-leave-banner';
            statusCard.appendChild(bannerEl);
          }

          if (bannerEl) {
            if (isLeaveInactive) {
              bannerEl.style.display = 'block';
              bannerEl.style.marginTop = '10px';
              bannerEl.style.padding = '10px 12px';
              bannerEl.style.background = '#FEF2F2';
              bannerEl.style.border = '1px solid #FECACA';
              bannerEl.style.borderRadius = '10px';
              bannerEl.style.fontSize = '12px';
              bannerEl.style.color = '#991B1B';
              bannerEl.style.lineHeight = '1.4';

              var daysStr = leaveInfo.days + ' Day' + (leaveInfo.days > 1 ? 's' : '');
              var periodStr = leaveInfo.fromDate === leaveInfo.toDate ? leaveInfo.fromDate : (leaveInfo.fromDate + ' – ' + leaveInfo.toDate);

              bannerEl.innerHTML = '<div style="display:flex; align-items:center; justify-content:space-between; font-weight:700; margin-bottom:4px;">'
                + '<span>● On Approved ' + leaveInfo.leaveType + ' (' + daysStr + ')</span>'
                + '<span style="font-size:11px; font-weight:700; background:#FEE2E2; color:#B91C1C; padding:2px 8px; border-radius:6px;">Inactive</span>'
                + '</div>'
                + '<div style="color:#7F1D1D;">Period: <b>' + periodStr + '</b></div>'
                + '<div style="color:#047857; font-weight:600; margin-top:4px;">'
                + '✓ Automatically changes back to <b>Active</b> on next working day (' + leaveInfo.nextWorkingDayStr + ')'
                + '</div>'
                + '<div style="margin-top:8px; padding-top:6px; border-top:1px dashed #FCA5A5; display:flex; gap:6px;">'
                + '<button type="button" id="btn-sim-next-day" style="flex:1; background:#FFFFFF; border:1px solid #F87171; border-radius:6px; color:#B91C1C; font-size:11px; font-weight:600; padding:4px 6px; cursor:pointer;">Simulate Next Working Day (End Leave) ↻</button>'
                + '</div>';

              var simBtn = bannerEl.querySelector('#btn-sim-next-day');
              if (simBtn) {
                simBtn.onclick = function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  window.SIMULATED_DATE_OFFSET_DAYS = (leaveInfo.days || 3) + 1;
                  updateLiveProfileStatusUI(targetDoc);
                };
              }
            } else if (window.SIMULATED_DATE_OFFSET_DAYS > 0) {
              bannerEl.style.display = 'block';
              bannerEl.style.marginTop = '10px';
              bannerEl.style.padding = '10px 12px';
              bannerEl.style.background = '#ECFDF5';
              bannerEl.style.border = '1px solid #A7F3D0';
              bannerEl.style.borderRadius = '10px';
              bannerEl.style.fontSize = '12px';
              bannerEl.style.color = '#065F46';
              bannerEl.style.lineHeight = '1.4';

              bannerEl.innerHTML = '<div style="display:flex; align-items:center; justify-content:space-between; font-weight:700;">'
                + '<span>✓ Approved Leave Period Completed</span>'
                + '<span style="font-size:11px; font-weight:700; background:#D1FAE5; color:#047857; padding:2px 8px; border-radius:6px;">Active</span>'
                + '</div>'
                + '<div style="color:#047857; margin-top:3px;">Employment Status automatically reverted back to <b>Active</b> on the next working day.</div>'
                + '<div style="margin-top:6px; padding-top:6px; border-top:1px dashed #6EE7B7;">'
                + '<button type="button" id="btn-reset-sim" style="background:#FFFFFF; border:1px solid #10B981; border-radius:6px; color:#047857; font-size:11px; font-weight:600; padding:3px 8px; cursor:pointer;">Reset to Current Date ↺</button>'
                + '</div>';

              var resetBtn = bannerEl.querySelector('#btn-reset-sim');
              if (resetBtn) {
                resetBtn.onclick = function(e) {
                  e.preventDefault();
                  e.stopPropagation();
                  window.SIMULATED_DATE_OFFSET_DAYS = 0;
                  updateLiveProfileStatusUI(targetDoc);
                };
              }
            } else {
              bannerEl.style.display = 'none';
            }
          }
        }
        window.updateLiveProfileStatusUI = updateLiveProfileStatusUI;

        function updateEmploymentStatusAfterApproval(empName, lType, status) {
          var activeLeave = getActiveLeaveInfo();
          var newStatus = activeLeave.isInactive ? 'Inactive' : 'Active';
          window.EMPLOYMENT_STATUS = newStatus;
          try {
            sessionStorage.setItem('EMPLOYMENT_STATUS', newStatus);
          } catch (e) {}

          var frame = document.getElementById('frame');
          if (frame) {
            var doc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
            if (doc && typeof updateLiveProfileStatusUI === 'function') {
              updateLiveProfileStatusUI(doc);
            }
          }
        }
        window.updateEmploymentStatusAfterApproval = updateEmploymentStatusAfterApproval;

        window.CHECKED_IN = true;
        window.ATTENDANCE_STATUS = 'Checked In';

        var frame = document.getElementById('frame');
        frame.addEventListener('load', function () {
          var doc = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
          if (!doc) return;

          try {
            if (frame.contentWindow) {
              frame.contentWindow.toggleSidebar = toggleSidebar;
              frame.contentWindow.openSidebar = openSidebar;
              frame.contentWindow.closeSidebar = closeSidebar;
              frame.contentWindow.loadScreen = loadScreen;
              frame.contentWindow.setAuthUser = setAuthUser;
              frame.contentWindow.logoutUser = logoutUser;
              frame.contentWindow.AUTH_USER = window.AUTH_USER;
            }
          } catch (e) {}

          var hideScrollGlobalStyle = doc.createElement('style');
          hideScrollGlobalStyle.textContent = `
            * {
              -ms-overflow-style: none !important;
              scrollbar-width: none !important;
            }
            *::-webkit-scrollbar,
            html::-webkit-scrollbar,
            body::-webkit-scrollbar,
            .screen::-webkit-scrollbar,
            .device::-webkit-scrollbar,
            div::-webkit-scrollbar,
            iframe::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
              background: transparent !important;
            }
            html, body, .screen, .device {
              -ms-overflow-style: none !important;
              scrollbar-width: none !important;
            }
          `;
          if (doc.head) doc.head.appendChild(hideScrollGlobalStyle);

          var logoGlobalStyle = doc.createElement('style');
          logoGlobalStyle.textContent = `
            .mini-logo, .brand img, .dash-top .brand img, .nav-logo {
              cursor: pointer !important;
              transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease !important;
              -webkit-tap-highlight-color: transparent !important;
              object-fit: contain !important;
              flex-shrink: 0 !important;
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
              border-radius: 0 !important;
            }
            .mini-logo:hover, .brand img:hover, .dash-top .brand img:hover, .nav-logo:hover {
              transform: scale(1.08) !important;
              opacity: 0.9 !important;
            }
            .mini-logo:active, .brand img:active, .dash-top .brand img:active, .nav-logo:active {
              transform: scale(0.94) !important;
            }
            .header .mini-logo {
              width: 26px !important;
              height: 26px !important;
              margin-top: 2px !important;
              flex-shrink: 0 !important;
            }
            .brand .mini-logo, .dash-top .brand img {
              width: 28px !important;
              height: 28px !important;
              margin-top: 0 !important;
              margin-right: 2px !important;
              flex-shrink: 0 !important;
              vertical-align: middle !important;
            }
            .brand {
              display: flex !important;
              align-items: center !important;
              gap: 10px !important;
            }
            .login-logo {
              width: 76px !important;
              height: 76px !important;
              border-radius: 0 !important;
              object-fit: contain !important;
              filter: drop-shadow(0 0 8px rgba(77, 150, 255, 0.35));
              margin-bottom: 24px !important;
              cursor: pointer !important;
              transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.25s ease !important;
              animation: logoBlueGlow 4s ease-in-out infinite;
            }
            .login-logo:hover {
              transform: scale(1.04) !important;
              filter: drop-shadow(0 0 12px rgba(77, 150, 255, 0.55)) !important;
            }
            .login-logo:active {
              transform: scale(0.96) !important;
            }
            @keyframes logoBlueGlow {
              0%, 100% {
                filter: drop-shadow(0 0 6px rgba(77, 150, 255, 0.3));
              }
              50% {
                filter: drop-shadow(0 0 10px rgba(77, 150, 255, 0.45));
              }
            }
            
            .statusbar { display: none !important; }
            .screen:not(.neumorphic-login-screen):not(.has-dash-header):not(:has(.dash-header)) {
              height: 844px !important;
              padding-top: 16px !important;
            }
            .screen.has-dash-header,
            .screen:has(.dash-header) {
              height: 844px !important;
              padding-top: 0 !important;
            }
            .dash-header {
              margin-top: 0 !important;
              border-top-left-radius: 0 !important;
              border-top-right-radius: 0 !important;
            }
            .screen.neumorphic-login-screen {
              height: 100% !important;
              min-height: 100% !important;
              padding: 24px !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: center !important;
              align-items: center !important;
              box-sizing: border-box !important;
            }
            .screen.neumorphic-login-screen .login-center-container {
              margin: auto !important;
              align-self: center !important;
            }
            /* Success Popup Modal */
            .success-modal-overlay {
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              background: rgba(15, 23, 42, 0.65) !important;
              backdrop-filter: blur(4px) !important;
              -webkit-backdrop-filter: blur(4px) !important;
              display: none !important;
              align-items: center !important;
              justify-content: center !important;
              z-index: 9999 !important;
              padding: 20px !important;
              opacity: 0 !important;
              transition: opacity 0.25s ease !important;
            }
            .success-modal-overlay.show {
              display: flex !important;
              opacity: 1 !important;
            }
            .success-modal-card {
              background: #ffffff !important;
              border-radius: 24px !important;
              padding: 32px 24px 24px !important;
              width: 100% !important;
              max-width: 320px !important;
              text-align: center !important;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35) !important;
              transform: scale(0.9) !important;
              transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
            }
            .success-modal-overlay.show .success-modal-card {
              transform: scale(1) !important;
            }
            .success-modal-icon-wrap {
              width: 64px !important;
              height: 64px !important;
              border-radius: 50% !important;
              background: #E3F8EE !important;
              color: #1FAE6E !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              margin: 0 auto 16px !important;
              box-shadow: 0 0 0 8px #F0FDF4 !important;
            }
            .success-modal-title {
              font-size: 20px !important;
              font-weight: 800 !important;
              color: #111827 !important;
              margin: 0 0 8px !important;
            }
            .success-modal-msg {
              font-size: 14px !important;
              color: #6B7280 !important;
              line-height: 1.5 !important;
              margin: 0 0 24px !important;
            }
            .success-modal-btn {
              width: 100% !important;
              padding: 13px !important;
              border-radius: 12px !important;
              background: #2F6BFF !important;
              color: #ffffff !important;
              font-size: 15px !important;
              font-weight: 700 !important;
              border: none !important;
              cursor: pointer !important;
              box-shadow: 0 4px 14px rgba(47, 107, 255, 0.35) !important;
              transition: background 0.2s ease, transform 0.15s ease !important;
            }
            .success-modal-btn:hover {
              background: #1E4FD6 !important;
              transform: translateY(-1px) !important;
            }
            .success-modal-btn:active {
              transform: scale(0.98) !important;
            }
            
            .statusbar {
              display: none !important;
            }
            .screen:not(.neumorphic-login-screen):not(.has-dash-header):not(:has(.dash-header)) {
              height: 844px !important;
              padding-top: 16px !important;
            }
            .screen.has-dash-header,
            .screen:has(.dash-header) {
              height: 844px !important;
              padding-top: 0 !important;
            }
            .dash-header {
              margin-top: 0 !important;
              border-top-left-radius: 0 !important;
              border-top-right-radius: 0 !important;
            }
            .screen.neumorphic-login-screen {
              height: 100% !important;
              min-height: 100% !important;
              padding: 24px !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: center !important;
              align-items: center !important;
              box-sizing: border-box !important;
            }
            .screen.neumorphic-login-screen .login-center-container {
              margin: auto !important;
              align-self: center !important;
            }
            /* Success Popup Modal */
            .success-modal-overlay {
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              bottom: 0 !important;
              background: rgba(15, 23, 42, 0.65) !important;
              backdrop-filter: blur(4px) !important;
              -webkit-backdrop-filter: blur(4px) !important;
              display: none !important;
              align-items: center !important;
              justify-content: center !important;
              z-index: 9999 !important;
              padding: 20px !important;
              opacity: 0 !important;
              transition: opacity 0.25s ease !important;
            }
            .success-modal-overlay.show {
              display: flex !important;
              opacity: 1 !important;
            }
            .success-modal-card {
              background: #ffffff !important;
              border-radius: 24px !important;
              padding: 32px 24px 24px !important;
              width: 100% !important;
              max-width: 320px !important;
              text-align: center !important;
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35) !important;
              transform: scale(0.9) !important;
              transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
            }
            .success-modal-overlay.show .success-modal-card {
              transform: scale(1) !important;
            }
            .success-modal-icon-wrap {
              width: 64px !important;
              height: 64px !important;
              border-radius: 50% !important;
              background: #E3F8EE !important;
              color: #1FAE6E !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              margin: 0 auto 16px !important;
              box-shadow: 0 0 0 8px #F0FDF4 !important;
            }
            .success-modal-title {
              font-size: 20px !important;
              font-weight: 800 !important;
              color: #111827 !important;
              margin: 0 0 8px !important;
            }
            .success-modal-msg {
              font-size: 14px !important;
              color: #6B7280 !important;
              line-height: 1.5 !important;
              margin: 0 0 24px !important;
            }
            .success-modal-btn {
              width: 100% !important;
              padding: 13px !important;
              border-radius: 12px !important;
              background: #2F6BFF !important;
              color: #ffffff !important;
              font-size: 15px !important;
              font-weight: 700 !important;
              border: none !important;
              cursor: pointer !important;
              box-shadow: 0 4px 14px rgba(47, 107, 255, 0.35) !important;
              transition: background 0.2s ease, transform 0.15s ease !important;
            }
            .success-modal-btn:hover {
              background: #1E4FD6 !important;
              transform: translateY(-1px) !important;
            }
            .success-modal-btn:active {
              transform: scale(0.98) !important;
            }
            /* Align logo and header text across all pages */
            .header {
              display: flex !important;
              align-items: flex-start !important;
              gap: 12px !important;
            }
            .header .mini-logo {
              width: 26px !important;
              height: 26px !important;
              object-fit: contain !important;
              border-radius: 4px !important;
              flex-shrink: 0 !important;
              margin-top: 1px !important;
            }
            .header h1 {
              font-size: 22px !important;
              font-weight: 800 !important;
              color: var(--text, #111827) !important;
              margin: 0 !important;
              line-height: 1.2 !important;
            }
            .header p {
              font-size: 13px !important;
              color: var(--text-secondary, #6B7280) !important;
              margin: 2px 0 0 !important;
              line-height: 1.2 !important;
            }
          `;
          if (doc.head) doc.head.appendChild(logoGlobalStyle);

          var logoSelector = '.mini-logo, .brand img, .dash-top .brand img, .dash-top .brand, .login-logo';
          doc.querySelectorAll(logoSelector).forEach(function (el) {
            el.style.cursor = 'pointer';
            el.title = 'Toggle Navigation Menu';
            el.onclick = function (e) {
              e.preventDefault();
              e.stopPropagation();
              toggleSidebar();
            };
          });

          var navGlowStyle = doc.createElement('style');
          navGlowStyle.textContent = `
            .bottom-nav {
              transition: box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease !important;
            }
            .bottom-nav:hover {
              box-shadow: 0 -4px 20px rgba(47, 107, 255, 0.18), 0 0 15px rgba(47, 107, 255, 0.12) !important;
              border-top-color: rgba(47, 107, 255, 0.4) !important;
            }
            .bottom-nav .tab {
              position: relative !important;
              padding: 6px 8px !important;
              border-radius: 12px !important;
              transition: color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease !important;
            }
            .bottom-nav .tab:hover {
              color: var(--primary, #2F6BFF) !important;
              background: rgba(47, 107, 255, 0.09) !important;
              box-shadow: 0 0 14px rgba(47, 107, 255, 0.25), inset 0 0 10px rgba(47, 107, 255, 0.1) !important;
              transform: translateY(-2px) !important;
            }
            .bottom-nav .tab .icon {
              transition: transform 0.25s ease !important;
            }
            .bottom-nav .tab:hover .icon {
              transform: scale(1.08) !important;
            }
            .bottom-nav .tab .icon svg {
              transition: stroke 0.25s ease, filter 0.25s ease !important;
            }
            .bottom-nav .tab:hover .icon svg {
              stroke: var(--primary, #2F6BFF) !important;
              filter: drop-shadow(0 0 6px rgba(47, 107, 255, 0.65)) !important;
            }
            .bottom-nav .tab.active .icon svg {
              stroke: var(--primary, #2F6BFF) !important;
              filter: drop-shadow(0 0 4px rgba(47, 107, 255, 0.4)) !important;
            }
            .date-cell {
              position: relative !important;
              cursor: pointer !important;
              border-radius: 10px !important;
              transition: background 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease, border-color 0.25s ease !important;
              border: 1.5px solid transparent;
            }
            .date-cell:hover {
              background: rgba(47, 107, 255, 0.12) !important;
              border-color: rgba(47, 107, 255, 0.45) !important;
              box-shadow: 0 0 14px rgba(47, 107, 255, 0.35), inset 0 0 8px rgba(47, 107, 255, 0.15) !important;
              transform: translateY(-2px) scale(1.05) !important;
              z-index: 10 !important;
            }
            .date-cell:hover .num {
              color: var(--primary, #2F6BFF) !important;
              font-weight: 800 !important;
              text-shadow: 0 0 8px rgba(47, 107, 255, 0.4) !important;
            }
            .date-cell .dot {
              transition: transform 0.2s ease, box-shadow 0.2s ease !important;
            }
            .date-cell:hover .dot {
              transform: scale(1.35) !important;
              box-shadow: 0 0 6px currentColor !important;
            }
            .date-cell.selected {
              border: 1.5px solid var(--primary, #2F6BFF) !important;
              border-radius: 10px !important;
              background: rgba(47, 107, 255, 0.06) !important;
            }
            /* Cards, Quick Actions & Item Containers Glow Hover */
            .card, .request-card, .req-card, .member-card, .team-card, .employee-card, .hol-card, .quick-action, .stat-card, .action-card, .item-card {
              transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease, background-color 0.25s ease !important;
            }
            .card:hover, .request-card:hover, .req-card:hover, .member-card:hover, .team-card:hover, .employee-card:hover, .hol-card:hover, .quick-action:hover, .stat-card:hover, .action-card:hover, .item-card:hover {
              border-color: var(--primary, #2F6BFF) !important;
              box-shadow: 0 0 20px rgba(47, 107, 255, 0.32), 0 6px 18px rgba(47, 107, 255, 0.18), inset 0 0 10px rgba(47, 107, 255, 0.06) !important;
              transform: translateY(-3px) !important;
              cursor: pointer !important;
            }
            /* Leave Approvals & Overview Cards - No Glow & No Highlight */
            .approval-card, .approval-card:hover, .overview-card, .overview-card:hover {
              border: 1px solid var(--border, #E5E7EB) !important;
              border-color: var(--border, #E5E7EB) !important;
              box-shadow: none !important;
              transform: none !important;
              cursor: default !important;
            }
            .request-actions {
              display: flex !important;
              align-items: center !important;
              gap: 8px !important;
              flex-shrink: 0 !important;
            }
            .btn-cancel-req {
              background: transparent !important;
              border: none !important;
              color: var(--text-muted, #9AA3B2) !important;
              cursor: pointer !important;
              padding: 4px !important;
              border-radius: 50% !important;
              display: inline-flex !important;
              align-items: center !important;
              justify-content: center !important;
              line-height: 1 !important;
              transition: all 0.2s ease !important;
              flex-shrink: 0 !important;
              outline: none !important;
            }
            .btn-cancel-req:hover {
              color: var(--danger, #E5484D) !important;
              background: var(--danger-bg, #FCE4E4) !important;
              transform: scale(1.15) !important;
            }
            .btn-cancel-req:active {
              transform: scale(0.95) !important;
            }
          `;
          if (doc.head) doc.head.appendChild(navGlowStyle);

          if (currentTpl === 'tpl-LeaveApprovalDetail') {
            var detailNoGlowStyle = doc.createElement('style');
            detailNoGlowStyle.textContent = `
              .card, .emp-card, .card:hover, .emp-card:hover {
                border: 1px solid var(--border, #E5E7EB) !important;
                border-color: var(--border, #E5E7EB) !important;
                box-shadow: none !important;
                transform: none !important;
                cursor: default !important;
              }
            `;
            if (doc.head) doc.head.appendChild(detailNoGlowStyle);

            var p = (SELECTED_PERSON && PERSON_DATA[SELECTED_PERSON]) || window.LATEST_REQUEST || PERSON_DATA['priya'];
            var empProf = window.USER_PROFILE || {};
            var dashboardEmpName = empProf.name || 'Priya Sharma';

            // Only override if employee is explicitly viewing their own request from employee dashboard
            if (window.AUTH_USER && window.AUTH_USER.role === 'employee' && (p.isSelf || !p.name)) {
              p.name = dashboardEmpName;
              p.role = empProf.role || p.role || 'Senior Software Engineer';
              p.empId = empProf.employeeId || p.empId || 'EMP-2024-0156';
              p.initials = empProf.initials || (dashboardEmpName.trim().split(/\s+/).map(function(w){return w[0];}).join('').toUpperCase().slice(0, 2)) || 'PS';
              p.appliedPath = dashboardEmpName.split(' ')[0] + ' (Applied)';
            }

            var isPerm = !!(p.isPermission || p.duration || p.type === 'Early Going' || p.type === 'Late Coming' || p.leaveType === 'Early Going' || p.leaveType === 'Late Coming' || p.permissionType);

            var elName = doc.getElementById('lad-name'); if (elName) elName.textContent = p.name;
            var elRole = doc.getElementById('lad-role'); if (elRole) elRole.textContent = p.role;
            var elEmpId = doc.getElementById('lad-empid'); if (elEmpId) elEmpId.textContent = p.empId;
            var elAvatar = doc.getElementById('lad-avatar'); if (elAvatar) elAvatar.textContent = p.initials;
            var elSubtitle = doc.getElementById('lad-subtitle'); if (elSubtitle) elSubtitle.textContent = p.subtitle || ((p.leaveType || p.type || (isPerm ? 'Permission' : 'Leave')) + ' Application');
            var elApplied = doc.getElementById('lad-applied-path'); if (elApplied) elApplied.textContent = p.appliedPath || (p.name.split(' ')[0] + ' (Applied)');

            var elSecTitle = doc.getElementById('lad-section-title');
            var elTypeLabel = doc.getElementById('lad-type-label');
            var elLeaveType = doc.getElementById('lad-leavetype');
            var elFromLabel = doc.getElementById('lad-from-label');
            var elFromDate = doc.getElementById('lad-fromdate');
            var elRowToDate = doc.getElementById('lad-row-todate');
            var elToLabel = doc.getElementById('lad-to-label');
            var elToDate = doc.getElementById('lad-todate');
            var elDurLabel = doc.getElementById('lad-duration-label');
            var elTotalDays = doc.getElementById('lad-totaldays');
            var elContactLabel = doc.getElementById('lad-contact-label');
            var elContact = doc.getElementById('lad-contact');
            var elReasonLabel = doc.getElementById('lad-reason-label');
            var elReason = doc.getElementById('lad-reason');

            if (isPerm) {
              if (elSecTitle) elSecTitle.textContent = 'PERMISSION SPECIFICS';
              if (elTypeLabel) elTypeLabel.textContent = 'Permission Type';
              if (elLeaveType) elLeaveType.textContent = p.leaveType || p.type || 'Late Coming';
              if (elFromLabel) elFromLabel.textContent = 'Schedule';
              if (elFromDate) elFromDate.textContent = p.schedule || p.fromDate || p.date || 'Sep 04 (10:00 - 10:30 AM)';
              if (elRowToDate) elRowToDate.style.display = 'none';
              if (elDurLabel) elDurLabel.textContent = 'Duration';
              if (elTotalDays) elTotalDays.textContent = p.duration || p.totalDays || '30 Mins';
              if (elContactLabel) elContactLabel.textContent = 'Emergency Contact';
              if (elContact) elContact.textContent = p.emergencyContact || p.contact || '+91 98765 22003';
              if (elReasonLabel) elReasonLabel.textContent = 'Reason for Permission';
              if (elReason) elReason.textContent = p.reason || 'Doctor appointment checkup';
            } else {
              if (elSecTitle) elSecTitle.textContent = 'LEAVE SPECIFICS';
              if (elTypeLabel) elTypeLabel.textContent = 'Leave Type';
              if (elLeaveType) elLeaveType.textContent = p.leaveType || 'Casual Leave';
              if (elFromLabel) elFromLabel.textContent = 'From Date';
              if (elFromDate) elFromDate.textContent = p.fromDate || 'Sep 10, 2026';
              if (elRowToDate) elRowToDate.style.display = 'flex';
              if (elToLabel) elToLabel.textContent = 'To Date';
              if (elToDate) elToDate.textContent = p.toDate || 'Sep 11, 2026';
              if (elDurLabel) elDurLabel.textContent = 'Total Days';
              if (elTotalDays) elTotalDays.textContent = p.totalDays || '2 Days';
              if (elContactLabel) elContactLabel.textContent = 'Emergency Contact';
              if (elContact) elContact.textContent = p.emergencyContact || p.contact || empProf.phone || '+91 98765 43210';
              if (elReasonLabel) elReasonLabel.textContent = 'Reason for Leave';
              if (elReason) elReason.textContent = p.reason || "Family function - attending sister's wedding ceremony in Bangalore.";
            }

            // Update Approval Path node for Manager
            var mgrPath = doc.getElementById('lad-manager-path');
            var rawStatus = (p && p.status) || (window.LAST_LEAVE_DECISION && (window.LAST_LEAVE_DECISION.personKey === SELECTED_PERSON || (SELECTED_PERSON === 'priya' && window.LAST_LEAVE_DECISION.personKey === 'priya')) ? window.LAST_LEAVE_DECISION.status : null);
            var dec = (rawStatus || '').toLowerCase();
            if (mgrPath && dec && dec !== 'pending') {
              if (dec === 'approved') {
                mgrPath.className = 'done';
                mgrPath.style.background = '#E3F8EE';
                mgrPath.style.color = '#1FAE6E';
                mgrPath.style.fontWeight = '700';
                mgrPath.style.padding = '3px 10px';
                mgrPath.style.borderRadius = '6px';
                mgrPath.textContent = 'Manager (Approved)';
              } else if (dec === 'rejected') {
                mgrPath.className = 'danger';
                mgrPath.style.background = '#FCE4E4';
                mgrPath.style.color = '#E5484D';
                mgrPath.style.fontWeight = '700';
                mgrPath.style.padding = '3px 10px';
                mgrPath.style.borderRadius = '6px';
                mgrPath.textContent = 'Manager (Rejected)';
              }
            }

            // Update decision action buttons if status is already decided
            var btnRow = doc.getElementById('lad-btn-row');
            if (btnRow && dec && dec !== 'pending') {
              var isApp = dec === 'approved';
              btnRow.innerHTML = '<div style="display:flex;flex-direction:column;gap:10px;width:100%;">'
                + '<div style="text-align:center;padding:12px;border-radius:12px;font-weight:700;font-size:15px;background:' + (isApp ? '#E3F8EE' : '#FCE4E4') + ';color:' + (isApp ? '#1FAE6E' : '#E5484D') + ';">'
                + (isApp ? '✓ Approved by Manager' : '✕ Rejected by Manager')
                + '</div>'
                + '<div style="display:flex;gap:10px;">'
                + '<button class="btn ' + (isApp ? 'outline-reject' : 'btn-primary') + '" style="flex:1;padding:12px;border-radius:12px;font-size:14px;cursor:pointer;" onclick="handleDetailLeaveDecision(\'' + (isApp ? 'rejected' : 'approved') + '\')">Change to ' + (isApp ? 'Reject' : 'Approve') + '</button>'
                + '<button class="btn btn-primary" style="flex:1;padding:12px;border-radius:12px;font-size:14px;cursor:pointer;" onclick="if(window.parent&&window.parent.loadScreen)window.parent.loadScreen(\'tpl-ManagerDashboard\');else if(typeof loadScreen===\'function\')loadScreen(\'tpl-ManagerDashboard\');">Done →</button>'
                + '</div>'
                + '</div>';
            }

            // Wire back button
            var backBtn = doc.querySelector('.back-btn');
            if (backBtn) {
              backBtn.style.cursor = 'pointer';
              backBtn.onclick = function() {
                if (window.AUTH_USER && window.AUTH_USER.role === 'manager') {
                  loadScreen('tpl-ManagerDashboard');
                } else {
                  loadScreen('tpl-EmployeeDashboard');
                }
              };
            }
          }

          if (currentTpl === 'tpl-MyAttendance') {
            var attendNoGlowStyle = doc.createElement('style');
            attendNoGlowStyle.textContent = `
              #details-card, #details-card:hover {
                border: 1px solid var(--border, #E5E7EB) !important;
                border-color: var(--border, #E5E7EB) !important;
                box-shadow: none !important;
                transform: none !important;
                cursor: default !important;
              }
            `;
            if (doc.head) doc.head.appendChild(attendNoGlowStyle);
          }

          if (currentTpl === 'tpl-EmployeeDashboard') {
            var dashNoGlowStyle = doc.createElement('style');
            dashNoGlowStyle.textContent = `
              .screen {
                padding-top: 0 !important;
              }
              .dash-header {
                margin-top: 0 !important;
                border-top-left-radius: 0 !important;
                border-top-right-radius: 0 !important;
              }
              #dash-leave-balance-card, #dash-leave-balance-card:hover {
                background: #FFFFFF !important;
                border: 1px solid #EAEFF5 !important;
                border-radius: 18px !important;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02) !important;
                transform: none !important;
                cursor: default !important;
              }
              .chip-btn.success:hover {
                background: #D1F3E2 !important;
                box-shadow: 0 2px 8px rgba(31, 174, 110, 0.22) !important;
                transform: translateY(-1px) !important;
              }
              .chip-btn.danger:hover {
                background: #FDD8DC !important;
                box-shadow: 0 2px 8px rgba(229, 72, 77, 0.22) !important;
                transform: translateY(-1px) !important;
              }
              .chip-btn:active {
                transform: translateY(0) !important;
              }
            `;
            if (doc.head) doc.head.appendChild(dashNoGlowStyle);

            var statusDot = doc.getElementById('dash-status-dot');
            var statusText = doc.getElementById('dash-status-text');
            var btnCheckIn = doc.getElementById('btn-check-in');
            var btnCheckOut = doc.getElementById('btn-check-out');

            function syncDashAttendanceUI() {
              if (statusDot) {
                statusDot.style.background = window.CHECKED_IN ? 'var(--success, #1FAE6E)' : 'var(--danger, #E5484D)';
              }
              if (statusText) {
                statusText.textContent = window.CHECKED_IN ? (window.ATTENDANCE_STATUS || 'Checked In') : 'Checked Out';
              }
            }
            syncDashAttendanceUI();

            if (btnCheckIn) {
              btnCheckIn.onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.CHECKED_IN = true;
                window.EMPLOYMENT_STATUS = 'Active';
                window.ATTENDANCE_STATUS = 'Checked In';
                syncDashAttendanceUI();
              };
            }

            if (btnCheckOut) {
              btnCheckOut.onclick = function (e) {
                e.preventDefault();
                e.stopPropagation();
                window.CHECKED_IN = false;
                window.EMPLOYMENT_STATUS = 'Inactive';
                window.ATTENDANCE_STATUS = 'Checked Out';
                syncDashAttendanceUI();
                loadScreen('tpl-MyProfile');
              };
            }
          }

          if (currentTpl === 'tpl-MyProfile') {
            var profileNoGlowStyle = doc.createElement('style');
            profileNoGlowStyle.textContent = `
              .card, .card:hover,
              .profile-card, .profile-card:hover,
              .status-card, .status-card:hover {
                border: 1px solid var(--border, #E5E7EB) !important;
                border-color: var(--border, #E5E7EB) !important;
                box-shadow: none !important;
                transform: none !important;
                cursor: default !important;
                background: var(--surface, #FFFFFF) !important;
              }
              .badge.danger {
                background: var(--danger-bg, #FEECEE) !important;
                color: var(--danger, #E5484D) !important;
              }
              .badge.success {
                background: var(--success-bg, #E3F8EE) !important;
                color: var(--success, #1FAE6E) !important;
              }
            `;
            if (doc.head) doc.head.appendChild(profileNoGlowStyle);

            var empStatusEl = doc.getElementById('profile-emp-status');
            if (!empStatusEl) {
              var badges = doc.querySelectorAll('.status-card .badge, .status-row .badge');
              if (badges.length > 0) empStatusEl = badges[0];
            }
            if (empStatusEl) {
              var currentStatus = window.EMPLOYMENT_STATUS || 'Active';
              empStatusEl.textContent = currentStatus;
              if (currentStatus === 'Active') {
                empStatusEl.className = 'badge success';
                empStatusEl.style.background = 'var(--success-bg, #E3F8EE)';
                empStatusEl.style.color = 'var(--success, #1FAE6E)';
              } else {
                empStatusEl.className = 'badge danger';
                empStatusEl.style.background = 'var(--danger-bg, #FEECEE)';
                empStatusEl.style.color = 'var(--danger, #E5484D)';
              }
            }
          }

          var tabs = doc.querySelectorAll('.bottom-nav .tab');
          var tabMap = {
            'dashboard': 'tpl-EmployeeDashboard',
            'attendance': 'tpl-MyAttendance',
            'apply': 'tpl-ApplyLeave',
            'history': 'tpl-LeaveHistory',
            'more': 'tpl-MyProfile',
            'profile': 'tpl-MyProfile'
          };
          tabs.forEach(function (tab) {
            tab.style.cursor = 'pointer';
            tab.addEventListener('click', function () {
              var label = tab.textContent.toLowerCase();
              for (var key in tabMap) {
                if (label.indexOf(key) !== -1) {
                  if (key === 'dashboard' && window.AUTH_USER && window.AUTH_USER.role === 'manager') {
                    loadScreen('tpl-ManagerDashboard');
                  } else if (key === 'history' && window.AUTH_USER && window.AUTH_USER.role === 'manager') {
                    alert('Access Restricted: Manager account is not authorized to access My Requests (History).');
                  } else {
                    loadScreen(tabMap[key]);
                  }
                  break;
                }
              }
            });
          });

          var backBtns = doc.querySelectorAll('.back-btn, [class*="back"]');
          backBtns.forEach(function (btn) {
            btn.style.cursor = 'pointer';
            btn.addEventListener('click', function () {
              if (window.AUTH_USER && window.AUTH_USER.role === 'manager') {
                loadScreen('tpl-ManagerDashboard');
              } else if (currentTpl.indexOf('Manager') !== -1 || currentTpl === 'tpl-TeamAttendance' || currentTpl === 'tpl-LeaveApprovals' || currentTpl === 'tpl-PermissionApprovals' || currentTpl === 'tpl-LeaveApprovalDetail') {
                loadScreen('tpl-ManagerDashboard');
              } else {
                loadScreen('tpl-EmployeeDashboard');
              }
            });
          });

          if (currentTpl === 'tpl-Login') {
            var loginBtn = doc.querySelector('button.btn-primary, .btn-primary');
            if (loginBtn) {
              loginBtn.style.cursor = 'pointer';
              loginBtn.addEventListener('click', function (e) {
                e.preventDefault();
                loadScreen('tpl-EmployeeDashboard');
              });
            }
          }

          if (currentTpl === 'tpl-ApplyLeave') {
            // Pre-fill Approving Manager from USER_PROFILE.reportingManager
            var leaveManagerEl = doc.getElementById('leave-manager-select');
            if (leaveManagerEl && window.USER_PROFILE && window.USER_PROFILE.reportingManager) {
              var reportMgr = window.USER_PROFILE.reportingManager;
              // Find option that starts with the manager name
              var leaveOpts = leaveManagerEl.querySelectorAll('option');
              var leaveMatched = false;
              leaveOpts.forEach(function(opt) {
                if (opt.value.toLowerCase().indexOf(reportMgr.toLowerCase().split(' ')[0]) !== -1) {
                  leaveManagerEl.value = opt.value;
                  leaveMatched = true;
                }
              });
              // If no match found, set first option or add one
              if (!leaveMatched && leaveOpts.length > 0) {
                leaveManagerEl.value = leaveOpts[0].value;
              }
            }
            var submitBtn = doc.getElementById('leave-submit-btn') || doc.querySelector('.btn-primary.full');
            if (submitBtn) {
              submitBtn.style.cursor = 'pointer';
              submitBtn.onclick = function (e) {
                if (e) e.preventDefault();
                if (frame.contentWindow && typeof frame.contentWindow.handleApplyLeaveSubmit === 'function') {
                  frame.contentWindow.handleApplyLeaveSubmit();
                }
              };
            }
            if (frame.contentWindow) {
              frame.contentWindow.closeLeaveSuccessModal = function () {
                var modal = doc.getElementById('leave-success-modal');
                if (modal) modal.classList.remove('show');
                if (window.AUTH_USER && window.AUTH_USER.role === 'manager') {
                  loadScreen('tpl-ManagerDashboard');
                } else {
                  loadScreen('tpl-EmployeeDashboard');
                }
              };
            }
          }

          // ── Apply Permission: save to shared state & navigate ──────────
          if (currentTpl === 'tpl-ApplyPermission') {
            // Pre-fill Approving Manager from USER_PROFILE.reportingManager
            var permManagerEl = doc.getElementById('perm-manager-select');
            if (permManagerEl && window.USER_PROFILE && window.USER_PROFILE.reportingManager) {
              var permReportMgr = window.USER_PROFILE.reportingManager;
              var permOpts = permManagerEl.querySelectorAll('option');
              var permMatched = false;
              permOpts.forEach(function(opt) {
                if (opt.value.toLowerCase().indexOf(permReportMgr.toLowerCase().split(' ')[0]) !== -1) {
                  permManagerEl.value = opt.value;
                  permMatched = true;
                }
              });
              if (!permMatched && permOpts.length > 0) {
                permManagerEl.value = permOpts[0].value;
              }
            }
            var iframeWin = frame.contentWindow;
            if (iframeWin) {
              iframeWin.handleApplyPermissionSubmit = function () {
                var permDateInput  = doc.getElementById('perm-date-input');
                var permTypeSelect = doc.getElementById('perm-type-select');
                var durationInput  = doc.getElementById('perm-duration-input');
                var reasonText     = doc.getElementById('perm-reason-text');
                var permManagerEl  = doc.getElementById('perm-manager-select');

                var rawDate   = permDateInput  ? permDateInput.value  : '2026-09-04';
                var months    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                var dp = rawDate.split('-');
                var fmtDate = dp.length === 3 ? (dp[2] + '-' + (months[parseInt(dp[1],10)-1]||'Sep') + '-' + dp[0]) : rawDate;

                var pType     = permTypeSelect ? permTypeSelect.value : 'Early Going';
                var pDuration = durationInput  ? (durationInput.value.trim() || '2 Hours') : '2 Hours';
                var pReason   = reasonText     ? (reasonText.value.trim()   || 'Personal work / checkup') : 'Personal work / checkup';

                if (!pReason) { alert('Please enter a reason.'); return; }

                var newId = 'perm-' + Date.now();
                var permProf = window.parent.USER_PROFILE || {};
                var permEmpName = permProf.name || 'Priya Sharma';
                var permEmpInitials = permProf.initials || (permEmpName.split(' ').map(function(w){return w[0];}).join('').toUpperCase().slice(0,2)) || 'PS';
                var permEmpId = permProf.employeeId || 'EMP-2024-0156';
                var defPermMgr = permProf.reportingManager ? (permProf.reportingManager.indexOf('(') !== -1 ? permProf.reportingManager : permProf.reportingManager.split(' ')[0] + ' (Reporting Manager)') : 'Vishnu (Reporting Manager)';
                var pManager = permManagerEl ? permManagerEl.value : defPermMgr;

                var entry = { id: newId, type: pType, date: fmtDate, duration: pDuration, reason: pReason, status: 'pending', employeeName: permEmpName, employeeInitials: permEmpInitials, employeeId: permEmpId, approvingManager: pManager };
                window.parent.PERM_STATE = window.parent.PERM_STATE || [];
                var existsPerm = window.parent.PERM_STATE.some(function(p){ return p.type === pType && p.date === fmtDate && p.reason === pReason; });
                if (!existsPerm) {
                  window.parent.PERM_STATE.unshift(entry);
                }

                if (!window.parent.EMP_LEAVE_REQUESTS) window.parent.EMP_LEAVE_REQUESTS = [];
                var existsEmpReq = window.parent.EMP_LEAVE_REQUESTS.some(function(r){ return r.leaveType === pType && r.fromDate === fmtDate && r.reason === pReason; });
                if (!existsEmpReq) {
                  window.parent.EMP_LEAVE_REQUESTS.unshift({ id: newId, leaveType: pType, fromDate: fmtDate, daysText: pDuration, reason: pReason, isPermission: true, employeeName: permEmpName });
                }

                var permPersonObj = {
                  id: newId,
                  isPermission: true,
                  name: permEmpName,
                  initials: permEmpInitials,
                  role: permProf.role || 'Senior Software Engineer',
                  empId: permEmpId,
                  type: pType,
                  leaveType: pType,
                  permissionType: pType,
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
                  appliedPath: permEmpName.split(' ')[0] + ' (Applied)',
                  status: 'pending'
                };
                if (!window.parent.PERSON_DATA) window.parent.PERSON_DATA = {};
                window.parent.PERSON_DATA[newId] = permPersonObj;
                window.parent.PERSON_DATA['priya'] = permPersonObj;
                window.parent.LATEST_REQUEST = permPersonObj;
                window.parent.LATEST_PERMISSION_REQUEST = permPersonObj;
                window.parent.SELECTED_PERSON = newId;

                var modal = doc.getElementById('perm-success-modal');
                if (modal) {
                  modal.classList.add('show');
                } else {
                  window.parent.loadScreen('tpl-EmployeeDashboard');
                }
              };
              iframeWin.closePermSuccessModal = function () {
                var modal = doc.getElementById('perm-success-modal');
                if (modal) modal.classList.remove('show');
                if (window.AUTH_USER && window.AUTH_USER.role === 'manager') {
                  loadScreen('tpl-ManagerDashboard');
                } else {
                  loadScreen('tpl-EmployeeDashboard');
                }
              };
            }
          }

          // ── Permission Approvals: inject new requests & wire approve/reject ──
          // ── Permission Approvals: dynamic action-driven list (no default cards) ─────
          if (currentTpl === 'tpl-PermissionApprovals') {
            var paList = doc.getElementById('permission-approvals-list');
            var noPermMsg = doc.getElementById('no-perm-msg');

            // Remove any legacy static cards if any exist
            doc.querySelectorAll('#permission-approvals-list .approval-card[data-perm-id="1"], #permission-approvals-list .approval-card[data-perm-id="2"], #permission-approvals-list .approval-card[data-perm-id="3"], #permission-approvals-list .approval-card[data-perm-id="4"]').forEach(function (el) {
              var nameText = el.querySelector('b') ? el.querySelector('b').textContent : '';
              if (nameText === 'Priya Sharma' || nameText === 'Deepak Kumar' || nameText === 'Rahul Verma' || nameText === 'Neha Gupta') {
                el.remove();
              }
            });

            // Collect all permission requests from PERM_STATE and EMP_LEAVE_REQUESTS
            var allPerms = window.PERM_STATE || [];
            if (window.EMP_LEAVE_REQUESTS) {
              window.EMP_LEAVE_REQUESTS.forEach(function (r) {
                if (r.isPermission) {
                  var existsInPermState = allPerms.some(function (p) {
                    return String(p.id) === String(r.id) || (p.employeeName === r.employeeName && p.type === r.leaveType && p.date === r.fromDate);
                  });
                  if (!existsInPermState) {
                    var permEmpName = r.employeeName || 'Employee';
                    var permInitials = r.employeeInitials || permEmpName.split(' ').map(function(w){return w[0];}).join('').toUpperCase().slice(0,2);
                    allPerms.push({
                      id: r.id,
                      type: r.leaveType || r.type || 'Early Going',
                      date: r.fromDate || r.date || '04-Sep-2026',
                      duration: r.daysText || r.duration || '2 Hours',
                      reason: r.reason || 'Personal work',
                      status: r.status || 'pending',
                      employeeName: permEmpName,
                      employeeInitials: permInitials,
                      employeeId: r.employeeId || 'EMP-2024-0000',
                      approvingManager: r.approvingManager || 'Rahul (Reporting Manager)'
                    });
                  }
                }
              });
            }
            window.PERM_STATE = allPerms;

            // Ensure PERSON_DATA has all submitted permission requests for detail view
            if (!window.PERSON_DATA) window.PERSON_DATA = {};
            allPerms.forEach(function (req) {
              var permKey = 'perm-' + req.id;
              var empName = req.employeeName || 'Employee';
              var empInitials = req.employeeInitials || empName.split(' ').map(function(w){return w[0];}).join('').toUpperCase().slice(0,2);
              var empId = req.employeeId || 'EMP-2024-0000';
              var pType = req.type || 'Early Going';
              var pDate = req.date || '04-Sep-2026';
              var pDuration = req.duration || '2 Hours';
              var pReason = req.reason || 'Personal work';
              var pManager = req.approvingManager || 'Rahul (Reporting Manager)';

              var permPersonObj = {
                id: req.id,
                permKey: permKey,
                isPermission: true,
                type: pType,
                leaveType: pType,
                permissionType: pType,
                date: pDate,
                fromDate: pDate,
                toDate: pDate,
                schedule: pDate + ' (' + pDuration + ')',
                duration: pDuration,
                totalDays: pDuration,
                reason: pReason,
                status: req.status || 'pending',
                employeeName: empName,
                name: empName,
                employeeInitials: empInitials,
                initials: empInitials,
                employeeId: empId,
                empId: empId,
                role: req.role || 'Software Engineer',
                approvingManager: pManager,
                contact: '+91 98765 22003',
                emergencyContact: '+91 98765 22003',
                subtitle: pType + ' Application',
                appliedPath: empName.split(' ')[0] + ' (Applied)'
              };

              if (!window.PERSON_DATA[permKey]) window.PERSON_DATA[permKey] = permPersonObj;
              if (!window.PERSON_DATA[req.id]) window.PERSON_DATA[req.id] = permPersonObj;
            });

                        // Synchronize cards in #permission-approvals-list
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
                  actionHtml = '<div class="btn-row"><button class="btn btn-reject" onclick="event.stopPropagation();processPermAction(\'' + req.id + '\', \'rejected\')">Reject</button><button class="btn btn-approve" onclick="event.stopPropagation();processPermAction(\'' + req.id + '\', \'approved\')">Approve</button></div>';
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
                var dateReasonText = (req.fromDate || req.date || '') + ' \u2022 ' + (req.reason || 'Personal Work');

                var cardDiv = doc.createElement('div');
                cardDiv.className = 'recent-request-card request-card';
                cardDiv.id = 'emp-req-' + req.id;
                cardDiv.style.marginTop = '8px';
                cardDiv.style.cursor = 'pointer';
                cardDiv.innerHTML = '<div class="recent-request-left">'
                  + '<div class="recent-request-title">' + titleText + '</div>'
                  + '<div class="recent-request-sub">' + dateReasonText + '</div>'
                  + '<div class="recent-request-meta">' + (req.employeeName || curName) + ' \u2022 ' + (req.employeeId || curEmpId) + '</div>'
                  + '</div>'
                  + '<div class="recent-request-right">'
                  + '<span class="recent-request-badge" style="background:' + (rStatus === 'approved' ? '#DCFCE7' : '#FCE4E4') + '; color:' + (rStatus === 'approved' ? '#16A34A' : '#E5484D') + ';">' + st + '</span>'
                  + '<button type="button" class="recent-request-dismiss-btn" title="Dismiss request" onclick="deleteEmpRequest(this, event, \'' + req.id + '\')">'
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
            var secContainer = doc.getElementById('emp-recent-requests-section');
            if (secContainer) {
              secContainer.style.display = userReqs.length > 0 ? 'block' : 'none';
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
          }

          // ── My Profile: populate with USER_PROFILE ───────────────────────
          if (currentTpl === 'tpl-MyProfile') {
            var prof = window.USER_PROFILE;
            if (prof) {
              if (doc.getElementById('profile-name-display') && prof.name) doc.getElementById('profile-name-display').textContent = prof.name;
              if (doc.getElementById('profile-role-display') && prof.role) doc.getElementById('profile-role-display').textContent = prof.role;
              if (doc.getElementById('profile-id-display') && prof.employeeId) doc.getElementById('profile-id-display').textContent = prof.employeeId;
              if (doc.getElementById('profile-avatar-display') && prof.initials) doc.getElementById('profile-avatar-display').textContent = prof.initials;
              if (doc.getElementById('edit-profile-name') && prof.name) doc.getElementById('edit-profile-name').value = prof.name;
              if (doc.getElementById('edit-profile-role') && prof.role) doc.getElementById('edit-profile-role').value = prof.role;
              if (doc.getElementById('edit-profile-id') && prof.employeeId) doc.getElementById('edit-profile-id').value = prof.employeeId;

              if (doc.getElementById('val-dept') && prof.department) doc.getElementById('val-dept').textContent = prof.department;
              if (doc.getElementById('val-team') && prof.team) doc.getElementById('val-team').textContent = prof.team;
              if (doc.getElementById('val-manager') && prof.reportingManager) doc.getElementById('val-manager').textContent = prof.reportingManager;
              if (doc.getElementById('val-location') && prof.workLocation) doc.getElementById('val-location').textContent = prof.workLocation;
              if (doc.getElementById('val-date') && prof.joiningDate) doc.getElementById('val-date').textContent = prof.joiningDate;
              if (doc.getElementById('input-dept') && prof.department) doc.getElementById('input-dept').value = prof.department;
              if (doc.getElementById('input-team') && prof.team) doc.getElementById('input-team').value = prof.team;
              if (doc.getElementById('input-manager') && prof.reportingManager) doc.getElementById('input-manager').value = prof.reportingManager;
              if (doc.getElementById('input-location') && prof.workLocation) doc.getElementById('input-location').value = prof.workLocation;
              if (doc.getElementById('input-date') && prof.joiningDate) doc.getElementById('input-date').value = prof.joiningDate;

              if (doc.getElementById('val-email') && prof.email) doc.getElementById('val-email').textContent = prof.email;
              if (doc.getElementById('val-phone') && prof.phone) doc.getElementById('val-phone').textContent = prof.phone;
              if (doc.getElementById('input-email') && prof.email) doc.getElementById('input-email').value = prof.email;
              if (doc.getElementById('input-phone') && prof.phone) doc.getElementById('input-phone').value = prof.phone;
            }
          }

          if (currentTpl === 'tpl-LeaveApprovals') {
            var laList = doc.getElementById('leave-approvals-list');
            var noMsg = doc.getElementById('no-leave-msg');

            // Remove any legacy static cards if any exist
            doc.querySelectorAll('.approval-card[data-leave-id="1"], .approval-card[data-leave-id="2"], .approval-card[data-leave-id="3"], .approval-card[data-leave-id="4"], .approval-card[data-leave-id="5"]').forEach(function(el) {
              var nameText = el.querySelector('b') ? el.querySelector('b').textContent : '';
              if (nameText === 'Priya Sharma' || nameText === 'Amit Patel' || nameText === 'Sneha Gupta' || nameText === 'Vikram Singh' || nameText === 'Ritu Verma') {
                el.remove();
              }
            });

            // Get all submitted leave requests
            var allLeaves = (window.EMP_LEAVE_REQUESTS || []).filter(function(r) {
              return !r.isPermission;
            });

            // Ensure PERSON_DATA has all submitted requests for detail view
            if (!window.PERSON_DATA) window.PERSON_DATA = {};
            allLeaves.forEach(function(req) {
              if (!window.PERSON_DATA[req.id]) {
                var empInitials = req.employeeInitials || 'EE';
                var empName = req.employeeName || 'Employee';
                var empId = req.employeeId || 'EMP-2024-0000';
                var empRole = req.employeeRole || 'Software Engineer';
                var lType = req.leaveType || req.type || 'Casual Leave';
                var daysText = req.daysText || '1.0 Day';
                var fromDate = req.fromDate || '07-Sep-2026';
                var toDate = req.toDate || fromDate;
                var reason = req.reason || 'Personal work';
                var defMgr = req.approvingManager || (window.USER_PROFILE && window.USER_PROFILE.reportingManager) || 'Rahul Sharma';
                window.PERSON_DATA[req.id] = {
                  id: req.id,
                  isPermission: false,
                  initials: empInitials,
                  name: empName,
                  role: empRole,
                  empId: empId,
                  leaveType: lType,
                  fromDate: fromDate,
                  toDate: toDate,
                  totalDays: daysText,
                  duration: daysText,
                  contact: (window.USER_PROFILE && window.USER_PROFILE.phone) || '+91 98765 43210',
                  emergencyContact: (window.USER_PROFILE && window.USER_PROFILE.phone) || '+91 98765 43210',
                  approvingManager: defMgr,
                  reason: reason,
                  subtitle: lType + ' Application',
                  appliedPath: empName.split(' ')[0] + ' (Applied)',
                  status: req.status || 'pending'
                };
              }
            });

            // Synchronize cards in #leave-approvals-list
            if (laList) {
              allLeaves.forEach(function(req) {
                var existingCard = laList.querySelector('[data-leave-id="' + req.id + '"]');
                var reqStatus = (req.status || 'pending').toLowerCase();
                var lType = req.leaveType || req.type || 'Leave';
                var typeClass = lType.indexOf('Sick') !== -1 ? 'warning' : lType.indexOf('Earned') !== -1 ? 'purple' : 'info';
                var empInitials = req.employeeInitials || 'EE';
                var empName = req.employeeName || 'Employee';
                var empId = req.employeeId || 'EMP-2024-0000';
                var daysText = req.daysText || '1.0 Day';
                var fromDate = req.fromDate || '';
                var toDate = req.toDate || fromDate;
                var dateRange = fromDate === toDate ? fromDate : (fromDate + ' – ' + toDate);
                var reason = req.reason || 'Personal work';

                var actionHtml = '';
                if (reqStatus === 'approved') {
                  actionHtml = '<div style="text-align:right; margin-top:8px;"><span class="badge success">Approved</span></div>';
                } else if (reqStatus === 'rejected') {
                  actionHtml = '<div style="text-align:right; margin-top:8px;"><span class="badge danger">Rejected</span></div>';
                } else {
                  actionHtml = '<div class="btn-row"><button class="btn btn-reject" onclick="event.stopPropagation();processLeaveAction(\'' + req.id + '\', \'rejected\')">Reject</button><button class="btn btn-approve" onclick="event.stopPropagation();processLeaveAction(\'' + req.id + '\', \'approved\')">Approve</button></div>';
                }

                if (!existingCard) {
                  var cardDiv = doc.createElement('div');
                  cardDiv.className = 'card approval-card';
                  cardDiv.setAttribute('data-leave-id', req.id);
                  cardDiv.setAttribute('data-status', reqStatus);
                  cardDiv.style.cursor = 'pointer';
                  cardDiv.innerHTML = '<div class="top-row"><div class="emp-row"><div class="avatar">' + empInitials + '</div><div><b>' + empName + '</b><p>' + empId + '</p></div></div><span class="badge ' + typeClass + '">' + lType + '</span></div>'
                    + '<hr/>'
                    + '<div class="detail-row"><span>Duration</span><b>' + daysText + ' (' + dateRange + ')</b></div>'
                    + '<div class="detail-row"><span>Reason</span><b>' + reason + '</b></div>'
                    + '<div class="card-action-wrap" id="action-wrap-' + req.id + '">' + actionHtml + '</div>';

                  if (noMsg) {
                    laList.insertBefore(cardDiv, noMsg);
                  } else {
                    laList.appendChild(cardDiv);
                  }
                } else {
                  existingCard.setAttribute('data-status', reqStatus);
                  var wrap = existingCard.querySelector('.card-action-wrap');
                  if (wrap) wrap.innerHTML = actionHtml;
                }
              });
            }

            // Attach card click handlers for LeaveApprovalDetail navigation
            doc.querySelectorAll('#leave-approvals-list .approval-card, .approval-card').forEach(function (card) {
              card.style.cursor = 'pointer';
              card.onclick = function (e) {
                if (e.target.tagName !== 'BUTTON') {
                  var leaveId = card.getAttribute('data-leave-id');
                  loadScreen('tpl-LeaveApprovalDetail', leaveId);
                }
              };
            });

            // Synchronize tab counts and filter display
            var iframeWin = frame.contentWindow;
            if (iframeWin) {
              if (typeof iframeWin.updateLeaveTabCounts === 'function') {
                iframeWin.updateLeaveTabCounts();
              }
              if (typeof iframeWin.renderLeaveApprovals === 'function') {
                iframeWin.renderLeaveApprovals();
              }
            }

            // Direct DOM counts fallback
            var pCards = doc.querySelectorAll('#leave-approvals-list .approval-card[data-status="pending"]');
            var aCards = doc.querySelectorAll('#leave-approvals-list .approval-card[data-status="approved"]');
            var rCards = doc.querySelectorAll('#leave-approvals-list .approval-card[data-status="rejected"]');
            var cp = doc.getElementById('count-pending'); if (cp) cp.textContent = pCards.length;
            var ca = doc.getElementById('count-approved'); if (ca) ca.textContent = aCards.length;
            var cr = doc.getElementById('count-rejected'); if (cr) cr.textContent = rCards.length;
            if (noMsg) {
              noMsg.style.display = pCards.length === 0 ? 'block' : 'none';
            }
          }

          if (currentTpl === 'tpl-PermissionApprovals') {
            doc.querySelectorAll('#permission-approvals-list .approval-card, .approval-card').forEach(function (card) {
              card.style.cursor = 'pointer';
              card.addEventListener('click', function (e) {
                if (e.target.tagName !== 'BUTTON') {
                  var permId = card.getAttribute('data-perm-id') || '1';
                  if (!window.PERSON_DATA[permId]) {
                    var cardName = card.querySelector('.emp-row b') ? card.querySelector('.emp-row b').textContent.trim() : 'Priya Sharma';
                    var cardType = card.getAttribute('data-type') || (card.querySelector('.emp-row p') ? card.querySelector('.emp-row p').textContent.trim() : 'Early Going');
                    var dateRow = card.querySelector('.detail-row:nth-child(3) b');
                    var durRow = card.querySelector('.detail-row:nth-child(4) b');
                    var rsnRow = card.querySelector('.detail-row:nth-child(5) b');
                    var cardDate = dateRow ? dateRow.textContent.trim() : 'Sep 04, 2026';
                    var cardDur = durRow ? durRow.textContent.trim() : '2 Hours';
                    var cardRsn = rsnRow ? rsnRow.textContent.trim() : 'Doctor appointment checkup';
                    var empProf = window.USER_PROFILE || {};
                    var defMgr = empProf.reportingManager ? (empProf.reportingManager.indexOf('(') !== -1 ? empProf.reportingManager : empProf.reportingManager + ' (Reporting Manager)') : 'Rahul (Reporting Manager)';
                    window.PERSON_DATA[permId] = {
                      id: permId,
                      isPermission: true,
                      name: cardName,
                      initials: card.querySelector('.avatar') ? card.querySelector('.avatar').textContent.trim() : 'PS',
                      role: 'Senior Software Engineer',
                      empId: 'EMP-2024-0156',
                      type: cardType,
                      leaveType: cardType,
                      permissionType: cardType,
                      fromDate: cardDate,
                      toDate: cardDate,
                      totalDays: cardDur,
                      duration: cardDur,
                      reason: cardRsn,
                      contact: defMgr,
                      approvingManager: defMgr,
                      emergencyContact: defMgr,
                      subtitle: cardType + ' Application',
                      appliedPath: cardName.split(' ')[0] + ' (Applied)',
                      status: card.getAttribute('data-status') || 'pending'
                    };
                  }
                  loadScreen('tpl-LeaveApprovalDetail', permId);
                }
              });
            });
          }

          if (currentTpl === 'tpl-TeamAttendance') {
            var teamDateInput = doc.getElementById('team-date-input');
            var teamDateText = doc.getElementById('team-date-text');
            if (teamDateInput) {
              teamDateInput.addEventListener('change', function () {
                if (!this.value) return;
                var parts = this.value.split('-');
                if (parts.length === 3) {
                  var yr = parseInt(parts[0], 10);
                  var mo = parseInt(parts[1], 10) - 1;
                  var da = parseInt(parts[2], 10);
                  var monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                  var mStr = monthsArr[mo];
                  var dayStr = String(da).padStart(2, '0');
                  if (teamDateText) teamDateText.textContent = mStr + ' ' + dayStr + ', ' + yr;
                }
              });
            }
          }
        });

        document.querySelectorAll('.nav-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            loadScreen(btn.getAttribute('data-tpl'));
          });
        });

        loadScreen('tpl-Login');
      }); // end DOMContentLoaded
    