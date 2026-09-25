const fs = require('fs');

const filesToCheck = [
  'index.html',
  'preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/src/screens/LeaveHistory/preview.html',
  'EmergereApp/EmergereApp/src/screens/LeaveHistory/preview.css',
  'EmergereApp/EmergereApp/src/screens/LeaveHistory/LeaveHistoryScreen.jsx',
  'EmergereApp/EmergereApp/src/screens/LeaveHistory/LeaveHistoryScreen.styles.js'
];

let allPassed = true;

filesToCheck.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Check 1: No more requests-header-banner.png anywhere
  const hasOldBannerPng = content.includes('requests-header-banner.png');
  if (hasOldBannerPng) {
    console.error(`FAIL: ${file} still contains requests-header-banner.png!`);
    allPassed = false;
  } else {
    console.log(`PASS: ${file} does not contain requests-header-banner.png.`);
  }

  // Check 2: HTML files check
  if (file.endsWith('.html')) {
    const hasTitle = content.includes('My Requests');
    const hasSub = content.includes('Track your leaves &amp; permissions') || content.includes('Track your leaves & permissions');
    const hasBackBtn = content.includes('handleRequestsBackNav');
    const hasFilterBar = content.includes('mr-filter-bar');
    const hasHistoryActive = content.includes('id="tab-history"') || content.includes("class=\"tab nav-tab active\"");
    
    if (!hasTitle || !hasSub || !hasBackBtn || !hasFilterBar) {
      console.error(`FAIL: ${file} missing critical elements: title=${hasTitle}, sub=${hasSub}, backBtn=${hasBackBtn}, filterBar=${hasFilterBar}`);
      allPassed = false;
    } else {
      console.log(`PASS: ${file} contains title, subtitle, backBtn handler, and filterBar.`);
    }

    if (file.includes('index') || file.includes('preview_app')) {
      const startTpl = content.indexOf('<template id="tpl-LeaveHistory">');
      const endTpl = content.indexOf('</template>', startTpl);
      if (startTpl === -1 || endTpl === -1 || startTpl >= endTpl) {
        console.error(`FAIL: ${file} has malformed <template id="tpl-LeaveHistory">`);
        allPassed = false;
      } else {
        console.log(`PASS: ${file} template tags are well-formed.`);
      }
    }
  }

  // Check 3: JSX checks
  if (file.endsWith('.jsx')) {
    const hasTitle = content.includes('<Text style={styles.headerTitle}>My Requests</Text>');
    const hasSub = content.includes('Track your leaves & permissions');
    const hasFeatherBack = content.includes('name="arrow-left"');
    const hasArtImg = content.includes('requests-header-art.png');
    if (!hasTitle || !hasSub || !hasFeatherBack || !hasArtImg) {
      console.error(`FAIL: ${file} missing JSX components: title=${hasTitle}, sub=${hasSub}, back=${hasFeatherBack}, art=${hasArtImg}`);
      allPassed = false;
    } else {
      console.log(`PASS: ${file} JSX structure is complete.`);
    }
  }
});

console.log('\nFinal Verdict:', allPassed ? 'ALL AUDITS PASSED 100%' : 'SOME AUDITS FAILED');
