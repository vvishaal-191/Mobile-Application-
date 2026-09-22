const fs = require('fs');
const path = require('path');

const actionGridHtml = `          <!-- 2x2 Action Cards from Image 2 -->
          <div class="dash-action-grid">
            <div class="dash-action-card" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ApplyLeave')}else if(typeof loadScreen==='function'){loadScreen('tpl-ApplyLeave')}">
              <div class="action-top">
                <div class="action-icon-wrap" style="background:#EEF4FF;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F6BFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><line x1="8" y1="14" x2="8.01" y2="14"></line><line x1="12" y1="14" x2="12.01" y2="14"></line><line x1="16" y1="14" x2="16.01" y2="14"></line><line x1="8" y1="18" x2="8.01" y2="18"></line><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                </div>
                <div class="action-chevron">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2F6BFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
              <div class="action-body">
                <div class="action-title">Apply Leave</div>
                <div class="action-sub">Plan your time off</div>
              </div>
            </div>

            <div class="dash-action-card" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ApplyPermission')}else if(typeof loadScreen==='function'){loadScreen('tpl-ApplyPermission')}">
              <div class="action-top">
                <div class="action-icon-wrap" style="background:#E6F9F0;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1FAE6E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                </div>
                <div class="action-chevron">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2F6BFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
              <div class="action-body">
                <div class="action-title">Apply Permission</div>
                <div class="action-sub">Request short leave</div>
              </div>
            </div>

            <div class="dash-action-card" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-LeaveHistory')}else if(typeof loadScreen==='function'){loadScreen('tpl-LeaveHistory')}">
              <div class="action-top">
                <div class="action-icon-wrap" style="background:#F1EDFD;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path><line x1="13" y1="13" x2="18" y2="13"></line><line x1="13" y1="17" x2="16" y2="17"></line></svg>
                </div>
                <div class="action-chevron">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2F6BFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
              <div class="action-body">
                <div class="action-title">My Requests</div>
                <div class="action-sub">Track your leaves & permissions</div>
              </div>
            </div>

            <div class="dash-action-card" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-HolidayCalendar')}else if(typeof loadScreen==='function'){loadScreen('tpl-HolidayCalendar')}">
              <div class="action-top">
                <div class="action-icon-wrap" style="background:#FFF1E5;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FA6400" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><circle cx="8" cy="14" r="1" fill="#FA6400"></circle><circle cx="12" cy="14" r="1" fill="#FA6400"></circle><circle cx="16" cy="14" r="1" fill="#FA6400"></circle><circle cx="8" cy="18" r="1" fill="#FA6400"></circle><circle cx="12" cy="18" r="1" fill="#FA6400"></circle></svg>
                </div>
                <div class="action-chevron">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2F6BFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
              <div class="action-body">
                <div class="action-title">Holiday Calendar</div>
                <div class="action-sub">View upcoming holidays</div>
              </div>
            </div>
          </div>`;

const actionGridCss = `
        /* 2x2 Action Cards from Image 2 */
        .dash-action-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 0 20px;
          margin: 0 0 16px;
        }

        .dash-action-card {
          background: #FFFFFF;
          border: 1px solid #EAEFF5;
          border-radius: 18px;
          padding: 16px 14px 14px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 126px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s ease;
          user-select: none;
        }

        .dash-action-card:hover {
          transform: translateY(-2px);
          border-color: #D3E0FF;
          box-shadow: 0 8px 24px rgba(47, 107, 255, 0.12), 0 2px 6px rgba(47, 107, 255, 0.04);
        }

        .dash-action-card:active {
          transform: translateY(0);
        }

        .action-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .action-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .action-chevron {
          width: 28px;
          height: 28px;
          border-radius: 14px;
          background: #EDF3FF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .dash-action-card:hover .action-chevron {
          background: #E0ECFF;
          transform: translateX(2px);
        }

        .action-body {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .action-title {
          font-size: 15px;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.2px;
          line-height: 1.25;
        }

        .action-sub {
          font-size: 12px;
          font-weight: 500;
          color: #6B7280;
          line-height: 1.35;
        }

        .card.request-card {
          border-radius: 18px;
          border: 1px solid #EAEFF5;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
          transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
          cursor: pointer;
        }

        .card.request-card:hover {
          border-color: #D3E0FF;
          box-shadow: 0 8px 20px rgba(47, 107, 255, 0.1), 0 2px 6px rgba(47, 107, 255, 0.04);
          transform: translateY(-2px);
        }
`;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. In tpl-EmployeeDashboard, replace the attendance card with actionGridHtml
  const attendanceCardRegex = /<div class="card" id="dash-attendance-card">[\s\S]*?<\/div>\s*<\/div>/;
  if (attendanceCardRegex.test(content)) {
    content = content.replace(attendanceCardRegex, actionGridHtml);
    console.log('Replaced attendance card in', filePath);
  } else {
    console.log('Attendance card regex did not match in', filePath);
  }

  // 2. Remove old QUICK ACTIONS label and quick-grid
  const oldQuickActionsRegex = /<p class="section-label">\s*QUICK ACTIONS\s*<\/p>\s*<div class="quick-grid">[\s\S]*?<\/div>/;
  if (oldQuickActionsRegex.test(content)) {
    content = content.replace(oldQuickActionsRegex, '');
    console.log('Removed old quick actions in', filePath);
  } else {
    console.log('Old quick actions regex did not match in', filePath);
  }

  // 3. Add CSS for action grid in tpl-EmployeeDashboard if not present
  if (!content.includes('.dash-action-grid')) {
    // Insert before </style> in tpl-EmployeeDashboard
    // Find tpl-EmployeeDashboard first
    const tplIdx = content.indexOf('id="tpl-EmployeeDashboard"');
    if (tplIdx !== -1) {
      const styleEndIdx = content.indexOf('</style>', tplIdx);
      if (styleEndIdx !== -1) {
        content = content.slice(0, styleEndIdx) + actionGridCss + content.slice(styleEndIdx);
        console.log('Added actionGridCss in', filePath);
      }
    }
  }

  // 4. Update the injected style for tpl-EmployeeDashboard
  // Replace:
  // #dash-attendance-card, #dash-attendance-card:hover,
  // #dash-leave-balance-card, #dash-leave-balance-card:hover {
  //   border: 1px solid var(--border, #E5E7EB) !important;
  //   ...
  // }
  const injectedStyleOld = /#dash-attendance-card,\s*#dash-attendance-card:hover,\s*#dash-leave-balance-card,\s*#dash-leave-balance-card:hover\s*\{[\s\S]*?\}/;
  const injectedStyleNew = `#dash-leave-balance-card, #dash-leave-balance-card:hover {
                background: #FFFFFF !important;
                border: 1px solid #EAEFF5 !important;
                border-radius: 18px !important;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02) !important;
                transform: none !important;
                cursor: default !important;
              }`;
  if (injectedStyleOld.test(content)) {
    content = content.replace(injectedStyleOld, injectedStyleNew);
    console.log('Updated injectedStyle in', filePath);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

const files = [
  path.join(__dirname, '..', 'preview_app.html'),
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'preview_app.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'index.html'),
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    processFile(f);
  } else {
    console.log('File not found:', f);
  }
});
