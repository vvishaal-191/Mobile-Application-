
        function openSidebarDrawer() {
          var overlay = document.getElementById('sidebar-overlay');
          if (overlay) overlay.classList.add('open');
          var pWin = (window.parent && window.parent !== window) ? window.parent : window;
          var prof = pWin.USER_PROFILE || window.USER_PROFILE || {};
          var nameEl = document.getElementById('sidebar-name');
          var initialsEl = document.getElementById('sidebar-initials');
          var curName = prof.name || (window.AUTH_USER && window.AUTH_USER.name) || 'Sneha Reddy';
          if (nameEl) nameEl.textContent = curName;
          if (initialsEl) {
            var parts = curName.trim().split(/\s+/);
            initialsEl.textContent = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : curName.slice(0, 2).toUpperCase();
          }
        }

        function closeSidebarDrawer() {
          var overlay = document.getElementById('sidebar-overlay');
          if (overlay) overlay.classList.remove('open');
        }

        function handleSidebarNav(screenId) {
          closeSidebarDrawer();
          setTimeout(function() {
            var pWin = (window.parent && window.parent !== window) ? window.parent : window;
            if (pWin.loadScreen) {
              pWin.loadScreen(screenId);
            } else if (typeof loadScreen === 'function') {
              loadScreen(screenId);
            }
          }, 120);
        }

        function handleSidebarLogout() {
          closeSidebarDrawer();
          setTimeout(function() {
            var pWin = (window.parent && window.parent !== window) ? window.parent : window;
            if (pWin.logout) {
              pWin.logout();
            } else if (typeof logout === 'function') {
              logout();
            } else if (pWin.loadScreen) {
              pWin.loadScreen('tpl-Login');
            } else if (typeof loadScreen === 'function') {
              loadScreen('tpl-Login');
            }
          }, 100);
        }

        function dismissRecentRequest(cardId, e) {
          if (e && e.stopPropagation) e.stopPropagation();
          var card = cardId ? document.getElementById(cardId) : document.querySelector('.recent-request-card');
          if (card) {
            card.style.transition = 'all 0.25s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(function() {
              card.remove();
              var reqList = document.getElementById('emp-dash-requests-list');
              var remainingCards = reqList ? reqList.querySelectorAll('.recent-request-card').length : 0;
              var label = document.getElementById('emp-dash-requests-label');
              var sec = document.getElementById('emp-recent-requests-section');
              if (label) label.textContent = 'RECENT REQUESTS (' + remainingCards + ')';
              if (remainingCards === 0 && sec) {
                sec.style.display = 'none';
              }
            }, 250);
          }
        }

        function syncDashboardRequests() {
          var pWin = (window.parent && window.parent !== window) ? window.parent : window;
          var docRef = document;
          setTimeout(function() {
            var sec = docRef.getElementById('emp-recent-requests-section');
            var reqList = docRef.getElementById('emp-dash-requests-list');
            var label = docRef.getElementById('emp-dash-requests-label');
            if (!sec || !reqList) return;

            var allReqs = [];
            try {
              if (pWin.EMP_LEAVE_REQUESTS && pWin.EMP_LEAVE_REQUESTS.length > 0) {
                allReqs = pWin.EMP_LEAVE_REQUESTS.slice();
              } else if (window.EMP_LEAVE_REQUESTS && window.EMP_LEAVE_REQUESTS.length > 0) {
                allReqs = window.EMP_LEAVE_REQUESTS.slice();
              } else if (pWin.ALL_SUBMITTED_REQUESTS && pWin.ALL_SUBMITTED_REQUESTS.length > 0) {
                allReqs = pWin.ALL_SUBMITTED_REQUESTS.slice();
              } else if (window.ALL_SUBMITTED_REQUESTS && window.ALL_SUBMITTED_REQUESTS.length > 0) {
                allReqs = window.ALL_SUBMITTED_REQUESTS.slice();
              } else {
                var stored = sessionStorage.getItem('ALL_SUBMITTED_REQUESTS') || (pWin.sessionStorage && pWin.sessionStorage.getItem('ALL_SUBMITTED_REQUESTS'));
                if (stored) allReqs = JSON.parse(stored);
              }
            } catch (e) {}

            var lastDecision = pWin.LAST_LEAVE_DECISION || window.LAST_LEAVE_DECISION || pWin.lastLeaveDecision || window.lastLeaveDecision;
            if (lastDecision && (lastDecision.status === 'approved' || lastDecision.status === 'rejected')) {
              var alreadyIn = allReqs.some(function(r) { return String(r.id) === String(lastDecision.id); });
              if (!alreadyIn) {
                allReqs.unshift({
                  id: lastDecision.id || ('dec-' + Date.now()),
                  leaveType: lastDecision.lType || 'Casual Leave',
                  title: (lastDecision.lType || 'Casual Leave') + ' (1.0 Day)',
                  subtitle: (lastDecision.fromDate || '07-Sep-2026') + ' • Personal Work',
                  fromDate: lastDecision.fromDate || '07-Sep-2026',
                  reason: 'Personal Work',
                  status: lastDecision.status,
                  employeeName: lastDecision.empName || (pWin.USER_PROFILE && pWin.USER_PROFILE.name) || 'Sneha Reddy',
                  employeeId: 'EMP-2024-0103'
                });
              }
            }

            // Filter ONLY approved or rejected requests (Image 4 format)
            var approvedOrRejected = allReqs.filter(function(r) {
              if (pWin.DELETED_REQUEST_IDS && pWin.DELETED_REQUEST_IDS.indexOf(String(r.id)) !== -1) return false;
              if (window.DELETED_REQUEST_IDS && window.DELETED_REQUEST_IDS.indexOf(String(r.id)) !== -1) return false;
              var st = (r.status || '').toLowerCase();
              return st === 'approved' || st === 'rejected';
            });

            if (approvedOrRejected.length === 0) {
              sec.style.display = 'none';
              reqList.innerHTML = '';
              if (label) label.textContent = 'RECENT REQUESTS (0)';
              return;
            }

            // Display Recent Requests
            sec.style.display = 'block';
            if (label) label.textContent = 'RECENT REQUESTS (' + approvedOrRejected.length + ')';
            reqList.innerHTML = '';

            approvedOrRejected.forEach(function(req) {
              var isApp = (req.status || '').toLowerCase() === 'approved';
              var badgeBg = isApp ? '#DCFCE7' : '#FCE4E4';
              var badgeColor = isApp ? '#16A34A' : '#E5484D';
              var badgeText = isApp ? 'Approved' : 'Rejected';
              var title = req.title || ((req.leaveType || req.type || 'Casual Leave') + ' (' + (req.daysText || req.totalDays || req.duration || '1.0 Day') + ')');
              var sub = req.subtitle || ((req.fromDate || req.date || '07-Sep-2026') + ' • ' + (req.reason || 'Personal Work'));
              var meta = (req.employeeName || (pWin.USER_PROFILE && pWin.USER_PROFILE.name) || 'Sneha Reddy') + ' • ' + (req.employeeId || (pWin.USER_PROFILE && pWin.USER_PROFILE.employeeId) || 'EMP-2024-0103');
              var reqId = 'emp-recent-req-' + (req.id || Math.random().toString(36).substr(2, 6));

              var c = docRef.createElement('div');
              c.className = 'recent-request-card';
              c.id = reqId;
              c.style.marginTop = '8px';
              c.onclick = function() {
                if (pWin.loadScreen) pWin.loadScreen('tpl-MyRequests');
                else if (typeof loadScreen === 'function') loadScreen('tpl-MyRequests');
              };
              c.innerHTML = '<div class="recent-request-left">'
                + '<div class="recent-request-title">' + title + '</div>'
                + '<div class="recent-request-sub">' + sub + '</div>'
                + '<div class="recent-request-meta">' + meta + '</div>'
                + '</div>'
                + '<div class="recent-request-right">'
                + '<span class="recent-request-badge" style="background:' + badgeBg + ';color:' + badgeColor + ';">' + badgeText + '</span>'
                + '<button class="recent-request-dismiss-btn" aria-label="Dismiss">'
                + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#94A3B8" stroke-width="1.8" fill="none"/><line x1="15" y1="9" x2="9" y2="15" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round"/><line x1="9" y1="9" x2="15" y2="15" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round"/></svg>'
                + '</button>'
                + '</div>';
              var disBtn = c.querySelector('.recent-request-dismiss-btn');
              if (disBtn) {
                disBtn.onclick = function(e) {
                  if (e && e.stopPropagation) e.stopPropagation();
                  dismissRecentRequest(reqId, e);
                };
              }
              reqList.appendChild(c);
            });
          }, 150);
        }

        function openNotificationsFromDashboard() {
          var pWin = (window.parent && window.parent !== window) ? window.parent : window;
          pWin.HAS_NEW_NOTIFICATION = false;
          window.HAS_NEW_NOTIFICATION = false;
          try { sessionStorage.removeItem('HAS_NEW_NOTIFICATION'); } catch (e) {}
          try { pWin.sessionStorage.removeItem('HAS_NEW_NOTIFICATION'); } catch (e) {}
          var bell = document.getElementById('dash-bell-btn') || document.querySelector('.bell');
          if (bell) bell.classList.remove('has-glow');
          if (pWin.loadScreen) {
            pWin.loadScreen('tpl-Notifications');
          } else if (typeof loadScreen === 'function') {
            loadScreen('tpl-Notifications');
          }
        }

        function syncBellGlow() {
          var pWin = (window.parent && window.parent !== window) ? window.parent : window;
          var hasNew = false;
          try {
            hasNew = !!(pWin.HAS_NEW_NOTIFICATION || window.HAS_NEW_NOTIFICATION || sessionStorage.getItem('HAS_NEW_NOTIFICATION') === 'true' || pWin.sessionStorage.getItem('HAS_NEW_NOTIFICATION') === 'true');
          } catch (e) {
            hasNew = !!(pWin.HAS_NEW_NOTIFICATION || window.HAS_NEW_NOTIFICATION);
          }
          var bell = document.getElementById('dash-bell-btn') || document.querySelector('.bell');
          if (bell) {
            if (hasNew) {
              bell.classList.add('has-glow');
            } else {
              bell.classList.remove('has-glow');
            }
          }
        }
        syncBellGlow();
        syncDashboardRequests();
        document.addEventListener('DOMContentLoaded', function() {
          syncBellGlow();
          syncDashboardRequests();
        });
      