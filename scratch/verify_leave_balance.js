const fs = require('fs');

const checks = [
  { file: 'EmergereApp/EmergereApp/src/screens/LeaveBalance/LeaveBalanceScreen.jsx', terms: ['Modal', 'comingSoonOverlay', 'comingSoonCard', 'Coming Soon', 'go(\'EmployeeDashboard\')'] },
  { file: 'EmergereApp/EmergereApp/src/screens/LeaveBalance/LeaveBalanceScreen.styles.js', terms: ['comingSoonOverlay', 'comingSoonCard', 'comingSoonIconWrap', 'comingSoonTitle', 'comingSoonMsg', 'comingSoonBtn', 'comingSoonBtnText'] },
  { file: 'EmergereApp/EmergereApp/src/screens/LeaveBalance/preview.html', terms: ['leave-balance-coming-soon-modal', 'coming-soon-title', 'Coming Soon', 'handleComingSoonDone', 'tpl-EmployeeDashboard'] },
  { file: 'EmergereApp/EmergereApp/src/screens/LeaveBalance/preview.css', terms: ['.coming-soon-modal-overlay', '.coming-soon-modal-card', '.coming-soon-icon-wrap', '.coming-soon-btn'] },
  { file: 'preview_app.html', terms: ['leave-balance-coming-soon-modal', 'handleComingSoonDone', 'tpl-EmployeeDashboard'] },
  { file: 'index.html', terms: ['leave-balance-coming-soon-modal', 'handleComingSoonDone', 'tpl-EmployeeDashboard'] },
  { file: 'EmergereApp/EmergereApp/preview_app.html', terms: ['leave-balance-coming-soon-modal', 'handleComingSoonDone', 'tpl-EmployeeDashboard'] },
  { file: 'EmergereApp/EmergereApp/index.html', terms: ['leave-balance-coming-soon-modal', 'handleComingSoonDone', 'tpl-EmployeeDashboard'] }
];

let allPassed = true;
for (const c of checks) {
  const content = fs.readFileSync(c.file, 'utf8');
  for (const t of c.terms) {
    if (!content.includes(t)) {
      console.error('FAIL in', c.file, 'missing:', t);
      allPassed = false;
    }
  }
}
if (allPassed) console.log('ALL 8 FILES VERIFIED SUCCESSFULLY!');
