const fs = require('fs');
const { tplContent } = require('./build_template');

const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log('File does not exist:', file);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');

  // 1. Replace <template id="tpl-EmployeeDashboard">...</template>
  const startTag = '<template id="tpl-EmployeeDashboard">';
  const start = content.indexOf(startTag);
  if (start === -1) {
    console.error('Could not find start in', file);
    return;
  }
  const end = content.indexOf('</template>', start) + '</template>'.length;
  content = content.substring(0, start) + tplContent + content.substring(end);

  // 2. Fix greeting logic so it never prepends duplicate "Hello,"
  content = content.replace(
    /greetingEl\.textContent\s*=\s*dName\.indexOf\('👋'\)[^;]+;/g,
    "greetingEl.textContent = curName || 'Sneha Reddy';"
  );
  content = content.replace(
    /greetingEl\.textContent\s*=\s*'Hello,\s*'\s*\+\s*curName;/g,
    "greetingEl.textContent = curName || 'Sneha Reddy';"
  );

  // 3. Ensure screen padding-top is 0 for EmployeeDashboard in dashNoGlowStyle
  if (content.indexOf("dashNoGlowStyle.textContent = `") !== -1 && content.indexOf(".screen {\n                padding-top: 0 !important;") === -1) {
    content = content.replace(
      "dashNoGlowStyle.textContent = `",
      "dashNoGlowStyle.textContent = `\n              .screen {\n                padding-top: 0 !important;\n              }\n              .dash-header {\n                margin-top: 0 !important;\n              }"
    );
  }

  // 4. Update request filtering in loadScreen for Employee Dashboard so it ONLY shows approved or rejected requests
  const oldFilterRegex = /\/\/ Filter requests strictly for currently logged-in employee[\s\S]*?return matchEmail \|\| matchId \|\| matchName;\s*\}\);/;
  const newFilterCode = `// Filter requests strictly for currently logged-in employee (ONLY approved or rejected)
            var allReqs = window.EMP_LEAVE_REQUESTS || [];
            var userReqs = allReqs.filter(function(r) {
              if (window.DELETED_REQUEST_IDS && window.DELETED_REQUEST_IDS.indexOf(String(r.id)) !== -1) return false;
              var matchEmail = r.employeeEmail && curEmail && (r.employeeEmail.toLowerCase() === curEmail);
              var matchId = r.employeeId && curEmpId && (r.employeeId.toUpperCase() === curEmpId.toUpperCase());
              var matchName = r.employeeName && curName && (r.employeeName.toLowerCase() === curName.toLowerCase());
              var isUserMatch = matchEmail || matchId || matchName;
              var st = (r.status || '').toLowerCase();
              var isApprovedOrRejected = st === 'approved' || st === 'rejected';
              return isUserMatch && isApprovedOrRejected;
            });`;

  if (oldFilterRegex.test(content)) {
    content = content.replace(oldFilterRegex, newFilterCode);
  }

  // 5. Update request card HTML creation in loadScreen for Employee Dashboard
  const oldCardSearch1 = "var cardDiv = doc.createElement('div');\n                cardDiv.className = 'card request-card';";
  const oldCardSearch2 = "var cardDiv = doc.createElement('div');\n                cardDiv.className = 'recent-request-card';";
  const oldCardSearch3 = "var cardDiv = doc.createElement('div');\n                cardDiv.className = 'recent-request-card request-card';";

  const targetCardBlock = `                var cardDiv = doc.createElement('div');
                cardDiv.className = 'recent-request-card request-card';
                cardDiv.id = 'emp-req-' + req.id;
                cardDiv.style.marginTop = '8px';
                cardDiv.style.cursor = 'pointer';
                cardDiv.innerHTML = '<div class="recent-request-left">'
                  + '<div class="recent-request-title">' + titleText + '</div>'
                  + '<div class="recent-request-sub">' + dateReasonText + '</div>'
                  + '<div class="recent-request-meta">' + (req.employeeName || curName) + ' \u2022 ' + (req.employeeId || curEmpId) + '</div>'
                  + '</div>'
                  + '<div class="recent-request-right">'
                  + '<span class="recent-request-badge" style="background:' + (rStatus === 'approved' ? '#DCFCE7' : '#FCE4E4') + '; color:' + (rStatus === 'approved' ? '#16A34A' : '#E5484D') + ';">' + st + '</span>'
                  + '<button type="button" class="recent-request-dismiss-btn" title="Dismiss request" onclick="deleteEmpRequest(this, event, \\'' + req.id + '\\')">'
                  + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#94A3B8" stroke-width="1.8" fill="none"/><line x1="15" y1="9" x2="9" y2="15" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round"/><line x1="9" y1="9" x2="15" y2="15" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round"/></svg>'
                  + '</button>'
                  + '</div>';`;

  // Replace any previous card block
  // Step 5 regex disabled to avoid corrupting permission-approvals
  if (false) {
    content = content.replace(cardBlockRegex, `${targetCardBlock}
                cardDiv.addEventListener('click', function(e) {
                  if (!e.target.closest('.recent-request-dismiss-btn') && !e.target.closest('.btn-cancel-req')) {
                    if (window.PERSON_DATA && window.PERSON_DATA[req.id]) {
                      loadScreen('tpl-LeaveApprovalDetail', req.id);
                    }
                  }
                });
                reqsList.appendChild(cardDiv);`);
  }

  // 6. Update section display toggle logic
  const oldLabelUpdateRegex = /if \(reqsLabel\) \{[\s\S]*?reqsLabel\.style\.display = [^;]+;[\s\S]*?\}/;
  const newLabelUpdate = `var secContainer = doc.getElementById('emp-recent-requests-section');
            if (secContainer) {
              secContainer.style.display = userReqs.length > 0 ? 'block' : 'none';
            }
            if (reqsLabel) {
              reqsLabel.textContent = 'RECENT REQUESTS (' + userReqs.length + ')';
              reqsLabel.style.display = userReqs.length > 0 ? 'block' : 'none';
            }`;

  if (oldLabelUpdateRegex.test(content)) {
    content = content.replace(oldLabelUpdateRegex, newLabelUpdate);
  }

  // 7. Ensure deleteEmpRequest hides section when count reaches 0
  if (content.indexOf("var allCards = docRef.querySelectorAll('.request-card');") !== -1 && content.indexOf("var secContainer = docRef.getElementById('emp-recent-requests-section');") === -1) {
    content = content.replace(
      "var allCards = docRef.querySelectorAll('.request-card');",
      "var allCards = docRef.querySelectorAll('.request-card, .recent-request-card');\n              var secContainer = docRef.getElementById('emp-recent-requests-section');\n              if (secContainer && allCards.length <= 1) secContainer.style.display = 'none';"
    );
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated:', file);
});
