const fs = require('fs');
const path = require('path');

const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/src/screens/Notifications/preview.html',
  'EmergereApp/EmergereApp/src/screens/Notifications/NotificationsScreen.jsx'
];

let allPassed = true;

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (!fs.existsSync(filePath)) {
    console.error(`File missing: ${file}`);
    allPassed = false;
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');

  if (file.endsWith('.jsx')) {
    if (content.includes('active="Dashboard"')) {
      console.error(`[FAIL] ${file} has active="Dashboard" in BottomNavBar`);
      allPassed = false;
    } else {
      console.log(`[PASS] ${file} does not have active="Dashboard"`);
    }
  } else {
    // Check tpl-Notifications content
    let tplContent = content;
    if (file.includes('preview_app') || file.includes('index.html')) {
      const idx = content.indexOf('id="tpl-Notifications"');
      const end = content.indexOf('</template>', idx);
      tplContent = content.substring(idx, end);
    }

    const bodyIdx = tplContent.indexOf('<body');
    const bodyContent = bodyIdx !== -1 ? tplContent.substring(bodyIdx) : tplContent;

    if (bodyContent.includes('active-dot-indicator')) {
      console.error(`[FAIL] ${file} has active-dot-indicator in HTML body`);
      allPassed = false;
    } else {
      console.log(`[PASS] ${file} does not have active-dot-indicator in HTML body`);
    }

    if (bodyContent.includes('dashboard-pill-wrap')) {
      console.error(`[FAIL] ${file} has dashboard-pill-wrap in HTML body`);
      allPassed = false;
    } else {
      console.log(`[PASS] ${file} does not have dashboard-pill-wrap in HTML body`);
    }

    if (bodyContent.includes('class="tab nav-tab active" id="tab-dashboard"') || bodyContent.includes('class="tab nav-tab active"')) {
      console.error(`[FAIL] ${file} has active class on tab-dashboard in HTML body`);
      allPassed = false;
    } else {
      console.log(`[PASS] ${file} does not have active class on tab-dashboard in HTML body`);
    }

    if (!bodyContent.includes('navigateToDashboard()')) {
      console.error(`[FAIL] ${file} missing navigateToDashboard()`);
      allPassed = false;
    } else {
      console.log(`[PASS] ${file} contains navigateToDashboard()`);
    }

    if (!tplContent.includes('tpl-EmployeeDashboard')) {
      console.error(`[FAIL] ${file} missing tpl-EmployeeDashboard`);
      allPassed = false;
    } else {
      console.log(`[PASS] ${file} targets tpl-EmployeeDashboard`);
    }
  }
});

console.log(allPassed ? '\n=== ALL NOTIFICATION FIXES VERIFIED! ===' : '\n=== SOME VERIFICATIONS FAILED! ===');
