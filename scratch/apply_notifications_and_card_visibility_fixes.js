const fs = require('fs');

console.log('=== APPLYING NOTIFICATION & CARD VISIBILITY FIXES ===\n');

// -------------------------------------------------------------
// 1. UPDATE ManagerDashboard/preview.html (Remove Bell Button)
// -------------------------------------------------------------
const mgrHtmlPath = 'EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.html';
if (fs.existsSync(mgrHtmlPath)) {
  let mgrHtml = fs.readFileSync(mgrHtmlPath, 'utf8');

  // Remove mgr-bell-btn
  const bellPattern = /<!-- Bell button with dot on right -->\s*<div class="mgr-bell-btn"[\s\S]*?<\/div>/;
  if (bellPattern.test(mgrHtml)) {
    mgrHtml = mgrHtml.replace(bellPattern, '');
    console.log('[OK] Removed bell button from ManagerDashboard/preview.html');
  } else {
    // Try matching without comment
    mgrHtml = mgrHtml.replace(/<div class="mgr-bell-btn" id="mgr-bell-btn"[\s\S]*?<\/div>/, '');
    console.log('[OK] Removed bell div from ManagerDashboard/preview.html');
  }

  fs.writeFileSync(mgrHtmlPath, mgrHtml, 'utf8');
}

// -------------------------------------------------------------
// 2. UPDATE ManagerDashboardScreen.jsx (Remove Bell Button in RN)
// -------------------------------------------------------------
const mgrJsxPath = 'EmergereApp/EmergereApp/src/screens/ManagerDashboard/ManagerDashboardScreen.jsx';
if (fs.existsSync(mgrJsxPath)) {
  let mgrJsx = fs.readFileSync(mgrJsxPath, 'utf8');
  mgrJsx = mgrJsx.replace(
    /<TouchableOpacity style=\{styles\.bellButton\} onPress=\{\(\) => go\('Notifications'\)\}>\s*<Feather name="bell" size=\{18\} color="#FFFFFF" \/>\s*<View style=\{styles\.bellDot\} \/>\s*<\/TouchableOpacity>/,
    ''
  );
  fs.writeFileSync(mgrJsxPath, mgrJsx, 'utf8');
  console.log('[OK] Removed bellButton from ManagerDashboardScreen.jsx');
}

// -------------------------------------------------------------
// 3. UPDATE LeaveApprovals/preview.html
// -------------------------------------------------------------
const leaveHtmlPath = 'EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html';
if (fs.existsSync(leaveHtmlPath)) {
  let leaveHtml = fs.readFileSync(leaveHtmlPath, 'utf8');

  // Fix Approved tab label
  leaveHtml = leaveHtml.replace(
    /<span class="tab-label">Approved \(<span id="count-approved">1<\/span>\)<\/span>/,
    '<span class="tab-label">Approved<span id="count-approved-wrap" style="display:none;"> (<span id="count-approved">0</span>)</span></span>'
  );
  leaveHtml = leaveHtml.replace(
    /<span class="tab-label">Approved \(<span id="count-approved">0<\/span>\)<\/span>/,
    '<span class="tab-label">Approved<span id="count-approved-wrap" style="display:none;"> (<span id="count-approved">0</span>)</span></span>'
  );

  // Fix updateLeaveTabCounts implementation
  const oldLeaveCountCode = `let pending = 0, approved = 1, rejected = 0;`;
  const newLeaveCountCode = `let pending = 0, approved = 0, rejected = 0;`;
  leaveHtml = leaveHtml.replace(oldLeaveCountCode, newLeaveCountCode);

  // Update display logic for count-approved-wrap in updateLeaveTabCounts
  if (!leaveHtml.includes('count-approved-wrap')) {
    leaveHtml = leaveHtml.replace(
      'if (countApproved) countApproved.textContent = approved;',
      'if (countApproved) countApproved.textContent = approved;\n      const wrapApproved = document.getElementById("count-approved-wrap");\n      if (wrapApproved) wrapApproved.style.display = approved > 0 ? "inline" : "none";'
    );
  } else if (!leaveHtml.includes('wrapApproved.style.display')) {
    leaveHtml = leaveHtml.replace(
      'if (countApproved) countApproved.textContent = approved;',
      'if (countApproved) countApproved.textContent = approved;\n      const wrapApproved = document.getElementById("count-approved-wrap");\n      if (wrapApproved) wrapApproved.style.display = approved > 0 ? "inline" : "none";'
    );
  }

  fs.writeFileSync(leaveHtmlPath, leaveHtml, 'utf8');
  console.log('[OK] Updated LeaveApprovals/preview.html');
}

