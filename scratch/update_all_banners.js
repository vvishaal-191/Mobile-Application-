const fs = require('fs');

const bannerBase64 = fs.readFileSync('scratch/banner_b64.txt', 'utf8').trim();

const newHeaderHtml = `<!-- Royal Blue Gradient Header Banner matching Image 2 -->
          <div class="la-header-banner-wrap" id="la-header-banner" style="position: relative; width: 100%; overflow: hidden; border-bottom-left-radius: 28px; border-bottom-right-radius: 28px; box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22); background: #0066FF;">
            <img src="${bannerBase64}" alt="Leave Approvals" class="header-banner-img" style="width: 100%; height: auto; display: block;" />
            <button
              class="back-btn-hitbox"
              onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}"
              title="Go Back"
              aria-label="Go Back"
              style="position: absolute; left: 14px; top: 22px; width: 44px; height: 44px; border-radius: 50%; background: transparent; border: none; cursor: pointer; z-index: 10; -webkit-tap-highlight-color: transparent;"
            ></button>
          </div>`;

const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

files.forEach(filepath => {
  if (!fs.existsSync(filepath)) return;
  let content = fs.readFileSync(filepath, 'utf8');

  // Find tpl-LeaveApprovals
  const tplIdx = content.indexOf('id="tpl-LeaveApprovals"');
  if (tplIdx === -1) {
    console.log(filepath, 'tpl-LeaveApprovals not found');
    return;
  }
  const tplEndIdx = content.indexOf('</template>', tplIdx);
  let tpl = content.substring(tplIdx, tplEndIdx);

  // Replace header-banner inside tpl
  // Current header banner starts with <div class="header-banner" id="la-header-banner">
  // and ends at </div> </div> </div> (the header top row)
  const headerStart = tpl.indexOf('<div class="header-banner" id="la-header-banner">');
  if (headerStart !== -1) {
    // Find where the tab bar starts: <div class="tab-bar-card
    const tabStart = tpl.indexOf('<div class="tab-bar-card', headerStart);
    if (tabStart !== -1) {
      const beforeHeader = tpl.substring(0, headerStart);
      const afterHeader = tpl.substring(tabStart);
      tpl = beforeHeader + newHeaderHtml + '\n\n          ' + afterHeader;
      content = content.substring(0, tplIdx) + tpl + content.substring(tplEndIdx);
      fs.writeFileSync(filepath, content, 'utf8');
      console.log('Updated', filepath, 'successfully!');
    } else {
      console.log(filepath, 'tab-bar-card not found after header');
    }
  } else {
    // Check if it already has la-header-banner-wrap
    const wrapStart = tpl.indexOf('<div class="la-header-banner-wrap" id="la-header-banner"');
    if (wrapStart !== -1) {
      const tabStart = tpl.indexOf('<div class="tab-bar-card', wrapStart);
      const beforeHeader = tpl.substring(0, wrapStart);
      const afterHeader = tpl.substring(tabStart);
      tpl = beforeHeader + newHeaderHtml + '\n\n          ' + afterHeader;
      content = content.substring(0, tplIdx) + tpl + content.substring(tplEndIdx);
      fs.writeFileSync(filepath, content, 'utf8');
      console.log('Re-updated', filepath, 'successfully!');
    } else {
      console.log(filepath, 'header banner not found in tpl');
    }
  }
});
