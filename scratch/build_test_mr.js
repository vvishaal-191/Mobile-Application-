const fs = require('fs');

const artBuf = fs.readFileSync('assets/requests-header-art.png');
const artB64 = artBuf.toString('base64');

const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Test My Requests Banner</title>
  <style>
    body {
      margin: 0;
      padding: 40px;
      background: #0e1420;
      display: flex;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .device {
      width: 390px;
      min-height: 844px;
      background: #F8FAFC;
      border-radius: 40px;
      border: 8px solid #1f2937;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
    }
    
    /* ── Royal Blue Curved Banner Header matching Image 2 ── */
    .mr-header-banner {
      position: relative;
      width: 100% !important;
      margin: 0 !important;
      margin-top: 0 !important;
      padding: 16px 18px 24px 18px !important;
      border-top-left-radius: 0 !important;
      border-top-right-radius: 0 !important;
      border-bottom-left-radius: 28px;
      border-bottom-right-radius: 28px;
      overflow: hidden;
      box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22);
      background: linear-gradient(135deg, #005CE6 0%, #0066FF 45%, #1877F2 100%);
      color: #FFFFFF;
      box-sizing: border-box;
      min-height: 120px;
    }

    .mr-header-banner::before {
      content: '';
      position: absolute;
      top: -50px;
      right: -20px;
      width: 220px;
      height: 220px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 70%);
      pointer-events: none;
    }

    .mr-header-banner::after {
      content: '';
      position: absolute;
      bottom: -40px;
      left: -20px;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
      pointer-events: none;
    }

    .mr-header-waves {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 60px;
      pointer-events: none;
      overflow: hidden;
      z-index: 1;
    }

    .mr-header-wave-svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    .mr-header-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 2;
    }

    .mr-header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .mr-back-btn {
      width: 38px;
      height: 38px;
      min-width: 38px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      transition: transform 0.2s ease, background 0.2s ease;
      padding: 0;
    }

    .mr-back-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.05);
    }

    .mr-header-text {
      display: flex;
      flex-direction: column;
    }

    .mr-header-title {
      font-size: 20px;
      font-weight: 700;
      color: #FFFFFF;
      margin: 0;
      letter-spacing: -0.2px;
      line-height: 1.2;
    }

    .mr-header-subtitle {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.85);
      margin: 4px 0 0 0;
      font-weight: 400;
      white-space: nowrap;
    }

    .mr-header-illustration {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: -4px;
    }

    .mr-header-art-img {
      width: 82px;
      height: 82px;
      object-fit: contain;
      display: block;
      filter: drop-shadow(0 4px 12px rgba(0, 30, 100, 0.25));
    }
  </style>
</head>
<body>
  <div class="device">
    <div class="mr-header-banner">
      <div class="mr-header-waves">
        <svg viewBox="0 0 400 60" preserveAspectRatio="none" class="mr-header-wave-svg">
          <path d="M0,25 C120,55 260,0 400,30 L400,60 L0,60 Z" fill="rgba(255,255,255,0.09)"></path>
          <path d="M0,40 C140,15 280,50 400,20 L400,60 L0,60 Z" fill="rgba(255,255,255,0.06)"></path>
        </svg>
      </div>
      <div class="mr-header-top-row">
        <div class="mr-header-left">
          <button class="mr-back-btn" title="Back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          <div class="mr-header-text">
            <h1 class="mr-header-title">My Requests</h1>
            <p class="mr-header-subtitle">Track your leaves &amp; permissions</p>
          </div>
        </div>
        <div class="mr-header-illustration">
          <img src="data:image/png;base64,${artB64}" alt="" class="mr-header-art-img" />
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

fs.writeFileSync('scratch/test_mr_banner.html', html, 'utf8');
console.log('Created scratch/test_mr_banner.html');
