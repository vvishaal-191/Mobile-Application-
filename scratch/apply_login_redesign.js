const fs = require('fs');
const path = require('path');

const logoBase64 = fs.readFileSync('EmergereApp/EmergereApp/assets/tech-circuit-logo.png').toString('base64');
const logoDataUri = 'data:image/png;base64,' + logoBase64;

// 1. New HTML markup for Login screen
const newLoginHtml = `
  <div class="device">
    <div class="screen login-redesign-screen" id="login-screen-wrap">
      
      <!-- Top Royal Blue Banner with Skyscrapers & Luminous Wave Layers -->
      <div class="login-header-banner">
        <svg class="login-header-bg-svg" viewBox="0 0 400 240" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lgnHdrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0056FF"/>
              <stop offset="45%" stop-color="#0066FF"/>
              <stop offset="85%" stop-color="#1D4ED8"/>
              <stop offset="100%" stop-color="#0D3BB0"/>
            </linearGradient>
            <linearGradient id="bldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#93C5FD" stop-opacity="0.32"/>
              <stop offset="100%" stop-color="#1E40AF" stop-opacity="0.08"/>
            </linearGradient>
            <linearGradient id="bldGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#60A5FA" stop-opacity="0.45"/>
              <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0.15"/>
            </linearGradient>
            <linearGradient id="bldGrad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#BFDBFE" stop-opacity="0.28"/>
              <stop offset="100%" stop-color="#1E3A8A" stop-opacity="0.05"/>
            </linearGradient>
            <linearGradient id="lgnRibbon1" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.45"/>
              <stop offset="50%" stop-color="#2563EB" stop-opacity="0.25"/>
              <stop offset="100%" stop-color="#0284C7" stop-opacity="0.05"/>
            </linearGradient>
            <linearGradient id="lgnRibbon2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#60A5FA" stop-opacity="0.38"/>
              <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0.08"/>
            </linearGradient>
          </defs>

          <!-- Base Gradient Background -->
          <rect width="400" height="240" fill="url(#lgnHdrGrad)"/>

          <!-- High-Rise Skyscraper Architecture Backdrop on Right -->
          <g opacity="0.88">
            <!-- Background building -->
            <polygon points="260,240 260,95 305,65 305,240" fill="url(#bldGrad1)"/>
            <line x1="270" y1="110" x2="295" y2="110" stroke="#FFFFFF" stroke-opacity="0.18" stroke-dasharray="2,3"/>
            <line x1="270" y1="125" x2="295" y2="125" stroke="#FFFFFF" stroke-opacity="0.18" stroke-dasharray="2,3"/>
            <line x1="270" y1="140" x2="295" y2="140" stroke="#FFFFFF" stroke-opacity="0.18" stroke-dasharray="2,3"/>
            <line x1="270" y1="155" x2="295" y2="155" stroke="#FFFFFF" stroke-opacity="0.18" stroke-dasharray="2,3"/>

            <!-- Mid-ground building -->
            <polygon points="295,240 295,75 345,45 345,240" fill="url(#bldGrad3)"/>
            <line x1="305" y1="85" x2="335" y2="85" stroke="#FFFFFF" stroke-opacity="0.2" stroke-dasharray="3,3"/>
            <line x1="305" y1="100" x2="335" y2="100" stroke="#FFFFFF" stroke-opacity="0.2" stroke-dasharray="3,3"/>
            <line x1="305" y1="115" x2="335" y2="115" stroke="#FFFFFF" stroke-opacity="0.2" stroke-dasharray="3,3"/>
            <line x1="305" y1="130" x2="335" y2="130" stroke="#FFFFFF" stroke-opacity="0.2" stroke-dasharray="3,3"/>

            <!-- Foreground Glass Tower (Skyscraper on far right) -->
            <polygon points="330,240 330,55 385,25 400,32 400,240" fill="url(#bldGrad2)"/>
            <line x1="330" y1="55" x2="385" y2="25" stroke="#FFFFFF" stroke-opacity="0.45" stroke-width="1.5"/>
            <line x1="345" y1="70" x2="395" y2="42" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1"/>
            <line x1="345" y1="90" x2="395" y2="62" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1"/>
            <line x1="345" y1="110" x2="395" y2="82" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1"/>
            <line x1="345" y1="130" x2="395" y2="102" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1"/>
            <line x1="345" y1="150" x2="395" y2="122" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1"/>
            <line x1="345" y1="170" x2="395" y2="142" stroke="#FFFFFF" stroke-opacity="0.25" stroke-width="1"/>
            <line x1="355" y1="65" x2="355" y2="240" stroke="#FFFFFF" stroke-opacity="0.2"/>
            <line x1="375" y1="50" x2="375" y2="240" stroke="#FFFFFF" stroke-opacity="0.2"/>
          </g>

          <!-- Translucent Flowing Wave Ribbons -->
          <path d="M-20,90 C80,40 180,110 280,75 C340,55 380,25 420,10 L420,240 L-20,240 Z" fill="url(#lgnRibbon1)"/>
          <path d="M420,130 C320,140 220,90 140,150 C80,195 20,220 -20,230 L-20,240 L420,240 Z" fill="url(#lgnRibbon2)"/>

          <!-- Organic Lower Transition Waves -->
          <path d="M-10,175 C80,185 140,240 220,210 C290,185 350,195 410,180 L410,240 L-10,240 Z" fill="#FFFFFF" fill-opacity="0.22"/>
          <path d="M-10,195 C70,195 130,245 200,225 C280,200 340,235 410,205 L410,240 L-10,240 Z" fill="#FFFFFF" fill-opacity="0.38"/>
          <path d="M-10,210 C60,205 120,248 190,238 C260,228 330,248 410,220 L410,240 L-10,240 Z" fill="#EEF5FF"/>
        </svg>

        <div class="login-header-content">
          <h1 class="login-header-title">Welcome <span class="accent-sky">Back</span></h1>
          <p class="login-header-sub">Sign in to continue to your account</p>
          <div class="login-header-pill-bar">
            <span class="pill-white"></span>
            <span class="pill-cyan"></span>
          </div>
        </div>
      </div>

      <!-- Overlapping Centered Logo Squircle -->
      <div class="login-logo-card-wrap">
        <div class="login-logo-card">
          <img class="login-logo-img" src="${logoDataUri}" alt="Emergere Circuit Logo" />
        </div>
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

        <!-- Password Input -->
        <div class="login-input-group">
          <div class="login-input-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <input type="password" id="pwd" class="login-input-field" placeholder="Password" autocomplete="current-password" />
          <button type="button" class="login-eye-btn" id="pwd-eye" onclick="toggleVisibility('pwd')" title="Show password" aria-label="Show password">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
        <div id="pwd-error" class="error-msg" style="display:none;">Password must contain a minimum of 8 characters.</div>

        <!-- Remember Me & Forgot Password Row -->
        <div class="login-options-row">
          <div class="remember-row" onclick="toggleRemember(this)">
            <div class="chk-box">✓</div>
            <span class="remember-label">Remember Me</span>
          </div>
          <a class="forgot-link" onclick="openForgotModal()" href="javascript:void(0)">Forgot Password?</a>
        </div>

        <!-- Primary Login Button -->
        <button type="button" class="btn-login-gradient" id="btn-login" onclick="handleLogin()">
          <span class="btn-login-text">Login</span>
          <div class="login-btn-arrow-disc">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </div>
        </button>

        <!-- OR Divider -->
        <div class="login-or-divider">
          <span class="or-line"></span>
          <span class="or-text">OR</span>
          <span class="or-line"></span>
        </div>
      </div>

      <!-- Bottom Ocean Waves Decoration with Floating Bokeh Orbs -->
      <div class="login-bottom-wave-wrap">
        <svg class="login-bottom-waves-svg" viewBox="0 0 400 180" fill="none" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="botWaveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.4"/>
              <stop offset="50%" stop-color="#60A5FA" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#2563EB" stop-opacity="0.15"/>
            </linearGradient>
            <linearGradient id="botWaveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#0066FF" stop-opacity="0.9"/>
              <stop offset="60%" stop-color="#1D4ED8" stop-opacity="0.95"/>
              <stop offset="100%" stop-color="#0052FF" stop-opacity="0.98"/>
            </linearGradient>
            <linearGradient id="botWaveGrad3" x1="0%" y1="0%" x2="100%" y2="80%">
              <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.65"/>
              <stop offset="60%" stop-color="#2563EB" stop-opacity="0.85"/>
              <stop offset="100%" stop-color="#1E40AF" stop-opacity="0.95"/>
            </linearGradient>
          </defs>

          <!-- Top cyan wave -->
          <path d="M0,70 C100,120 220,10 320,80 C360,110 390,90 400,80 L400,180 L0,180 Z" fill="url(#botWaveGrad1)"/>

          <!-- Middle cyan-blue wave -->
          <path d="M0,105 C80,60 180,130 280,85 C340,60 380,95 400,100 L400,180 L0,180 Z" fill="url(#botWaveGrad3)"/>

          <!-- Front deep royal wave -->
          <path d="M0,135 C110,95 210,165 310,120 C360,100 385,125 400,130 L400,180 L0,180 Z" fill="url(#botWaveGrad2)"/>

          <!-- Floating translucent glowing bubbles/orbs -->
          <circle cx="55" cy="115" r="14" fill="#FFFFFF" fill-opacity="0.28"/>
          <circle cx="110" cy="148" r="9" fill="#FFFFFF" fill-opacity="0.35"/>
          <circle cx="270" cy="95" r="6.5" fill="#38BDF8" fill-opacity="0.6"/>
          <circle cx="340" cy="108" r="13" fill="#FFFFFF" fill-opacity="0.35"/>
          <circle cx="380" cy="142" r="7.5" fill="#FFFFFF" fill-opacity="0.22"/>
        </svg>
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
          <button class="btn-cancel" onclick="closeForgotModal()">Cancel</button>
          <button class="btn-confirm" onclick="confirmForgot()">Confirm</button>
        </div>
      </div>
    </div>
  </div>
`;

