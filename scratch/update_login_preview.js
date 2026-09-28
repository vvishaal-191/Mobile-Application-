const fs = require('fs');
const path = require('path');

const b64Data = JSON.parse(fs.readFileSync(path.join(__dirname, 'login_assets_base64.json'), 'utf8'));

const previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<title>Login - Preview</title>
<link rel="stylesheet" href="../../../preview/base.css" />
<link rel="stylesheet" href="./preview.css" />
</head>
<body>

  <div class="device">
    <div class="screen login-redesign-screen" id="login-screen-wrap">
      
      <!-- Top Royal Blue Banner with Skyscrapers & Circuit Logo (Exact Image 2 Reference) -->
      <div class="login-header-banner-container">
        <img class="login-header-banner-img" src="${b64Data.topHeader}" alt="Welcome Back - Sign in to continue to your account" />
      </div>

      <!-- Floating Main Form Card -->
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
        <button type="button" id="btn-login-submit" class="btn-login-gradient">
          <span class="btn-login-text">Login</span>
          <div class="login-btn-arrow-disc">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </button>
      </div>

      <!-- Bottom Luminous Blue Waves Decoration -->
      <div class="login-bottom-wave-wrap">
        <img class="login-bottom-waves-img" src="${b64Data.bottomWave}" alt="" />
      </div>

      <!-- Forgot Password Modal -->
      <div id="forgot-pwd-modal" class="modal-overlay" style="display:none;">
        <div class="modal-card">
          <div class="modal-head">
            <h3>Reset Password</h3>
            <span class="modal-close" id="modal-close-btn">&times;</span>
          </div>
          <p class="modal-sub">Enter your registered email address to receive password reset instructions.</p>
          <div id="modal-err" class="modal-err-box" style="display:none;"></div>
          <div class="modal-field">
            <label>Email Address</label>
            <input type="email" id="modal-email-input" placeholder="name@emergere.com" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-cancel" id="modal-cancel-btn">Cancel</button>
            <button type="button" class="btn-confirm" id="modal-submit-btn">Send Reset Link</button>
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
      const pwdInput = document.getElementById('password');
      const emailErr = document.getElementById('email-err');
      const pwdErr = document.getElementById('password-err');
      const authErr = document.getElementById('login-auth-err');
      const togglePwdBtn = document.getElementById('toggle-pwd-btn');
      const eyeIcon = document.getElementById('eye-icon');
      const rememberToggle = document.getElementById('remember-me-toggle');
      const rememberChk = document.getElementById('remember-chk');
      const loginBtn = document.getElementById('btn-login-submit');

      const forgotLink = document.getElementById('forgot-password-link');
      const forgotModal = document.getElementById('forgot-pwd-modal');
      const modalClose = document.getElementById('modal-close-btn');
      const modalCancel = document.getElementById('modal-cancel-btn');
      const modalSubmit = document.getElementById('modal-submit-btn');
      const modalEmail = document.getElementById('modal-email-input');
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

      // Predefined Credentials (preserved 100%)
      const managers = ['vishnu@gmail.com', 'ram@gmail.com', 'rahul@gmail.com'];
      const employees = ['john@gmail.com', 'jack@gmail.com', 'sneha@gmail.com'];

      // Login Submission Logic
      if (loginBtn) {
        loginBtn.addEventListener('click', function() {
          let hasErr = false;
          const emailVal = emailInput.value.trim();
          const pwdVal = pwdInput.value;

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
          if (managers.includes(emailVal.toLowerCase())) {
            if (pwdVal === 'manager@123') {
              if (window.parent && window.parent.postMessage) {
                window.parent.postMessage({ type: 'NAVIGATE', screen: 'ManagerDashboard', role: 'manager', email: emailVal }, '*');
              }
              alert('Login Successful as Manager! Navigating to Manager Dashboard...');
              return;
            } else {
              authErr.textContent = 'Invalid manager password. Use: manager@123';
              authErr.style.display = 'block';
              return;
            }
          }

          // Check Employee
          if (employees.includes(emailVal.toLowerCase())) {
            if (pwdVal === 'employee@123') {
              if (window.parent && window.parent.postMessage) {
                window.parent.postMessage({ type: 'NAVIGATE', screen: 'EmployeeDashboard', role: 'employee', email: emailVal }, '*');
              }
              alert('Login Successful as Employee! Navigating to Employee Dashboard...');
              return;
            } else {
              authErr.textContent = 'Invalid employee password. Use: employee@123';
              authErr.style.display = 'block';
              return;
            }
          }

          // Generic credentials check
          if (pwdVal.length >= 6) {
            if (window.parent && window.parent.postMessage) {
              window.parent.postMessage({ type: 'NAVIGATE', screen: 'EmployeeDashboard', role: 'employee', email: emailVal }, '*');
            }
            alert('Login Successful! Navigating to Dashboard...');
          } else {
            authErr.textContent = 'Invalid credentials. Please verify your email and password.';
            authErr.style.display = 'block';
          }
        });
      }

      // Modal Handlers
      if (forgotLink) {
        forgotLink.addEventListener('click', function() {
          forgotModal.style.display = 'flex';
          modalErr.style.display = 'none';
          modalEmail.value = emailInput.value || '';
        });
      }

      function closeModal() {
        forgotModal.style.display = 'none';
      }

      if (modalClose) modalClose.addEventListener('click', closeModal);
      if (modalCancel) modalCancel.addEventListener('click', closeModal);

      if (modalSubmit) {
        modalSubmit.addEventListener('click', function() {
          const val = modalEmail.value.trim();
          if (!val) {
            modalErr.textContent = 'Please enter your email address.';
            modalErr.style.display = 'block';
            return;
          }
          alert('Password reset instructions have been sent to ' + val);
          closeModal();
        });
      }
    })();
  </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../EmergereApp/EmergereApp/src/screens/Login/preview.html'), previewHtml);
console.log('Updated preview.html successfully');
