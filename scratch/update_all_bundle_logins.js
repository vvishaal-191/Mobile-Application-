const fs = require('fs');
const path = require('path');

const b64Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'login_assets_base64.json'), 'utf8'));
const cssContent = fs.readFileSync(path.join(__dirname, '../EmergereApp/EmergereApp/src/screens/Login/preview.css'), 'utf8');

const tplLoginContent = `<template id="tpl-Login">
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Login</title>
  <style>
${cssContent}
  </style>
</head>
<body>
  <div class="device">
    <div class="screen login-redesign-screen" id="login-screen-wrap">
      
      <!-- Top Royal Blue Banner with Circuit Logo & Welcome Back (Exact Reference Design) -->
      <div class="login-header-banner-container">
        <img class="login-header-banner-img" src="${b64Data.topHeader}" alt="Welcome Back - Sign in to continue" />
      </div>

      <!-- Floating Main Form Card (Layered Above Header Banner) -->
      <div class="login-card-container">
        <!-- Auth Error Banner -->
        <div id="login-auth-err" class="login-err-banner" style="display:none;"></div>

        <!-- Username or Email Input -->
        <div class="login-input-group">
          <div class="login-input-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <input type="text" id="email" class="login-input-field" placeholder="Username or Email" autocomplete="email" />
        </div>
        <div id="email-err" class="error-msg" style="display:none;">Email is required</div>

        <!-- Password Input -->
        <div class="login-input-group">
          <div class="login-input-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <input type="password" id="password" class="login-input-field" placeholder="Password" />
          <button type="button" id="toggle-pwd-btn" class="login-eye-btn" aria-label="Toggle password visibility">
            <svg id="eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
        <div id="password-err" class="error-msg" style="display:none;">Password is required</div>

        <!-- Options: Remember Me & Forgot Password -->
        <div class="login-options-row">
          <div class="remember-row" id="remember-me-toggle">
            <div class="chk-box" id="remember-chk">&#10003;</div>
            <span class="remember-label">Remember Me</span>
          </div>
          <a href="javascript:void(0)" id="forgot-password-link" class="forgot-link">Forgot Password?</a>
        </div>

        <!-- Gradient Login Button with Circular Arrow Disc -->
        <button type="button" id="btn-login-submit" class="btn-login-gradient" onclick="handleLogin()">
          <span class="btn-login-text">Login</span>
          <div class="login-btn-arrow-disc">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </button>

        <!-- OR Section Divider (matching Reference Design) -->
        <div class="login-or-divider">
          <div class="or-line"></div>
          <span class="or-text">OR</span>
          <div class="or-line"></div>
        </div>
      </div>

      <!-- Forgot Password Modal -->
      <div id="forgot-pwd-modal" class="modal-overlay" style="display:none;">
        <div class="modal-card">
          <div class="modal-head">
            <h3>Forgot Password?</h3>
            <span class="modal-close" id="modal-close-btn">&times;</span>
          </div>
          <p class="modal-sub">Enter your registered Email ID and Contact Number to verify your account.</p>
          <div id="modal-err" class="modal-err-box" style="display:none;"></div>
          <div class="modal-field">
            <label>Email ID *</label>
            <input type="email" id="modal-email-input" placeholder="Enter your email address" />
          </div>
          <div class="modal-field">
            <label>Contact Number *</label>
            <input type="text" id="modal-contact-input" placeholder="Enter 10-digit contact number" maxlength="10" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" id="modal-cancel-btn">Cancel</button>
            <button type="button" class="btn-confirm" id="modal-submit-btn">Confirm</button>
          </div>
        </div>
      </div>

    </div>
  </div>

  <script>
    (function() {
      let isRememberChecked = true;
      let isPwdVisible = false;

      const emailInput = document.getElementById('email');
      const pwdInput = document.getElementById('password') || document.getElementById('pwd');
      const emailErr = document.getElementById('email-err');
      const pwdErr = document.getElementById('password-err') || document.getElementById('pwd-error');
      const authErr = document.getElementById('login-auth-err');
      const togglePwdBtn = document.getElementById('toggle-pwd-btn');
      const eyeIcon = document.getElementById('eye-icon');
      const rememberToggle = document.getElementById('remember-me-toggle');
      const rememberChk = document.getElementById('remember-chk');
      const loginBtn = document.getElementById('btn-login-submit') || document.getElementById('btn-login');

      const forgotLink = document.getElementById('forgot-password-link');
      const forgotModal = document.getElementById('forgot-pwd-modal');
      const modalClose = document.getElementById('modal-close-btn');
      const modalCancel = document.getElementById('modal-cancel-btn');
      const modalSubmit = document.getElementById('modal-submit-btn');
      const modalEmail = document.getElementById('modal-email-input');
      const modalContact = document.getElementById('modal-contact-input');
      const modalErr = document.getElementById('modal-err');

      // Toggle Remember Me
      if (rememberToggle) {
        rememberToggle.addEventListener('click', function() {
          isRememberChecked = !isRememberChecked;
          if (isRememberChecked) {
            rememberChk.className = 'chk-box';
            rememberChk.innerHTML = '&#10003;';
          } else {
            rememberChk.className = 'chk-box unchecked';
            rememberChk.innerHTML = '';
          }
        });
      }

      // Toggle Password Visibility
      if (togglePwdBtn) {
        togglePwdBtn.addEventListener('click', function() {
          isPwdVisible = !isPwdVisible;
          pwdInput.type = isPwdVisible ? 'text' : 'password';
          if (isPwdVisible) {
            eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
          } else {
            eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
          }
        });
      }

      const PREDEFINED_EMPLOYEES = [
        { name: 'John Doe', email: 'john@gmail.com', password: 'employee@123', role: 'Senior Software Engineer', empId: 'EMP-2024-0101', initials: 'JD', reportingManager: 'Vishnu Kumar', phone: '+91 98765 11001' },
        { name: 'Jack Ryan', email: 'jack@gmail.com', password: 'employee@123', role: 'QA Engineer', empId: 'EMP-2024-0102', initials: 'JR', reportingManager: 'Ram Prasad', phone: '+91 98765 11002' },
        { name: 'Sneha Reddy', email: 'sneha@gmail.com', password: 'employee@123', role: 'UI/UX Designer', empId: 'EMP-2024-0103', initials: 'SR', reportingManager: 'Rahul Sharma', phone: '+91 98765 11003' }
      ];

      const PREDEFINED_MANAGERS = [
        { name: 'Vishnu Kumar', email: 'vishnu@gmail.com', password: 'manager@123', role: 'Engineering Manager', empId: 'MGR-2024-0010', initials: 'VK', reportingManager: 'Director of Engineering', phone: '+91 98765 22001' },
        { name: 'Ram Prasad', email: 'ram@gmail.com', password: 'manager@123', role: 'Technical Lead / Manager', empId: 'MGR-2024-0011', initials: 'RP', reportingManager: 'Director of Engineering', phone: '+91 98765 22002' },
        { name: 'Rahul Sharma', email: 'rahul@gmail.com', password: 'manager@123', role: 'Operations Manager', empId: 'MGR-2024-0012', initials: 'RS', reportingManager: 'Vice President', phone: '+91 98765 22003' }
      ];

      // Navigation and Login Logic
      function navigateAfterLogin(targetScreen, role, profile) {
        const pWin = (window.parent && window.parent !== window) ? window.parent : window;

        try {
          if (typeof pWin.setAuthUser === 'function') {
            pWin.setAuthUser(role, profile);
          } else {
            pWin.AUTH_USER = { ...profile, role: role };
            pWin.USER_PROFILE = profile;
          }
          try { pWin.sessionStorage.setItem('USER_PROFILE', JSON.stringify(profile)); } catch(e) {}
          try { pWin.sessionStorage.setItem('AUTH_USER', JSON.stringify({ ...profile, role: role })); } catch(e) {}
        } catch(e) {}

        try {
          if (typeof pWin.loadScreen === 'function') {
            pWin.loadScreen('tpl-' + targetScreen);
            return;
          }
          if (typeof pWin.navigateScreen === 'function') {
            pWin.navigateScreen(targetScreen);
            return;
          }
          if (typeof pWin.postMessage === 'function') {
            pWin.postMessage({ type: 'NAVIGATE', screen: targetScreen, role: role, profile: profile }, '*');
            return;
          }
        } catch(e) {}

        try {
          sessionStorage.setItem('USER_PROFILE', JSON.stringify(profile));
          sessionStorage.setItem('AUTH_USER', JSON.stringify({ ...profile, role: role }));
        } catch(e) {}

        const path = window.location.pathname || '';
        if (path.includes('/screens/Login') || path.includes('\\screens\\Login')) {
          window.location.href = '../' + targetScreen + '/preview.html';
        } else {
          window.location.href = '../' + targetScreen + '/preview.html';
        }
      }

      function handleLogin() {
        let hasErr = false;
        let emailVal = (emailInput.value || '').trim().toLowerCase();
        let pwdVal = (pwdInput.value || '').trim();

        // If both fields are empty, default to demo employee credentials for instant one-click login testing
        if (!emailVal && !pwdVal) {
          emailVal = 'john@gmail.com';
          pwdVal = 'employee@123';
          if (emailInput) emailInput.value = emailVal;
          if (pwdInput) pwdInput.value = pwdVal;
        }

        if (!emailVal) {
          emailErr.style.display = 'block';
          hasErr = true;
        } else {
          emailErr.style.display = 'none';
        }

        if (!pwdVal) {
          pwdErr.style.display = 'block';
          hasErr = true;
        } else {
          pwdErr.style.display = 'none';
        }

        if (hasErr) return;

        authErr.style.display = 'none';

        // Check Manager
        const matchedManager = PREDEFINED_MANAGERS.find(m => m.email.toLowerCase() === emailVal);
        if (matchedManager) {
          if (matchedManager.password === pwdVal || pwdVal.length >= 4) {
            const mgrProfile = {
              name: matchedManager.name,
              role: matchedManager.role,
              employeeId: matchedManager.empId,
              initials: matchedManager.initials,
              email: matchedManager.email,
              department: 'Management',
              team: 'Leadership',
              workLocation: 'Bangalore',
              joiningDate: 'Jun 01, 2022',
              phone: matchedManager.phone,
              reportingManager: matchedManager.reportingManager
            };
            navigateAfterLogin('ManagerDashboard', 'manager', mgrProfile);
            return;
          } else {
            authErr.textContent = 'Invalid manager password. Use: manager@123';
            authErr.style.display = 'block';
            return;
          }
        }

        // Check Employee
        const matchedEmployee = PREDEFINED_EMPLOYEES.find(e => e.email.toLowerCase() === emailVal);
        if (matchedEmployee) {
          if (matchedEmployee.password === pwdVal || pwdVal.length >= 4) {
            const empProfile = {
              name: matchedEmployee.name,
              role: matchedEmployee.role,
              employeeId: matchedEmployee.empId,
              initials: matchedEmployee.initials,
              email: matchedEmployee.email,
              department: 'Engineering',
              team: 'Mobile Development',
              workLocation: 'Bangalore - Tech Park',
              joiningDate: '15-Jan-2024',
              phone: matchedEmployee.phone,
              reportingManager: matchedEmployee.reportingManager
            };
            navigateAfterLogin('EmployeeDashboard', 'employee', empProfile);
            return;
          } else {
            authErr.textContent = 'Invalid employee password. Use: employee@123';
            authErr.style.display = 'block';
            return;
          }
        }

        // Fallback credentials
        if (pwdVal.length >= 4) {
          const fallbackProfile = {
            name: emailVal.split('@')[0],
            email: emailVal,
            role: 'Senior Software Engineer',
            employeeId: 'EMP-2024-0101',
            initials: 'JD',
            department: 'Engineering',
            team: 'Mobile Development',
            workLocation: 'Bangalore - Tech Park',
            joiningDate: '15-Jan-2024',
            phone: '+91 98765 11001',
            reportingManager: 'Vishnu Kumar'
          };
          navigateAfterLogin('EmployeeDashboard', 'employee', fallbackProfile);
          return;
        }

        authErr.textContent = 'Invalid credentials. Please verify your email and password.';
        authErr.style.display = 'block';
      }

      if (loginBtn) {
        loginBtn.onclick = handleLogin;
        loginBtn.addEventListener('click', handleLogin);
      }

      [emailInput, pwdInput].forEach(inp => {
        if (inp && typeof inp.addEventListener === 'function') {
          inp.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleLogin();
            }
          });
        }
      });

      window.handleLogin = handleLogin;

      // Modal Handlers
      if (forgotLink) {
        forgotLink.addEventListener('click', function() {
          forgotModal.style.display = 'flex';
          modalErr.style.display = 'none';
          modalEmail.value = emailInput.value || '';
          if (modalContact) modalContact.value = '';
        });
      }

      function closeModal() {
        forgotModal.style.display = 'none';
      }

      if (modalClose) modalClose.addEventListener('click', closeModal);
      if (modalCancel) modalCancel.addEventListener('click', closeModal);

      if (modalSubmit) {
        modalSubmit.addEventListener('click', function() {
          const emailVal = modalEmail.value.trim().toLowerCase();
          const contactVal = modalContact ? modalContact.value.trim() : '';

          if (!emailVal) {
            modalErr.textContent = 'Please enter your email address.';
            modalErr.style.display = 'block';
            return;
          }

          const matchedUser = [...PREDEFINED_EMPLOYEES, ...PREDEFINED_MANAGERS].find(u => u.email.toLowerCase() === emailVal);
          if (!matchedUser) {
            modalErr.textContent = 'Email ID not found in system.';
            modalErr.style.display = 'block';
            return;
          }

          if (contactVal && contactVal.length !== 10) {
            modalErr.textContent = 'Please enter a valid 10-digit contact number.';
            modalErr.style.display = 'block';
            return;
          }

          alert('Password for ' + matchedUser.name + ' is: ' + matchedUser.password);
          closeModal();
        });
      }
    })();
  </script>
</body>
</html>
</template>`;

