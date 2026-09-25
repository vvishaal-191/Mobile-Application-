const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'preview_app.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'index.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'preview_app.html')
];

// 1. MyProfile Back Nav Fix
const oldProfileBackNav = `  function handleProfileBackNav() {
    var parentWin = window.parent || window;
    if (parentWin.loadScreen) {
      parentWin.loadScreen('tpl-EmployeeDashboard');
    } else if (typeof loadScreen === 'function') {
      loadScreen('tpl-EmployeeDashboard');
    } else {
      location.href = '../EmployeeDashboard/preview.html';
    }
  }`;

const newProfileBackNav = `  function handleProfileBackNav() {
    var parentWin = (window.parent && window.parent !== window) ? window.parent : window;
    var isManager = false;
    try {
      if (parentWin.AUTH_USER && parentWin.AUTH_USER.role === 'manager') isManager = true;
      else if (window.AUTH_USER && window.AUTH_USER.role === 'manager') isManager = true;
      else if (parentWin.USER_PROFILE && (parentWin.USER_PROFILE.role || '').toLowerCase().indexOf('manager') !== -1) isManager = true;
      else if (window.USER_PROFILE && (window.USER_PROFILE.role || '').toLowerCase().indexOf('manager') !== -1) isManager = true;
      else if (localStorage.getItem('user_role') === 'manager' || localStorage.getItem('auth_role') === 'manager') isManager = true;
    } catch(e) {}

    var targetScreen = isManager ? 'tpl-ManagerDashboard' : 'tpl-EmployeeDashboard';
    var targetPath = isManager ? '../ManagerDashboard/preview.html' : '../EmployeeDashboard/preview.html';

    if (parentWin.loadScreen) {
      parentWin.loadScreen(targetScreen);
    } else if (typeof loadScreen === 'function') {
      loadScreen(targetScreen);
    } else {
      location.href = targetPath;
    }
  }`;

// 2. MyProfile History Tab Handler Fix
const oldHistoryTabHandler = `    } else if (target === 'history') {
      if (isManager) {
        alert('Access Restricted: Manager account is not authorized to access My Requests (History).');
        return;
      }
      if (parentWin.loadScreen) {
        parentWin.loadScreen('tpl-LeaveHistory');
      } else if (typeof loadScreen === 'function') {
        loadScreen('tpl-LeaveHistory');
      } else if (typeof navTo === 'function') {
        navTo('History');
      } else {
        window.location.href = '../LeaveHistory/preview.html';
      }
    }`;

const newHistoryTabHandler = `    } else if (target === 'history') {
      if (isManager) {
        var mScreen = 'tpl-HolidayCalendar';
        if (parentWin.loadScreen) {
          parentWin.loadScreen(mScreen);
        } else if (typeof loadScreen === 'function') {
          loadScreen(mScreen);
        } else {
          window.location.href = '../HolidayCalendar/preview.html';
        }
        return;
      }
      if (parentWin.loadScreen) {
        parentWin.loadScreen('tpl-LeaveHistory');
      } else if (typeof loadScreen === 'function') {
        loadScreen('tpl-LeaveHistory');
      } else if (typeof navTo === 'function') {
        navTo('History');
      } else {
        window.location.href = '../LeaveHistory/preview.html';
      }
    }`;

// 3. New Manager Dashboard Stat Cards CSS (Image 3)
const oldMgrStatsCss = `    /* ── Top 4 Stat Cards Row ── */
    .mgr-stats-card {
      background: #FFFFFF;
      border-radius: 20px;
      padding: 12px 8px;
      margin: -24px 16px 14px 16px;
      position: relative;
      z-index: 10;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
      border: 1px solid #F1F5F9;
    }

    .stat-item {
      background: #FFFFFF;
      border: 1px solid #F1F5F9;
      border-radius: 14px;
      padding: 8px 6px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .stat-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .stat-item-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
    }

    .stat-icon-box {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-chevron {
      color: #CBD5E1;
      font-size: 11px;
    }

    .stat-num {
      font-size: 19px;
      font-weight: 800;
      color: #0F172A;
      line-height: 1.1;
      margin-bottom: 3px;
      position: relative;
      z-index: 2;
    }

    .stat-lbl {
      font-size: 10px;
      font-weight: 600;
      color: #64748B;
      line-height: 1.25;
      position: relative;
      z-index: 2;
    }

    .stat-wave-bg {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 26px;
      pointer-events: none;
      z-index: 1;
      opacity: 0.65;
    }`;

