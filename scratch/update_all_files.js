const fs = require('fs');

const newTpl = fs.readFileSync('scratch/new_leave_balance_tpl.html', 'utf8');

const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Replace template
  const tplStartStr = '<template id="tpl-LeaveBalance">';
  const tplEndStr = '</template>';
  const startIdx = content.indexOf(tplStartStr);
  if (startIdx === -1) {
    console.error(`Error: Could not find ${tplStartStr} in ${file}`);
    return;
  }
  const endIdx = content.indexOf(tplEndStr, startIdx);
  if (endIdx === -1) {
    console.error(`Error: Could not find ${tplEndStr} in ${file}`);
    return;
  }

  const before = content.slice(0, startIdx);
  const after = content.slice(endIdx + tplEndStr.length);
  content = before + newTpl.trim() + after;

  // 2. Add has-lb-header and lb-header-banner to global overrides
  // We can add has-lb-header to .has-mr-header lines if not already present
  if (!content.includes('.has-lb-header')) {
    content = content.replace(
      /:not\(\.has-mr-header\):not\(:has\(\.mr-header-banner\)\)/g,
      ':not(.has-mr-header):not(:has(.mr-header-banner)):not(.has-lb-header):not(:has(.lb-header-banner))'
    );
    content = content.replace(
      /\.screen\.has-mr-header,\r?\n\s*\.screen:has\(\.mr-header-banner\)/g,
      '.screen.has-mr-header,\n            .screen:has(.mr-header-banner),\n            .screen.has-lb-header,\n            .screen:has(.lb-header-banner)'
    );
    content = content.replace(
      /\.mr-header-banner\s*\{/g,
      '.mr-header-banner,\n            .lb-header-banner {'
    );
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Successfully updated ${file}`);
});
