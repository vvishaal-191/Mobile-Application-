// --- Notification glow on bell icon ---
(function initBellGlow() {
  const bellEl = document.getElementById('dash-bell-btn') || document.querySelector('.header-bell-wrap') || document.querySelector('.bell');
  if (!bellEl) return;

  function checkForNewNotifications() {
    const pWin = (window.parent && window.parent !== window) ? window.parent : window;
    const notes = pWin.NOTIFICATIONS || [];
    if (notes.some(function(n) { return n.unread; })) {
      bellEl.classList.add('has-glow');
    } else {
      bellEl.classList.remove('has-glow');
    }
  }

  checkForNewNotifications();

  // Re-check when user returns to this screen (focus / page restore)
  window.addEventListener('focus', checkForNewNotifications);
  window.addEventListener('pageshow', checkForNewNotifications);

  // Remove glow when user opens notifications
  bellEl.addEventListener('click', function() {
    bellEl.classList.remove('has-glow');
    const pWin = (window.parent && window.parent !== window) ? window.parent : window;
    if (pWin.NOTIFICATIONS) {
      pWin.NOTIFICATIONS = pWin.NOTIFICATIONS.map(function(n) { return Object.assign({}, n, { unread: false }); });
    }
    if (window.parent && window.parent.loadScreen) window.parent.loadScreen('tpl-Notifications');
    else window.location.href = '../Notifications/preview.html';
  });
})();

document.querySelectorAll('.bottom-nav .tab, .bottom-nav .nav-tab').forEach((t) => {
  t.addEventListener('click', () => {
    if (typeof setActiveNav === 'function') setActiveNav(t);
    if (t.textContent.includes('Profile')) {
      if (window.parent && window.parent.loadScreen) {
        window.parent.loadScreen('tpl-MyProfile');
      } else {
        window.location.href = '../MyProfile/preview.html';
      }
    }
  });
});

(function syncUserProfile() {
  let prof = (window.parent && window.parent.USER_PROFILE) || window.USER_PROFILE;
  if (!prof) {
    try {
      const stored = sessionStorage.getItem('USER_PROFILE');
      if (stored) prof = JSON.parse(stored);
    } catch(e) {}
  }
  const greetingEl = document.getElementById('dash-greeting') || document.querySelector('.greeting');
  if (greetingEl) {
    const name = (prof && prof.name) ? prof.name.replace(/\s*\s*$/, '') : 'Sneha Reddy';
    greetingEl.textContent = name;
  }
  if (prof) {
    const roleTextEl = document.getElementById('dash-role-text');
    const idTextEl = document.getElementById('dash-id-text');
    if (roleTextEl && prof.role) roleTextEl.textContent = prof.role;
    if (idTextEl && prof.employeeId) idTextEl.textContent = prof.employeeId;
  }
})();

// ── Sidebar Drawer Functions (Image 4) ──
function openSidebarDrawer() {
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) overlay.classList.add('open');
  const pWin = (window.parent && window.parent !== window) ? window.parent : window;
  const prof = pWin.USER_PROFILE || window.USER_PROFILE || {};
  const nameEl = document.getElementById('sidebar-name');
  const initialsEl = document.getElementById('sidebar-initials');
  const curName = (prof.name || (window.AUTH_USER && window.AUTH_USER.name) || 'Sneha Reddy').replace(/\s*👋\s*$/, '');
  if (nameEl) nameEl.textContent = curName;
  if (initialsEl) {
    const parts = curName.trim().split(/\s+/);
    initialsEl.textContent = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : curName.slice(0, 2).toUpperCase();
  }
}
window.openSidebarDrawer = openSidebarDrawer;

function closeSidebarDrawer() {
  const overlay = document.getElementById('sidebar-overlay');
  if (overlay) overlay.classList.remove('open');
}
window.closeSidebarDrawer = closeSidebarDrawer;

