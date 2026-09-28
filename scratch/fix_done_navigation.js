const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../preview_app.html'),
  path.join(__dirname, '../index.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/preview_app.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/index.html')
];

for (const filePath of files) {
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Ensure tpl-LeaveBalance has the script definition
  const tplStart = content.indexOf('<template id="tpl-LeaveBalance">');
  if (tplStart !== -1) {
    const tplEnd = content.indexOf('</template>', tplStart);
    if (tplEnd !== -1) {
      let tplContent = content.substring(tplStart, tplEnd);

      // Make sure the button and overlay have inline fallbacks
      tplContent = tplContent.replace(
        /id="coming-soon-done-btn"[^>]*>Done<\/button>/g,
        'id="coming-soon-done-btn" onclick="if(typeof handleComingSoonDone===\'function\'){handleComingSoonDone()}else if(window.parent&&window.parent.loadScreen){window.parent.loadScreen(\'tpl-EmployeeDashboard\')}else if(typeof loadScreen===\'function\'){loadScreen(\'tpl-EmployeeDashboard\')}else{window.location.href=\'../EmployeeDashboard/preview.html\'}">Done</button>'
      );

      // Make sure script has handleComingSoonDone
      if (!tplContent.includes('function handleComingSoonDone()')) {
        tplContent = tplContent.replace(
          '<script>',
          `<script>
        function handleComingSoonDone() {
          var pWin = (window.parent && window.parent !== window) ? window.parent : window;
          if (pWin.loadScreen) {
            pWin.loadScreen('tpl-EmployeeDashboard');
          } else if (typeof loadScreen === 'function') {
            loadScreen('tpl-EmployeeDashboard');
          } else {
            window.location.href = '../EmployeeDashboard/preview.html';
          }
        }
        window.handleComingSoonDone = handleComingSoonDone;
`
        );
      }

      content = content.substring(0, tplStart) + tplContent + content.substring(tplEnd);
    }
  }

  // 2. Also ensure top-level window in the bundle has handleComingSoonDone
  if (!content.includes('window.handleComingSoonDone = handleComingSoonDone; // top-level')) {
    content = content.replace(
      'window.loadScreen = loadScreen;',
      `window.loadScreen = loadScreen;
        function handleComingSoonDone() {
          var target = (window.AUTH_USER && window.AUTH_USER.role === 'manager') ? 'tpl-ManagerDashboard' : 'tpl-EmployeeDashboard';
          if (typeof loadScreen === 'function') {
            loadScreen(target);
          }
        }
        window.handleComingSoonDone = handleComingSoonDone; // top-level`
    );
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed navigation in:', filePath);
}
