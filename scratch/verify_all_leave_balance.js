const fs = require('fs');
const assert = require('assert');

const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/src/screens/LeaveBalance/preview.html',
];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  console.log(`Checking ${file}...`);
  assert(content.includes('lb-header-banner'), `${file} must contain lb-header-banner`);
  assert(content.includes('Leave Balances'), `${file} must contain Leave Balances title`);
  assert(content.includes('Employee Balance Summary for 2026'), `${file} must contain subtitle`);
  assert(content.includes('Jan - Dec 2026'), `${file} must contain period`);
  assert(content.includes('2026'), `${file} must contain 2026`);
  assert(content.includes('Casual Leave'), `${file} must contain Casual Leave`);
  assert(content.includes('Sick Leave'), `${file} must contain Sick Leave`);
  assert(content.includes('Earned Leave'), `${file} must contain Earned Leave`);
  assert(content.includes('Privilege Leave'), `${file} must contain Privilege Leave`);
  assert(content.includes('Emergency Leave'), `${file} must contain Emergency Leave`);
  assert(content.includes('tab-dashboard'), `${file} must contain bottom nav tab-dashboard`);
  assert(content.includes('tab-attendance'), `${file} must contain bottom nav tab-attendance`);
  assert(content.includes('tab-apply'), `${file} must contain bottom nav tab-apply`);
  assert(content.includes('tab-history'), `${file} must contain bottom nav tab-history`);
  assert(content.includes('tab-profile'), `${file} must contain bottom nav tab-profile`);
  console.log(`✓ ${file} passed all checks.`);
});

console.log('\nAll files verified successfully!');
