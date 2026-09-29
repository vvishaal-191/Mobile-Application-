const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

// 1. Extract tpl-Login script
const tplStart = indexHtml.indexOf('<template id="tpl-Login">');
const tplEnd = indexHtml.indexOf('</template>', tplStart);
const tplContent = indexHtml.substring(tplStart, tplEnd);
const scriptMatch = tplContent.match(/<script>([\s\S]*?)<\/script>/);

// 2. Set up mock window and parent window matching index.html
let parentWindow = {
  AUTH_USER: null,
  USER_PROFILE: null,
  currentTpl: 'tpl-Login',
  EMPLOYEE_ALLOWED_SCREENS: ['tpl-Login', 'tpl-EmployeeDashboard', 'tpl-ApplyLeave', 'tpl-MyAttendance', 'tpl-LeaveBalance', 'tpl-LeaveHistory', 'tpl-ApplyPermission', 'tpl-Notifications', 'tpl-MyProfile'],
  MANAGER_ALLOWED_SCREENS: ['tpl-Login', 'tpl-ManagerDashboard', 'tpl-TeamAttendance', 'tpl-LeaveApprovals', 'tpl-LeaveApprovalDetail', 'tpl-PermissionApprovals', 'tpl-MyAttendance', 'tpl-HolidayCalendar', 'tpl-Notifications', 'tpl-MyProfile'],
  sessionStorage: {
    data: {},
    setItem(k, v) { this.data[k] = v; },
    getItem(k) { return this.data[k]; },
    removeItem(k) { delete this.data[k]; }
  }
};

parentWindow.setAuthUser = function(role, userObj) {
  parentWindow.AUTH_USER = Object.assign({}, userObj, { role: role, jobTitle: userObj.role });
  if (role === 'employee') {
    parentWindow.USER_PROFILE = {
      name: userObj.name || 'John Doe',
      role: userObj.role || 'Senior Software Engineer',
      employeeId: userObj.empId || userObj.employeeId || 'EMP-2024-0101',
      initials: userObj.initials || 'JD',
      email: userObj.email || 'john@gmail.com',
      department: 'Engineering',
      team: 'Mobile Development',
      reportingManager: userObj.reportingManager || 'Vishnu Kumar',
      workLocation: 'Bangalore - Tech Park',
      joiningDate: '15-Jan-2024',
      phone: userObj.phone || '+91 98765 11001'
    };
  } else if (role === 'manager') {
    parentWindow.USER_PROFILE = {
      name: userObj.name || 'Vishnu Kumar',
      role: userObj.role || 'Engineering Lead / Manager',
      employeeId: userObj.empId || userObj.employeeId || 'MGR-2024-0010',
      initials: userObj.initials || 'VK',
      email: userObj.email || 'vishnu@gmail.com',
      department: 'Management',
      team: 'Leadership',
      reportingManager: 'Director of Engineering',
      workLocation: 'Bangalore - Tech Park',
      joiningDate: '01-Jun-2022',
      phone: userObj.phone || '+91 98765 22001'
    };
  }
  console.log('[setAuthUser called] role =', role, 'name =', parentWindow.AUTH_USER.name);
};

parentWindow.loadScreen = function(tplId, personKey) {
  console.log('[loadScreen called] tplId =', tplId);
  if (tplId === 'tpl-MyRequests') tplId = 'tpl-LeaveHistory';
  if (tplId === 'tpl-Profile' || tplId === 'Profile') tplId = 'tpl-MyProfile';

  if (parentWindow.AUTH_USER && parentWindow.AUTH_USER.role === 'manager') {
    if (tplId === 'tpl-EmployeeDashboard' || tplId === 'tpl-Dashboard') {
      tplId = 'tpl-ManagerDashboard';
      console.log('  -> Diverted to tpl-ManagerDashboard because AUTH_USER.role === "manager"');
    }
    if (tplId === 'tpl-LeaveHistory' || tplId === 'tpl-History') {
      tplId = 'tpl-HolidayCalendar';
    }
  } else {
    if (tplId === 'tpl-Dashboard') {
      tplId = 'tpl-EmployeeDashboard';
    }
  }

  parentWindow.currentTpl = tplId;
  console.log('[FINAL SCREEN LOADED]:', tplId);
};

// 3. Mock document inside iframe
let clickListener = null;
const iframeDoc = {
  getElementById(id) {
    if (id === 'email') return { value: 'john@gmail.com', style: {} };
    if (id === 'password' || id === 'pwd') return { value: 'employee@123', style: {} };
    if (id === 'btn-login-submit' || id === 'btn-login') {
      return {
        style: {},
        addEventListener(event, fn) {
          if (event === 'click') clickListener = fn;
        }
      };
    }
    return { style: {}, addEventListener() {} };
  }
};

const iframeWin = {
  parent: parentWindow,
  document: iframeDoc,
  location: { pathname: '/index.html' }
};

// Execute tpl-Login script
const runTpl = new Function('document', 'window', scriptMatch[1]);
runTpl(iframeDoc, iframeWin);

console.log('\n--- SIMULATING CLICK ON LOGIN BUTTON WITH john@gmail.com ---');
if (clickListener) {
  clickListener();
} else {
  console.log('Error: No click listener attached to login button!');
}
