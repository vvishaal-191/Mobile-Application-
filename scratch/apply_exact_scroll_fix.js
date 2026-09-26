const fs = require('fs');

const files = [
  'index.html',
  'EmergereApp/EmergereApp/index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

const target1 = `        body {
          background: var(--perm-bg) !important;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .device {
          background: var(--perm-bg) !important;
          position: relative;
          overflow: hidden;
          width: 100%;
          min-height: 100vh;
        }

        .screen {
          background: var(--perm-bg) !important;
          padding-bottom: 140px;
          min-height: 100vh;
          box-sizing: border-box;
          position: relative;
        }

        .screen,
        .screen.has-perm-header,
        .screen.has-al-header {
          padding-top: 0 !important;
        }`;

const replacement1 = `        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          background: var(--perm-bg) !important;
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
          background: var(--perm-bg) !important;
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

        .statusbar { display: none !important; }

        .screen {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 90px;
          background: var(--perm-bg) !important;
          -webkit-overflow-scrolling: touch;
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
          box-sizing: border-box;
          position: relative;
        }

        .screen::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        .screen,
        .screen.has-perm-header,
        .screen.has-al-header {
          padding-top: 0 !important;
        }`;

const target2 = `        /* Bottom Nav */
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #FFFFFF;
          border-top: 1px solid #E2E8F0;
          display: flex;
          align-items: flex-end;
          padding: 8px 0 16px;
          height: 68px;
          box-sizing: border-box;
          z-index: 10;
        }`;

const replacement2 = `        /* Bottom Nav Styling */
        .bottom-nav {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: #FFFFFF;
          border-top: 1px solid #EAEFF5;
          border-radius: 24px 24px 0 0;
          padding: 8px 12px 14px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.03);
          z-index: 100;
          box-sizing: border-box;
          height: 68px;
        }`;

const target3 = `            <button class="perm-submit-btn" id="perm-submit-btn" onclick="handleApplyPermissionSubmit()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              <span>Submit Request</span>
            </button>
          </div>

          <!-- Bottom Navigation Bar -->`;

const replacement3 = `            <button class="perm-submit-btn" id="perm-submit-btn" onclick="handleApplyPermissionSubmit()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              <span>Submit Request</span>
            </button>
          </div>
        </div>

        <!-- Bottom Navigation Bar -->`;

const target4 = `              <button class="success-modal-btn" onclick="closePermSuccessModal()">Done</button>
            </div>
          </div>
        </div>
      </div>

      <script>`;

const replacement4 = `              <button class="success-modal-btn" onclick="closePermSuccessModal()">Done</button>
            </div>
          </div>
      </div>

      <script>`;

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  const isCRLF = content.includes('\r\n');
  let norm = content.replace(/\r\n/g, '\n');

  if (norm.includes(target1.replace(/\r\n/g, '\n'))) {
    norm = norm.replace(target1.replace(/\r\n/g, '\n'), replacement1.replace(/\r\n/g, '\n'));
    console.log(`[PASS] Replaced Target 1 in ${f}`);
  } else {
    console.error(`[FAIL] Target 1 not found in ${f}`);
  }

  if (norm.includes(target2.replace(/\r\n/g, '\n'))) {
    norm = norm.replace(target2.replace(/\r\n/g, '\n'), replacement2.replace(/\r\n/g, '\n'));
    console.log(`[PASS] Replaced Target 2 in ${f}`);
  } else {
    console.error(`[FAIL] Target 2 not found in ${f}`);
  }

  if (norm.includes(target3.replace(/\r\n/g, '\n'))) {
    norm = norm.replace(target3.replace(/\r\n/g, '\n'), replacement3.replace(/\r\n/g, '\n'));
    console.log(`[PASS] Replaced Target 3 in ${f}`);
  } else {
    console.error(`[FAIL] Target 3 not found in ${f}`);
  }

  if (norm.includes(target4.replace(/\r\n/g, '\n'))) {
    norm = norm.replace(target4.replace(/\r\n/g, '\n'), replacement4.replace(/\r\n/g, '\n'));
    console.log(`[PASS] Replaced Target 4 in ${f}`);
  } else {
    console.error(`[FAIL] Target 4 not found in ${f}`);
  }

  if (isCRLF) {
    norm = norm.replace(/\n/g, '\r\n');
  }
  fs.writeFileSync(f, norm, 'utf8');
});

// Update React Native styles: EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.styles.js
const rnStylesPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.styles.js';
let rnStyles = fs.readFileSync(rnStylesPath, 'utf8');
rnStyles = rnStyles.replace(/scrollContent:\s*\{\s*paddingBottom:\s*\d+,/, 'scrollContent: {\n    paddingBottom: 110,');
fs.writeFileSync(rnStylesPath, rnStyles, 'utf8');
console.log(`Updated ${rnStylesPath}`);

// Update preview.css: EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.css
const previewCssPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.css';
let previewCss = fs.readFileSync(previewCssPath, 'utf8');
previewCss = previewCss.replace(/padding-bottom:\s*\d+px;/, 'padding-bottom: 90px;');
previewCss = previewCss.replace(/\n\s*min-height:\s*100vh;/, '');
fs.writeFileSync(previewCssPath, previewCss, 'utf8');
console.log(`Updated ${previewCssPath}`);

// Update preview.html: EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.html
const previewHtmlPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.html';
let previewHtml = fs.readFileSync(previewHtmlPath, 'utf8');
previewHtml = previewHtml.replace(/<div class="perm-bottom-spacer"[\s\S]*?<\/div>\s*/g, '');
const isCRLFPreview = previewHtml.includes('\r\n');
let normPreview = previewHtml.replace(/\r\n/g, '\n');
normPreview = normPreview.replace(
  '      <!-- Submit Request Button with Paper Airplane Icon -->\n      <button class="perm-submit-btn" id="perm-submit-btn" onclick="handleApplyPermissionSubmit()">\n        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">\n          <line x1="22" y1="2" x2="11" y2="13"></line>\n          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>\n        </svg>\n        <span>Submit Request</span>\n      </button>\n    </div>\n\n    <!-- Bottom Navigation Bar -->',
  '      <!-- Submit Request Button with Paper Airplane Icon -->\n      <button class="perm-submit-btn" id="perm-submit-btn" onclick="handleApplyPermissionSubmit()">\n        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">\n          <line x1="22" y1="2" x2="11" y2="13"></line>\n          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>\n        </svg>\n        <span>Submit Request</span>\n      </button>\n    </div>\n  </div>\n\n  <!-- Bottom Navigation Bar -->'
);
normPreview = normPreview.replace(
  '        <button class="success-modal-btn" onclick="closePermSuccessModal()">Done</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<script src="../../../preview/shared.js">',
  '        <button class="success-modal-btn" onclick="closePermSuccessModal()">Done</button>\n      </div>\n    </div>\n</div>\n\n<script src="../../../preview/shared.js">'
);
if (isCRLFPreview) normPreview = normPreview.replace(/\n/g, '\r\n');
fs.writeFileSync(previewHtmlPath, normPreview, 'utf8');
console.log(`Updated ${previewHtmlPath}`);

console.log('Done!');
