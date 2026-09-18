const fs = require('fs');

function updateHtmlFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Host head style update
  const hostStyleTarget = `  <style>\n    * {\n      box-sizing: border-box;\n    }`;
  const hostStyleReplacement = `  <style>
    * {
      box-sizing: border-box;
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }

    *::-webkit-scrollbar,
    html::-webkit-scrollbar,
    body::-webkit-scrollbar,
    #sidebar::-webkit-scrollbar,
    #stage::-webkit-scrollbar,
    #frame::-webkit-scrollbar,
    .device::-webkit-scrollbar,
    .screen::-webkit-scrollbar,
    div::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
      background: transparent !important;
    }

    html, body, #sidebar, #stage, #frame, .device, .screen {
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }`;

  if (content.includes(hostStyleTarget)) {
    content = content.replace(hostStyleTarget, hostStyleReplacement);
  }

  // 2. In iframe load listener, inject hideScrollGlobalStyle
  const iframeLoadTarget = `var logoGlobalStyle = doc.createElement('style');`;
  const iframeLoadReplacement = `var hideScrollGlobalStyle = doc.createElement('style');
          hideScrollGlobalStyle.textContent = \`
            * {
              -ms-overflow-style: none !important;
              scrollbar-width: none !important;
            }
            *::-webkit-scrollbar,
            html::-webkit-scrollbar,
            body::-webkit-scrollbar,
            .screen::-webkit-scrollbar,
            .device::-webkit-scrollbar,
            div::-webkit-scrollbar,
            iframe::-webkit-scrollbar {
              display: none !important;
              width: 0 !important;
              height: 0 !important;
              background: transparent !important;
            }
            html, body, .screen, .device {
              -ms-overflow-style: none !important;
              scrollbar-width: none !important;
            }
          \`;
          if (doc.head) doc.head.appendChild(hideScrollGlobalStyle);

          var logoGlobalStyle = doc.createElement('style');`;

  if (!content.includes('hideScrollGlobalStyle') && content.includes(iframeLoadTarget)) {
    content = content.replace(iframeLoadTarget, iframeLoadReplacement);
  }

  // 3. In templates, update .screen rules to hide scrollbar
  // Login screen rule
  const loginScreenTarget = `.screen {
          flex: 1;
          overflow-y: auto;
          padding: 30px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #FFFFFF;
        }`;
  const loginScreenReplacement = `.screen {
          flex: 1;
          overflow-y: auto;
          padding: 30px 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          color: #FFFFFF;
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }

        .screen::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }`;
  if (content.includes(loginScreenTarget)) {
    content = content.replace(loginScreenTarget, loginScreenReplacement);
  }

  // General screen rule (appears in 14 templates)
  const generalScreenTarget = `.screen {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 90px;
          -webkit-overflow-scrolling: touch;
        }`;
  const generalScreenReplacement = `.screen {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 90px;
          -webkit-overflow-scrolling: touch;
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }

        .screen::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }`;
  while (content.includes(generalScreenTarget)) {
    content = content.replace(generalScreenTarget, generalScreenReplacement);
  }

  // 4. Update employee list scrollbar in Login
  const empScrollTarget = `#app-emp-list::-webkit-scrollbar,
        #emp-list::-webkit-scrollbar {
          width: 4px;
        }`;
  const empScrollReplacement = `#app-emp-list::-webkit-scrollbar,
        #emp-list::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }`;
  if (content.includes(empScrollTarget)) {
    content = content.replace(empScrollTarget, empScrollReplacement);
  }

  // 5. Update * { box-sizing: border-box; } in template styles
  const tplBoxSizingTarget = `        * {
          box-sizing: border-box;
        }

        body {`;
  const tplBoxSizingReplacement = `        * {
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

        body {`;
  while (content.includes(tplBoxSizingTarget)) {
    content = content.replace(tplBoxSizingTarget, tplBoxSizingReplacement);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated HTML file:', filePath);
}

const htmlFiles = [
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'preview_app.html',
  'index.html'
];

htmlFiles.forEach(updateHtmlFile);
