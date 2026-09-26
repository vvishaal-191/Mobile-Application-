const fs = require('fs');

const bannerBase64 = fs.readFileSync('scratch/banner_b64.txt', 'utf8').trim();

let html = fs.readFileSync('EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html', 'utf8');

const bannerHtml = `<!-- Royal Blue Gradient Header Banner matching Image 2 -->
  <div class="la-header-banner-wrap" id="la-header-banner" style="position: relative; width: 100%; overflow: hidden; border-bottom-left-radius: 28px; border-bottom-right-radius: 28px; box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22); background: #0066FF;">
    <img src="${bannerBase64}" alt="Leave Approvals" style="width: 100%; height: auto; display: block;" />
    <button
      class="back-btn-hitbox"
      onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}"
      title="Go Back"
      aria-label="Go Back"
      style="position: absolute; left: 14px; top: 22px; width: 44px; height: 44px; border-radius: 50%; background: transparent; border: none; cursor: pointer; z-index: 10; -webkit-tap-highlight-color: transparent;"
    ></button>
  </div>`;

// Replace from <!-- Gradient Header Banner --> to before <!-- Tab Bar with Icons and Underline -->
const startMarker = '<!-- Gradient Header Banner -->';
const endMarker = '<!-- Tab Bar with Icons and Underline -->';

const sIdx = html.indexOf(startMarker);
const eIdx = html.indexOf(endMarker);

if (sIdx !== -1 && eIdx !== -1) {
  html = html.substring(0, sIdx) + bannerHtml + '\n\n  ' + html.substring(eIdx);
  fs.writeFileSync('EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html', html, 'utf8');
  console.log('Updated standalone preview.html successfully!');
} else {
  console.log('Markers not found in preview.html:', { sIdx, eIdx });
}