const newMgrStatsCss = `    /* ── Top 4 Stat Cards Row matching Image 3 ── */
    .mgr-stats-card {
      background: #FFFFFF;
      border-radius: 20px;
      padding: 10px 8px;
      margin: -24px 16px 14px 16px;
      position: relative;
      z-index: 10;
      box-shadow: 0 10px 25px rgba(0, 40, 140, 0.08);
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 7px;
      border: 1px solid rgba(226, 232, 240, 0.85);
    }

    .stat-item {
      border-radius: 16px;
      padding: 10px 6px 12px 7px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .stat-item.stat-pending {
      background: linear-gradient(180deg, #F0F6FF 0%, #E2EDFE 100%);
      border: 1px solid #D6E6FE;
    }

    .stat-item.stat-approved {
      background: linear-gradient(180deg, #F0FDF4 0%, #E0F9E9 100%);
      border: 1px solid #CEF3D8;
    }

    .stat-item.stat-rejected {
      background: linear-gradient(180deg, #FEF2F2 0%, #FEE5E5 100%);
      border: 1px solid #FCD4D4;
    }

    .stat-item.stat-members {
      background: linear-gradient(180deg, #FAF5FF 0%, #F2E7FE 100%);
      border: 1px solid #E9D8FE;
    }

    .stat-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    }

    .stat-item-top {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 8px;
    }

    .stat-icon-circle {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-num {
      font-size: 21px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 4px;
      position: relative;
      z-index: 2;
    }

    .stat-lbl {
      font-size: 10px;
      font-weight: 600;
      color: #334155;
      line-height: 1.25;
      position: relative;
      z-index: 2;
    }

    .stat-wave-bg {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 26px;
      pointer-events: none;
      z-index: 1;
    }`;

// 4. New Manager Dashboard Stat Cards HTML (Image 3)
const oldMgrStatsHtmlRegex = /<!-- Top 4 Stat Cards Row matching Image 2 -->[\s\S]*?<div class="mgr-stats-card">[\s\S]*?<\/div>[\s\S]*?<!-- Quick Actions Section/;

