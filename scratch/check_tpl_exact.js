const fs = require('fs');

const files = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const start = content.indexOf('<template id="tpl-LeaveBalance">');
  const end = content.indexOf('</template>', start);
  const tpl = content.slice(start, end);
  console.log(`=== ${f} ===`);
  console.log('  390px in tpl-LeaveBalance:', tpl.includes('390px'));
  console.log('  440px in tpl-LeaveBalance:', tpl.includes('440px'));
  console.log('  min-width: 769px in tpl-LeaveBalance:', tpl.includes('min-width: 769px'));
  console.log('  padding: 18px 20px 24px 20px:', tpl.includes('padding: 18px 20px 24px 20px'));
  console.log('  padding: 16px 20px 20px 20px in cards container:', tpl.includes('padding: 16px 20px 20px 20px'));
});
