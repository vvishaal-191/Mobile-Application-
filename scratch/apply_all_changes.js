const fs = require('fs');

console.log('Starting full updates across codebase...');

const newLadTpl = fs.readFileSync('scratch/new_lad_template.html', 'utf8').trim();

// 1. Files containing the SPA (index.html, preview_app.html, EmergereApp index/preview)
const spaFiles = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

const oldStatCardRegex = /<!--\s*4\.\s*Team Members\s*-->[\s\S]*?<div class="stat-lbl">Team<br>Members<\/div>[\s\S]*?<\/div>/;

const newStatCardHtml = `<!-- 4. Request Detail -->
        <div class="stat-item stat-members" onclick="handleCardNav('tpl-LeaveApprovalDetail', 'priya')">
          <div class="stat-item-top">
            <div class="stat-icon-circle" style="background: #EDE9FE;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <line x1="10" y1="9" x2="8" y2="9"></line>
              </svg>
            </div>
          </div>
          <div class="stat-num" id="mgr-stat-members" style="color: #7C3AED;">12</div>
          <div class="stat-lbl">Request<br>Detail</div>
          <svg class="stat-wave-bg" viewBox="0 0 80 26" fill="none" preserveAspectRatio="none">
            <path d="M0 10 C 26 4 54 18 80 11 V 26 H 0 Z" fill="#E9D5FF" fill-opacity="0.85"/>
          </svg>
        </div>`;

const oldHandleCardNavInMgrDash = `    function handleCardNav(screenId) {
      const pWin = (window.parent && window.parent !== window) ? window.parent : window;
      if (pWin.loadScreen) {
        pWin.loadScreen(screenId);
      } else if (typeof loadScreen === 'function') {
        loadScreen(screenId);
      }
    }`;

const newHandleCardNavInMgrDash = `    function handleCardNav(screenId, personKey) {
      const pWin = (window.parent && window.parent !== window) ? window.parent : window;
      if (pWin.loadScreen) {
        pWin.loadScreen(screenId, personKey || (screenId === 'tpl-LeaveApprovalDetail' ? 'priya' : undefined));
      } else if (typeof loadScreen === 'function') {
        loadScreen(screenId, personKey || (screenId === 'tpl-LeaveApprovalDetail' ? 'priya' : undefined));
      }
    }`;

