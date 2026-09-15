document.querySelectorAll('.bottom-nav .tab').forEach((t) => t.addEventListener('click', () => setActiveNav(t)));

const monthsShortArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let activeTeamDateObj = new Date(2026, 8, 3); // Sep 3, 2026

function formatTeamDateString(d) {
  const mStr = monthsShortArr[d.getMonth()];
  const dayStr = String(d.getDate()).padStart(2, '0');
  const yrStr = d.getFullYear();
  return `${mStr} ${dayStr}, ${yrStr}`;
}

function updateTeamDateNavDisplay() {
  const textEl = document.getElementById('team-date-text');
  if (textEl) textEl.textContent = formatTeamDateString(activeTeamDateObj);
  const inputEl = document.getElementById('team-date-input');
  if (inputEl) {
    const yyyy = activeTeamDateObj.getFullYear();
    const mm = String(activeTeamDateObj.getMonth() + 1).padStart(2, '0');
    const dd = String(activeTeamDateObj.getDate()).padStart(2, '0');
    inputEl.value = `${yyyy}-${mm}-${dd}`;
  }
}

window.changeTeamDate = function(deltaDays) {
  activeTeamDateObj.setDate(activeTeamDateObj.getDate() + deltaDays);
  updateTeamDateNavDisplay();
};

window.onTeamDatePick = function(val) {
  if (!val) return;
  const parts = val.split('-');
  if (parts.length === 3) {
    const yr = parseInt(parts[0], 10);
    const mo = parseInt(parts[1], 10) - 1;
    const da = parseInt(parts[2], 10);
    activeTeamDateObj = new Date(yr, mo, da);
    updateTeamDateNavDisplay();
  }
};
