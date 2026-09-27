const fs = require('fs');
const path = require('path');

console.log('--- STARTING ATTENDANCE COMING SOON POPUP IMPLEMENTATION ---');

// 1. Popup HTML and CSS snippets
const comingSoonModalStyles = `
/* Coming Soon Popup Modal */
.coming-soon-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 9999;
  opacity: 1;
  pointer-events: auto;
  transition: opacity 0.25s ease;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.coming-soon-modal-card {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 32px 24px;
  width: 100%;
  max-width: 320px;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transform: scale(1);
  transition: transform 0.25s ease;
  box-sizing: border-box;
}

.coming-soon-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background: #EFF6FF;
  border: 6px solid #DBEAFE;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #2563EB;
}

.coming-soon-title {
  font-size: 20px;
  font-weight: 800;
  color: #111827;
  margin: 0 0 8px;
  font-family: inherit;
}

.coming-soon-msg {
  font-size: 13.5px;
  color: #64748B;
  line-height: 1.45;
  margin: 0 0 24px;
  font-family: inherit;
}

.coming-soon-btn {
  width: 100%;
  background: #0066FF;
  color: #FFFFFF;
  border: none;
  border-radius: 14px;
  padding: 13px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
  transition: all 0.2s ease;
  outline: none;
  font-family: inherit;
}

.coming-soon-btn:hover {
  background: #0052CC;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 102, 255, 0.4);
}

.coming-soon-btn:active {
  transform: scale(0.98);
}
`;

const comingSoonModalHtml = `
    <!-- Coming Soon Popup Modal -->
    <div class="coming-soon-modal-overlay" id="attendance-coming-soon-modal" onclick="if(event.target===this)handleComingSoonDone()">
      <div class="coming-soon-modal-card">
        <div class="coming-soon-icon-wrap">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
            <circle cx="12" cy="15" r="2"></circle>
          </svg>
        </div>
        <h2 class="coming-soon-title">Coming Soon</h2>
        <p class="coming-soon-msg">This feature is currently under development and will be available soon.</p>
        <button class="coming-soon-btn" id="coming-soon-done-btn" onclick="handleComingSoonDone()">Done</button>
      </div>
    </div>
`;

const employeeDoneScript = `
<script>
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
</script>
`;

const managerDoneScript = `
<script>
function handleComingSoonDone() {
  var pWin = (window.parent && window.parent !== window) ? window.parent : window;
  if (pWin.loadScreen) {
    pWin.loadScreen('tpl-ManagerDashboard');
  } else if (typeof loadScreen === 'function') {
    loadScreen('tpl-ManagerDashboard');
  } else {
    window.location.href = '../ManagerDashboard/preview.html';
  }
}
window.handleComingSoonDone = handleComingSoonDone;
</script>
`;

// 2. Update MyAttendance/preview.html
const myAttPath = 'EmergereApp/EmergereApp/src/screens/MyAttendance/preview.html';
let myAttHtml = fs.readFileSync(myAttPath, 'utf8');
if (!myAttHtml.includes('coming-soon-modal-overlay')) {
  // Inject style
  myAttHtml = myAttHtml.replace('</head>', `<style>${comingSoonModalStyles}</style></head>`);
  // Inject modal before closing .device
  const lastDeviceClose = myAttHtml.lastIndexOf('</div>');
  myAttHtml = myAttHtml.substring(0, lastDeviceClose) + comingSoonModalHtml + myAttHtml.substring(lastDeviceClose);
  // Inject script
  myAttHtml = myAttHtml.replace('</body>', `${employeeDoneScript}</body>`);
  fs.writeFileSync(myAttPath, myAttHtml, 'utf8');
  console.log('[OK] Updated', myAttPath);
}

// 3. Update TeamAttendance/preview.html
const teamAttPath = 'EmergereApp/EmergereApp/src/screens/TeamAttendance/preview.html';
let teamAttHtml = fs.readFileSync(teamAttPath, 'utf8');
if (!teamAttHtml.includes('coming-soon-modal-overlay')) {
  // Inject style
  teamAttHtml = teamAttHtml.replace('</head>', `<style>${comingSoonModalStyles}</style></head>`);
  // Inject modal before closing .device
  const lastDeviceClose = teamAttHtml.lastIndexOf('</div>');
  teamAttHtml = teamAttHtml.substring(0, lastDeviceClose) + comingSoonModalHtml + teamAttHtml.substring(lastDeviceClose);
  // Inject script
  teamAttHtml = teamAttHtml.replace('</body>', `${managerDoneScript}</body>`);
  fs.writeFileSync(teamAttPath, teamAttHtml, 'utf8');
  console.log('[OK] Updated', teamAttPath);
}

// 4. Update preview_app.html, index.html, EmergereApp/EmergereApp/preview_app.html, EmergereApp/EmergereApp/index.html
const htmlFiles = [
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'preview_app.html',
  'index.html'
];