const newLoadScreenLadBlock = `          if (currentTpl === 'tpl-LeaveApprovalDetail') {
            var p = (SELECTED_PERSON && PERSON_DATA[SELECTED_PERSON]) || window.LATEST_REQUEST || PERSON_DATA['priya'];
            var empProf = window.USER_PROFILE || {};
            var dashboardEmpName = empProf.name || 'Priya Sharma';

            // Only override if employee is explicitly viewing their own request from employee dashboard
            if (window.AUTH_USER && window.AUTH_USER.role === 'employee' && (p.isSelf || !p.name)) {
              p.name = dashboardEmpName;
              p.role = empProf.role || p.role || 'Senior Software Engineer';
              p.empId = empProf.employeeId || p.empId || 'EMP-2024-0156';
              p.initials = empProf.initials || (dashboardEmpName.trim().split(/\\s+/).map(function(w){return w[0];}).join('').toUpperCase().slice(0, 2)) || 'PS';
              p.appliedPath = dashboardEmpName.split(' ')[0] + ' (Applied)';
            }

            var isPerm = !!(p.isPermission || p.duration || p.type === 'Early Going' || p.type === 'Late Coming' || p.leaveType === 'Early Going' || p.leaveType === 'Late Coming' || p.permissionType);

            var elName = doc.getElementById('lad-name'); if (elName) elName.textContent = p.name;
            var elRole = doc.getElementById('lad-role'); if (elRole) elRole.textContent = p.role;
            var elEmpId = doc.getElementById('lad-empid'); if (elEmpId) elEmpId.textContent = p.empId;
            var elAvatar = doc.getElementById('lad-avatar'); if (elAvatar) elAvatar.textContent = p.initials;
            var elSubtitle = doc.getElementById('lad-subtitle'); if (elSubtitle) elSubtitle.textContent = p.subtitle || ((p.leaveType || p.type || (isPerm ? 'Permission' : 'Leave')) + ' Application');
            var elApplied = doc.getElementById('lad-applied-path');
            var elAppliedName = doc.getElementById('lad-applied-name');
            if (elAppliedName && p.name) elAppliedName.textContent = p.name.split(' ')[0];
            if (elApplied) elApplied.textContent = 'Applied';

            var elSecTitle = doc.getElementById('lad-section-title');
            var elTypeLabel = doc.getElementById('lad-type-label');
            var elLeaveType = doc.getElementById('lad-leavetype') || doc.getElementById('lad-type-val');
            var elFromLabel = doc.getElementById('lad-from-label');
            var elFromDate = doc.getElementById('lad-fromdate') || doc.getElementById('lad-from-val');
            var elRowToDate = doc.getElementById('lad-row-todate') || doc.getElementById('lad-row-to');
            var elToLabel = doc.getElementById('lad-to-label');
            var elToDate = doc.getElementById('lad-todate') || doc.getElementById('lad-to-val');
            var elDurLabel = doc.getElementById('lad-duration-label') || doc.getElementById('lad-dur-label');
            var elTotalDays = doc.getElementById('lad-totaldays') || doc.getElementById('lad-dur-val');
            var elContactLabel = doc.getElementById('lad-contact-label');
            var elContact = doc.getElementById('lad-contact') || doc.getElementById('lad-contact-val');
            var elRowContact = doc.getElementById('lad-row-contact');
            var elReasonLabel = doc.getElementById('lad-reason-label');
            var elReason = doc.getElementById('lad-reason') || doc.getElementById('lad-reason-val');

            if (isPerm) {
              if (elSecTitle) elSecTitle.textContent = 'Permission Details';
              if (elTypeLabel) elTypeLabel.textContent = 'Permission Type';
              if (elLeaveType) elLeaveType.textContent = p.leaveType || p.type || 'Late Coming';
              if (elFromLabel) elFromLabel.textContent = 'Date';
              if (elFromDate) elFromDate.textContent = p.schedule || p.fromDate || p.date || 'Sep 04 (10:00 - 10:30 AM)';
              if (elRowToDate) elRowToDate.style.display = 'none';
              if (elDurLabel) elDurLabel.textContent = 'Duration';
              if (elTotalDays) elTotalDays.textContent = p.duration || p.totalDays || '30 Mins';
              if (elRowContact) elRowContact.style.display = 'none';
              if (elReasonLabel) elReasonLabel.textContent = 'Reason for Permission';
              if (elReason) elReason.textContent = p.reason || 'Doctor appointment checkup';
            } else {
              if (elSecTitle) elSecTitle.textContent = 'Leave Details';
              if (elTypeLabel) elTypeLabel.textContent = 'Leave Type';
              if (elLeaveType) elLeaveType.textContent = p.leaveType || 'Casual Leave';
              if (elFromLabel) elFromLabel.textContent = 'From Date';
              if (elFromDate) elFromDate.textContent = p.fromDate || 'Sep 10, 2026';
              if (elRowToDate) elRowToDate.style.display = 'flex';
              if (elToLabel) elToLabel.textContent = 'To Date';
              if (elToDate) elToDate.textContent = p.toDate || 'Sep 11, 2026';
              if (elDurLabel) elDurLabel.textContent = 'Total Days';
              if (elTotalDays) elTotalDays.textContent = p.totalDays || '2 Days';
              if (elRowContact) elRowContact.style.display = 'flex';
              if (elContactLabel) elContactLabel.textContent = 'Emergency Contact';
              if (elContact) elContact.textContent = p.emergencyContact || p.contact || empProf.phone || '+91 98765 43210';
              if (elReasonLabel) elReasonLabel.textContent = 'Reason for Leave';
              if (elReason) elReason.textContent = p.reason || "Family function - attending sister's wedding ceremony in Bangalore.";
            }

            // Update Approval Path node for Manager
            var mgrPath = doc.getElementById('lad-manager-path');
            var rawStatus = (p && p.status) || (window.LAST_LEAVE_DECISION && (window.LAST_LEAVE_DECISION.personKey === SELECTED_PERSON || (SELECTED_PERSON === 'priya' && window.LAST_LEAVE_DECISION.personKey === 'priya')) ? window.LAST_LEAVE_DECISION.status : null);
            var dec = (rawStatus || '').toLowerCase();
            if (mgrPath && dec && dec !== 'pending') {
              if (dec === 'approved') {
                mgrPath.className = 'step-pill applied';
                mgrPath.style.background = '#DCFCE7';
                mgrPath.style.color = '#15803D';
                mgrPath.textContent = 'Approved';
              } else if (dec === 'rejected') {
                mgrPath.className = 'step-pill';
                mgrPath.style.background = '#FEE2E2';
                mgrPath.style.color = '#DC2626';
                mgrPath.textContent = 'Rejected';
              }
            }

            // Update decision action buttons if status is already decided
            var btnRow = doc.getElementById('lad-btn-row');
            if (btnRow && dec && dec !== 'pending') {
              var isApp = (dec === 'approved');
              btnRow.innerHTML = '<div style="display:flex;flex-direction:column;gap:10px;width:100%;">'
                + '<div style="text-align:center;padding:12px;border-radius:12px;font-weight:700;font-size:14px;background:' + (isApp ? '#DCFCE7' : '#FEE2E2') + ';color:' + (isApp ? '#15803D' : '#DC2626') + ';border:1px solid ' + (isApp ? '#86EFAC' : '#FCA5A5') + ';">'
                + (isApp ? '✓ Approved by Manager' : '✕ Rejected by Manager')
                + '</div>'
                + '<div style="display:flex;gap:10px;">'
                + '<button class="btn-action ' + (isApp ? 'btn-reject' : 'btn-approve') + '" style="flex:1;height:40px;font-size:13px;" onclick="handleDetailLeaveDecision(\\'' + (isApp ? 'rejected' : 'approved') + '\\')">Change to ' + (isApp ? 'Reject' : 'Approve') + '</button>'
                + '<button class="btn-action" style="flex:1;height:40px;font-size:13px;background:#1D68F2;color:#FFFFFF;border:none;" onclick="if(window.parent&&window.parent.loadScreen)window.parent.loadScreen(\\'tpl-ManagerDashboard\\');else if(typeof loadScreen===\\'function\\')loadScreen(\\'tpl-ManagerDashboard\\');">Done →</button>'
                + '</div>'
                + '</div>';
            }

            // Wire back button
            var backBtn = doc.querySelector('.back-btn-circle') || doc.querySelector('.back-btn');
            if (backBtn) {
              backBtn.style.cursor = 'pointer';
              backBtn.onclick = function() {
                if (window.AUTH_USER && window.AUTH_USER.role === 'manager') {
                  loadScreen('tpl-ManagerDashboard');
                } else {
                  loadScreen('tpl-EmployeeDashboard');
                }
              };
            }
          }`;

spaFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log('Skipping non-existent:', file);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');
  console.log(`Processing ${file}...`);

  // 1. Replace 4th stat card
  if (oldStatCardRegex.test(content)) {
    content = content.replace(oldStatCardRegex, newStatCardHtml);
    console.log(`  [OK] Replaced stat card in ${file}`);
  } else {
    console.log(`  [WARN] Stat card regex did not match in ${file}`);
  }

  // 2. Replace handleCardNav in tpl-ManagerDashboard
  if (content.includes(oldHandleCardNavInMgrDash)) {
    content = content.replace(oldHandleCardNavInMgrDash, newHandleCardNavInMgrDash);
    console.log(`  [OK] Replaced handleCardNav in ${file}`);
  } else {
    console.log(`  [INFO] oldHandleCardNavInMgrDash exact string not found, checking variations in ${file}`);
    content = content.replace(
      /function handleCardNav\(screenId\)\s*\{\s*const pWin = \(window\.parent && window\.parent !== window\)\s*\?\s*window\.parent\s*:\s*window;\s*if\s*\(pWin\.loadScreen\)\s*\{\s*pWin\.loadScreen\(screenId\);\s*\}\s*else if\s*\(typeof loadScreen === 'function'\)\s*\{\s*loadScreen\(screenId\);\s*\}\s*\}/g,
      newHandleCardNavInMgrDash
    );
  }

  // 3. Replace tpl-LeaveApprovalDetail template
  const ladStart = content.indexOf('<template id="tpl-LeaveApprovalDetail">');
  if (ladStart !== -1) {
    const ladEnd = content.indexOf('</template>', ladStart);
    if (ladEnd !== -1) {
      content = content.substring(0, ladStart) + newLadTpl + content.substring(ladEnd + 11);
      console.log(`  [OK] Replaced tpl-LeaveApprovalDetail in ${file}`);
    }
  } else {
    console.log(`  [WARN] tpl-LeaveApprovalDetail not found in ${file}`);
  }

  // 4. Replace loadScreen LeaveApprovalDetail block
  const lsLadStart = content.indexOf("if (currentTpl === 'tpl-LeaveApprovalDetail') {");
  if (lsLadStart !== -1) {
    let depth = 0;
    let lsLadEnd = -1;
    for (let i = lsLadStart; i < content.length; i++) {
      if (content[i] === '{') depth++;
      else if (content[i] === '}') {
        depth--;
        if (depth === 0) {
          lsLadEnd = i;
          break;
        }
      }
    }
    if (lsLadEnd !== -1) {
      content = content.substring(0, lsLadStart) + newLoadScreenLadBlock + content.substring(lsLadEnd + 1);
      console.log(`  [OK] Replaced loadScreen LeaveApprovalDetail block in ${file}`);
    }
  } else {
    console.log(`  [WARN] loadScreen LeaveApprovalDetail block not found in ${file}`);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`  Saved ${file}, length: ${content.length}`);
});

