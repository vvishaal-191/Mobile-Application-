const fs = require('fs');
const path = require('path');
const { applyHtmlFixes } = require('./apply_html_fixes_mod');

const htmlFiles = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

console.log('--- Applying fixes to HTML bundle files ---');
htmlFiles.forEach((relPath) => {
  const fullPath = path.resolve(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.error('File not found:', fullPath);
    return;
  }
  const original = fs.readFileSync(fullPath, 'utf8');
  let transformed = applyHtmlFixes(original);

  // Additional refinements:
  // Role-aware handleBackNav in tpl-ApplyPermission
  transformed = transformed.replace(
    /function handleBackNav\(\)\s*\{\s*var parentWin = window\.parent \|\| window;\s*if \(parentWin\.loadScreen\) \{\s*parentWin\.loadScreen\('tpl-EmployeeDashboard'\);\s*\} else if \(typeof loadScreen === 'function'\) \{\s*loadScreen\('tpl-EmployeeDashboard'\);\s*\} else \{\s*location\.href = '\.\.\/EmployeeDashboard\/preview\.html';\s*\}\s*\}/g,
    `function handleBackNav() {
          var parentWin = window.parent || window;
          var isMgr = (parentWin.AUTH_USER && parentWin.AUTH_USER.role === 'manager') || (window.AUTH_USER && window.AUTH_USER.role === 'manager');
          var dest = isMgr ? 'tpl-ManagerDashboard' : 'tpl-EmployeeDashboard';
          if (parentWin.loadScreen) {
            parentWin.loadScreen(dest);
          } else if (typeof loadScreen === 'function') {
            loadScreen(dest);
          } else {
            location.href = isMgr ? '../ManagerDashboard/preview.html' : '../EmployeeDashboard/preview.html';
          }
        }`
  );

  // Role-aware handleBackNav in tpl-ApplyLeave
  transformed = transformed.replace(
    /function handleBackNav\(\)\s*\{\s*if \(window\.parent && window\.parent\.loadScreen\) \{\s*window\.parent\.loadScreen\('tpl-EmployeeDashboard'\);\s*\} else if \(typeof loadScreen === 'function'\) \{\s*loadScreen\('tpl-EmployeeDashboard'\);\s*\} else \{\s*location\.href = '\.\.\/EmployeeDashboard\/preview\.html';\s*\}\s*\}/g,
    `function handleBackNav() {
          var parentWin = window.parent || window;
          var isMgr = (parentWin.AUTH_USER && parentWin.AUTH_USER.role === 'manager') || (window.AUTH_USER && window.AUTH_USER.role === 'manager');
          var dest = isMgr ? 'tpl-ManagerDashboard' : 'tpl-EmployeeDashboard';
          if (window.parent && window.parent.loadScreen) {
            window.parent.loadScreen(dest);
          } else if (typeof loadScreen === 'function') {
            loadScreen(dest);
          } else {
            location.href = isMgr ? '../ManagerDashboard/preview.html' : '../EmployeeDashboard/preview.html';
          }
        }`
  );

  // Role-aware tab-dashboard in tpl-ApplyPermission
  transformed = transformed.replace(
    /<div class="tab nav-tab" id="tab-dashboard" onclick="if\(window\.parent&&window\.parent\.loadScreen\)\{window\.parent\.loadScreen\('tpl-EmployeeDashboard'\)\}else if\(typeof loadScreen==='function'\)\{loadScreen\('tpl-EmployeeDashboard'\)\}else if\(typeof navTo==='function'\)\{navTo\('Dashboard'\)\}">/g,
    `<div class="tab nav-tab" id="tab-dashboard" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen((window.parent.AUTH_USER&&window.parent.AUTH_USER.role==='manager')?'tpl-ManagerDashboard':'tpl-EmployeeDashboard')}else if(typeof loadScreen==='function'){loadScreen((window.AUTH_USER&&window.AUTH_USER.role==='manager')?'tpl-ManagerDashboard':'tpl-EmployeeDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}">`
  );

  // Role-aware lb-back-btn and tab-dashboard in tpl-LeaveBalance
  transformed = transformed.replace(
    /<button class="lb-back-btn" title="Back" onclick="if\(window\.parent&&window\.parent\.loadScreen\)\{window\.parent\.loadScreen\('tpl-EmployeeDashboard'\)\}else if\(typeof loadScreen==='function'\)\{loadScreen\('tpl-EmployeeDashboard'\)\}else\{window\.history\.back\(\)\}"><svg width="20"/g,
    `<button class="lb-back-btn" title="Back" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen((window.parent.AUTH_USER&&window.parent.AUTH_USER.role==='manager')?'tpl-ManagerDashboard':'tpl-EmployeeDashboard')}else if(typeof loadScreen==='function'){loadScreen((window.AUTH_USER&&window.AUTH_USER.role==='manager')?'tpl-ManagerDashboard':'tpl-EmployeeDashboard')}else{window.history.back()}"><svg width="20"`
  );

  fs.writeFileSync(fullPath, transformed, 'utf8');
  console.log('Updated:', relPath, 'Length:', transformed.length);
});

