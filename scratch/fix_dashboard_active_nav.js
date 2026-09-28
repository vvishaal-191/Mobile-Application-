const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  path.join(__dirname, '../preview_app.html'),
  path.join(__dirname, '../index.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/preview_app.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/index.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html'),
];

// Target active tab-dashboard pattern
const activeDashboardPattern = /<div class="tab nav-tab active" id="tab-dashboard"[^>]*>[\s\S]*?<div class="dashboard-pill-wrap">[\s\S]*?<\/div>[\s\S]*?<span>Dashboard<\/span>[\s\S]*?<span class="active-dot-indicator"><\/span>[\s\S]*?<\/div>/g;

const replacementNonActiveDashboard = `<div class="tab nav-tab" id="tab-dashboard" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else{window.location.href='../ManagerDashboard/preview.html'}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z"></path>
        </svg>
        <span>Dashboard</span>
      </div>`;

for (const filePath of filesToUpdate) {
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist:', filePath);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // In preview_app.html / index.html, we only want to update inside tpl-LeaveApprovals and tpl-PermissionApprovals
  if (filePath.endsWith('preview_app.html') || filePath.endsWith('index.html')) {
    // 1. Update tpl-LeaveApprovals
    const laStart = content.indexOf('<template id="tpl-LeaveApprovals">');
    if (laStart !== -1) {
      const laEnd = content.indexOf('</template>', laStart);
      if (laEnd !== -1) {
        let laContent = content.substring(laStart, laEnd);
        if (activeDashboardPattern.test(laContent)) {
          laContent = laContent.replace(activeDashboardPattern, replacementNonActiveDashboard);
          content = content.substring(0, laStart) + laContent + content.substring(laEnd);
          modified = true;
          console.log(`[${path.basename(filePath)}] Updated tpl-LeaveApprovals`);
        }
      }
    }

    // 2. Update tpl-PermissionApprovals
    const paStart = content.indexOf('<template id="tpl-PermissionApprovals">');
    if (paStart !== -1) {
      const paEnd = content.indexOf('</template>', paStart);
      if (paEnd !== -1) {
        let paContent = content.substring(paStart, paEnd);
        if (activeDashboardPattern.test(paContent)) {
          paContent = paContent.replace(activeDashboardPattern, replacementNonActiveDashboard);
          content = content.substring(0, paStart) + paContent + content.substring(paEnd);
          modified = true;
          console.log(`[${path.basename(filePath)}] Updated tpl-PermissionApprovals`);
        }
      }
    }
  } else {
    // Standalone preview files
    if (activeDashboardPattern.test(content)) {
      content = content.replace(activeDashboardPattern, replacementNonActiveDashboard);
      modified = true;
      console.log(`[${path.basename(filePath)}] Updated standalone preview`);
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Saved:', filePath);
  } else {
    console.log('No active dashboard pattern found in:', filePath);
  }
}