// 2. ManagerDashboard standalone preview.html
const mgrDashPreview = 'EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html';
if (fs.existsSync(mgrDashPreview)) {
  let content = fs.readFileSync(mgrDashPreview, 'utf8');
  if (oldStatCardRegex.test(content)) {
    content = content.replace(oldStatCardRegex, newStatCardHtml);
    console.log(`[OK] Replaced stat card in ${mgrDashPreview}`);
  }
  content = content.replace(
    /function handleCardNav\(screenId\)\s*\{/g,
    'function handleCardNav(screenId, personKey) {'
  );
  content = content.replace(
    /pWin\.loadScreen\(screenId\);/g,
    'pWin.loadScreen(screenId, personKey || (screenId === "tpl-LeaveApprovalDetail" ? "priya" : undefined));'
  );
  content = content.replace(
    /loadScreen\(screenId\);/g,
    'loadScreen(screenId, personKey || (screenId === "tpl-LeaveApprovalDetail" ? "priya" : undefined));'
  );
  fs.writeFileSync(mgrDashPreview, content, 'utf8');
  console.log(`Saved ${mgrDashPreview}`);
}

// 3. ManagerDashboard preview.js
const mgrDashPreviewJs = 'EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.js';
if (fs.existsSync(mgrDashPreviewJs)) {
  let content = fs.readFileSync(mgrDashPreviewJs, 'utf8');
  // Update screenMap
  if (!content.includes("'tpl-LeaveApprovalDetail'")) {
    content = content.replace(
      "'tpl-LeaveApprovals': '../LeaveApprovals/preview.html',",
      "'tpl-LeaveApprovals': '../LeaveApprovals/preview.html',\n        'tpl-LeaveApprovalDetail': '../LeaveApprovalDetail/preview.html',"
    );
  }
  content = content.replace(
    'function handleSidebarNav(screenId) {',
    'function handleSidebarNav(screenId, personKey) {'
  );
  content = content.replace(
    'pWin.loadScreen(screenId);',
    'pWin.loadScreen(screenId, personKey);'
  );
  content = content.replace(
    'loadScreen(screenId);',
    'loadScreen(screenId, personKey);'
  );
  content = content.replace(
    'if (screenMap[screenId]) window.location.href = screenMap[screenId];',
    'if (screenMap[screenId]) { var q = personKey ? "?person=" + encodeURIComponent(personKey) : ""; window.location.href = screenMap[screenId] + q; }'
  );
  content = content.replace(
    'function handleCardNav(screenId) {\n  handleSidebarNav(screenId);\n}',
    'function handleCardNav(screenId, personKey) {\n  handleSidebarNav(screenId, personKey || (screenId === "tpl-LeaveApprovalDetail" ? "priya" : undefined));\n}'
  );
  fs.writeFileSync(mgrDashPreviewJs, content, 'utf8');
  console.log(`Saved ${mgrDashPreviewJs}`);
}

// 4. ManagerDashboardScreen.jsx
const mgrDashJsx = 'EmergereApp/EmergereApp/src/screens/ManagerDashboard/ManagerDashboardScreen.jsx';
if (fs.existsSync(mgrDashJsx)) {
  let content = fs.readFileSync(mgrDashJsx, 'utf8');
  content = content.replace(
    "{ key: 'members', value: '12', label: 'Team\\nMembers', icon: 'users', color: '#7C3AED', haloBg: '#EDE9FE', cardBg: '#FAF5FF', numColor: '#7C3AED', borderColor: '#E9D8FE', target: 'TeamAttendance' },",
    "{ key: 'requestDetail', value: '12', label: 'Request\\nDetail', icon: 'file-text', color: '#7C3AED', haloBg: '#EDE9FE', cardBg: '#FAF5FF', numColor: '#7C3AED', borderColor: '#E9D8FE', target: 'LeaveApprovalDetail' },"
  );
  fs.writeFileSync(mgrDashJsx, content, 'utf8');
  console.log(`Saved ${mgrDashJsx}`);
}

// 5. LeaveApprovalDetail standalone preview.html & preview.css
const ladPreviewHtml = 'EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/preview.html';
const testLadNew = fs.readFileSync('scratch/test_lad_new.html', 'utf8');
fs.writeFileSync(ladPreviewHtml, testLadNew, 'utf8');
console.log(`Saved ${ladPreviewHtml}`);

console.log('All changes applied successfully!');
