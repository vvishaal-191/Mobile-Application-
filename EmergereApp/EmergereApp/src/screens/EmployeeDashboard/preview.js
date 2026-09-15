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

const btnCheckIn = document.getElementById('btn-check-in');
const btnCheckOut = document.getElementById('btn-check-out');
const dot = document.getElementById('dash-status-dot');
const text = document.getElementById('dash-status-text');

function updateAttendance(checkedIn) {
  if (dot) dot.style.background = checkedIn ? 'var(--success)' : 'var(--danger)';
  if (text) text.textContent = checkedIn ? 'Checked In' : 'Checked Out';
  try {
    sessionStorage.setItem('EMPLOYMENT_STATUS', checkedIn ? 'Active' : 'Inactive');
    sessionStorage.setItem('CHECKED_IN', checkedIn ? 'true' : 'false');
  } catch(e) {}
}

if (btnCheckIn) {
  btnCheckIn.addEventListener('click', () => {
    updateAttendance(true);
    if (window.parent) {
      window.parent.CHECKED_IN = true;
      window.parent.EMPLOYMENT_STATUS = 'Active';
      window.parent.ATTENDANCE_STATUS = 'Checked In';
      if (typeof window.parent.loadScreen === 'function') {
        window.parent.loadScreen('tpl-MyProfile');
        return;
      }
    }
    window.location.href = '../MyProfile/preview.html?status=Active';
  });
}

if (btnCheckOut) {
  btnCheckOut.addEventListener('click', () => {
    updateAttendance(false);
    if (window.parent) {
      window.parent.CHECKED_IN = false;
      window.parent.EMPLOYMENT_STATUS = 'Inactive';
      window.parent.ATTENDANCE_STATUS = 'Checked Out';
    }
  });
}
