
    function syncManagerDashboard(targetDoc) {
      const doc = targetDoc || document;
      if (!doc) return;
      const store = (window.parent && window.parent.EMP_LEAVE_REQUESTS) ? window.parent : (window.EMP_LEAVE_REQUESTS ? window : (window.parent || window));

      // 1. Gather all leave and permission requests
      const allRequests = [];
      const seenIds = {};

      if (store.EMP_LEAVE_REQUESTS && Array.isArray(store.EMP_LEAVE_REQUESTS)) {
        store.EMP_LEAVE_REQUESTS.forEach(function(r) {
          if (r && r.id && !seenIds[r.id]) {
            seenIds[r.id] = true;
            allRequests.push(r);
          }
        });
      }
      if (store.PERM_STATE && Array.isArray(store.PERM_STATE)) {
        store.PERM_STATE.forEach(function(r) {
          if (r && r.id && !seenIds[r.id]) {
            seenIds[r.id] = true;
            allRequests.push(r);
          }
        });
      }

      // Compute counts
      const pendingLeaves = allRequests.filter(function(r) {
        return !r.isPermission && (r.status || 'pending').toLowerCase() === 'pending';
      });
      const pendingPerms = allRequests.filter(function(r) {
        return !!r.isPermission && (r.status || 'pending').toLowerCase() === 'pending';
      });
      const totalPending = allRequests.filter(function(r) {
        return (r.status || 'pending').toLowerCase() === 'pending';
      });

      // 2. Notification Count:
      // In the card shown in the second image (Permission Approvals), display notification count
      // whenever an employee submits a Leave or Permission request
      const permBadge = doc.getElementById('manager-dash-perm-badge');
      if (permBadge) {
        const notifCount = Math.max(store.MGR_NOTIFICATION_COUNT || 0, allRequests.length);
        permBadge.textContent = String(notifCount);
        permBadge.style.display = 'inline-flex';
      }

      const leaveBadge = doc.getElementById('manager-dash-leave-badge');
      if (leaveBadge) {
        leaveBadge.textContent = String(pendingLeaves.length);
      }

      const statPending = doc.getElementById('mgr-stat-pending');
      if (statPending) {
        statPending.textContent = String(18 + totalPending.length);
      }

      // 3. Recent Requests Section (matching Image 3)
      const requestsLabel = doc.getElementById('mgr-dash-requests-label');
      const requestsList = doc.getElementById('mgr-dash-requests-list');

      if (requestsLabel) {
        requestsLabel.textContent = 'Recent Requests (' + allRequests.length + ')';
      }

      if (requestsList) {
        if (allRequests.length === 0) {
          // Empty state matching Image 3
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
          allRequests.forEach(function(req) {
            const isPerm = !!req.isPermission;
            const empName = req.employeeName || req.name || 'Sneha Reddy';
            const empInitials = req.employeeInitials || req.initials || (empName.split(' ').map(function(w){return w[0];}).join('').toUpperCase().slice(0, 2)) || 'SR';
            const empRole = req.employeeRole || req.role || (isPerm ? 'UI/UX Designer' : 'Senior Software Engineer');
            const reqType = req.leaveType || req.type || (isPerm ? 'Early Going' : 'Casual Leave');
            const duration = req.daysText || req.duration || req.totalDays || (isPerm ? '2 Hours' : '2 Days');
            const dates = req.date || (req.fromDate === req.toDate ? req.fromDate : (req.fromDate + ' – ' + (req.toDate || req.fromDate)));
            const reason = req.reason || (isPerm ? 'Personal work / checkup' : "Family function - attending sister's wedding ceremony in Bangalore.");
            const status = (req.status || 'pending').toLowerCase();
            const statusLabel = status === 'approved' ? 'Approved' : (status === 'rejected' ? 'Rejected' : 'Pending');

            // Employee Status Button: Green when Active, Red when Inactive (Requirement 1)
            let isEmpInactive = false;
            if (status === 'approved' && !isPerm) {
              isEmpInactive = true;
            } else if (typeof store.computeEmploymentStatus === 'function') {
              isEmpInactive = store.computeEmploymentStatus({ name: empName }) === 'Inactive';
            } else if (store.EMPLOYMENT_STATUS === 'Inactive') {
              isEmpInactive = true;
            }
            const empStatusText = isEmpInactive ? 'Inactive' : 'Active';
            const empStatusPillStyle = isEmpInactive
              ? 'background: #FEE2E2 !important; border: 1px solid #FCA5A5 !important; color: #DC2626 !important;'
              : 'background: #DCFCE7 !important; border: 1px solid #86EFAC !important; color: #15803D !important;';
            const empStatusDotStyle = isEmpInactive
              ? 'background: #EF4444 !important;'
              : 'background: #16A34A !important;';
            const empStatusTextStyle = isEmpInactive
              ? 'color: #DC2626 !important;'
              : 'color: #15803D !important;';

            htmlCards += '<div class="recent-req-item" onclick="handleCardNav(\'tpl-LeaveApprovalDetail\', \'' + (req.id || 'priya') + '\')" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:14px; padding:14px 16px; margin-bottom:12px; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.03); transition:all 0.2s;">'
              + '<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">'
              + '<div style="display:flex; align-items:center; gap:10px;">'
              + '<div style="width:38px; height:38px; border-radius:50%; background:' + (isPerm ? '#D97706' : '#2563EB') + '; color:#FFFFFF; font-weight:700; font-size:14px; display:flex; align-items:center; justify-content:center;">' + empInitials + '</div>'
              + '<div>'
              + '<div style="font-size:14px; font-weight:700; color:#0F172A;">' + empName + '</div>'
              + '<div style="font-size:11.5px; color:#64748B;">' + empRole + '</div>'
              + '</div>'
              + '</div>'
              // Employee Status Button (Requirement 1)
              + '<div class="profile-status-pill ' + (isEmpInactive ? 'inactive-status' : 'active-status') + '" style="' + empStatusPillStyle + ' padding:4px 10px; border-radius:999px; display:inline-flex; align-items:center; gap:5px; font-size:11.5px; font-weight:700;">'
              + '<span class="profile-status-dot" style="' + empStatusDotStyle + ' width:7px; height:7px; border-radius:50%; display:inline-block;"></span>'
              + '<span class="profile-status-text" style="' + empStatusTextStyle + '">' + empStatusText + '</span>'
              + '</div>'
              + '</div>'

              + '<div style="display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom:6px;">'
              + '<span style="background:' + (isPerm ? '#FFFBEB' : '#EFF6FF') + '; color:' + (isPerm ? '#D97706' : '#2563EB') + '; border:1px solid ' + (isPerm ? '#FDE68A' : '#DBEAFE') + '; padding:2px 8px; border-radius:6px; font-weight:600;">' + reqType + ' (' + duration + ')</span>'
              + '<span style="color:#475569; font-weight:500;">' + dates + '</span>'
              + '<span style="margin-left:auto; font-size:11px; font-weight:700; padding:2px 8px; border-radius:6px; background:' + (status === 'approved' ? '#DCFCE7' : (status === 'rejected' ? '#FEE2E2' : '#FEF3C7')) + '; color:' + (status === 'approved' ? '#15803D' : (status === 'rejected' ? '#DC2626' : '#D97706')) + ';">' + statusLabel + '</span>'
              + '</div>'

              + '<div style="font-size:12px; color:#475569; background:#F8FAFC; padding:8px 10px; border-radius:8px; line-height:1.4; border-left:3px solid ' + (isPerm ? '#F59E0B' : '#3B82F6') + ';">'
              + '"' + reason + '"'
              + '</div>'
              + '</div>';
          });
          requestsList.innerHTML = htmlCards;
        }
      }
    }
