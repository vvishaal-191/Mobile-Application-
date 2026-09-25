const fs = require('fs');
const path = require('path');
const vm = require('vm');

const files = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'preview_app.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'index.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'preview_app.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'src', 'screens', 'MyProfile', 'preview.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'src', 'screens', 'ManagerDashboard', 'preview.html'),
];

let allPassed = true;

function assert(condition, message) {
  if (!condition) {
    console.error('❌ FAIL:', message);
    allPassed = false;
  } else {
    console.log('✅ PASS:', message);
  }
}

// 1. Check Manager Dashboard stat cards in all files that contain tpl-ManagerDashboard or preview.html
files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  const basename = path.basename(f);

  if (content.includes('id="tpl-ManagerDashboard"') || f.includes('ManagerDashboard')) {
    console.log(`\n--- Testing Manager Dashboard in ${basename} (${f}) ---`);
    // Chevrons should not be present in stat cards
    assert(!content.includes('<span class="stat-chevron">›</span>'), `${basename}: No chevrons in stat cards`);
    // All stat IDs should be present
    assert(content.includes('id="mgr-stat-pending"'), `${basename}: id="mgr-stat-pending" present`);
    assert(content.includes('id="mgr-stat-approved"'), `${basename}: id="mgr-stat-approved" present`);
    assert(content.includes('id="mgr-stat-rejected"'), `${basename}: id="mgr-stat-rejected" present`);
    assert(content.includes('id="mgr-stat-members"'), `${basename}: id="mgr-stat-members" present`);
    // Classes for themed styling
    assert(content.includes('stat-pending'), `${basename}: stat-pending class present`);
    assert(content.includes('stat-approved'), `${basename}: stat-approved class present`);
    assert(content.includes('stat-rejected'), `${basename}: stat-rejected class present`);
    assert(content.includes('stat-members'), `${basename}: stat-members class present`);
    // Color matched numbers
    assert(content.includes('#0066FF') && content.includes('#00A859') && content.includes('#EF4444') && content.includes('#7C3AED'), `${basename}: Themed number colors present`);
    // Waves present
    assert(content.includes('stat-wave-bg'), `${basename}: stat-wave-bg present`);
  }

  if (content.includes('id="tpl-MyProfile"') || f.includes('MyProfile')) {
    console.log(`\n--- Testing MyProfile Navigation in ${basename} (${f}) ---`);
    // Check that handleProfileBackNav exists and checks role
    assert(content.includes('function handleProfileBackNav()'), `${basename}: handleProfileBackNav defined`);
    assert(content.includes('targetScreen = isManager ? \'tpl-ManagerDashboard\' : \'tpl-EmployeeDashboard\''), `${basename}: handleProfileBackNav checks isManager`);
    
    // Simulate execution of handleProfileBackNav in a VM for Manager
    let lastLoadedScreen = null;
    let alertCalled = false;
    const sandbox = {
      window: {},
      parentWin: {},
      localStorage: { getItem: () => null },
      alert: (msg) => { alertCalled = true; console.log('Alert called with:', msg); },
    };
    sandbox.window.parent = sandbox;
    sandbox.parentWin = sandbox;
    sandbox.AUTH_USER = { role: 'manager', name: 'Vishnu Kumar' };
    sandbox.loadScreen = (tpl) => { lastLoadedScreen = tpl; };

    // Extract handleProfileBackNav function
    const fnMatch = content.match(/function handleProfileBackNav\(\)\s*\{[\s\S]*?\n  \}/);
    if (fnMatch) {
      vm.createContext(sandbox);
      vm.runInContext(fnMatch[0], sandbox);
      vm.runInContext('handleProfileBackNav()', sandbox);
      assert(lastLoadedScreen === 'tpl-ManagerDashboard', `${basename}: handleProfileBackNav() navigates to tpl-ManagerDashboard for Manager (got: ${lastLoadedScreen})`);
      assert(!alertCalled, `${basename}: No alert called when Manager clicks Back`);
    } else {
      assert(false, `${basename}: could not extract handleProfileBackNav function`);
    }

    // Simulate for Employee
    lastLoadedScreen = null;
    alertCalled = false;
    sandbox.AUTH_USER = { role: 'employee', name: 'John Doe' };
    vm.runInContext('handleProfileBackNav()', sandbox);
    assert(lastLoadedScreen === 'tpl-EmployeeDashboard', `${basename}: handleProfileBackNav() navigates to tpl-EmployeeDashboard for Employee`);

    // Test handleNavTab('history') for Manager
    const tabMatch = content.match(/function handleNavTab\(target,\s*event\)\s*\{[\s\S]*?\n  \}/);
    if (tabMatch) {
      lastLoadedScreen = null;
      alertCalled = false;
      sandbox.AUTH_USER = { role: 'manager' };
      vm.runInContext(tabMatch[0], sandbox);
      vm.runInContext('handleNavTab("history")', sandbox);
      assert(lastLoadedScreen === 'tpl-HolidayCalendar', `${basename}: handleNavTab('history') navigates Manager to tpl-HolidayCalendar without restriction (got: ${lastLoadedScreen})`);
      assert(!alertCalled, `${basename}: No restriction alert thrown on history tab for Manager`);
    }
  }
});

console.log('\n=======================================');
if (allPassed) {
  console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
} else {
  console.error('❌ SOME TESTS FAILED');
}
console.log('=======================================\n');
