const fs = require('fs');

// Read the complete standalone test file which was already validated
const testContent = fs.readFileSync('scratch/test_manager_dashboard.html', 'utf8');

// Extract head style and body content from testContent
const styleMatch = testContent.match(/<style>([\s\S]*?)<\/style>/);
const bodyMatch = testContent.match(/<body>([\s\S]*?)<\/body>/);

if (!styleMatch || !bodyMatch) {
  console.error('Failed to match style or body from test_manager_dashboard.html');
  process.exit(1);
}

const styles = styleMatch[1];
const body = bodyMatch[1];

// Assemble the template content
const templateContent = `
  <template id="tpl-ManagerDashboard">
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
      <style>
${styles}
      </style>
    </head>
    <body>
${body}
    </body>
    </html>
  </template>`;

// Check criteria
console.log('--- VALIDATION CHECKS ---');
console.log('Has manager-dash-leave-badge:', /class="qbadge" id="manager-dash-leave-badge">[0-9]+/.test(templateContent));
console.log('Has manager-dash-perm-badge:', /class="qbadge" id="manager-dash-perm-badge">[0-9]+/.test(templateContent));
console.log('Has mgr-dash-requests-label:', templateContent.includes('id="mgr-dash-requests-label"'));
console.log('Has mgr-dash-requests-list:', templateContent.includes('id="mgr-dash-requests-list"'));
console.log('Has "View All" (should be FALSE):', /view\s*all/i.test(templateContent));
console.log('Has openSidebarDrawer:', templateContent.includes('openSidebarDrawer'));
console.log('Has hamburger-btn:', templateContent.includes('class="hamburger-btn"'));

fs.writeFileSync('scratch/assembled_tpl_manager_dashboard.html', templateContent, 'utf8');
console.log('Assembled template saved to scratch/assembled_tpl_manager_dashboard.html (length:', templateContent.length, ')');
