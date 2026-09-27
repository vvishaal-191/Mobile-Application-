const fs = require('fs');

console.log('--- STARTING VERIFICATION FOR ATTENDANCE COMING SOON MODAL ---');

const filesToCheck = [
  'EmergereApp/EmergereApp/src/screens/MyAttendance/preview.html',
  'EmergereApp/EmergereApp/src/screens/TeamAttendance/preview.html',
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

let allPassed = true;

filesToCheck.forEach(f => {
  if (!fs.existsSync(f)) {
    console.error(`❌ File not found: ${f}`);
    allPassed = false;
    return;
  }
  const content = fs.readFileSync(f, 'utf8');

  // Check 1: Coming Soon Title
  const hasComingSoonTitle = content.includes('Coming Soon');
  // Check 2: Coming Soon Message
  const hasComingSoonMsg = content.includes('This feature is currently under development and will be available soon.');
  // Check 3: Done Button
  const hasDoneBtn = content.includes('coming-soon-btn') && content.includes('Done');
  // Check 4: Modal styles
  const hasModalStyles = content.includes('.coming-soon-modal-overlay') && content.includes('.coming-soon-modal-card');
  // Check 5: Navigation to EmployeeDashboard and ManagerDashboard
  const hasEmpNav = content.includes('tpl-EmployeeDashboard') || content.includes('EmployeeDashboard');
  const hasMgrNav = content.includes('tpl-ManagerDashboard') || content.includes('ManagerDashboard');

  console.log(`\nVerifying ${f}:`);
  console.log(` - Has 'Coming Soon' Title: ${hasComingSoonTitle}`);
  console.log(` - Has 'Coming Soon' Message: ${hasComingSoonMsg}`);
  console.log(` - Has 'Done' Button: ${hasDoneBtn}`);
  console.log(` - Has Modal Styles: ${hasModalStyles}`);
  console.log(` - Has Employee Navigation: ${hasEmpNav}`);
  console.log(` - Has Manager Navigation: ${hasMgrNav}`);

  if (hasComingSoonTitle && hasComingSoonMsg && hasDoneBtn && hasModalStyles && (hasEmpNav || hasMgrNav)) {
    console.log(`✅ ${f} PASSED all checks!`);
  } else {
    console.error(`❌ ${f} FAILED some checks!`);
    allPassed = false;
  }
});

// Also check React Native files
const rnFiles = [
  'EmergereApp/EmergereApp/src/screens/MyAttendance/MyAttendanceScreen.jsx',
  'EmergereApp/EmergereApp/src/screens/MyAttendance/MyAttendanceScreen.styles.js',
  'EmergereApp/EmergereApp/src/screens/TeamAttendance/TeamAttendanceScreen.jsx',
  'EmergereApp/EmergereApp/src/screens/TeamAttendance/TeamAttendanceScreen.styles.js'
];

rnFiles.forEach(f => {
  if (!fs.existsSync(f)) {
    console.error(`❌ React Native file not found: ${f}`);
    allPassed = false;
    return;
  }
  const content = fs.readFileSync(f, 'utf8');
  const hasComingSoon = content.includes('Coming Soon') || content.includes('comingSoon');
  console.log(`\nVerifying RN ${f}: has Coming Soon: ${hasComingSoon}`);
  if (hasComingSoon) {
    console.log(`✅ RN ${f} PASSED!`);
  } else {
    console.error(`❌ RN ${f} FAILED!`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\n=========================================');
  console.log('ALL COMING SOON POPUP CHECKS PASSED 100%!');
  console.log('=========================================');
} else {
  process.exit(1);
}
