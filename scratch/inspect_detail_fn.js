const fs = require('fs');
const c = fs.readFileSync('preview_app.html', 'utf8');

const fnIdx = c.indexOf('function handleDetailLeaveDecision');
if (fnIdx !== -1) {
  console.log(c.substring(fnIdx, fnIdx + 2000));
} else {
  console.log('function handleDetailLeaveDecision not found');
}
