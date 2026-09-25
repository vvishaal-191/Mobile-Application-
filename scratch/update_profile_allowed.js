const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');

  // Replace in EMPLOYEE_ALLOWED_SCREENS
  const empTarget = "'tpl-MyProfile'\r\n        ];";
  const empTargetLf = "'tpl-MyProfile'\n        ];";
  const empReplace = "'tpl-MyProfile',\r\n          'tpl-Profile'\r\n        ];";

  if (content.includes(empTarget)) {
    content = content.replace(empTarget, empReplace);
  } else if (content.includes(empTargetLf)) {
    content = content.replace(empTargetLf, empReplace);
  }

  // Replace in MANAGER_ALLOWED_SCREENS
  const mgrTarget = "'tpl-MyProfile'\r\n        ];\r\n\r\n        window.AUTH_USER = null;";
  const mgrTargetLf = "'tpl-MyProfile'\n        ];\n\n        window.AUTH_USER = null;";
  const mgrReplace = "'tpl-MyProfile',\r\n          'tpl-Profile'\r\n        ];\r\n\r\n        window.AUTH_USER = null;";

  if (content.includes(mgrTarget)) {
    content = content.replace(mgrTarget, mgrReplace);
  } else if (content.includes(mgrTargetLf)) {
    content = content.replace(mgrTargetLf, mgrReplace);
  }

  fs.writeFileSync(f, content, 'utf8');
  console.log('Updated allowed screens in', f);
});
