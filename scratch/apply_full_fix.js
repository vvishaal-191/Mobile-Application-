const fs = require('fs');

const newTpl = fs.readFileSync('scratch/new_leave_balance_tpl.html', 'utf8').trim();

const targetFiles = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

targetFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Replace <template id="tpl-LeaveBalance">...</template>
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
  content = before + newTpl + after;

  // 2. Update global stylesheet overrides in frame load handler
  // Rule A: :not(.has-mr-header):not(:has(.mr-header-banner))
  content = content.replaceAll(
    ':not(.has-mr-header):not(:has(.mr-header-banner)):not(.has-lb-header):not(:has(.lb-header-banner))',
    ':not(.has-mr-header):not(:has(.mr-header-banner))' // normalize first if previously replaced partially
  );
  content = content.replaceAll(
    ':not(.has-mr-header):not(:has(.mr-header-banner))',
    ':not(.has-mr-header):not(:has(.mr-header-banner)):not(.has-lb-header):not(:has(.lb-header-banner))'
  );

  // Rule B: .screen:has(.mr-header-banner)
  content = content.replaceAll(
    '.screen.has-lb-header,\n            .screen:has(.lb-header-banner),\n',
    '' // normalize first
  );
  content = content.replaceAll(
    '.screen.has-lb-header,\r\n            .screen:has(.lb-header-banner),\r\n',
    '' // normalize first
  );
  content = content.replaceAll(
    '.screen:has(.mr-header-banner)',
    '.screen:has(.mr-header-banner),\n            .screen.has-lb-header,\n            .screen:has(.lb-header-banner)'
  );

  // Rule C: .mr-header-banner
  content = content.replaceAll(
    '.mr-header-banner,\n            .lb-header-banner',
    '.mr-header-banner' // normalize first
  );
  content = content.replaceAll(
    '.mr-header-banner,\r\n            .lb-header-banner',
    '.mr-header-banner' // normalize first
  );
  content = content.replaceAll(
    '.mr-header-banner {',
    '.mr-header-banner,\n            .lb-header-banner {'
  );

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Successfully updated ${file}`);
});
