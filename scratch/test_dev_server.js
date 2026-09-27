fetch('http://localhost:3000/preview_app.html')
  .then(res => res.text())
  .then(text => {
    console.log('HTTP 200, length:', text.length);
    console.log('Approved click handler present:', text.includes("openLeaveApprovalsTab('approved')"));
    console.log('Rejected click handler present:', text.includes("openLeaveApprovalsTab('rejected')"));
    console.log('Recent requests filter present:', text.includes('const processedRequests = allRequests.filter'));
    console.log('Leave Approvals selectable text present:', text.includes('Manage Team Requests'));
    console.log('Permission Approvals selectable text present:', text.includes('Short-duration Passes'));
  })
  .catch(err => console.error(err));