htmlFiles.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');

  // A. Update tpl-MyAttendance template inside c
  const p1 = c.indexOf('id="tpl-MyAttendance"');
  if (p1 !== -1) {
    const end1 = c.indexOf('</template>', p1);
    let tpl1 = c.substring(p1, end1);
    if (!tpl1.includes('coming-soon-modal-overlay')) {
      // Add style in tpl1
      tpl1 = tpl1.replace('</style>', `${comingSoonModalStyles}\n      </style>`);
      // Add modal before <script> (which is right after </div></div> of device)
      const scrIdx = tpl1.indexOf('<script>');
      if (scrIdx !== -1) {
        tpl1 = tpl1.substring(0, scrIdx) + comingSoonModalHtml + '\n' + tpl1.substring(scrIdx);
      }
      // Add script inside tpl1 script
      const scrEnd = tpl1.lastIndexOf('</script>');
      if (scrEnd !== -1) {
        const empDoneFn = `\n        function handleComingSoonDone() {\n          var pWin = (window.parent && window.parent !== window) ? window.parent : window;\n          if (pWin.loadScreen) {\n            pWin.loadScreen('tpl-EmployeeDashboard');\n          } else if (typeof loadScreen === 'function') {\n            loadScreen('tpl-EmployeeDashboard');\n          } else {\n            window.location.href = '../EmployeeDashboard/preview.html';\n          }\n        }\n        window.handleComingSoonDone = handleComingSoonDone;\n`;
        tpl1 = tpl1.substring(0, scrEnd) + empDoneFn + tpl1.substring(scrEnd);
      }
      c = c.substring(0, p1) + tpl1 + c.substring(end1);
    }
  }

  // B. Update tpl-TeamAttendance template inside c
  const p2 = c.indexOf('id="tpl-TeamAttendance"');
  if (p2 !== -1) {
    const end2 = c.indexOf('</template>', p2);
    let tpl2 = c.substring(p2, end2);
    if (!tpl2.includes('coming-soon-modal-overlay')) {
      // Add style in tpl2
      tpl2 = tpl2.replace('</style>', `${comingSoonModalStyles}\n      </style>`);
      // Add modal before <script>
      const scrIdx = tpl2.indexOf('<script>');
      if (scrIdx !== -1) {
        tpl2 = tpl2.substring(0, scrIdx) + comingSoonModalHtml + '\n' + tpl2.substring(scrIdx);
      }
      // Add script inside tpl2 script
      const scrEnd = tpl2.lastIndexOf('</script>');
      if (scrEnd !== -1) {
        const mgrDoneFn = `\n        function handleComingSoonDone() {\n          var pWin = (window.parent && window.parent !== window) ? window.parent : window;\n          if (pWin.loadScreen) {\n            pWin.loadScreen('tpl-ManagerDashboard');\n          } else if (typeof loadScreen === 'function') {\n            loadScreen('tpl-ManagerDashboard');\n          } else {\n            window.location.href = '../ManagerDashboard/preview.html';\n          }\n        }\n        window.handleComingSoonDone = handleComingSoonDone;\n`;
        tpl2 = tpl2.substring(0, scrEnd) + mgrDoneFn + tpl2.substring(scrEnd);
      }
      c = c.substring(0, p2) + tpl2 + c.substring(end2);
    }
  }

  // C. Update top-level loadScreen hooks in c
  const myAttHook = `if (currentTpl === 'tpl-MyAttendance') {
            var myDoneBtn = doc.getElementById('coming-soon-done-btn');
            if (myDoneBtn) {
              myDoneBtn.onclick = function() { loadScreen('tpl-EmployeeDashboard'); };
            }
          }`;
  if (!c.includes('myDoneBtn') && c.includes("if (currentTpl === 'tpl-MyAttendance')")) {
    c = c.replace("if (currentTpl === 'tpl-MyAttendance') {", `if (currentTpl === 'tpl-MyAttendance') {\n            var myDoneBtn = doc.getElementById('coming-soon-done-btn');\n            if (myDoneBtn) {\n              myDoneBtn.onclick = function() { loadScreen('tpl-EmployeeDashboard'); };\n            }`);
  }

  const teamAttHook = `if (currentTpl === 'tpl-TeamAttendance') {
            var teamDoneBtn = doc.getElementById('coming-soon-done-btn');
            if (teamDoneBtn) {
              teamDoneBtn.onclick = function() { loadScreen('tpl-ManagerDashboard'); };
            }
          }`;
  if (!c.includes('teamDoneBtn') && c.includes("if (currentTpl === 'tpl-TeamAttendance')")) {
    c = c.replace("if (currentTpl === 'tpl-TeamAttendance') {", `if (currentTpl === 'tpl-TeamAttendance') {\n            var teamDoneBtn = doc.getElementById('coming-soon-done-btn');\n            if (teamDoneBtn) {\n              teamDoneBtn.onclick = function() { loadScreen('tpl-ManagerDashboard'); };\n            }`);
  }

  fs.writeFileSync(f, c, 'utf8');
  console.log('[OK] Updated templates and hooks in', f);
});

console.log('--- COMPLETED ATTENDANCE COMING SOON POPUP IMPLEMENTATION ---');
