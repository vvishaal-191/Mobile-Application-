const fs = require('fs');

const calBase64 = fs.readFileSync('scratch/cal_b64.txt', 'utf8').trim();
const emptyBase64 = fs.readFileSync('scratch/empty_b64.txt', 'utf8').trim();

// Read standalone preview.html
let html = fs.readFileSync('EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html', 'utf8');

// Update calendar image if present or replace SVG header illustration with image
if (html.includes('<div class="la-header-illustration">')) {
  html = html.replace(
    /<div class="la-header-illustration">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
    `<div class="la-header-illustration">
        <img src="${calBase64}" alt="Calendar" style="width: 72px; height: 64px; object-fit: contain;" />
      </div>
    </div>
  </div>`
  );
}

// Update empty state art image if present
if (html.includes('<div class="la-empty-art-wrap">')) {
  html = html.replace(
    /<div class="la-empty-art-wrap">[\s\S]*?<\/div>/,
    `<div class="la-empty-art-wrap" style="width: 100%; max-width: 240px; margin: 0 auto 16px; display: flex; justify-content: center;">
          <img src="${emptyBase64}" alt="No leave requests" style="width: 100%; max-width: 220px; height: auto; object-fit: contain;" />
        </div>`
  );
}

fs.writeFileSync('EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html', html, 'utf8');
console.log('Updated EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html');
