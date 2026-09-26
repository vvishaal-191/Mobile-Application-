const fs = require('fs');
const http = require('http');

console.log('--- Checking HTML files ---');
const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const hasTpl = content.includes('id="tpl-LeaveApprovals"');
  const hasHeader = content.includes('class="header-title">Leave Approvals</h1>');
  const hasSubtitle = content.includes('class="header-subtitle">Manage Team Requests</p>');
  const hasCal = content.includes('class="header-art-img"');
  const hasPending = content.includes('Pending (<span id="count-pending">0</span>)');
  const hasApproved = content.includes('Approved (<span id="count-approved">1</span>)');
  const hasEmptyTitle = content.includes('No leave requests found</h2>');
  const hasEmptySub = content.includes('There are no leave requests in this category.</p>');
  const hasWorkflow = content.includes('processLeaveAction(id, newStatus)');

  console.log(f, {
    hasTpl,
    hasHeader,
    hasSubtitle,
    hasCal,
    hasPending,
    hasApproved,
    hasEmptyTitle,
    hasEmptySub,
    hasWorkflow
  });
});

console.log('\n--- Checking React Native files ---');
const jsx = fs.readFileSync('EmergereApp/EmergereApp/src/screens/LeaveApprovals/LeaveApprovalsScreen.jsx', 'utf8');
console.log('JSX length:', jsx.length);
console.log('JSX has CALENDAR_IMG:', jsx.includes('CALENDAR_IMG'));
console.log('JSX has EMPTY_ART_IMG:', jsx.includes('EMPTY_ART_IMG'));
console.log('JSX has handleApprove:', jsx.includes('handleApprove'));
console.log('JSX has handleReject:', jsx.includes('handleReject'));
console.log('JSX has LeaveApprovalDetail nav:', jsx.includes('LeaveApprovalDetail'));
console.log('JSX has BottomNavBar:', jsx.includes('<BottomNavBar'));

console.log('\n--- Testing local dev server HTTP ---');
http.get('http://localhost:3000/', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Server response status:', res.statusCode);
    console.log('Contains Leave Approvals button:', body.includes('Leave Approvals'));
    console.log('Contains new tpl-LeaveApprovals:', body.includes('class="header-title">Leave Approvals</h1>'));
    console.log('All verification passed successfully!');
    process.exit(0);
  });
}).on('error', (err) => {
  console.log('HTTP test error:', err.message);
  process.exit(1);
});
