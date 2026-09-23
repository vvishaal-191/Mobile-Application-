
        // ── Helpers ──────────────────────────────────────────────────────────
        var currentTab = 'all';

        function pWin() {
          try { return window.parent && window.parent !== window ? window.parent : window; } catch(e) { return window; }
        }

        function navTo(screen) {
          var pw = pWin();
          if (pw.loadScreen) { var map = { Dashboard:'tpl-EmployeeDashboard', Attendance:'tpl-MyAttendance', Apply:'tpl-ApplyLeave', More:'tpl-MyProfile' }; pw.loadScreen(map[screen] || 'tpl-EmployeeDashboard'); }
        }

        function getRequests() {
          var pw = pWin();
          return (pw.EMP_LEAVE_REQUESTS || []).slice();
        }

        function statusInfo(raw) {
          var s = (raw || 'pending').toLowerCase();
          if (s === 'approved') return { label:'Approved', tone:'success', icon:'✓', iconColor:'#1FAE6E' };
          if (s === 'rejected') return { label:'Rejected', tone:'danger', icon:'✕', iconColor:'#E5484D' };
          return { label:'Pending', tone:'warning', icon:'⏱', iconColor:'#F5A623' };
        }

        function formatDate(d) {
          if (!d) return '';
          var monthMap = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          // Try DD-MMM-YYYY
          var m = String(d).match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/);
          if (m) return m[2] + ' ' + String(m[1]).padStart(2,'0') + ', ' + m[3];
          // Try YYYY-MM-DD
          var m2 = String(d).match(/^(\d{4})-(\d{2})-(\d{2})$/);
          if (m2) return monthMap[parseInt(m2[2],10)-1] + ' ' + m2[3] + ', ' + m2[1];
          return d;
        }

        function buildCard(req, idx) {
          var isPermission = !!(req.isPermission || req.permissionType || ['Early Going','Late Coming','Personal Work','Official Work'].indexOf(req.leaveType || req.type || '') !== -1);
          var si = statusInfo(req.status);
          var title = isPermission ? ('Permission (' + (req.leaveType || req.type || req.permissionType || 'Permission') + ')') : (req.leaveType || req.type || 'Leave');
          var displayDate = formatDate(req.fromDate || req.date || '');
          var timeSlot = (req.startTime && req.endTime) ? (req.startTime + ' - ' + req.endTime) : (req.schedule || '');
          var dateText = (isPermission && timeSlot) ? displayDate + ' • ' + timeSlot : displayDate;
          var duration = req.daysText || req.totalDays || req.duration || (isPermission ? '2 Hours' : '1.0 Day');
          var appliedDate = req.appliedDate || req.submittedAt || 'Applied';
          var approverName = req.approverName || (req.approvingManager ? req.approvingManager.replace(' (Reporting Manager)','') : 'Manager');
          var reason = req.reason || 'Personal work';
          var approverComments = req.approverComments || req.remarks || '';
          var remark = req.remark || (si.label === 'Approved' ? 'Approved by ' + approverName + '.' : si.label === 'Rejected' ? 'Rejected by ' + approverName + '.' : 'Sent to ' + approverName + ' for review.');
          var supportingDocs = req.supportingDocs || 'None Attached';
          var category = isPermission ? 'permissions' : 'leaves';

          // Tracking stages
          var isApproved = si.label === 'Approved';
          var isRejected = si.label === 'Rejected';
          var isDecided = isApproved || isRejected;

          var stage1DotClass = 'done-ok';
          var stage1Line = isDecided ? (isRejected ? 'no' : 'ok') : '';
          var stage2DotClass = isDecided ? (isRejected ? 'done-no' : 'done-ok') : 'active';
          var stage2TitleClass = isDecided ? (isRejected ? 'red' : 'green') : 'blue';
          var stage2Line = isDecided ? (isRejected ? 'no' : 'ok') : '';
          var stage3DotClass = isDecided ? (isRejected ? 'done-no' : 'done-ok') : '';
          var stage3TitleClass = isDecided ? (isRejected ? 'red' : 'green') : 'muted';
          var stage3ChipHtml = isDecided
            ? (isRejected ? '<span class="chip chip-rejected">✕ Rejected</span>' : '<span class="chip chip-approved">✓ Approved</span>')
            : '<span class="chip chip-pending">Awaiting</span>';

          var approverCommentHtml = approverComments
            ? '<div class="detail-block"><span class="detail-block-label">Approver Comments</span><div class="detail-block-hl">' + escHtml(approverComments) + '</div></div>'
            : '';

          var timeRow = (isPermission && timeSlot)
            ? '<div class="detail-row"><span class="detail-label">Start &amp; End Time</span><span class="detail-value">' + escHtml(timeSlot) + '</span></div>'
            : '';

          return '<div class="card" data-type="' + category + '" data-idx="' + idx + '">' +
            '<div class="req-row">' +
              '<div class="req-left">' +
                '<span class="req-icon" style="color:' + si.iconColor + '">' + si.icon + '</span>' +
                '<div><p class="req-title">' + escHtml(title) + '</p><p class="req-date">' + escHtml(dateText) + '</p></div>' +
              '</div>' +
              '<span class="badge ' + si.tone + '">' + si.label + '</span>' +
            '</div>' +
            '<div class="divider"></div>' +
            '<div class="footer-row">' +
              '<p class="remark">Remarks: ' + escHtml(remark) + '</p>' +
              '<button class="view-btn" onclick="toggleExpand(this)">View Details ›</button>' +
            '</div>' +
            '<div class="expanded">' +
              '<p class="section-label">REQUEST TRACKING</p>' +
              '<div class="tracker">' +
                '<div class="tracker-step">' +
                  '<div class="tracker-dot-col"><div class="tracker-dot done-ok">✓</div><div class="tracker-line ' + stage1Line + '"></div></div>' +
                  '<div class="tracker-labels"><div class="tracker-title">Applied</div><div class="tracker-sub">' + escHtml(appliedDate) + '</div></div>' +
                '</div>' +
                '<div class="tracker-step">' +
                  '<div class="tracker-dot-col"><div class="tracker-dot ' + stage2DotClass + '">' + (isDecided ? (isRejected ? '✕' : '✓') : '') + '</div><div class="tracker-line ' + stage2Line + '"></div></div>' +
                  '<div class="tracker-labels"><div class="tracker-title ' + stage2TitleClass + '">Pending with Manager</div><div class="tracker-sub">' + escHtml(approverName) + '</div></div>' +
                '</div>' +
                '<div class="tracker-step">' +
                  '<div class="tracker-dot-col"><div class="tracker-dot ' + stage3DotClass + '">' + (isDecided ? (isRejected ? '✕' : '✓') : '') + '</div></div>' +
                  '<div class="tracker-labels" style="flex:1"><div class="tracker-title ' + stage3TitleClass + '">' + (isRejected ? 'Rejected' : 'Approved') + '</div><div class="tracker-sub">' + (isDecided ? 'By ' + escHtml(approverName) : 'Awaiting decision') + '</div></div>' +
                  '<div class="tracker-chip">' + stage3ChipHtml + '</div>' +
                '</div>' +
              '</div>' +
              '<div class="detail-sep"></div>' +
              '<p class="section-label">COMPLETE REQUEST DETAILS</p>' +
              '<div class="detail-row"><span class="detail-label">Request Type</span><span class="detail-value">' + (isPermission ? 'Permission' : 'Leave') + '</span></div>' +
              '<div class="detail-row"><span class="detail-label">Category</span><span class="detail-value">' + escHtml(title) + '</span></div>' +
              '<div class="detail-row"><span class="detail-label">Date</span><span class="detail-value">' + escHtml(displayDate) + '</span></div>' +
              timeRow +
              '<div class="detail-row"><span class="detail-label">' + (isPermission ? 'Duration' : 'Number of Days') + '</span><span class="detail-value">' + escHtml(duration) + '</span></div>' +
              '<div class="detail-row"><span class="detail-label">Applied Date</span><span class="detail-value">' + escHtml(appliedDate) + '</span></div>' +
              '<div class="detail-row"><span class="detail-label">Approval Status</span><span class="badge ' + si.tone + '" style="font-size:11px;padding:3px 10px;">' + si.label + '</span></div>' +
              '<div class="detail-row"><span class="detail-label">Approver / Manager</span><span class="detail-value">' + escHtml(approverName) + '</span></div>' +
              '<div class="detail-block"><span class="detail-block-label">Reason / Comments</span><div class="detail-block-text">' + escHtml(reason) + '</div></div>' +
              approverCommentHtml +
              '<div class="detail-block"><span class="detail-block-label">Supporting Documents</span><div class="detail-block-text">📎 ' + escHtml(supportingDocs) + '</div></div>' +
            '</div>' +
          '</div>';
        }

        function escHtml(s) {
          return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        }

        function renderCards() {
          var reqs = getRequests();
          var container = document.getElementById('cards-container');
          if (!container) return;

          var filtered = reqs.filter(function(r) {
            var isPerm = !!(r.isPermission || r.permissionType || ['Early Going','Late Coming','Personal Work','Official Work'].indexOf(r.leaveType || r.type || '') !== -1);
            if (currentTab === 'leaves') return !isPerm;
            if (currentTab === 'permissions') return isPerm;
            return true;
          });

          if (filtered.length === 0) {
            container.innerHTML = '<div class="empty-state">' +
              '<div class="empty-icon">📋</div>' +
              '<p class="empty-title">No requests yet</p>' +
              '<p class="empty-sub">' + (currentTab === 'permissions' ? 'Apply for a permission to see it here.' : currentTab === 'leaves' ? 'Apply for leave to see it here.' : 'Submit a leave or permission request to see it here.') + '</p>' +
              '<button class="empty-btn" onclick="navTo(\'Apply\')">' + (currentTab === 'permissions' ? '+ Apply Permission' : '+ Apply Leave') + '</button>' +
            '</div>';
            return;
          }

          // Preserve expanded state
          var expandedSet = {};
          container.querySelectorAll('.card').forEach(function(c) {
            var exp = c.querySelector('.expanded');
            if (exp && exp.style.display === 'block') expandedSet[c.getAttribute('data-idx')] = true;
          });

          var html = '';
          var globalIdx = 0;
          reqs.forEach(function(r, i) {
            var isPerm = !!(r.isPermission || r.permissionType || ['Early Going','Late Coming','Personal Work','Official Work'].indexOf(r.leaveType || r.type || '') !== -1);
            var matchTab = currentTab === 'all' || (currentTab === 'leaves' && !isPerm) || (currentTab === 'permissions' && isPerm);
            if (matchTab) html += buildCard(r, i);
          });
          container.innerHTML = html;

          // Restore expanded state and re-apply display:none properly
          container.querySelectorAll('.card').forEach(function(c) {
            var exp = c.querySelector('.expanded');
            if (!exp) return;
            if (expandedSet[c.getAttribute('data-idx')]) {
              exp.style.display = 'block';
              var btn = c.querySelector('.view-btn');
              if (btn) btn.textContent = 'Hide Details ∧';
            } else {
              exp.style.display = 'none';
            }
          });
        }

        function toggleExpand(btn) {
          var card = btn.closest('.card');
          if (!card) return;
          var exp = card.querySelector('.expanded');
          if (!exp) return;
          if (exp.style.display === 'block') {
            exp.style.display = 'none';
            btn.textContent = 'View Details ›';
          } else {
            exp.style.display = 'block';
            btn.textContent = 'Hide Details ∧';
          }
        }

        function filterTab(tab, el) {
          currentTab = tab;
          document.querySelectorAll('.pill').forEach(function(p) { p.classList.remove('active'); });
          if (el) el.classList.add('active');
          renderCards();
        }

        // Set logo
        (function() {
          var pw = pWin();
          var logo = document.getElementById('lh-logo');
          if (!logo) return;
          var imgs = pw.document ? pw.document.querySelectorAll('img') : [];
          for (var i = 0; i < imgs.length; i++) {
            var src = imgs[i].src || '';
            if (src && src.indexOf('data:image') === 0 && imgs[i].width > 0) { logo.src = src; break; }
          }
        })();

        // Initial render
        renderCards();

        // Auto-refresh every 1.2 seconds to pick up manager decisions
        setInterval(renderCards, 1200);
      