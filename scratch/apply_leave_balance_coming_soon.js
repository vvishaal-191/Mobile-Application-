const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '../preview_app.html'),
  path.join(__dirname, '../index.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/preview_app.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/index.html')
];

const cssToAdd = `
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

const modalHtmlToAdd = `
        <!-- Coming Soon Popup Modal -->
        <div class="coming-soon-modal-overlay" id="leave-balance-coming-soon-modal" onclick="if(event.target===this)handleComingSoonDone()">
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

const scriptToAdd = `
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
`;

for (const filePath of files) {
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist:', filePath);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Find tpl-LeaveBalance
  const tplStart = content.indexOf('<template id="tpl-LeaveBalance">');
  if (tplStart === -1) {
    console.log('tpl-LeaveBalance not found in', filePath);
    continue;
  }
  const tplEnd = content.indexOf('</template>', tplStart);
  if (tplEnd === -1) {
    console.log('tpl-LeaveBalance closing not found in', filePath);
    continue;
  }

  let tplContent = content.substring(tplStart, tplEnd);

  // 1. Add CSS before </style> inside tpl-LeaveBalance if not already added
  if (!tplContent.includes('.coming-soon-modal-overlay')) {
    const styleEndIdx = tplContent.lastIndexOf('</style>');
    if (styleEndIdx !== -1) {
      tplContent = tplContent.substring(0, styleEndIdx) + cssToAdd + tplContent.substring(styleEndIdx);
    }
  }

  // 2. Add Modal markup before the last </div> before <script> (closing .device) if not already added
  if (!tplContent.includes('id="leave-balance-coming-soon-modal"')) {
    const scriptStartIdx = tplContent.indexOf('<script>');
    if (scriptStartIdx !== -1) {
      const beforeScript = tplContent.substring(0, scriptStartIdx);
      const afterScript = tplContent.substring(scriptStartIdx);
      const lastDivIdx = beforeScript.lastIndexOf('</div>');
      if (lastDivIdx !== -1) {
        tplContent = beforeScript.substring(0, lastDivIdx) + modalHtmlToAdd + beforeScript.substring(lastDivIdx) + afterScript;
      }
    }
  }

  // 3. Add handleComingSoonDone script inside <script> if not already added
  if (!tplContent.includes('handleComingSoonDone')) {
    const scriptStartIdx = tplContent.indexOf('<script>');
    if (scriptStartIdx !== -1) {
      tplContent = tplContent.replace('<script>', '<script>' + scriptToAdd);
    }
  }

  content = content.substring(0, tplStart) + tplContent + content.substring(tplEnd);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated:', filePath);
}
