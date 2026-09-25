const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');

// Check that EMPLOYEE_ALLOWED_SCREENS contains both
const empIdx = c.indexOf('var EMPLOYEE_ALLOWED_SCREENS = [');
const empEnd = c.indexOf('];', empIdx);
const empScreens = c.substring(empIdx, empEnd);
console.log('EMPLOYEE_ALLOWED_SCREENS includes tpl-MyProfile:', empScreens.includes("'tpl-MyProfile'"));
console.log('EMPLOYEE_ALLOWED_SCREENS includes tpl-Profile:', empScreens.includes("'tpl-Profile'"));

// Check loadScreen alias logic
const lsIdx = c.indexOf('function loadScreen(tplId');
const lsSnippet = c.substring(lsIdx, lsIdx + 400);
console.log('loadScreen has tpl-Profile alias mapping:', lsSnippet.includes("tplId = 'tpl-MyProfile'"));

// Check sidebar button
console.log('Sidebar button calls tpl-MyProfile:', c.includes("handleSidebarNav('tpl-MyProfile')"));
