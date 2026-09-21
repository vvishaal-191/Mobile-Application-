const fs = require('fs');

const files = [
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'preview_app.html',
  'index.html'
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update .brand img in tpl-EmployeeDashboard
  content = content.replace(
    /\.brand\s*\{\s*display:\s*flex;\s*align-items:\s*center;\s*gap:\s*[0-9]+px;\s*font-weight:\s*800;\s*font-size:\s*22px;\s*\}\s*\.brand img\s*\{[^}]*\}/g,
    `.brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 800;
          font-size: 22px;
        }

        .brand img {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          object-fit: contain;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.04);
          flex-shrink: 0;
        }`
  );

  // 2. Update .mini-logo in tpl-ManagerDashboard
  content = content.replace(
    /\.mini-logo\s*\{\s*width:\s*26px;\s*height:\s*26px;\s*object-fit:\s*contain;\s*border-radius:\s*[0-9]+px;\s*flex-shrink:\s*0;\s*\}/g,
    `.mini-logo {
          width: 28px;
          height: 28px;
          object-fit: contain;
          border-radius: 6px;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.04);
          flex-shrink: 0;
        }`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated dashboard styles in ${filePath}`);
});
