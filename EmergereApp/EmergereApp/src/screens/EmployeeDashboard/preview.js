// --- Notification glow on bell icon ---
(function initBellGlow() {
  const bellEl = document.querySelector('.bell');
  if (!bellEl) return;

  function checkForNewNotifications() {
    const pWin = (window.parent && window.parent !== window) ? window.parent : window;
    const notes = pWin.NOTIFICATIONS || [];
    if (notes.some(function(n) { return n.unread; })) {
      bellEl.classList.add('bell-glow');
    } else {
      bellEl.classList.remove('bell-glow');
    }
  }

  checkForNewNotifications();

  // Re-check when user returns to this screen (focus / page restore)
  window.addEventListener('focus', checkForNewNotifications);
  window.addEventListener('pageshow', checkForNewNotifications);

  // Remove glow when user opens notifications
  bellEl.addEventListener('click', function() {
    bellEl.classList.remove('bell-glow');
    const pWin = (window.parent && window.parent !== window) ? window.parent : window;
    if (pWin.NOTIFICATIONS) {
      pWin.NOTIFICATIONS = pWin.NOTIFICATIONS.map(function(n) { return Object.assign({}, n, { unread: false }); });
    }
    if (window.parent && window.parent.loadScreen) window.parent.loadScreen('tpl-Notifications');
  });
})();

document.querySelectorAll('.bottom-nav .tab').forEach((t) => {
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
  if (prof) {
    const greetingEl = document.getElementById('dash-greeting') || document.querySelector('.greeting');
    if (greetingEl && prof.name) {
      greetingEl.textContent = 'Hello, ' + prof.name;
    }
    const roleTextEl = document.getElementById('dash-role-text');
    const idTextEl = document.getElementById('dash-id-text');
    if (roleTextEl && prof.role) roleTextEl.textContent = prof.role;
    if (idTextEl && prof.employeeId) idTextEl.textContent = prof.employeeId;
  }
})();

function deleteEmpRequest(btn, e, reqId) {
  if (e) {
    e.stopPropagation();
    e.preventDefault();
  }
  const card = btn ? btn.closest('.request-card') : null;
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
    const count = document.querySelectorAll('.request-card').length;
    const label = document.getElementById('emp-dash-requests-label') || document.querySelector('.section-label');
    if (label) {
      label.textContent = 'RECENT REQUESTS (' + count + ')';
    }
  }, 220);
}
window.deleteEmpRequest = deleteEmpRequest;
