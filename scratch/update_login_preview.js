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
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>
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

  <script src="./preview.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, '../EmergereApp/EmergereApp/src/screens/Login/preview.html'), previewHtml);
console.log('Updated EmergereApp/EmergereApp/src/screens/Login/preview.html successfully with top-aligned card');
