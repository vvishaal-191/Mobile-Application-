const fs = require('fs');

['preview_app.html', 'index.html'].forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const start = content.indexOf('id="tpl-EmployeeDashboard"');
  const end = content.indexOf('</template>', start);
  const empDashHtml = content.substring(start, end);
  console.log(`=== ${file} ===`);
  console.log('empDashHtml contains QUICK ACTIONS:', empDashHtml.includes('QUICK ACTIONS'));
  console.log('empDashHtml contains dash-action-grid:', empDashHtml.includes('dash-action-grid'));
  console.log('empDashHtml contains dash-attendance-card:', empDashHtml.includes('dash-attendance-card'));
  console.log('empDashHtml contains dash-leave-balance-card:', empDashHtml.includes('dash-leave-balance-card'));
  console.log('empDashHtml contains emp-dash-requests-label:', empDashHtml.includes('emp-dash-requests-label'));
});
