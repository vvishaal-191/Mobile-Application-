const fs = require('fs');

const content = fs.readFileSync('index.html', 'utf8');
const lines = content.split('\n');

lines.forEach((l, idx) => {
  if (l.includes('<template id="tpl-LeaveHistory">')) {
    console.log('Start line:', idx + 1);
  }
  if (idx > 6700 && idx < 7600 && l.trim() === '</template>') {
    console.log('End line:', idx + 1);
  }
});