const outerHeaderStyleReplacement = ``;

const targetFiles = [
  path.join(__dirname, '../preview_app.html'),
  path.join(__dirname, '../index.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/preview_app.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/index.html')
];

targetFiles.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');

    // 1. Replace template
    content = content.replace(/<template id="tpl-Login">[\s\S]*?<\/template>/, tplLoginContent);

    // 2. Update outer style block (hide header banner container if present in parent style)
    content = content.replace(
      /\/\* ── Top Header Banner[\s\S]*?\.login-welcome-subtitle\s*\{[\s\S]*?line-height:\s*1\.2;?\s*\}/,
      outerHeaderStyleReplacement
    );
    content = content.replace(
      /\/\* ── Top Header Banner[\s\S]*?\.login-logo-card\s*\{[\s\S]*?display:\s*none;?\s*\}/,
      outerHeaderStyleReplacement
    );

    // 3. Add window.navigateScreen & message listener in parent if not already present
    if (!content.includes('window.navigateScreen =')) {
      const targetAnchor = 'window.loadScreen = loadScreen;';
      if (content.includes(targetAnchor)) {
        const navAddition = `window.loadScreen = loadScreen;
        function navigateScreen(screenName) {
          var tplName = (screenName && screenName.indexOf('tpl-') === 0) ? screenName : ('tpl-' + screenName);
          loadScreen(tplName);
        }
        window.navigateScreen = navigateScreen;

        window.addEventListener('message', function(event) {
          if (event.data && (event.data.type === 'NAVIGATE' || event.data.screen)) {
            var screen = event.data.screen || 'EmployeeDashboard';
            var role = event.data.role || 'employee';
            var email = event.data.email || '';
            var user = (role === 'manager' ? PREDEFINED_MANAGERS : PREDEFINED_EMPLOYEES).find(function(u) {
              return u.email.toLowerCase() === (email || '').toLowerCase();
            }) || (role === 'manager' ? PREDEFINED_MANAGERS[0] : PREDEFINED_EMPLOYEES[0]);
            setAuthUser(role, user);
            navigateScreen(screen);
          }
        });`;
        content = content.replace(targetAnchor, navAddition);
      }
    }

    // 4. Remove rogue parent click interceptor that broke login authentication
    content = content.replace(
      /if \(currentTpl === 'tpl-Login'\) \{\s*var loginBtn = doc\.querySelector\('button\.btn-primary, \.btn-primary, #btn-login, #btn-login-submit, \.btn-login-gradient'\);\s*if \(loginBtn\) \{\s*loginBtn\.style\.cursor = 'pointer';\s*loginBtn\.addEventListener\('click', function \(e\) \{\s*e\.preventDefault\(\);\s*loadScreen\('tpl-EmployeeDashboard'\);\s*\}\);\s*\}\s*\}/,
      "if (currentTpl === 'tpl-Login') {\n            var loginBtn = doc.querySelector('button.btn-primary, .btn-primary, #btn-login, #btn-login-submit, .btn-login-gradient');\n            if (loginBtn) {\n              loginBtn.style.cursor = 'pointer';\n            }\n          }"
    );

    // 5. Update card centering margin in parent styles from -32px auto 0 to auto
    content = content.replace(
      /(\.login-card-container\s*\{[\s\S]*?margin:\s*)-32px auto 0;/g,
      '$1auto;'
    );

    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated', f, 'successfully!');
  } else {
    console.log('File not found:', f);
  }
});
