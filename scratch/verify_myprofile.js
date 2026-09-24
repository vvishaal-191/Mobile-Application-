const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '..', 'preview_app.html'),
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'preview_app.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'index.html'),
];

const requiredIds = [
  'profile-main-card',
  'profile-edit-btn-wrap',
  'profile-save-cancel-wrap',
  'profile-view-mode',
  'profile-avatar-display',
  'profile-name-display',
  'profile-role-display',
  'profile-id-display',
  'profile-edit-mode',
  'edit-profile-name',
  'edit-profile-role',
  'edit-profile-id',
  'profile-emp-status',
  'job-read-mode',
  'val-dept',
  'val-team',
  'val-manager',
  'val-location',
  'val-date',
  'job-edit-mode',
  'input-dept',
  'input-team',
  'input-manager',
  'input-location',
  'input-date',
  'contact-read-mode',
  'val-email',
  'val-phone',
  'contact-edit-mode',
  'input-email',
  'input-phone',
  'tab-dashboard',
  'tab-attendance',
  'tab-apply',
  'tab-history',
  'tab-profile'
];

targetFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const tplStart = content.indexOf('<template id="tpl-MyProfile">');
  const tplEnd = content.indexOf('</template>', tplStart);
  
  if (tplStart === -1 || tplEnd === -1) {
    console.error('FAILED: template not found in', f);
    return;
  }
  
  const tpl = content.substring(tplStart, tplEnd);
  
  const missing = [];
  requiredIds.forEach(id => {
    if (tpl.indexOf(`id="${id}"`) === -1) {
      missing.push(id);
    }
  });

  const hasProfileHeaderBanner = tpl.indexOf('class="profile-header-banner') !== -1;
  const hasProfileHeaderClass = tpl.indexOf('has-profile-header') !== -1;
  const hasZeroPaddingRule = content.indexOf('.screen.has-profile-header') !== -1;

  console.log(path.basename(f), {
    tplLength: tpl.length,
    missingCount: missing.length,
    missing: missing,
    hasProfileHeaderBanner,
    hasProfileHeaderClass,
    hasZeroPaddingRule
  });
});
