const fs = require('fs');

console.log('--- VERIFYING PREVIEW_APP.HTML AND INDEX.HTML INTEGRITY ---');

const previewApp = fs.readFileSync('preview_app.html', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

// Check that both files contain the updated functions
function checkFile(name, content) {
  console.log(`Checking ${name}...`);
  if (!content.includes('function syncManagerDashboard')) {
    console.error(`❌ ${name} missing function syncManagerDashboard`);
    process.exit(1);
  }
  if (!content.includes('processedLeaves.forEach(function(l) { processedRequests.push(Object.assign({}, l, { _isPermCard: false })); });')) {
    console.error(`❌ ${name} missing separate processedLeaves logic`);
    process.exit(1);
  }
  if (!content.includes('processedPerms.forEach(function(p) { processedRequests.push(Object.assign({}, p, { _isPermCard: true })); });')) {
    console.error(`❌ ${name} missing separate processedPerms logic`);
    process.exit(1);
  }
  if (!content.includes('function handleDetailLeaveDecision')) {
    console.error(`❌ ${name} missing function handleDetailLeaveDecision`);
    process.exit(1);
  }
  console.log(`✅ ${name} contains all updated logic!`);
}

checkFile('preview_app.html', previewApp);
checkFile('index.html', indexHtml);
checkFile('EmergereApp/EmergereApp/preview_app.html', fs.readFileSync('EmergereApp/EmergereApp/preview_app.html', 'utf8'));
checkFile('EmergereApp/EmergereApp/index.html', fs.readFileSync('EmergereApp/EmergereApp/index.html', 'utf8'));
checkFile('EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.js', fs.readFileSync('EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.js', 'utf8'));

console.log('All files passed integrity checks!');
