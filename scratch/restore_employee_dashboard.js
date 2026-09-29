const fs = require('fs');
const path = require('path');

const empTpl = fs.readFileSync(path.join(__dirname, 'tpl_employee_dashboard_restored.html'), 'utf8');

const targetFiles = [
  path.join(__dirname, '../index.html'),
  path.join(__dirname, '../preview_app.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/index.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/preview_app.html')
];

targetFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log('Skipping missing file:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  console.log('\nProcessing:', filePath);

  // 1. Restore sidebar nav button if missing
  const empNavBtn = '<button class="nav-btn" data-tpl="tpl-EmployeeDashboard">Employee Dashboard</button>';
  if (!content.includes('data-tpl="tpl-EmployeeDashboard"')) {
    const myAttendBtn = '<button class="nav-btn" data-tpl="tpl-MyAttendance">';
    if (content.includes(myAttendBtn)) {
      content = content.replace(myAttendBtn, empNavBtn + '\n    ' + myAttendBtn);
      console.log(' - Restored Employee Dashboard nav button in sidebar');
    } else {
      console.log(' - Could not find insertion point for nav button');
    }
  } else {
    console.log(' - Employee Dashboard nav button already exists');
  }

  // 2. Restore tpl-EmployeeDashboard if missing
  if (!content.includes('id="tpl-EmployeeDashboard"')) {
    const myAttendTpl = '<template id="tpl-MyAttendance">';
    if (content.includes(myAttendTpl)) {
      content = content.replace(myAttendTpl, empTpl + '\n\n  ' + myAttendTpl);
      console.log(' - Restored <template id="tpl-EmployeeDashboard">');
    } else {
      console.log(' - Could not find insertion point for <template id="tpl-EmployeeDashboard">');
    }
  } else {
    console.log(' - <template id="tpl-EmployeeDashboard"> already exists');
  }

  // 3. Ensure PREDEFINED_EMPLOYEES and PREDEFINED_MANAGERS exist in outer script
  if (!content.includes('var PREDEFINED_EMPLOYEES =') && !content.includes('const PREDEFINED_EMPLOYEES =')) {
    const defAnchor = 'var EMPLOYEE_ALLOWED_SCREENS =';
    if (content.includes(defAnchor)) {
      const predefinedBlock = `var PREDEFINED_EMPLOYEES = [
        { name: 'John Doe', email: 'john@gmail.com', password: 'employee@123', role: 'Senior Software Engineer', empId: 'EMP-2024-0101', initials: 'JD', reportingManager: 'Vishnu Kumar', phone: '+91 98765 11001' },
        { name: 'Jack Ryan', email: 'jack@gmail.com', password: 'employee@123', role: 'QA Engineer', empId: 'EMP-2024-0102', initials: 'JR', reportingManager: 'Ram Prasad', phone: '+91 98765 11002' },
        { name: 'Sneha Reddy', email: 'sneha@gmail.com', password: 'employee@123', role: 'UI/UX Designer', empId: 'EMP-2024-0103', initials: 'SR', reportingManager: 'Rahul Sharma', phone: '+91 98765 11003' }
      ];

      var PREDEFINED_MANAGERS = [
        { name: 'Vishnu Kumar', email: 'vishnu@gmail.com', password: 'manager@123', role: 'Engineering Manager', empId: 'MGR-2024-0010', initials: 'VK', reportingManager: 'Director of Engineering', phone: '+91 98765 22001' },
        { name: 'Ram Prasad', email: 'ram@gmail.com', password: 'manager@123', role: 'Technical Lead / Manager', empId: 'MGR-2024-0011', initials: 'RP', reportingManager: 'Director of Engineering', phone: '+91 98765 22002' },
        { name: 'Rahul Sharma', email: 'rahul@gmail.com', password: 'manager@123', role: 'Operations Manager', empId: 'MGR-2024-0012', initials: 'RS', reportingManager: 'Vice President', phone: '+91 98765 22003' }
      ];\n\n      ` + defAnchor;
      content = content.replace(defAnchor, predefinedBlock);
      console.log(' - Added PREDEFINED_EMPLOYEES and PREDEFINED_MANAGERS to outer scope');
    }
  }

  // 4. Ensure tpl-Login cleans up sessionStorage AUTH_USER too
  content = content.replace(
    `if (tplId === 'tpl-Login') {
            window.AUTH_USER = null;
            try {
              sessionStorage.removeItem('USER_PROFILE');
            } catch (e) {}`,
    `if (tplId === 'tpl-Login') {
            window.AUTH_USER = null;
            try {
              sessionStorage.removeItem('USER_PROFILE');
              sessionStorage.removeItem('AUTH_USER');
            } catch (e) {}`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(' - Successfully saved:', filePath);
});