// -------------------------------------------------------------
// 4. UPDATE PermissionApprovals/preview.html
// -------------------------------------------------------------
const permHtmlPath = 'EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html';
if (fs.existsSync(permHtmlPath)) {
  let permHtml = fs.readFileSync(permHtmlPath, 'utf8');

  // Fix Rejected tab label if it has 1
  permHtml = permHtml.replace(
    /<span class="tab-label">Rejected \(<span id="perm-count-rejected">1<\/span>\)<\/span>/,
    '<span class="tab-label">Rejected (<span id="perm-count-rejected">0</span>)</span>'
  );

  // Fix updatePermTabCounts implementation
  permHtml = permHtml.replace(
    'let pending = 0, approved = 0, rejected = 1;',
    'let pending = 0, approved = 0, rejected = 0;'
  );

  fs.writeFileSync(permHtmlPath, permHtml, 'utf8');
  console.log('[OK] Updated PermissionApprovals/preview.html');
}

// -------------------------------------------------------------
// 5. UPDATE ALL 4 BUNDLE HTML FILES
// -------------------------------------------------------------
const appFiles = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

appFiles.forEach(f => {
  if (!fs.existsSync(f)) return;
  let content = fs.readFileSync(f, 'utf8');

  // A. Empty initial PERM_STATE so Priya Sharma card & badge 1 do not appear by default
  const permInitPattern = /if \(!window\.PERM_STATE \|\| window\.PERM_STATE\.length === 0\) \{\s*window\.PERM_STATE = \[\s*\{\s*id:\s*'perm-init-1'[\s\S]*?\}\s*\];\s*\}/;
  if (permInitPattern.test(content)) {
    content = content.replace(permInitPattern, 'if (!window.PERM_STATE) {\n          window.PERM_STATE = [];\n        }');
    console.log('[OK] Reset initial PERM_STATE to empty in', f);
  }

  // B. Remove bell button from tpl-ManagerDashboard in bundle
  const tplMgrStart = content.indexOf('<template id="tpl-ManagerDashboard">');
  if (tplMgrStart !== -1) {
    const tplMgrEnd = content.indexOf('</template>', tplMgrStart);
    let mgrTpl = content.substring(tplMgrStart, tplMgrEnd);

    mgrTpl = mgrTpl.replace(/<!-- Bell button with dot on right -->\s*<div class="mgr-bell-btn"[\s\S]*?<\/div>/, '');
    mgrTpl = mgrTpl.replace(/<div class="mgr-bell-btn" id="mgr-bell-btn"[\s\S]*?<\/div>/, '');

    content = content.substring(0, tplMgrStart) + mgrTpl + content.substring(tplMgrEnd);
  }

  // C. Update tpl-LeaveApprovals in bundle
  const tplLaStart = content.indexOf('<template id="tpl-LeaveApprovals">');
  if (tplLaStart !== -1) {
    const tplLaEnd = content.indexOf('</template>', tplLaStart);
    let laTpl = content.substring(tplLaStart, tplLaEnd);

    // Replace count-approved label
    laTpl = laTpl.replace(
      /<span class="tab-label">Approved \(<span id="count-approved">1<\/span>\)<\/span>/,
      '<span class="tab-label">Approved<span id="count-approved-wrap" style="display:none;"> (<span id="count-approved">0</span>)</span></span>'
    );
    laTpl = laTpl.replace(
      /<span class="tab-label">Approved \(<span id="count-approved">0<\/span>\)<\/span>/,
      '<span class="tab-label">Approved<span id="count-approved-wrap" style="display:none;"> (<span id="count-approved">0</span>)</span></span>'
    );

    // Replace hardcoded approved = 1
    laTpl = laTpl.replace(
      'let pending = 0, approved = 1, rejected = 0;',
      'let pending = 0, approved = 0, rejected = 0;'
    );

    // Update updateLeaveTabCounts logic in laTpl
    if (!laTpl.includes('wrapApproved.style.display')) {
      laTpl = laTpl.replace(
        'if (countApproved) countApproved.textContent = approved;',
        'if (countApproved) countApproved.textContent = approved;\n      const wrapApproved = document.getElementById("count-approved-wrap");\n      if (wrapApproved) wrapApproved.style.display = approved > 0 ? "inline" : "none";'
      );
    }

    content = content.substring(0, tplLaStart) + laTpl + content.substring(tplLaEnd);
  }

  // D. Update tpl-PermissionApprovals in bundle
  const tplPaStart = content.indexOf('<template id="tpl-PermissionApprovals">');
  if (tplPaStart !== -1) {
    const tplPaEnd = content.indexOf('</template>', tplPaStart);
    let paTpl = content.substring(tplPaStart, tplPaEnd);

    paTpl = paTpl.replace(
      /<span class="tab-label">Rejected \(<span id="perm-count-rejected">1<\/span>\)<\/span>/,
      '<span class="tab-label">Rejected (<span id="perm-count-rejected">0</span>)</span>'
    );
    paTpl = paTpl.replace(
      'let pending = 0, approved = 0, rejected = 1;',
      'let pending = 0, approved = 0, rejected = 0;'
    );

    content = content.substring(0, tplPaStart) + paTpl + content.substring(tplPaEnd);
  }

  fs.writeFileSync(f, content, 'utf8');
  console.log('[OK] Updated bundle file:', f);
});

console.log('\n=== FIXES SUCCESSFULLY APPLIED TO ALL RELEVANT FILES ===');