function handleSidebarNav(href, tplId) {
  closeSidebarDrawer();
  setTimeout(() => {
    const pWin = (window.parent && window.parent !== window) ? window.parent : window;
    if (pWin.loadScreen && tplId) {
      pWin.loadScreen(tplId);
    } else if (href) {
      window.location.href = href;
    }
  }, 120);
}
window.handleSidebarNav = handleSidebarNav;

function handleSidebarLogout() {
  closeSidebarDrawer();
  setTimeout(() => {
    const pWin = (window.parent && window.parent !== window) ? window.parent : window;
    if (pWin.logout) {
      pWin.logout();
    } else if (pWin.loadScreen) {
      pWin.loadScreen('tpl-Login');
    } else {
      window.location.href = '../Login/preview.html';
    }
  }, 100);
}
window.handleSidebarLogout = handleSidebarLogout;

// ── Dismiss Recent Request ──
function dismissRecentRequest(cardId, e) {
  if (e && e.stopPropagation) e.stopPropagation();
  const card = cardId ? document.getElementById(cardId) : document.querySelector('.recent-request-card');
  if (card) {
    card.style.transition = 'all 0.25s ease';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
      card.remove();
      const reqList = document.getElementById('emp-dash-requests-list');
      const rem = reqList ? reqList.querySelectorAll('.recent-request-card').length : 0;
      const label = document.getElementById('emp-dash-requests-label');
      const sec = document.getElementById('emp-recent-requests-section');
      if (label) label.textContent = 'RECENT REQUESTS (' + rem + ')';
      if (rem === 0 && sec) sec.style.display = 'none';
    }, 250);
  }
}
window.dismissRecentRequest = dismissRecentRequest;

function deleteEmpRequest(btn, e, reqId) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const card = btn ? (btn.closest('.recent-request-card') || btn.closest('.request-card')) : null;
  if (!card) return;

  const cardId = reqId || card.id;
  const pWin = (window.parent && window.parent !== window) ? window.parent : window;

  if (pWin.EMP_LEAVE_REQUESTS) {
    pWin.EMP_LEAVE_REQUESTS = pWin.EMP_LEAVE_REQUESTS.filter(r => String(r.id) !== String(cardId) && ('emp-req-' + r.id) !== card.id);
  }
  if (window.EMP_LEAVE_REQUESTS) {
    window.EMP_LEAVE_REQUESTS = window.EMP_LEAVE_REQUESTS.filter(r => String(r.id) !== String(cardId) && ('emp-req-' + r.id) !== card.id);
  }

  card.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
  card.style.opacity = '0';
  card.style.transform = 'scale(0.92) translateY(-8px)';
  setTimeout(() => {
    card.remove();
    const reqList = document.getElementById('emp-dash-requests-list');
    const rem = reqList ? reqList.querySelectorAll('.recent-request-card').length : 0;
    const label = document.getElementById('emp-dash-requests-label') || document.querySelector('.section-label');
    const sec = document.getElementById('emp-recent-requests-section');
    if (label) {
      label.textContent = 'RECENT REQUESTS (' + rem + ')';
      if (rem === 0) label.style.display = 'none';
    }
    if (rem === 0 && sec) sec.style.display = 'none';
  }, 220);
}
window.deleteEmpRequest = deleteEmpRequest;

