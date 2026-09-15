document.querySelectorAll('.bottom-nav .tab').forEach((t) => t.addEventListener('click', () => setActiveNav(t)));

(function syncStatus() {
  const badge = document.getElementById('profile-emp-status') || document.querySelector('.status-card .badge');
  if (!badge) return;
  let status = 'Active';
  if (window.parent && window.parent.EMPLOYMENT_STATUS) {
    status = window.parent.EMPLOYMENT_STATUS;
  } else {
    try {
      const stored = sessionStorage.getItem('EMPLOYMENT_STATUS');
      if (stored) status = stored;
    } catch(e) {}
    const params = new URLSearchParams(window.location.search);
    if (params.get('status')) status = params.get('status');
  }

  badge.textContent = status;
  if (status === 'Active') {
    badge.className = 'badge success';
    badge.style.background = 'var(--success-bg)';
    badge.style.color = 'var(--success)';
  } else {
    badge.className = 'badge danger';
    badge.style.background = 'var(--danger-bg)';
    badge.style.color = 'var(--danger)';
  }
})();
