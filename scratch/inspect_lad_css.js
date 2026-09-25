const fs = require('fs');
if (fs.existsSync('EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/preview.css')) {
  console.log(fs.readFileSync('EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/preview.css', 'utf8'));
} else {
  console.log('preview.css does not exist');
}
