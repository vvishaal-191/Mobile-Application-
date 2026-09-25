const fs = require('fs');

const content = fs.readFileSync('scratch/tpl_manager_dashboard_extracted.html', 'utf8');
console.log('length:', content.length);

// Search for Inactive or status in scratch/tpl_manager_dashboard_extracted.html
let pos = 0;
while ((pos = content.indexOf('Inactive', pos)) !== -1) {
  console.log('Found Inactive at:', pos, content.substring(pos - 50, pos + 100));
  pos += 8;
}

pos = 0;
while ((pos = content.indexOf('status', pos)) !== -1) {
  console.log('Found status at:', pos, content.substring(pos - 50, pos + 100));
  pos += 6;
}
