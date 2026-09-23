const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '..', 'preview_app.html'),
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'preview_app.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'index.html')
];

const newTemplateContent = `  <template id="tpl-Login">
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <title>Login</title>
      <style>
        :root {
          --nm-bg: #EEF3F9;
          --nm-surface: #FFFFFF;
          --nm-shadow-light: #FFFFFF;
          --nm-shadow-dark: rgba(160, 185, 215, 0.35);
          --nm-text-main: #0F172A;
          --nm-text-sub: #64748B;
          --nm-blue: #2563EB;
          --nm-blue-gradient: linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%);
        }

        * {
          box-sizing: border-box;
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }

        *::-webkit-scrollbar,
        html::-webkit-scrollbar,
        body::-webkit-scrollbar,
        .device::-webkit-scrollbar,
        .screen::-webkit-scrollbar,
        div::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
          background: transparent !important;
        }

        html, body, .device, .screen {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }

        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: var(--nm-bg);
          display: flex;
          justify-content: center;
          align-items: stretch;
          padding: 0;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
        }

        .device {
          width: 100%;
          max-width: 440px;
          height: 100vh;
          height: 100dvh;
          background: var(--nm-bg);
          border-radius: 0;
          border: none;
          overflow: hidden;
          position: relative;
          box-shadow: none;
          display: flex;
          flex-direction: column;
          margin: 0 auto;
        }

        @media (min-width: 769px) {
          body {
            background: #0e1420;
            padding: 15px 0;
            align-items: center;
          }

          .device {
            border-radius: 40px;
            border: 8px solid #1f2937;
            height: 844px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, .4);
          }
        }

        .screen.neumorphic-login-screen {
          flex: 1;
          height: 100% !important;
          min-height: 100% !important;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 24px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
          align-items: center !important;
          position: relative;
          background: var(--nm-bg);
          color: var(--nm-text-main);
          box-sizing: border-box;
        }

        /* Ambient Background Shapes */
        .bg-shape {
          position: absolute;
          pointer-events: none;
          z-index: 1;
        }

        .bg-circle-tl {
          width: 280px;
          height: 280px;
          top: -100px;
          left: -100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.85) 0%, rgba(225, 236, 249, 0.45) 60%, transparent 100%);
          box-shadow: inset -6px -6px 16px rgba(255, 255, 255, 0.9), 10px 10px 28px rgba(175, 195, 225, 0.22);
        }

        .bg-circle-tr {
          width: 130px;
          height: 130px;
          top: 90px;
          right: -45px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(210, 228, 252, 0.4) 100%);
          box-shadow: 0 10px 24px rgba(165, 188, 218, 0.28);
        }

        .bg-wave-br {
          width: 220px;
          height: 220px;
          bottom: -90px;
          right: -90px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.7) 0%, rgba(210, 228, 252, 0.35) 70%, transparent 100%);
        }

        /* Center Container */
        .login-center-container {
          width: 100%;
          max-width: 390px;
          margin: auto !important;
          display: flex;
          flex-direction: column;
          align-self: center;
          position: relative;
          z-index: 10;
          box-sizing: border-box;
        }

        /* Logo Squircle Plate */
        .login-logo-card {
          width: 104px;
          height: 104px;
          border-radius: 30px;
          margin: 0 auto 20px;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 10;
          box-shadow: 0 16px 36px rgba(160, 185, 215, 0.38), 0 2px 6px rgba(255, 255, 255, 0.95), inset 0 1px 2px rgba(255, 255, 255, 1);
          border: 1.5px solid rgba(255, 255, 255, 0.85);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .login-logo-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 42px rgba(160, 185, 215, 0.45), 0 2px 8px rgba(255, 255, 255, 1);
        }

        .login-logo-img {
          width: 66px;
          height: 66px;
          object-fit: contain;
        }

        /* Headings */
        .welcome-title {
          font-size: 26px;
          font-weight: 800;
          color: var(--nm-text-main);
          margin: 0 0 6px;
          text-align: center;
          letter-spacing: -0.3px;
          position: relative;
          z-index: 10;
        }

        .subtitle-text {
          font-size: 13.5px;
          font-weight: 500;
          color: var(--nm-text-sub);
          letter-spacing: 1.2px;
          margin: 0 0 24px;
          text-align: center;
          position: relative;
          z-index: 10;
        }

        /* Error Messages */
        .error-msg {
          background: #FCE4E4;
          border: 1px solid #F87171;
          color: #E5484D;
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 16px;
          text-align: center;
          box-shadow: 0 4px 14px rgba(229, 72, 77, 0.15);
          position: relative;
          z-index: 10;
        }

        /* Neumorphic Pill Inputs */
        .neumorph-input-wrap {
          height: 54px;
          border-radius: 27px;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          padding: 0 20px;
          margin-bottom: 16px;
          position: relative;
          z-index: 10;
          box-shadow: 0 5px 16px rgba(165, 188, 218, 0.24), inset 0 1px 2px rgba(255, 255, 255, 0.95);
          border: 1.5px solid rgba(255, 255, 255, 0.9);
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .neumorph-input-wrap:focus-within {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18), 0 6px 18px rgba(165, 188, 218, 0.3);
        }

        .input-icon {
          display: flex;
          align-items: center;
          margin-right: 12px;
          color: #64748B;
          flex-shrink: 0;
        }

        .neumorph-input-wrap input {
          flex: 1;
          height: 100%;
          border: none;
          background: transparent;
          color: #0F172A;
          font-size: 14.5px;
          font-weight: 500;
          outline: none;
          font-family: inherit;
          padding: 0;
        }

        .neumorph-input-wrap input::placeholder {
          color: #94A3B8;
          font-weight: 400;
        }

        .eye-btn {
          background: none;
          border: none;
          color: #64748B;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: color 0.15s ease;
        }

        .eye-btn:hover {
          color: #1E293B;
        }

        /* Options Row */
        .login-options-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 4px 6px 22px;
          position: relative;
          z-index: 10;
        }

        .remember-row {
          display: flex;
          align-items: center;
          gap: 9px;
          cursor: pointer;
          user-select: none;
        }

        .chk-box {
          width: 20px;
          height: 20px;
          border-radius: 6px;
          background: var(--nm-blue);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 12px;
          font-weight: bold;
          transition: background 0.15s ease, border-color 0.15s ease;
          border: 1px solid var(--nm-blue);
        }

        .chk-box.unchecked {
          background: #FFFFFF;
          color: transparent;
          border: 1.5px solid #CBD5E1;
        }

        .remember-label {
          font-size: 13.5px;
          font-weight: 600;
          color: #1E293B;
        }

        .forgot-link {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--nm-blue);
          text-decoration: none;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        /* Primary Gradient Login Button */
        .btn-login-neumorph {
          width: 100%;
          height: 56px;
          border-radius: 28px;
          background: var(--nm-blue-gradient);
          color: #FFFFFF;
          font-size: 17.5px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 10;
          box-shadow: 0 10px 24px rgba(37, 99, 235, 0.38), inset 0 1px 2px rgba(255, 255, 255, 0.3);
          transition: transform 0.15s ease, box-shadow 0.2s ease;
          font-family: inherit;
        }

        .btn-login-neumorph:hover {
          box-shadow: 0 12px 28px rgba(37, 99, 235, 0.45);
        }

        .btn-login-neumorph:active {
          transform: scale(0.98);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.3);
        }

        .login-btn-arrow {
          position: absolute;
          right: 8px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.22);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Forgot Password Modal */
        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
        }

        .modal-card {
          width: 100%;
          max-width: 360px;
          background: #FFFFFF;
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
          border: 1.5px solid rgba(255, 255, 255, 0.9);
          animation: modalFadeIn 0.2s ease-out;
        }

        @keyframes modalFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .modal-head h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          color: #0F172A;
        }

        .modal-close {
          font-size: 18px;
          font-weight: 700;
          color: #64748B;
          cursor: pointer;
          padding: 4px;
          transition: color 0.15s ease;
        }

        .modal-close:hover {
          color: #0F172A;
        }

        .modal-sub {
          font-size: 13px;
          color: #64748B;
          margin: 0 0 16px;
          line-height: 1.4;
        }

        .modal-err-box {
          background: #FCE4E4;
          border: 1px solid #F87171;
          color: #E5484D;
          padding: 8px 12px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 14px;
          text-align: center;
        }

        .modal-field {
          margin-bottom: 14px;
        }

        .modal-field label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 6px;
        }

        .modal-field input {
          width: 100%;
          height: 46px;
          border: 1px solid #E2E8F0;
          border-radius: 12px;
          padding: 0 14px;
          font-size: 14px;
          color: #0F172A;
          background: #F1F5F9;
          outline: none;
          box-sizing: border-box;
          font-family: inherit;
        }

        .modal-field input:focus {
          border-color: #3B82F6;
          background: #FFFFFF;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
          margin-top: 18px;
        }

        .btn-cancel {
          flex: 1;
          height: 44px;
          border-radius: 12px;
          background: #F1F5F9;
          color: #475569;
          border: none;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          font-family: inherit;
        }

        .btn-confirm {
          flex: 1;
          height: 44px;
          border-radius: 12px;
          background: #2563EB;
          color: #FFFFFF;
          border: none;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
          font-family: inherit;
        }
      </style>
    </head>

    <body>
      <div class="device">
        <div class="screen neumorphic-login-screen" id="login-screen-wrap">
          <!-- Ambient decorative background shapes -->
          <div class="bg-shape bg-circle-tl"></div>
          <div class="bg-shape bg-circle-tr"></div>
          <div class="bg-shape bg-wave-br"></div>

          <!-- Centered Login Container -->
          <div class="login-center-container">
            <!-- Logo Plate -->
            <div class="login-logo-card">
              <img class="login-logo-img" src="assets/emergere-circuit-logo.png" onerror="if(this.src.indexOf('EmergereApp')===-1){this.src='EmergereApp/EmergereApp/assets/emergere-circuit-logo.png';}else{this.src='assets/emergere-circuit-logo.png';}" alt="Logo" />
            </div>

            <h1 class="welcome-title">Welcome Back</h1>
            <p class="subtitle-text">Sign in to continue</p>

            <div id="login-auth-err" class="error-msg" style="display:none;"></div>

            <!-- Username or Email Input -->
            <div class="neumorph-input-wrap">
              <span class="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input type="email" id="email" data-id="login-email" value="" placeholder="Username or Email" oninput="clearLoginErrors()" onkeydown="if(event.key==='Enter'){event.preventDefault();handleLogin();}" autocomplete="email" />
            </div>

            <!-- Password Input -->
            <div class="neumorph-input-wrap password-wrap">
              <span class="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input id="pwd" data-id="login-pass" type="password" placeholder="Password" oninput="updatePasswordEyeVisibility('pwd');clearLoginErrors();" onkeydown="if(event.key==='Enter'){event.preventDefault();handleLogin();}" autocomplete="current-password" />
              <button type="button" id="pwd-eye" class="eye-btn" onclick="toggleVisibility('pwd')" title="View password" style="display:none;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </button>
            </div>
            <div id="pwd-error" class="error-msg" style="display:none;">Password must contain a minimum of 8 characters.</div>

            <!-- Remember Me & Forgot Password Row -->
            <div class="login-options-row">
              <div class="remember-row" id="remember-container" onclick="toggleRemember(this)">
                <div class="chk-box" id="app-remember-chk">✓</div>
                <span class="remember-label">Remember Me</span>
              </div>
              <a class="forgot-link" onclick="openForgotModal()" href="javascript:void(0)">Forgot Password?</a>
            </div>

            <!-- Primary Login Button -->
            <button type="button" class="btn-login-neumorph" id="login-submit-btn" onclick="handleLogin()">
              <span>Login</span>
              <div class="login-btn-arrow">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </button>
          </div>
        </div>

        <!-- Forgot Password Modal -->
        <div id="forgot-modal" class="modal-overlay" style="display:none;">
          <div class="modal-card">
            <div class="modal-head">
              <h3>Forgot Password?</h3>
              <span class="modal-close" onclick="closeForgotModal()">✕</span>
            </div>
            <p class="modal-sub">Enter your registered Email ID and Contact Number to verify your account.</p>
            
            <div id="modal-err" class="modal-err-box" style="display:none;"></div>

            <div class="modal-field">
              <label>Email ID *</label>
              <input type="email" id="forgot-email" placeholder="Enter your email address" />
            </div>

            <div class="modal-field">
              <label>Contact Number *</label>
              <input type="tel" id="forgot-contact" placeholder="Enter 10-digit contact number" maxlength="10" />
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" onclick="closeForgotModal()">Cancel</button>
              <button type="button" class="btn-confirm" onclick="confirmForgot()">Confirm</button>
            </div>
          </div>
        </div>
      </div>

      <script>
        let isRememberChecked = true;

        const PREDEFINED_EMPLOYEES = [
          { name: 'John Doe', email: 'john@gmail.com', password: 'employee@123', role: 'Senior Software Engineer', empId: 'EMP-2024-0101', initials: 'JD', phone: '+91 98765 11001', reportingManager: 'Vishnu Kumar' },
          { name: 'Jack Ryan', email: 'jack@gmail.com', password: 'employee@123', role: 'QA Engineer', empId: 'EMP-2024-0102', initials: 'JR', phone: '+91 98765 11002', reportingManager: 'Ram Prasad' },
          { name: 'Sneha Reddy', email: 'sneha@gmail.com', password: 'employee@123', role: 'UI/UX Designer', empId: 'EMP-2024-0103', initials: 'SR', phone: '+91 98765 11003', reportingManager: 'Rahul Sharma' }
        ];

        const PREDEFINED_MANAGERS = [
          { name: 'Vishnu Kumar', email: 'vishnu@gmail.com', password: 'manager@123', role: 'Engineering Manager', empId: 'MGR-2024-0010', initials: 'VK', phone: '+91 98765 22001', reportingManager: 'Director of Engineering' },
          { name: 'Ram Prasad', email: 'ram@gmail.com', password: 'manager@123', role: 'Technical Lead / Manager', empId: 'MGR-2024-0011', initials: 'RP', phone: '+91 98765 22002', reportingManager: 'Director of Engineering' },
          { name: 'Rahul Sharma', email: 'rahul@gmail.com', password: 'manager@123', role: 'Operations Manager', empId: 'MGR-2024-0012', initials: 'RS', phone: '+91 98765 22003', reportingManager: 'Vice President' }
        ];

        const EYE_SVG_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
        const EYE_OFF_SVG_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="23" x2="23" y2="1"></line></svg>';

        function clearLoginErrors() {
          const errBox = document.getElementById('login-auth-err');
          const pwdErr = document.getElementById('pwd-error');
          if (errBox) errBox.style.display = 'none';
          if (pwdErr) pwdErr.style.display = 'none';
        }

        function updatePasswordEyeVisibility(id) {
          const input = document.getElementById(id || 'pwd');
          if (!input) return;
          const eyeBtn = document.getElementById(input.id + '-eye') || (input.parentElement ? input.parentElement.querySelector('.eye-btn') : null);
          if (!eyeBtn) return;
          if (input.value && input.value.length > 0) {
            eyeBtn.style.display = 'flex';
            eyeBtn.innerHTML = input.type === 'password' ? EYE_SVG_ICON : EYE_OFF_SVG_ICON;
            eyeBtn.setAttribute('title', input.type === 'password' ? 'View password' : 'Hide password');
          } else {
            eyeBtn.style.display = 'none';
          }
        }

        function toggleVisibility(id) {
          const input = document.getElementById(id);
          if (!input) return;
          const isPass = input.type === 'password';
          input.type = isPass ? 'text' : 'password';
          const eyeBtn = document.getElementById(id + '-eye') || (input.parentElement ? input.parentElement.querySelector('.eye-btn') : null);
          if (eyeBtn) {
            eyeBtn.innerHTML = isPass ? EYE_OFF_SVG_ICON : EYE_SVG_ICON;
            eyeBtn.setAttribute('title', isPass ? 'Hide password' : 'View password');
          }
        }

        function isPasswordMatch(expected, actual) {
          if (!expected || !actual) return false;
          const exp = String(expected).trim();
          const act = String(actual).trim();
          return exp === act || exp.toLowerCase() === act.toLowerCase();
        }

        function handleLogin() {
          const emailInput = document.getElementById('email') || document.getElementById('login-email');
          const pwdInput = document.getElementById('pwd') || document.getElementById('login-pass');
          const errBox = document.getElementById('login-auth-err');
          const pwdErr = document.getElementById('pwd-error') || document.getElementById('login-pass-err');

          if (errBox) errBox.style.display = 'none';
          if (pwdErr) pwdErr.style.display = 'none';

          const emailVal = emailInput ? emailInput.value.trim().toLowerCase() : '';
          const pwdVal = pwdInput ? pwdInput.value.trim() : '';

          if (!emailVal || !pwdVal) {
            if (errBox) {
              errBox.textContent = 'Please enter both email address and password.';
              errBox.style.display = 'block';
            }
            return;
          }

          // 1. Check Manager (vishnu@gmail.com, ram@gmail.com, rahul@gmail.com)
          const matchedManager = PREDEFINED_MANAGERS.find(
            m => m.email.toLowerCase() === emailVal
          );
          if (matchedManager && isPasswordMatch(matchedManager.password, pwdVal)) {
            if (window.parent && typeof window.parent.setAuthUser === 'function') {
              window.parent.setAuthUser('manager', matchedManager);
            } else if (typeof setAuthUser === 'function') {
              setAuthUser('manager', matchedManager);
            }
            if (window.parent && window.parent.loadScreen) {
              window.parent.loadScreen('tpl-ManagerDashboard');
            } else if (typeof loadScreen === 'function') {
              loadScreen('tpl-ManagerDashboard');
            } else {
              alert('Manager login successful! Redirecting to Manager Dashboard.');
            }
            return;
          }

          // 2. Check Employee (john@gmail.com, jack@gmail.com, sneha@gmail.com)
          const matchedEmp = PREDEFINED_EMPLOYEES.find(
            e => e.email.toLowerCase() === emailVal
          );
          if (matchedEmp && isPasswordMatch(matchedEmp.password, pwdVal)) {
            if (window.parent && typeof window.parent.setAuthUser === 'function') {
              window.parent.setAuthUser('employee', matchedEmp);
            } else if (typeof setAuthUser === 'function') {
              setAuthUser('employee', matchedEmp);
            }
            if (window.parent && window.parent.loadScreen) {
              window.parent.loadScreen('tpl-EmployeeDashboard');
            } else if (typeof loadScreen === 'function') {
              loadScreen('tpl-EmployeeDashboard');
            } else {
              alert('Employee login successful! Redirecting to Employee Dashboard.');
            }
            return;
          }

          // Invalid
          if (errBox) {
            errBox.textContent = 'Invalid email address or password. Please check your credentials and try again.';
            errBox.style.display = 'block';
          }
        }
        window.handleAppLogin = handleLogin;
        window.handleLogin = handleLogin;

        function toggleRemember(el) {
          isRememberChecked = !isRememberChecked;
          const chk = document.getElementById('app-remember-chk') || (el ? el.querySelector('.chk-box') : document.querySelector('.chk-box'));
          if (chk) {
            if (isRememberChecked) {
              chk.classList.remove('unchecked');
              chk.textContent = '✓';
            } else {
              chk.classList.add('unchecked');
              chk.textContent = '';
            }
          }
        }
        window.toggleRememberMeApp = toggleRemember;
        window.toggleRemember = toggleRemember;

        function openForgotModal() {
          const forgotEmail = document.getElementById('forgot-email') || document.getElementById('app-forgot-email');
          const forgotContact = document.getElementById('forgot-contact') || document.getElementById('app-forgot-contact');
          const modalErr = document.getElementById('modal-err') || document.getElementById('app-modal-err');
          
          if (forgotEmail) forgotEmail.value = '';
          if (forgotContact) forgotContact.value = '';
          if (modalErr) modalErr.style.display = 'none';

          const modal = document.getElementById('forgot-modal') || document.getElementById('app-forgot-modal');
          if (modal) modal.style.display = 'flex';
        }
        window.openForgotModal = openForgotModal;
        window.openAppForgotModal = openForgotModal;

        function closeForgotModal() {
          const modal = document.getElementById('forgot-modal') || document.getElementById('app-forgot-modal');
          if (modal) modal.style.display = 'none';
        }
        window.closeForgotModal = closeForgotModal;
        window.closeAppForgotModal = closeForgotModal;

        function confirmForgot() {
          const emailInput = document.getElementById('forgot-email') || document.getElementById('app-forgot-email');
          const contactInput = document.getElementById('forgot-contact') || document.getElementById('app-forgot-contact');
          const modalErr = document.getElementById('modal-err') || document.getElementById('app-modal-err');

          const emailVal = emailInput ? emailInput.value.trim() : '';
          const contactVal = contactInput ? contactInput.value.trim() : '';

          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const phoneRegex = /^\d{10}$/;

          if (!emailVal || !emailRegex.test(emailVal)) {
            if (modalErr) {
              modalErr.textContent = 'Please enter a valid registered Email ID.';
              modalErr.style.display = 'block';
            }
            return;
          }

          if (!contactVal || !phoneRegex.test(contactVal.replace(/[\s-]/g, ''))) {
            if (modalErr) {
              modalErr.textContent = 'Please enter a valid 10-digit registered Contact Number.';
              modalErr.style.display = 'block';
            }
            return;
          }

          if (modalErr) modalErr.style.display = 'none';
          closeForgotModal();

          if (window.parent && window.parent.loadScreen) {
            window.parent.loadScreen('tpl-EmployeeDashboard');
          } else if (typeof loadScreen === 'function') {
            loadScreen('tpl-EmployeeDashboard');
          } else {
            alert('Verification successful! Redirecting to Employee Dashboard.');
          }
        }
        window.confirmForgot = confirmForgot;
        window.confirmAppForgot = confirmForgot;

        document.addEventListener('DOMContentLoaded', () => {
          console.log('Neumorphic Login preview ready');
        });
      </script>
    </body>

    </html>
  </template>`;

const tplRegex = /<template\s+id=["']tpl-Login["']>[\s\S]*?<\/template>/;

targetFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error('File not found:', file);
    return;
  }
  const content = fs.readFileSync(file, 'utf8');
  if (!tplRegex.test(content)) {
    console.error('Template tpl-Login not found in:', file);
    return;
  }
  const updated = content.replace(tplRegex, newTemplateContent);
  fs.writeFileSync(file, updated, 'utf8');
  console.log('Successfully updated tpl-Login in:', file);
});
