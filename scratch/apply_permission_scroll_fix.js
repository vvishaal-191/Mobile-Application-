const fs = require('fs');

// 1. Read master index.html
let masterHtml = fs.readFileSync('EmergereApp/EmergereApp/index.html', 'utf8');

const tplStart = masterHtml.indexOf('<template id="tpl-ApplyPermission">');
const tplEnd = masterHtml.indexOf('</template>', tplStart);
let tplContent = masterHtml.substring(tplStart, tplEnd);

const newBodyDeviceScreenCss = `        body {
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

const newBottomNavCss = `        /* Bottom Nav Styling */
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

// Replace body, device, screen styles in tplContent
tplContent = tplContent.replace(
  /body\s*\{[\s\S]*?padding-top:\s*0\s*!important;\s*\}/,
  newBodyDeviceScreenCss.trim()
);

// Replace bottom-nav style
tplContent = tplContent.replace(
  /\/\*[\s\S]*?bottom navigation bar[\s\S]*?\*\/[\s\S]*?\.bottom-nav\s*\{[\s\S]*?\}/,
  newBottomNavCss.trim()
);

// Close .screen immediately after .perm-form-card
const oldFormCardClose = `            <!-- Submit Request Button with Paper Airplane Icon -->
            <button class="perm-submit-btn" id="perm-submit-btn" onclick="handleApplyPermissionSubmit()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              <span>Submit Request</span>
            </button>
          </div>

          <!-- Bottom Navigation Bar (Hidden on Apply Permission matching Image 2) -->`;

const newFormCardClose = `            <!-- Submit Request Button with Paper Airplane Icon -->
            <button class="perm-submit-btn" id="perm-submit-btn" onclick="handleApplyPermissionSubmit()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              <span>Submit Request</span>
            </button>
          </div>
        </div>

        <!-- Bottom Navigation Bar -->`;

tplContent = tplContent.replace(oldFormCardClose, newFormCardClose);

// At the end before </script>, fix closing divs from </div> </div> </div> to </div> </div>
const oldEndDivs = `              <button class="success-modal-btn" onclick="closePermSuccessModal()">Done</button>
            </div>
          </div>
        </div>
      </div>

      <script>`;

const newEndDivs = `              <button class="success-modal-btn" onclick="closePermSuccessModal()">Done</button>
            </div>
          </div>
      </div>

      <script>`;

tplContent = tplContent.replace(oldEndDivs, newEndDivs);

// Apply to all 4 files
const htmlFiles = [
  'index.html',
  'EmergereApp/EmergereApp/index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

htmlFiles.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');
  const start = content.indexOf('<template id="tpl-ApplyPermission">');
  const end = content.indexOf('</template>', start);
  if (start === -1 || end === -1) {
    console.error(`tpl-ApplyPermission not found in ${file}`);
    return;
  }
  let newContent = content.substring(0, start) + tplContent + content.substring(end);

  // Fix any duplicate </template> tag in root preview_app.html
  newContent = newContent.replace('</template>\n  </template>\n  <template id="tpl-HolidayCalendar">', '</template>\n  <template id="tpl-HolidayCalendar">');

  fs.writeFileSync(file, newContent, 'utf8');
  console.log(`Updated ${file}`);
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
// Ensure .screen closes before .bottom-nav in preview.html
previewHtml = previewHtml.replace(
  /<\/div>\s*<!-- Bottom Navigation Bar -->/,
  '</div>\n  </div>\n\n  <!-- Bottom Navigation Bar -->'
);
previewHtml = previewHtml.replace(
  /<\/div>\s*<\/div>\s*<\/div>\s*<script src="\.\.\/\.\.\/\.\.\/preview\/shared\.js">/,
  '</div>\n  </div>\n</div>\n\n<script src="../../../preview/shared.js">'
);
fs.writeFileSync(previewHtmlPath, previewHtml, 'utf8');
console.log(`Updated ${previewHtmlPath}`);

console.log('ALL DONE SUCCESSFULLY.');
