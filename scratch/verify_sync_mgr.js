const fs = require('fs');

const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

files.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  console.log(`=== ${f} ===`);
  const hasSubmittedCheck = c.includes('isSubmitted = r.managerDecisionSubmitted');
  const hasProfileStatusPill = c.includes('profile-status-pill active-status');
  const countSyncMgr = (c.match(/function syncManagerDashboard\(/g) || []).length;
  console.log('hasSubmittedCheck:', hasSubmittedCheck);
  console.log('hasProfileStatusPill (in card):', hasProfileStatusPill);
  console.log('countSyncMgr:', countSyncMgr);

  // Check how many occurrences of profile-status-pill remain in file
  const pillCount = (c.match(/class="profile-status-pill/g) || []).length;
  console.log('Total profile-status-pill in file (Profile page only expected 1):', pillCount);
});
