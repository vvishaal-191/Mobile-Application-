// Simulate the environment in node
const window = {
  PERM_STATE: [],
  EMP_LEAVE_REQUESTS: [],
  AUTH_USER: { name: 'Priya Sharma', role: 'employee' },
  USER_PROFILE: { name: 'Priya Sharma' }
};
const store = window;

// Simulate handleApplyPermissionSubmit from tpl-ApplyPermission
function submitPerm1() {
  var newId = 'perm-' + Date.now();
  window.MGR_NOTIFICATION_COUNT = (window.MGR_NOTIFICATION_COUNT || 0) + 1;
  var entry = {
    id: newId,
    type: 'Early Going',
    date: '04-Sep-2026',
    reason: 'Doctor',
    isPermission: true
  };
  window.PERM_STATE.unshift(entry);
  window.EMP_LEAVE_REQUESTS.unshift({
    id: newId,
    leaveType: 'Early Going',
    fromDate: '04-Sep-2026',
    reason: 'Doctor',
    isPermission: true
  });
}

submitPerm1();
console.log('After submitPerm1:');
console.log('PERM_STATE count:', window.PERM_STATE.length);
console.log('EMP_LEAVE_REQUESTS count:', window.EMP_LEAVE_REQUESTS.length);
console.log('MGR_NOTIFICATION_COUNT:', window.MGR_NOTIFICATION_COUNT);

// Now what if iframeWin.handleApplyPermissionSubmit also ran?
// Or what if someone clicked it?