// 2. New CSS styles matching Image 2 exactly
const newLoginCss = `/* Login Screen Exact Design Reference Styles (Image 2) */
:root {
  --lgn-bg: #EEF5FF;
  --lgn-primary: #0066FF;
  --lgn-primary-dark: #1D4ED8;
  --lgn-sky: #38BDF8;
  --lgn-text-main: #0F172A;
  --lgn-text-muted: #94A3B8;
  --lgn-input-bg: #F1F5F9;
  --lgn-border: #E2E8F0;
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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background: #F0F4F9;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.device {
  width: 100%;
  max-width: 414px;
  height: 844px;
  background: var(--lgn-bg);
  border-radius: 40px;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.25);
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
}

.screen.login-redesign-screen {
  background: var(--lgn-bg);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* ── Top Header Banner ── */
.login-header-banner {
  position: relative;
  width: 100%;
  height: 230px;
  min-height: 230px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 38px 24px 0 24px;
  box-sizing: border-box;
}

.login-header-bg-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.login-header-content {
  position: relative;
  z-index: 5;
}

.login-header-title {
  font-size: 30px;
  font-weight: 800;
  color: #FFFFFF;
  margin: 0 0 6px 0;
  letter-spacing: -0.4px;
  line-height: 1.15;
}

.accent-sky {
  color: var(--lgn-sky);
  font-weight: 800;
}

.login-header-sub {
  font-size: 13.5px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.88);
  margin: 0 0 12px 0;
  letter-spacing: 0.1px;
}

.login-header-pill-bar {
  display: flex;
  gap: 4px;
  align-items: center;
}

.pill-white {
  width: 36px;
  height: 4px;
  border-radius: 4px;
  background: #FFFFFF;
}

.pill-cyan {
  width: 22px;
  height: 4px;
  border-radius: 4px;
  background: rgba(56, 189, 248, 0.55);
}

/* ── Logo Card ── */
.login-logo-card-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -46px;
  margin-bottom: 14px;
  position: relative;
  z-index: 15;
}

.login-logo-card {
  width: 94px;
  height: 94px;
  border-radius: 26px;
  background: #FFFFFF;
  box-shadow: 0 14px 32px rgba(0, 80, 220, 0.18), 0 3px 8px rgba(0, 0, 0, 0.04);
  border: 1.2px solid rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.login-logo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 38px rgba(0, 80, 220, 0.25);
}

.login-logo-img {
  width: 62px;
  height: 62px;
  object-fit: contain;
  display: block;
}

/* ── Floating Main Form Card ── */
.login-card-container {
  margin: 0 20px 10px 20px;
  padding: 24px 20px 24px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 28px;
  box-shadow: 0 14px 38px rgba(0, 70, 200, 0.07), 0 2px 6px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(226, 232, 240, 0.85);
  position: relative;
  z-index: 10;
  box-sizing: border-box;
}

.login-err-banner {
  background: #FEE2E2;
  color: #DC2626;
  border: 1px solid #FCA5A5;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 14px;
  line-height: 1.4;
}

/* ── Input Groups ── */
.login-input-group {
  height: 52px;
  background: var(--lgn-input-bg);
  border-radius: 14px;
  border: 1.2px solid var(--lgn-border);
  display: flex;
  align-items: center;
  padding: 0 14px;
  margin-bottom: 14px;
  transition: all 0.2s ease;
}

.login-input-group:focus-within {
  background: #FFFFFF;
  border-color: var(--lgn-primary);
  box-shadow: 0 0 0 3.5px rgba(0, 102, 255, 0.12);
}

.login-input-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.login-input-field {
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  font-size: 14.5px;
  color: var(--lgn-text-main);
  font-weight: 500;
  outline: none;
  font-family: inherit;
}

.login-input-field::placeholder {
  color: var(--lgn-text-muted);
  font-weight: 400;
}

.login-eye-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.error-msg {
  color: #DC2626;
  font-size: 12px;
  font-weight: 600;
  margin-top: -6px;
  margin-bottom: 12px;
  padding-left: 4px;
}

/* ── Options Row ── */
.login-options-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 6px 2px 20px 2px;
}

.remember-row {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.chk-box {
  width: 18px;
  height: 18px;
  border-radius: 5px;
  background: var(--lgn-primary);
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.chk-box.unchecked {
  background: #FFFFFF;
  border: 1.5px solid #CBD5E1;
  color: transparent;
}

.remember-label {
  font-size: 13.5px;
  font-weight: 600;
  color: #1E293B;
}

.forgot-link {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--lgn-primary);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.15s ease;
}

.forgot-link:hover {
  text-decoration: underline;
  color: var(--lgn-primary-dark);
}

/* ── Primary Login Button ── */
.btn-login-gradient {
  width: 100%;
  height: 54px;
  border-radius: 27px;
  background: linear-gradient(90deg, #0052FF 0%, #0066FF 45%, #1D4ED8 100%);
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 102, 255, 0.38);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 0 24px;
  position: relative;
  transition: all 0.2s ease;
  outline: none;
}

.btn-login-gradient:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 28px rgba(0, 102, 255, 0.46);
}

.btn-login-gradient:active {
  transform: scale(0.98);
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
}

.btn-login-text {
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: 0.2px;
  margin: 0 auto;
  padding-left: 28px;
}

.login-btn-arrow-disc {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── OR Divider ── */
.login-or-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 22px 0 4px 0;
  gap: 14px;
}

.or-line {
  flex: 1;
  height: 1px;
  background: #E2E8F0;
}

.or-text {
  font-size: 12px;
  font-weight: 700;
  color: var(--lgn-text-muted);
  letter-spacing: 1px;
}

/* ── Bottom Waves ── */
.login-bottom-wave-wrap {
  width: 100%;
  height: 130px;
  margin-top: auto;
  overflow: hidden;
  pointer-events: none;
  position: relative;
  z-index: 1;
}

.login-bottom-waves-svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* ── Forgot Password Modal ── */
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
}

.modal-card {
  width: 100%;
  max-width: 350px;
  background: #FFFFFF;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid #E2E8F0;
  box-sizing: border-box;
}

.modal-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.modal-head h3 {
  font-size: 18px;
  font-weight: 700;
  color: #0F172A;
  margin: 0;
}

.modal-close {
  cursor: pointer;
  color: #64748B;
  font-size: 18px;
  font-weight: 700;
}

.modal-sub {
  font-size: 13px;
  color: #64748B;
  margin: 0 0 16px;
  line-height: 1.4;
}

.modal-err-box {
  background: #FEE2E2;
  color: #DC2626;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 12px;
  margin-bottom: 12px;
}

.modal-field {
  margin-bottom: 14px;
}

.modal-field label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

.modal-field input {
  width: 100%;
  height: 44px;
  border-radius: 10px;
  border: 1px solid #CBD5E1;
  padding: 0 12px;
  font-size: 14px;
  color: #0F172A;
  background: #F8FAFC;
  outline: none;
  box-sizing: border-box;
}

.modal-field input:focus {
  border-color: #0066FF;
  background: #FFFFFF;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-cancel {
  flex: 1;
  height: 42px;
  border-radius: 12px;
  border: 1px solid #CBD5E1;
  background: #FFFFFF;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
}

.btn-confirm {
  flex: 1;
  height: 42px;
  border-radius: 12px;
  border: none;
  background: #0066FF;
  color: #FFFFFF;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
}
`;

