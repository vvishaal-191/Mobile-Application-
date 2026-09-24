const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '../preview_app.html'),
  path.join(__dirname, '../index.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/preview_app.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/index.html'),
];

targetFiles.forEach((file) => {
  if (!fs.existsSync(file)) {
    console.log('File not found:', file);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');

  // 1. Update EMPLOYEE_ALLOWED_SCREENS to include tpl-MyRequests
  const oldAllowed = `'tpl-LeaveHistory',
          'tpl-HolidayCalendar'`;
  const newAllowed = `'tpl-LeaveHistory',
          'tpl-MyRequests',
          'tpl-HolidayCalendar'`;
  if (content.includes(oldAllowed)) {
    content = content.split(oldAllowed).join(newAllowed);
    console.log(file, ': updated EMPLOYEE_ALLOWED_SCREENS');
  }

  // Also check single-line or other spacing variants if any
  const oldAllowedCompact = `'tpl-LeaveHistory', 'tpl-HolidayCalendar'`;
  const newAllowedCompact = `'tpl-LeaveHistory', 'tpl-MyRequests', 'tpl-HolidayCalendar'`;
  if (content.includes(oldAllowedCompact)) {
    content = content.split(oldAllowedCompact).join(newAllowedCompact);
  }

  // 2. Add alias normalization in loadScreen
  const oldLoadScreen = `function loadScreen(tplId, personKey) {`;
  const newLoadScreen = `function loadScreen(tplId, personKey) {
          // Normalize screen aliases
          if (tplId === 'tpl-MyRequests') {
            tplId = 'tpl-LeaveHistory';
          }
          if (tplId === 'tpl-Dashboard') {
            tplId = (window.AUTH_USER && window.AUTH_USER.role === 'manager') ? 'tpl-ManagerDashboard' : 'tpl-EmployeeDashboard';
          }`;
  if (content.includes(oldLoadScreen) && !content.includes(`if (tplId === 'tpl-MyRequests')`)) {
    content = content.replace(oldLoadScreen, newLoadScreen);
    console.log(file, ': added alias normalization in loadScreen');
  }

  // 3. Update dashboard card, sidebar, and recent request clicks from tpl-MyRequests to tpl-LeaveHistory
  content = content.split("loadScreen('tpl-MyRequests')").join("loadScreen('tpl-LeaveHistory')");
  content = content.split('handleSidebarNav(\'tpl-MyRequests\')').join('handleSidebarNav(\'tpl-LeaveHistory\')');

  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated:', file);
});