const newMgrStatsHtmlReplacement = `<!-- Top 4 Stat Cards Row matching Image 3 -->
      <div class="mgr-stats-card">
        <!-- 1. Pending Requests -->
        <div class="stat-item stat-pending" onclick="handleCardNav('tpl-LeaveApprovals')">
          <div class="stat-item-top">
            <div class="stat-icon-circle" style="background: #DBEAFE;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="8" y1="12" x2="14" y2="12"></line>
                <line x1="8" y1="16" x2="12" y2="16"></line>
                <circle cx="18" cy="18" r="3" stroke="#0066FF" stroke-width="2.3"></circle>
              </svg>
            </div>
          </div>
          <div class="stat-num" id="mgr-stat-pending" style="color: #0066FF;">18</div>
          <div class="stat-lbl">Pending<br>Requests</div>
          <svg class="stat-wave-bg" viewBox="0 0 80 26" fill="none" preserveAspectRatio="none">
            <path d="M0 14 C 22 24 55 4 80 12 V 26 H 0 Z" fill="#BFDBFE" fill-opacity="0.8"/>
          </svg>
        </div>

        <!-- 2. Approved This Month -->
        <div class="stat-item stat-approved" onclick="handleCardNav('tpl-LeaveApprovals')">
          <div class="stat-item-top">
            <div class="stat-icon-circle" style="background: #DCFCE7;">
              <div style="width: 22px; height: 22px; border-radius: 50%; background: #00A859; display: flex; align-items: center; justify-content: center;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>
          </div>
          <div class="stat-num" id="mgr-stat-approved" style="color: #00A859;">24</div>
          <div class="stat-lbl">Approved<br>This Month</div>
          <svg class="stat-wave-bg" viewBox="0 0 80 26" fill="none" preserveAspectRatio="none">
            <path d="M0 12 C 25 4 52 20 80 8 V 26 H 0 Z" fill="#BBF7D0" fill-opacity="0.85"/>
          </svg>
        </div>

        <!-- 3. Rejected This Month -->
        <div class="stat-item stat-rejected" onclick="handleCardNav('tpl-LeaveApprovals')">
          <div class="stat-item-top">
            <div class="stat-icon-circle" style="background: #FEE2E2;">
              <div style="width: 22px; height: 22px; border-radius: 50%; background: #EF4444; display: flex; align-items: center; justify-content: center;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </div>
            </div>
          </div>
          <div class="stat-num" id="mgr-stat-rejected" style="color: #EF4444;">3</div>
          <div class="stat-lbl">Rejected<br>This Month</div>
          <svg class="stat-wave-bg" viewBox="0 0 80 26" fill="none" preserveAspectRatio="none">
            <path d="M0 16 C 28 22 55 8 80 14 V 26 H 0 Z" fill="#FECDD3" fill-opacity="0.85"/>
          </svg>
        </div>

        <!-- 4. Team Members -->
        <div class="stat-item stat-members" onclick="handleCardNav('tpl-TeamAttendance')">
          <div class="stat-item-top">
            <div class="stat-icon-circle" style="background: #EDE9FE;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
          <div class="stat-num" id="mgr-stat-members" style="color: #7C3AED;">12</div>
          <div class="stat-lbl">Team<br>Members</div>
          <svg class="stat-wave-bg" viewBox="0 0 80 26" fill="none" preserveAspectRatio="none">
            <path d="M0 10 C 26 4 54 18 80 11 V 26 H 0 Z" fill="#E9D5FF" fill-opacity="0.85"/>
          </svg>
        </div>
      </div>

      <!-- Quick Actions Section`;

targetFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. Back nav fix
  if (content.includes(oldProfileBackNav)) {
    content = content.replace(oldProfileBackNav, newProfileBackNav);
    modified = true;
    console.log('Updated Profile Back Nav in:', path.basename(filePath));
  } else {
    console.warn('oldProfileBackNav not matched exactly in:', path.basename(filePath));
  }

  // 2. History tab fix
  if (content.includes(oldHistoryTabHandler)) {
    content = content.replace(oldHistoryTabHandler, newHistoryTabHandler);
    modified = true;
    console.log('Updated Profile History Tab in:', path.basename(filePath));
  } else {
    console.warn('oldHistoryTabHandler not matched exactly in:', path.basename(filePath));
  }

  // 3. Stats CSS fix
  if (content.includes(oldMgrStatsCss)) {
    content = content.replace(oldMgrStatsCss, newMgrStatsCss);
    modified = true;
    console.log('Updated Manager Stats CSS in:', path.basename(filePath));
  } else {
    console.warn('oldMgrStatsCss not matched exactly in:', path.basename(filePath));
  }

  // 4. Stats HTML fix
  if (oldMgrStatsHtmlRegex.test(content)) {
    content = content.replace(oldMgrStatsHtmlRegex, newMgrStatsHtmlReplacement);
    modified = true;
    console.log('Updated Manager Stats HTML in:', path.basename(filePath));
  } else {
    console.warn('oldMgrStatsHtmlRegex not matched in:', path.basename(filePath));
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully saved:', filePath);
  }
});