function syncDashboardRequests() {
  const pWin = (window.parent && window.parent !== window) ? window.parent : window;
  const sec = document.getElementById('emp-recent-requests-section');
  const reqList = document.getElementById('emp-dash-requests-list');
  const label = document.getElementById('emp-dash-requests-label');
  if (!sec || !reqList) return;

  let allReqs = [];
  try {
    if (pWin.EMP_LEAVE_REQUESTS && pWin.EMP_LEAVE_REQUESTS.length > 0) {
      allReqs = pWin.EMP_LEAVE_REQUESTS.slice();
    } else if (window.EMP_LEAVE_REQUESTS && window.EMP_LEAVE_REQUESTS.length > 0) {
      allReqs = window.EMP_LEAVE_REQUESTS.slice();
    } else {
      const stored = sessionStorage.getItem('ALL_SUBMITTED_REQUESTS');
      if (stored) allReqs = JSON.parse(stored);
    }
  } catch (e) {}

  const lastDecision = pWin.LAST_LEAVE_DECISION || window.LAST_LEAVE_DECISION || pWin.lastLeaveDecision || window.lastLeaveDecision;
  if (lastDecision && (lastDecision.status === 'approved' || lastDecision.status === 'rejected')) {
    const alreadyIn = allReqs.some(r => String(r.id) === String(lastDecision.id));
    if (!alreadyIn) {
      allReqs.unshift({
        id: lastDecision.id || ('dec-' + Date.now()),
        leaveType: lastDecision.lType || 'Casual Leave',
        title: (lastDecision.lType || 'Casual Leave') + ' (1.0 Day)',
        subtitle: (lastDecision.fromDate || '07-Sep-2026') + ' • Personal Work',
        fromDate: lastDecision.fromDate || '07-Sep-2026',
        reason: 'Personal Work',
        status: lastDecision.status,
        employeeName: lastDecision.empName || 'Sneha Reddy',
        employeeId: 'EMP-2024-0103'
      });
    }
  }

  // Filter ONLY approved or rejected requests (Image 4 requirement)
  const approvedOrRejected = allReqs.filter(r => {
    if (pWin.DELETED_REQUEST_IDS && pWin.DELETED_REQUEST_IDS.indexOf(String(r.id)) !== -1) return false;
    if (window.DELETED_REQUEST_IDS && window.DELETED_REQUEST_IDS.indexOf(String(r.id)) !== -1) return false;
    const st = (r.status || '').toLowerCase();
    return st === 'approved' || st === 'rejected';
  });

  if (approvedOrRejected.length === 0) {
    sec.style.display = 'none';
    reqList.innerHTML = '';
    if (label) label.textContent = 'RECENT REQUESTS (0)';
    return;
  }

  sec.style.display = 'block';
  if (label) {
    label.textContent = 'RECENT REQUESTS (' + approvedOrRejected.length + ')';
    label.style.display = 'block';
  }
  reqList.innerHTML = '';

  approvedOrRejected.forEach(req => {
    const isApp = (req.status || '').toLowerCase() === 'approved';
    const badgeBg = isApp ? '#DCFCE7' : '#FCE4E4';
    const badgeColor = isApp ? '#16A34A' : '#E5484D';
    const badgeText = isApp ? 'Approved' : 'Rejected';
    const title = req.title || ((req.leaveType || req.type || 'Casual Leave') + ' (' + (req.daysText || req.totalDays || req.duration || '1.0 Day') + ')');
    const sub = req.subtitle || ((req.fromDate || req.date || '07-Sep-2026') + ' • ' + (req.reason || 'Personal Work'));
    const meta = (req.employeeName || (pWin.USER_PROFILE && pWin.USER_PROFILE.name) || 'Sneha Reddy') + ' • ' + (req.employeeId || (pWin.USER_PROFILE && pWin.USER_PROFILE.employeeId) || 'EMP-2024-0103');
    const reqId = 'emp-recent-req-' + (req.id || Math.random().toString(36).substr(2, 6));

    const c = document.createElement('div');
    c.className = 'recent-request-card request-card';
    c.id = reqId;
    c.style.marginTop = '8px';
    c.onclick = () => {
      if (pWin.loadScreen) pWin.loadScreen('tpl-MyRequests');
      else window.location.href = '../LeaveHistory/preview.html';
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
    const disBtn = c.querySelector('.recent-request-dismiss-btn');
    if (disBtn) {
      disBtn.onclick = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        dismissRecentRequest(reqId, e);
      };
    }
    reqList.appendChild(c);
  });
}
window.syncDashboardRequests = syncDashboardRequests;
syncDashboardRequests();
document.addEventListener('DOMContentLoaded', syncDashboardRequests);
