const fs = require('fs');
const path = require('path');

const previewHtmlPath = path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'src', 'screens', 'MyProfile', 'preview.html');
const previewCssPath = path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'src', 'screens', 'MyProfile', 'preview.css');

const previewHtml = fs.readFileSync(previewHtmlPath, 'utf8');
const previewCss = fs.readFileSync(previewCssPath, 'utf8');

console.log('preview.html size:', previewHtml.length);
console.log('preview.css size:', previewCss.length);

// Extract the <body> content of preview.html and scripts
const bodyStart = previewHtml.indexOf('<body>');
const bodyEnd = previewHtml.lastIndexOf('</body>');
const bodyInner = previewHtml.substring(bodyStart + 6, bodyEnd).trim();

console.log('bodyInner length:', bodyInner.length);
