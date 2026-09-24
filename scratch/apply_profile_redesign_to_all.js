const fs = require('fs');
const path = require('path');

// Read preview.html and preview.css from src/screens/MyProfile
const previewHtmlPath = path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'src', 'screens', 'MyProfile', 'preview.html');
const previewCssPath = path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'src', 'screens', 'MyProfile', 'preview.css');

const previewHtml = fs.readFileSync(previewHtmlPath, 'utf8');
const previewCss = fs.readFileSync(previewCssPath, 'utf8');

// Extract body inner content from preview.html
const bodyStart = previewHtml.indexOf('<body>');
const bodyEnd = previewHtml.lastIndexOf('</body>');
let bodyInner = previewHtml.substring(bodyStart + 6, bodyEnd).trim();

// Strip external script tags because templates are rendered via srcdoc
bodyInner = bodyInner.replace(/<script src="[^"]*"><\/script>\s*/g, '');

// Construct the new template HTML
const newTemplate = `  <template id="tpl-MyProfile">
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <title>My Profile</title>
      <style>
        /* Base Device & Scrollbar Rules */
        :root {
          --prof-primary: #0066FF;
          --prof-primary-dark: #0050EA;
          --prof-bg: #EEF4FB;
          --prof-card-bg: #FFFFFF;
          --prof-border: #E2E8F0;
          --prof-text-main: #0F172A;
          --prof-text-sub: #64748B;
          --prof-text-muted: #94A3B8;
          --prof-danger: #EF4444;
          --prof-danger-bg: #FEF2F2;
          --prof-danger-border: #FEE2E2;

          --primary: #2F6BFF;
          --primary-dark: #1E4FD6;
          --bg: #EEF4FB;
          --surface: #FFFFFF;
          --navy: #1B2333;
          --text: #0F172A;
          --text-secondary: #64748B;
          --text-muted: #94A3B8;
          --success: #16A34A;
          --success-bg: #DCFCE7;
          --danger: #EF4444;
          --danger-bg: #FEF2F2;
          --border: #E2E8F0;
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
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          background: #EEF4FB !important;
          display: flex;
          justify-content: center;
          align-items: stretch;
          height: 100vh;
          height: 100dvh;
          overflow: hidden;
          -webkit-font-smoothing: antialiased;
        }

        .device {
          width: 100%;
          max-width: 440px;
          height: 100vh;
          height: 100dvh;
          background: #EEF4FB !important;
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
            background: #0e1420 !important;
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

        .screen {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding-top: 0 !important;
          padding-bottom: 96px;
          box-sizing: border-box;
          position: relative;
          background: #EEF4FB !important;
          -webkit-overflow-scrolling: touch;
        }

        /* Screen Specific Styles */
${previewCss}
      </style>
    </head>
    <body>
${bodyInner}
    </body>
    </html>
  </template>`;

const targetFiles = [
  path.join(__dirname, '..', 'preview_app.html'),
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'preview_app.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'index.html'),
];

targetFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace <template id="tpl-MyProfile">...</template>
  const tplStart = content.indexOf('<template id="tpl-MyProfile">');
  if (tplStart === -1) {
    console.log('Template not found in:', filePath);
    return;
  }
  const tplEnd = content.indexOf('</template>', tplStart);
  if (tplEnd === -1) {
    console.log('Closing template not found in:', filePath);
    return;
  }

  content = content.substring(0, tplStart) + newTemplate.trim() + content.substring(tplEnd + '</template>'.length);

  // Update dynamic padding injection CSS:
  // 1. Exclude .has-profile-header and .profile-header-banner from padding-top: 16px
  const oldNotSelector = ':not(.has-perm-header):not(:has(.perm-header-banner))';
  const newNotSelector = ':not(.has-perm-header):not(:has(.perm-header-banner)):not(.has-profile-header):not(:has(.profile-header-banner))';
  if (content.indexOf(oldNotSelector) !== -1) {
    content = content.split(oldNotSelector).join(newNotSelector);
  }

  // 2. Add .screen.has-profile-header, .screen:has(.profile-header-banner) to padding-top: 0
  const oldZeroPadding = `.screen.has-perm-header,
            .screen:has(.perm-header-banner) {
              height: 844px !important;
              padding-top: 0 !important;
            }`;
  const newZeroPadding = `.screen.has-perm-header,
            .screen:has(.perm-header-banner),
            .screen.has-profile-header,
            .screen:has(.profile-header-banner) {
              height: 844px !important;
              padding-top: 0 !important;
            }`;
  if (content.indexOf(oldZeroPadding) !== -1) {
    content = content.split(oldZeroPadding).join(newZeroPadding);
  }

  // 3. Add .profile-header-banner to border-radius resets
  const oldRadius = `.perm-header-banner {
              margin-top: 0 !important;
              border-top-left-radius: 0 !important;
              border-top-right-radius: 0 !important;
            }`;
  const newRadius = `.perm-header-banner,
            .profile-header-banner {
              margin-top: 0 !important;
              border-top-left-radius: 0 !important;
              border-top-right-radius: 0 !important;
            }`;
  if (content.indexOf(oldRadius) !== -1) {
    content = content.split(oldRadius).join(newRadius);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully updated:', filePath, 'New size:', content.length);
});
