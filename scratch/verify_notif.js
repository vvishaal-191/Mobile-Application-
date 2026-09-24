const fs = require('fs');
const path = require('path');

const files = [
  'EmergereApp/EmergereApp/src/screens/Notifications/preview.html',
  'EmergereApp/EmergereApp/src/screens/Notifications/preview.css',
  'EmergereApp/EmergereApp/src/screens/Notifications/NotificationsScreen.jsx',
  'EmergereApp/EmergereApp/src/screens/Notifications/NotificationsScreen.styles.js',
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

let allOk = true;

files.forEach(f => {
  const full = path.join(__dirname, '..', f);
  if (!fs.existsSync(full)) {
    console.error('Missing file:', f);
    allOk = false;
    return;
  }
  const content = fs.readFileSync(full, 'utf8');
  console.log(`[OK] ${f} exists (${content.length} bytes)`);

  if (f.endsWith('.html')) {
    if (f.includes('preview_app.html') || f.includes('index.html')) {
      if (!content.includes('id="tpl-Notifications"')) {
        console.error(`[ERROR] ${f} missing tpl-Notifications`);
        allOk = false;
      }
      if (!content.includes('notif-header-banner')) {
        console.error(`[ERROR] ${f} missing notif-header-banner`);
        allOk = false;
      }
      if (!content.includes('notif-recent-pill')) {
        console.error(`[ERROR] ${f} missing notif-recent-pill`);
        allOk = false;
      }
      if (!content.includes('clearAllNotifications')) {
        console.error(`[ERROR] ${f} missing clearAllNotifications`);
        allOk = false;
      }
      if (!content.includes('removeSingleNotif')) {
        console.error(`[ERROR] ${f} missing removeSingleNotif`);
        allOk = false;
      }
    } else {
      if (!content.includes('notif-header-banner')) {
        console.error(`[ERROR] ${f} missing notif-header-banner`);
        allOk = false;
      }
      if (!content.includes('notif-recent-pill')) {
        console.error(`[ERROR] ${f} missing notif-recent-pill`);
        allOk = false;
      }
      if (!content.includes('clearAllNotifications')) {
        console.error(`[ERROR] ${f} missing clearAllNotifications`);
        allOk = false;
      }
    }
  }
});

console.log(allOk ? '\n=== ALL VERIFICATIONS PASSED ===' : '\n=== SOME VERIFICATIONS FAILED ===');
