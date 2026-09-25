const fs = require('fs');

console.log('Writing apply script for Manager Dashboard enhancements...');

const syncCode = fs.readFileSync('scratch/sync_mgr_code.js', 'utf8');

const spaFiles = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

spaFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  console.log(`Updating ${file}...`);
  let content = fs.readFileSync(file, 'utf8');

  // 1. Inject syncManagerDashboard into tpl-ManagerDashboard <script>
  if (!content.includes('function syncManagerDashboard(')) {
    content = content.replace(
      'function openNotificationsFromManager() {\n      handleCardNav(\'tpl-Notifications\');\n    }',
      `function openNotificationsFromManager() {\n      handleCardNav('tpl-Notifications');\n    }\n\n${syncCode}\n\n    window.addEventListener('DOMContentLoaded', function() {\n      syncManagerDashboard(document);\n    });\n    setTimeout(function() {\n      syncManagerDashboard(document);\n    }, 50);`
    );
    console.log(`  [OK] Injected syncManagerDashboard into tpl-ManagerDashboard in ${file}`);
  }

  // 2. Also inject syncManagerDashboard in global SPA script if not present
  if (!content.includes('window.syncManagerDashboard = syncManagerDashboard;')) {
    content = content.replace(
      'window.getActiveLeaveInfo = getActiveLeaveInfo;',
      `window.getActiveLeaveInfo = getActiveLeaveInfo;\n${syncCode}\nwindow.syncManagerDashboard = syncManagerDashboard;`
    );
    console.log(`  [OK] Injected syncManagerDashboard globally in ${file}`);
  }

  // 3. In loadScreen, call syncManagerDashboard when loading tpl-ManagerDashboard
  if (!content.includes("if (currentTpl === 'tpl-ManagerDashboard') {")) {
    content = content.replace(
      "if (currentTpl === 'tpl-LeaveApprovalDetail') {",
      `if (currentTpl === 'tpl-ManagerDashboard') {\n            if (typeof syncManagerDashboard === 'function') {\n              syncManagerDashboard(doc);\n            }\n          }\n\n          if (currentTpl === 'tpl-LeaveApprovalDetail') {`
    );
    console.log(`  [OK] Added tpl-ManagerDashboard hook in loadScreen in ${file}`);
  }

  // 4. Update tpl-ApplyPermission to increment notification count on Permission Approvals card (Image 2)
  if (content.includes('function handleApplyPermissionSubmit()') && !content.includes('parentWin.MGR_NOTIFICATION_COUNT')) {
    content = content.replace(
      "var newId = 'perm-' + Date.now();",
      `var newId = 'perm-' + Date.now();
          var parentDoc = (window.parent && window.parent.document) ? window.parent.document : document;
          var parentWin = window.parent || window;
          parentWin.MGR_NOTIFICATION_COUNT = (parentWin.MGR_NOTIFICATION_COUNT || 0) + 1;
          var mgrTpl = parentDoc.getElementById('tpl-ManagerDashboard');
          if (mgrTpl) {
            var mgrHtml = mgrTpl.innerHTML;
            mgrHtml = mgrHtml.replace(/class="qbadge" id="manager-dash-perm-badge">[0-9]+/, function(m) {
              var c = parseInt(m.replace('class="qbadge" id="manager-dash-perm-badge">', ''), 10) || 0;
              return 'class="qbadge" id="manager-dash-perm-badge">' + (c + 1);
            });
            mgrTpl.innerHTML = mgrHtml;
          }
          var livePermBadge = parentDoc.getElementById('manager-dash-perm-badge') || document.getElementById('manager-dash-perm-badge');
          if (livePermBadge) {
            var curPermVal = parseInt(livePermBadge.textContent, 10) || 0;
            livePermBadge.textContent = String(curPermVal + 1);
          }
          if (typeof parentWin.syncManagerDashboard === 'function') {
            try { parentWin.syncManagerDashboard(parentDoc); } catch(e){}
          }`
    );
    console.log(`  [OK] Updated handleApplyPermissionSubmit in ${file}`);
  }

  // 5. Update tpl-ApplyLeave to also increment MGR_NOTIFICATION_COUNT & manager-dash-perm-badge (Image 2)
  if (content.includes('id="manager-dash-leave-badge"') && !content.includes('store.MGR_NOTIFICATION_COUNT = (store.MGR_NOTIFICATION_COUNT || 0) + 1;')) {
    content = content.replace(
      "var liveMgrBadge = parentDoc.getElementById('manager-dash-leave-badge') || document.getElementById('manager-dash-leave-badge');",
      `var liveMgrBadge = parentDoc.getElementById('manager-dash-leave-badge') || document.getElementById('manager-dash-leave-badge');
            store.MGR_NOTIFICATION_COUNT = (store.MGR_NOTIFICATION_COUNT || 0) + 1;
            if (mgrTpl) {
              var mgrHtml2 = mgrTpl.innerHTML;
              mgrHtml2 = mgrHtml2.replace(/class="qbadge" id="manager-dash-perm-badge">[0-9]+/, function(m) {
                var c2 = parseInt(m.replace('class="qbadge" id="manager-dash-perm-badge">', ''), 10) || 0;
                return 'class="qbadge" id="manager-dash-perm-badge">' + (c2 + 1);
              });
              mgrTpl.innerHTML = mgrHtml2;
            }
            var livePermBadge = parentDoc.getElementById('manager-dash-perm-badge') || document.getElementById('manager-dash-perm-badge');
            if (livePermBadge) {
              var curP = parseInt(livePermBadge.textContent, 10) || 0;
              livePermBadge.textContent = String(curP + 1);
            }
            if (typeof store.syncManagerDashboard === 'function') {
              try { store.syncManagerDashboard(parentDoc); } catch(e){}
            }`
    );
    console.log(`  [OK] Updated leave submit badge logic in ${file}`);
  }

  // 6. Update updateLiveProfileStatusUI for Employee Status Button (Requirement 1 & Image 1)
  const oldStatusLogic = `          if (empStatusEl) {
            empStatusEl.textContent = finalStatus;
            if (finalStatus === 'Active') {
              empStatusEl.className = 'badge success';
              empStatusEl.style.background = 'var(--success-bg, #E3F8EE)';
              empStatusEl.style.color = 'var(--success, #1FAE6E)';
            } else {
              empStatusEl.className = 'badge danger';
              empStatusEl.style.background = 'var(--danger-bg, #FEECEE)';
              empStatusEl.style.color = 'var(--danger, #E5484D)';
            }
          }`;

  const newStatusLogic = `          if (empStatusEl) {
            empStatusEl.textContent = finalStatus;
            var pillEl = empStatusEl.closest ? empStatusEl.closest('.profile-status-pill') : empStatusEl.parentElement;
            var dotEl = pillEl ? pillEl.querySelector('.profile-status-dot') : null;

            if (finalStatus === 'Active') {
              empStatusEl.className = 'profile-status-text';
              empStatusEl.style.color = '#15803D';
              empStatusEl.style.background = 'transparent';
              if (pillEl) {
                pillEl.className = 'profile-status-pill active-status';
                pillEl.style.background = '#DCFCE7';
                pillEl.style.border = '1px solid #86EFAC';
              }
              if (dotEl) {
                dotEl.className = 'profile-status-dot';
                dotEl.style.background = '#16A34A';
              }
            } else {
              empStatusEl.className = 'profile-status-text';
              empStatusEl.style.color = '#DC2626';
              empStatusEl.style.background = 'transparent';
              if (pillEl) {
                pillEl.className = 'profile-status-pill inactive-status';
                pillEl.style.background = '#FEE2E2';
                pillEl.style.border = '1px solid #FCA5A5';
              }
              if (dotEl) {
                dotEl.className = 'profile-status-dot';
                dotEl.style.background = '#EF4444';
              }
            }
          }`;

  if (content.includes(oldStatusLogic)) {
    content = content.replace(oldStatusLogic, newStatusLogic);
    console.log(`  [OK] Updated updateLiveProfileStatusUI in ${file}`);
  }

  // 7. Update tpl-MyProfile loadScreen handler as well
  const oldProfileLs = `            if (empStatusEl) {
              var currentStatus = window.EMPLOYMENT_STATUS || 'Active';
              empStatusEl.textContent = currentStatus;
              if (currentStatus === 'Active') {
                empStatusEl.className = 'badge success';
                empStatusEl.style.background = 'var(--success-bg, #E3F8EE)';
                empStatusEl.style.color = 'var(--success, #1FAE6E)';
              } else {
                empStatusEl.className = 'badge danger';
                empStatusEl.style.background = 'var(--danger-bg, #FEECEE)';
                empStatusEl.style.color = 'var(--danger, #E5484D)';
              }
            }`;

  const newProfileLs = `            if (empStatusEl) {
              var currentStatus = window.EMPLOYMENT_STATUS || 'Active';
              empStatusEl.textContent = currentStatus;
              var pillEl = empStatusEl.closest ? empStatusEl.closest('.profile-status-pill') : empStatusEl.parentElement;
              var dotEl = pillEl ? pillEl.querySelector('.profile-status-dot') : null;

              if (currentStatus === 'Active') {
                empStatusEl.className = 'profile-status-text';
                empStatusEl.style.color = '#15803D';
                empStatusEl.style.background = 'transparent';
                if (pillEl) {
                  pillEl.className = 'profile-status-pill active-status';
                  pillEl.style.background = '#DCFCE7';
                  pillEl.style.border = '1px solid #86EFAC';
                }
                if (dotEl) {
                  dotEl.className = 'profile-status-dot';
                  dotEl.style.background = '#16A34A';
                }
              } else {
                empStatusEl.className = 'profile-status-text';
                empStatusEl.style.color = '#DC2626';
                empStatusEl.style.background = 'transparent';
                if (pillEl) {
                  pillEl.className = 'profile-status-pill inactive-status';
                  pillEl.style.background = '#FEE2E2';
                  pillEl.style.border = '1px solid #FCA5A5';
                }
                if (dotEl) {
                  dotEl.className = 'profile-status-dot';
                  dotEl.style.background = '#EF4444';
                }
              }
            }`;

  if (content.includes(oldProfileLs)) {
    content = content.replace(oldProfileLs, newProfileLs);
    console.log(`  [OK] Updated loadScreen profile status in ${file}`);
  }

  // 8. Add CSS rules for .profile-status-pill.inactive-status & .active-status
  if (!content.includes('.profile-status-pill.inactive-status')) {
    content = content.replace(
      '.profile-status-pill {',
      `.profile-status-pill.inactive-status { background: #FEE2E2 !important; border: 1px solid #FCA5A5 !important; }
.profile-status-pill.inactive-status .profile-status-dot { background: #EF4444 !important; }
.profile-status-pill.inactive-status .profile-status-text { color: #DC2626 !important; }
.profile-status-pill.active-status { background: #DCFCE7 !important; border: 1px solid #86EFAC !important; }
.profile-status-pill.active-status .profile-status-dot { background: #16A34A !important; }
.profile-status-pill.active-status .profile-status-text { color: #15803D !important; }
.profile-status-pill {`
    );
    console.log(`  [OK] Added profile-status-pill CSS classes in ${file}`);
  }

  // 9. Ensure .qbadge has prominent round red styling matching Image 2
  if (content.includes('.qbadge {') && !content.includes('min-width: 22px;')) {
    content = content.replace(
      '.qbadge {',
      `.qbadge {
      min-width: 22px;
      height: 22px;
      line-height: 22px;
      text-align: center;
      box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);`
    );
    console.log(`  [OK] Enhanced .qbadge styling in ${file}`);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Saved ${file}`);
});

// 10. Update ManagerDashboardScreen.jsx for React Native
const mgrDashJsx = 'EmergereApp/EmergereApp/src/screens/ManagerDashboard/ManagerDashboardScreen.jsx';
if (fs.existsSync(mgrDashJsx)) {
  let content = fs.readFileSync(mgrDashJsx, 'utf8');
  content = content.replace(
    ".filter((r) => r && r.id && (r.status || 'Pending').toLowerCase() !== 'pending')",
    ".filter((r) => r && r.id)"
  );
  content = content.replace(
    "status: (r.status && r.status.toLowerCase() === 'rejected') ? 'Rejected' : 'Approved',",
    "status: (r.status && r.status.toLowerCase() === 'rejected') ? 'Rejected' : ((r.status && r.status.toLowerCase() === 'approved') ? 'Approved' : 'Pending'),"
  );
  content = content.replace(
    "tone: (r.status && r.status.toLowerCase() === 'rejected') ? 'danger' : 'success',",
    "tone: (r.status && r.status.toLowerCase() === 'rejected') ? 'danger' : ((r.status && r.status.toLowerCase() === 'approved') ? 'success' : 'warning'),"
  );
  if (!content.includes("action.key === 'PermissionApprovals'")) {
    content = content.replace(
      `        setQuickActions((qa) =>
          qa.map((action) =>
            action.key === 'LeaveApprovals'
              ? { ...action, badge: (action.badge || 0) + fresh.filter((r) => r.leaveType !== r.type).length || (action.badge || 0) + fresh.length }
              : action
          )
        );`,
      `        setQuickActions((qa) =>
          qa.map((action) => {
            if (action.key === 'PermissionApprovals') {
              return { ...action, badge: (action.badge || 0) + fresh.length };
            }
            if (action.key === 'LeaveApprovals') {
              return { ...action, badge: (action.badge || 0) + fresh.filter((r) => !r.isPermission).length };
            }
            return action;
          })
        );`
    );
  }
  fs.writeFileSync(mgrDashJsx, content, 'utf8');
  console.log(`Saved ${mgrDashJsx}`);
}

// 11. Update MyProfileScreen.jsx and MyProfileScreen.styles.js for React Native status pill
const myProfileJsx = 'EmergereApp/EmergereApp/src/screens/MyProfile/MyProfileScreen.jsx';
if (fs.existsSync(myProfileJsx)) {
  let content = fs.readFileSync(myProfileJsx, 'utf8');
  content = content.replace(
    `<View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{employmentStatus}</Text>
          </View>`,
    `<View style={[styles.statusPill, employmentStatus === 'Inactive' && styles.statusPillInactive]}>
            <View style={[styles.statusDot, employmentStatus === 'Inactive' && styles.statusDotInactive]} />
            <Text style={[styles.statusText, employmentStatus === 'Inactive' && styles.statusTextInactive]}>{employmentStatus}</Text>
          </View>`
  );
  fs.writeFileSync(myProfileJsx, content, 'utf8');
  console.log(`Saved ${myProfileJsx}`);
}

const myProfileStyles = 'EmergereApp/EmergereApp/src/screens/MyProfile/MyProfileScreen.styles.js';
if (fs.existsSync(myProfileStyles)) {
  let content = fs.readFileSync(myProfileStyles, 'utf8');
  if (!content.includes('statusPillInactive:')) {
    content = content.replace(
      'statusPill: {',
      `statusPillInactive: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  statusDotInactive: {
    backgroundColor: '#EF4444',
  },
  statusTextInactive: {
    color: '#DC2626',
  },
  statusPill: {`
    );
    fs.writeFileSync(myProfileStyles, content, 'utf8');
    console.log(`Saved ${myProfileStyles}`);
  }
}

console.log('Manager Dashboard enhancements applied successfully!');