// ==========================================
// FIX React Native / Screen preview files
// ==========================================

// 1. ApplyPermissionScreen.styles.js
const permStylesPath = path.resolve(__dirname, '../EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.styles.js');
if (fs.existsSync(permStylesPath)) {
  let s = fs.readFileSync(permStylesPath, 'utf8');
  s = s.replace(/paddingBottom:\s*110,/, 'paddingBottom: 140,');
  s = s.replace(/marginTop:\s*6,\s*shadowColor:\s*'#0066FF',/, 'marginTop: 20,\n    marginBottom: 12,\n    shadowColor: \'#0066FF\',');
  s = s.replace(/paddingVertical:\s*22,\s*shadowColor:/, 'paddingVertical: 22,\n    paddingBottom: 32,\n    marginBottom: 36,\n    shadowColor:');
  fs.writeFileSync(permStylesPath, s, 'utf8');
  console.log('Updated ApplyPermissionScreen.styles.js');
}

// 2. ApplyPermission preview.css
const permCssPath = path.resolve(__dirname, '../EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.css');
if (fs.existsSync(permCssPath)) {
  let c = fs.readFileSync(permCssPath, 'utf8');
  c = c.replace(/padding-bottom:\s*96px;/g, 'padding-bottom: 140px;');
  c = c.replace(
    /\.perm-form-card\s*\{[\s\S]*?padding:\s*22px 16px 24px 16px;/g,
    `.perm-form-card {\n  margin: -24px 14px 40px 14px;\n  background: #FFFFFF;\n  border-radius: 26px;\n  padding: 22px 16px 32px 16px;`
  );
  c = c.replace(
    /\.perm-submit-btn\s*\{([\s\S]*?)margin-top:\s*6px;/g,
    `.perm-submit-btn {$1margin-top: 20px;\n  margin-bottom: 12px;`
  );
  fs.writeFileSync(permCssPath, c, 'utf8');
  console.log('Updated ApplyPermission preview.css');
}

// 3. ManagerDashboardScreen.jsx
const mgrScreenPath = path.resolve(__dirname, '../EmergereApp/EmergereApp/src/screens/ManagerDashboard/ManagerDashboardScreen.jsx');
if (fs.existsSync(mgrScreenPath)) {
  let m = fs.readFileSync(mgrScreenPath, 'utf8');
  // Team Calendar -> Holiday Calendar in Quick Actions & Sidebar
  m = m.replace(/title:\s*'Team Calendar',/g, "title: 'Holiday Calendar',");
  m = m.replace(/label:\s*'Team Calendar',/g, "label: 'Holiday Calendar',");
  m = m.replace(/key:\s*'TeamCalendar',/g, "key: 'HolidayCalendar',");
  // Fix permission badge increment bug (was fresh.length, now fresh.filter(r => r.isPermission).length)
  m = m.replace(
    /if \(action\.key === 'PermissionApprovals'\) \{\s*return \{ \.\.\.action, badge: \(action\.badge \|\| 0\) \+ fresh\.length \};\s*\}/g,
    `if (action.key === 'PermissionApprovals') {
              return { ...action, badge: (action.badge || 0) + fresh.filter((r) => r.isPermission).length };
            }`
  );
  fs.writeFileSync(mgrScreenPath, m, 'utf8');
  console.log('Updated ManagerDashboardScreen.jsx');
}

// 4. ManagerDashboard preview.html
const mgrPreviewPath = path.resolve(__dirname, '../EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html');
if (fs.existsSync(mgrPreviewPath)) {
  let mp = fs.readFileSync(mgrPreviewPath, 'utf8');
  mp = mp.replace(/<!-- 4\. Team Calendar -->([\s\S]*?)<div class="qa-title">Team Calendar<\/div>/g, '<!-- 4. Holiday Calendar -->$1<div class="qa-title">Holiday Calendar</div>');
  mp = mp.replace(/<!-- 5\. Team Calendar -->([\s\S]*?)<span class="sidebar-item-label">Team Calendar<\/span>/g, '<!-- 5. Holiday Calendar -->$1<span class="sidebar-item-label">Holiday Calendar</span>');
  mp = mp.replace(
    /<div class="nav-tab" id="tab-history" onclick="handleCardNav\('tpl-HolidayCalendar'\)">\s*<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2\.2" stroke-linecap="round" stroke-linejoin="round">\s*<path d="M3 12a9 9 0 1 0 9-9 9\.75 9\.75 0 0 0-6\.74 2\.74L3 8"><\/path>[\s\S]*?<span>Calendar<\/span>\s*<\/div>/g,
    `<div class="nav-tab" id="tab-history" onclick="handleCardNav('tpl-HolidayCalendar')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span style="white-space:nowrap;font-size:10px;">Holiday Calendar</span>
      </div>`
  );
  fs.writeFileSync(mgrPreviewPath, mp, 'utf8');
  console.log('Updated ManagerDashboard preview.html');
}

// 5. HolidayCalendar preview.html
const hcPreviewPath = path.resolve(__dirname, '../EmergereApp/EmergereApp/src/screens/HolidayCalendar/preview.html');
if (fs.existsSync(hcPreviewPath)) {
  let hcp = fs.readFileSync(hcPreviewPath, 'utf8');
  hcp = hcp.replace(
    /<button class="hc-back-btn" title="Back" onclick="if\(window\.parent&&window\.parent\.loadScreen\)\{window\.parent\.loadScreen\('tpl-EmployeeDashboard'\)\}else if\(typeof loadScreen==='function'\)\{loadScreen\('tpl-EmployeeDashboard'\)\}else\{window\.history\.back\(\)\}">/g,
    `<button class="hc-back-btn" title="Back" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen((window.parent.AUTH_USER&&window.parent.AUTH_USER.role==='manager')?'tpl-ManagerDashboard':'tpl-EmployeeDashboard')}else if(typeof loadScreen==='function'){loadScreen((window.AUTH_USER&&window.AUTH_USER.role==='manager')?'tpl-ManagerDashboard':'tpl-EmployeeDashboard')}else{window.history.back()}">`
  );
  fs.writeFileSync(hcPreviewPath, hcp, 'utf8');
  console.log('Updated HolidayCalendar preview.html');
}

// 6. BottomNavBar.jsx
const navBarPath = path.resolve(__dirname, '../EmergereApp/EmergereApp/src/components/BottomNavBar.jsx');
if (fs.existsSync(navBarPath)) {
  let nb = fs.readFileSync(navBarPath, 'utf8');
  // Update TABS handling for manager: 4th tab is Holiday Calendar with calendar icon
  nb = nb.replace(
    /export default function BottomNavBar\(\{ active, onNavigate \}\) \{/g,
    `export default function BottomNavBar({ active, onNavigate }) {
  const isManager = typeof global !== 'undefined' && global.USER_ROLE === 'manager';
  const effectiveTabs = TABS.map((tab) => {
    if (tab.key === 'History' && isManager) {
      return { key: 'HolidayCalendar', label: 'Holiday Calendar', icon: 'calendar' };
    }
    return tab;
  });`
  );
  nb = nb.replace(/\{TABS\.map\(\(tab\) => \{/g, '{effectiveTabs.map((tab) => {');
  // Fix navigation logic: remove manager alert restriction, route to HolidayCalendar
  nb = nb.replace(
    /\} else if \(tabKey === 'History'\) \{\s*if \(isManager\) \{\s*alert\('Access Restricted: Manager account is not authorized to access My Requests \(History\)\.'\);\s*return;\s*\}\s*onNavigate\('LeaveHistory'\);/g,
    `} else if (tabKey === 'History' || tabKey === 'HolidayCalendar') {
      if (isManager) {
        onNavigate('HolidayCalendar');
      } else {
        onNavigate('LeaveHistory');
      }`
  );
  // Update isActive logic
  nb = nb.replace(
    /const isActive = active === tab\.key \|\| \(tab\.key === 'Profile' && \(active === 'Profile' \|\| active === 'More'\)\);/g,
    `const isActive = active === tab.key || (tab.key === 'HolidayCalendar' && active === 'HolidayCalendar') || (tab.key === 'Profile' && (active === 'Profile' || active === 'More'));`
  );
  fs.writeFileSync(navBarPath, nb, 'utf8');
  console.log('Updated BottomNavBar.jsx');
}

console.log('--- ALL FIXES APPLIED SUCCESSFULLY ---');