// Update EmergereApp/EmergereApp/src/screens/Login/preview.html
const standaloneHtmlPath = path.resolve('EmergereApp/EmergereApp/src/screens/Login/preview.html');
const standaloneHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<title>Login - Preview</title>
<link rel="stylesheet" href="../../../preview/base.css" />
<link rel="stylesheet" href="./preview.css" />
</head>
<body>
${newLoginHtml}
  <script src="../../../preview/shared.js"></script>
  <script src="./preview.js"></script>
</body>
</html>
`;
fs.writeFileSync(standaloneHtmlPath, standaloneHtmlContent, 'utf8');
console.log('Updated standalone Login preview.html');

// Update EmergereApp/EmergereApp/src/screens/Login/preview.css
const standaloneCssPath = path.resolve('EmergereApp/EmergereApp/src/screens/Login/preview.css');
fs.writeFileSync(standaloneCssPath, newLoginCss, 'utf8');
console.log('Updated standalone Login preview.css');

// Function to update tpl-Login in the bundle files
function buildTplLogin() {
  return `<template id="tpl-Login">
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Login</title>
  <style>
${newLoginCss}
  </style>
</head>
<body>
${newLoginHtml}

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

    const EYE_SVG_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
    const EYE_OFF_SVG_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="23" x2="23" y2="1"></line></svg>';

    function toggleVisibility(id) {
      const input = document.getElementById(id);
      if (!input) return;
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      const eyeBtn = document.getElementById(id + '-eye') || (input.parentElement ? input.parentElement.querySelector('.login-eye-btn') : null);
      if (eyeBtn) {
        eyeBtn.innerHTML = isPass ? EYE_OFF_SVG_ICON : EYE_SVG_ICON;
        eyeBtn.setAttribute('title', isPass ? 'Hide password' : 'Show password');
        eyeBtn.setAttribute('aria-label', isPass ? 'Hide password' : 'Show password');
      }
    }
    window.toggleVisibility = toggleVisibility;

    function isPasswordMatch(expected, actual) {
      if (!expected || !actual) return false;
      const exp = String(expected).trim();
      const act = String(actual).trim();
      return exp === act || exp.toLowerCase() === act.toLowerCase();
    }

    function handleLogin() {
      const emailInput = document.getElementById('email');
      const pwdInput = document.getElementById('pwd');
      const errBox = document.getElementById('login-auth-err');
      const pwdErr = document.getElementById('pwd-error');

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
          window.location.href = '../ManagerDashboard/preview.html';
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
          window.location.href = '../EmployeeDashboard/preview.html';
        }
        return;
      }

      // Invalid
      if (errBox) {
        errBox.textContent = 'Invalid email address or password. Please check your credentials and try again.';
        errBox.style.display = 'block';
      }
    }
    window.handleLogin = handleLogin;

    function toggleRemember(el) {
      isRememberChecked = !isRememberChecked;
      const chk = el ? el.querySelector('.chk-box') : document.querySelector('.chk-box');
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
    window.toggleRemember = toggleRemember;

    function openForgotModal() {
      const forgotEmail = document.getElementById('forgot-email');
      const forgotContact = document.getElementById('forgot-contact');
      const modalErr = document.getElementById('modal-err');
      
      if (forgotEmail) forgotEmail.value = '';
      if (forgotContact) forgotContact.value = '';
      if (modalErr) modalErr.style.display = 'none';

      const modal = document.getElementById('forgot-modal');
      if (modal) modal.style.display = 'flex';
    }
    window.openForgotModal = openForgotModal;

    function closeForgotModal() {
      const modal = document.getElementById('forgot-modal');
      if (modal) modal.style.display = 'none';
    }
    window.closeForgotModal = closeForgotModal;

    function confirmForgot() {
      const emailInput = document.getElementById('forgot-email');
      const contactInput = document.getElementById('forgot-contact');
      const modalErr = document.getElementById('modal-err');

      const emailVal = emailInput ? emailInput.value.trim() : '';
      const contactVal = contactInput ? contactInput.value.trim() : '';

      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      const phoneRegex = /^\\d{10}$/;

      if (!emailVal || !emailRegex.test(emailVal)) {
        if (modalErr) {
          modalErr.textContent = 'Please enter a valid registered Email ID.';
          modalErr.style.display = 'block';
        }
        return;
      }

      if (!contactVal || !phoneRegex.test(contactVal.replace(/[\\s-]/g, ''))) {
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
  </script>
</body>
</html>
</template>`;
}

// Update all 4 HTML bundle files
const bundleFiles = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

const newTplLoginContent = buildTplLogin();

bundleFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let c = fs.readFileSync(file, 'utf8');
  const startTag = '<template id="tpl-Login">';
  const startIdx = c.indexOf(startTag);
  if (startIdx === -1) {
    console.log('tpl-Login not found in', file);
    return;
  }
  const endTag = '</template>';
  const endIdx = c.indexOf(endTag, startIdx);
  if (endIdx === -1) {
    console.log('tpl-Login end tag not found in', file);
    return;
  }
  c = c.substring(0, startIdx) + newTplLoginContent + c.substring(endIdx + endTag.length);
  fs.writeFileSync(file, c, 'utf8');
  console.log('Updated tpl-Login in', file);
});
