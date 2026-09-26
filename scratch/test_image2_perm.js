const fs = require('fs');

const testHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Image 2 Apply Permission Test</title>
  <style>
    :root {
      --perm-primary: #0066FF;
      --perm-primary-dark: #0050EA;
      --perm-bg: #EEF4FB;
      --perm-card-bg: #FFFFFF;
      --perm-border: #E2E8F0;
      --perm-text-main: #111827;
      --perm-text-sub: #64748B;
      --perm-text-muted: #94A3B8;
      --perm-danger: #EF4444;
      --primary: #0066FF;
      --surface: #FFFFFF;
      --text: #111827;
      --border: #E2E8F0;
    }
    * { box-sizing: border-box; }
    body {
      background: var(--perm-bg) !important;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .device {
      background: var(--perm-bg) !important;
      position: relative;
      width: 100%;
      max-width: 410px;
      margin: 0 auto;
      min-height: 100vh;
    }
    .screen {
      background: var(--perm-bg) !important;
      padding-bottom: 40px;
      min-height: 100vh;
      box-sizing: border-box;
      position: relative;
    }
    .perm-header-banner {
      background: linear-gradient(135deg, #0056E0 0%, #0066FF 45%, #1877F2 100%);
      padding: 24px 18px 46px 18px;
      border-bottom-left-radius: 32px;
      border-bottom-right-radius: 32px;
      position: relative;
      overflow: hidden;
    }
    .perm-header-decor-bubble1 {
      position: absolute;
      top: -20px;
      left: -15px;
      width: 140px;
      height: 140px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 70%);
      pointer-events: none;
    }
    .perm-header-decor-bubble2 {
      position: absolute;
      top: 10px;
      left: 140px;
      width: 90px;
      height: 90px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 70%);
      pointer-events: none;
    }
    .perm-header-decor-bubble3 {
      position: absolute;
      top: -25px;
      right: -15px;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 70%);
      pointer-events: none;
    }
    .perm-header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 2;
    }
    .perm-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }
    .perm-back-btn {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.22);
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      flex-shrink: 0;
    }
    .perm-header-text {
      display: flex;
      flex-direction: column;
    }
    .perm-header-title {
      font-size: 21px;
      font-weight: 800;
      color: #FFFFFF;
      margin: 0;
      letter-spacing: -0.3px;
      line-height: 1.2;
    }
    .perm-header-subtitle {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.9);
      margin: 3px 0 0 0;
      font-weight: 400;
    }
    .perm-header-badge {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      margin-top: -12px;
      margin-right: -4px;
      flex-shrink: 0;
    }
    .perm-calendar-svg {
      filter: drop-shadow(0 10px 20px rgba(0, 35, 120, 0.28));
      display: block;
    }
    .perm-form-card {
      margin: -24px 14px 40px 14px;
      background: #FFFFFF;
      border-radius: 28px;
      padding: 22px 16px 32px 16px;
      box-shadow: 0 12px 36px rgba(15, 30, 80, 0.08);
      border: 1px solid rgba(226, 232, 240, 0.8);
      position: relative;
      z-index: 2;
    }
    .perm-field { margin-bottom: 18px; }
    .perm-label {
      display: block;
      font-size: 13.5px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }
    .perm-required {
      color: var(--perm-danger);
      margin-left: 2px;
      font-weight: 700;
    }
    .perm-input-card {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 50px;
      padding: 0 16px;
      border: 1.5px solid var(--perm-border);
      border-radius: 14px;
      background: #FFFFFF;
      cursor: pointer;
    }
    .perm-card-value {
      font-size: 14.5px;
      font-weight: 500;
      color: #111827;
    }
    .perm-card-icon {
      color: #111827;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }
    .perm-textarea-card {
      border: 1.5px solid var(--perm-border);
      border-radius: 14px;
      background: #FFFFFF;
      padding: 14px 16px 28px 16px;
      position: relative;
    }
    .perm-textarea {
      width: 100%;
      border: none;
      background: transparent;
      padding: 0;
      font-size: 14.5px;
      color: #111827;
      font-family: inherit;
      resize: vertical;
      min-height: 72px;
      line-height: 1.45;
      outline: none;
    }
    .perm-char-counter {
      position: absolute;
      right: 22px;
      bottom: 8px;
      font-size: 12px;
      color: var(--perm-text-muted);
      font-weight: 500;
    }
    .perm-resize-grip {
      position: absolute;
      right: 6px;
      bottom: 6px;
      width: 10px;
      height: 10px;
      opacity: 0.35;
    }
    .perm-submit-btn {
      width: 100%;
      height: 52px;
      background: linear-gradient(135deg, #0075FF 0%, #0056E0 100%);
      border: none;
      border-radius: 18px;
      color: #FFFFFF;
      font-size: 16px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      cursor: pointer;
      box-shadow: 0 8px 22px rgba(0, 102, 255, 0.38);
      font-family: inherit;
      margin-top: 20px;
      margin-bottom: 12px;
    }
    .bottom-nav {
      display: none !important;
    }
  </style>
</head>
<body>
  <div class="device">
    <div class="screen">
      <div class="perm-header-banner">
        <div class="perm-header-decor-bubble1"></div>
        <div class="perm-header-decor-bubble2"></div>
        <div class="perm-header-decor-bubble3"></div>
        <div class="perm-header-content">
          <div class="perm-header-left">
            <button class="perm-back-btn" title="Back">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div class="perm-header-text">
              <h1 class="perm-header-title">Apply Permission</h1>
              <p class="perm-header-subtitle">Request short duration permission</p>
            </div>
          </div>
          <div class="perm-header-badge">
            <svg class="perm-calendar-svg" width="80" height="78" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="14" y="16" width="64" height="58" rx="14" fill="#FFFFFF"/>
              <path d="M14 30C14 22.268 20.268 16 28 16H64C71.732 16 78 22.268 78 30V32H14V30Z" fill="#3B82F6"/>
              <rect x="25" y="9" width="5.5" height="13" rx="2.75" fill="#BFDBFE"/>
              <rect x="43" y="9" width="5.5" height="13" rx="2.75" fill="#BFDBFE"/>
              <rect x="61" y="9" width="5.5" height="13" rx="2.75" fill="#BFDBFE"/>
              <rect x="22" y="39" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
              <rect x="35" y="39" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
              <rect x="48" y="39" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
              <rect x="61" y="39" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
              <rect x="22" y="50" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
              <rect x="35" y="50" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
              <rect x="48" y="50" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
              <rect x="61" y="50" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
              <rect x="22" y="60" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
              <rect x="35" y="60" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
              <path d="M78 6 C78 4.5 80 4 81.5 5.5 C83 4 85 4.5 85 6 C85 8.5 81.5 10.5 81.5 10.5 C81.5 10.5 78 8.5 78 6 Z" fill="#93C5FD" opacity="0.85"/>
              <circle cx="89" cy="14" r="2" fill="#BFDBFE" opacity="0.8"/>
              <circle cx="72" cy="70" r="18" fill="#0066FF" stroke="#FFFFFF" stroke-width="3.5"/>
              <circle cx="72" cy="70" r="11" stroke="#FFFFFF" stroke-width="1.8" stroke-opacity="0.9" fill="none"/>
              <path d="M72 63V70L76 73" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="perm-form-card">
        <div class="perm-field">
          <label class="perm-label">Date <span class="perm-required">*</span></label>
          <div class="perm-input-card">
            <span class="perm-card-value">09/04/2026</span>
            <div class="perm-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
          </div>
        </div>

        <div class="perm-field">
          <label class="perm-label">Permission Type <span class="perm-required">*</span></label>
          <div class="perm-input-card">
            <span class="perm-card-value">Early Going</span>
            <div class="perm-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div class="perm-field">
          <label class="perm-label">Duration <span class="perm-required">*</span></label>
          <div class="perm-input-card">
            <span class="perm-card-value">2 Hours</span>
            <div class="perm-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div class="perm-field">
          <label class="perm-label">Reason <span class="perm-required">*</span></label>
          <div class="perm-textarea-card">
            <textarea class="perm-textarea" rows="4" placeholder="E.g., Medical checkup, personal work..."></textarea>
            <div class="perm-char-counter">0/500</div>
            <svg class="perm-resize-grip" viewBox="0 0 10 10" fill="none" stroke="#94A3B8" stroke-width="1.5">
              <line x1="8" y1="2" x2="2" y2="8"></line>
              <line x1="9" y1="5" x2="5" y2="9"></line>
            </svg>
          </div>
        </div>

        <div class="perm-field">
          <label class="perm-label">Approving Manager</label>
          <div class="perm-input-card">
            <span class="perm-card-value">Vishnu (Reporting Manager)</span>
            <div class="perm-card-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <button class="perm-submit-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          <span>Submit Request</span>
        </button>
      </div>
    </div>
  </div>
</body>
</html>
`;

fs.writeFileSync('scratch/test_image2_perm.html', testHtml);
console.log('Written test_image2_perm.html');
