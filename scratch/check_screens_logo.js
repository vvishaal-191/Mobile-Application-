const fs = require('fs');
const path = require('path');

const screensDir = 'EmergereApp/EmergereApp/src/screens';
const screens = fs.readdirSync(screensDir);

screens.forEach(screen => {
  const screenPath = path.join(screensDir, screen);
  if (!fs.statSync(screenPath).isDirectory()) return;

  const files = fs.readdirSync(screenPath);
  const jsxFile = files.find(f => f.endsWith('.jsx'));
  const htmlFile = files.find(f => f.endsWith('.html'));

  let jsxHasLogo = false;
  let htmlHasLogo = false;

  if (jsxFile) {
    const jsxContent = fs.readFileSync(path.join(screenPath, jsxFile), 'utf8');
    jsxHasLogo = jsxContent.includes('emergere-logo') || jsxContent.includes('logo');
  }

  if (htmlFile) {
    const htmlContent = fs.readFileSync(path.join(screenPath, htmlFile), 'utf8');
    htmlHasLogo = htmlContent.includes('emergere-logo') || htmlContent.includes('mini-logo');
  }

  console.log(`Screen: ${screen.padEnd(25)} | JSX Logo: ${jsxHasLogo ? 'YES' : 'NO '} | HTML Logo: ${htmlHasLogo ? 'YES' : 'NO '}`);
});
