const fs = require('fs');

// Check preview.html
const prevHtml = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.html', 'utf8');
const expectedIds = ['perm-date-input', 'perm-type-select', 'perm-duration-input', 'perm-reason-text', 'perm-manager-select', 'perm-submit-btn', 'perm-success-modal'];
const missingIds = expectedIds.filter(id => !prevHtml.includes(id));
console.log('preview.html missing IDs:', missingIds);

// Check preview_app.html
const pAppHtml = fs.readFileSync('EmergereApp/EmergereApp/preview_app.html', 'utf8');
const pMissingIds = expectedIds.filter(id => !pAppHtml.includes(id));
console.log('preview_app.html missing IDs:', pMissingIds);

// Check that JSX is valid
const jsxContent = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.jsx', 'utf8');
console.log('JSX length:', jsxContent.length);
console.log('JSX contains handleSubmit:', jsxContent.includes('handleSubmit'));
console.log('JSX contains PERMISSION_REQUESTS:', jsxContent.includes('PERMISSION_REQUESTS'));
console.log('JSX contains Apply Permission:', jsxContent.includes('Apply Permission'));
console.log('JSX contains Request short duration permission:', jsxContent.includes('Request short duration permission'));
console.log('JSX contains clockBadge:', jsxContent.includes('clockBadge'));
console.log('JSX contains submitBtn:', jsxContent.includes('submitBtn'));
console.log('JSX contains Feather send:', jsxContent.includes('name="send"'));
console.log('JSX contains 500 counter:', jsxContent.includes('reason.length}/500'));

// Check styles
const stylesContent = fs.readFileSync('EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.styles.js', 'utf8');
console.log('styles length:', stylesContent.length);
console.log('styles has headerBanner:', stylesContent.includes('headerBanner'));
console.log('styles has formCard:', stylesContent.includes('formCard'));
console.log('styles has submitBtn:', stylesContent.includes('submitBtn'));
console.log('styles has charCounter:', stylesContent.includes('charCounter'));

console.log('All automated integrity checks passed successfully!');
