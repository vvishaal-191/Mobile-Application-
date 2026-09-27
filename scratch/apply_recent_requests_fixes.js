const fs = require('fs');

console.log('=== APPLYING MANAGER DASHBOARD RECENT REQUESTS & CARD FIXES ===\n');

// 1. UPDATE preview.js in ManagerDashboard
const previewJsPath = 'EmergereApp/EmergereApp/src/screens/ManagerDashboard/preview.js';
if (fs.existsSync(previewJsPath)) {
  let js = fs.readFileSync(previewJsPath, 'utf8');

  // Replace recent requests section in syncManagerDashboard
  const startMarker = '// 3. Recent Requests Section';
  const endMarker = 'requestsList.innerHTML = htmlCards;\n        }\n      }';

  const startIdx = js.indexOf(startMarker);
  const endIdx = js.indexOf(endMarker, startIdx);

  if (startIdx !== -1 && endIdx !== -1) {
    const replacement = `// 3. Recent Requests Section
      // Only requests that have been approved or rejected by the manager AND submitted appear in Recent Requests.
      // Newly submitted pending requests do not appear here until approved/rejected and submitted.
      const submittedMap = store.MANAGER_SUBMITTED_DECISIONS || {};
      const processedRequests = allRequests.filter(function(r) {
        const s = (r.status || '').toLowerCase();
        const isDecided = s === 'approved' || s === 'rejected';
        const isSubmitted = r.managerDecisionSubmitted === true || r.decisionSubmitted === true || !!submittedMap[r.id] || !!r.approvedAt || !!r.rejectedAt;
        return isDecided && isSubmitted;
      });

      const requestsLabel = doc.getElementById('mgr-dash-requests-label');
      const requestsList = doc.getElementById('mgr-dash-requests-list');

      if (requestsLabel) {
        requestsLabel.textContent = 'Recent Requests (' + processedRequests.length + ')';
      }

      if (requestsList) {
        if (processedRequests.length === 0) {
          // Empty state matching Image 3
          requestsList.innerHTML = '<div class="empty-requests-wrap">'
            + '<svg width="100" height="85" viewBox="0 0 100 85" fill="none" xmlns="http://www.w3.org/2000/svg">'
            + '<defs>'
            + '<linearGradient id="docGrad" x1="0" y1="0" x2="0" y2="1">'
            + '<stop offset="0%" stop-color="#EFF6FF"/>'
            + '<stop offset="100%" stop-color="#DBEAFE"/>'
            + '</linearGradient>'
            + '</defs>'
            + '<rect x="25" y="10" width="46" height="58" rx="8" fill="url(#docGrad)" stroke="#BFDBFE" stroke-width="1.5"/>'
            + '<line x1="33" y1="22" x2="57" y2="22" stroke="#93C5FD" stroke-width="2.5" stroke-linecap="round"/>'
            + '<line x1="33" y1="30" x2="63" y2="30" stroke="#93C5FD" stroke-width="2.5" stroke-linecap="round"/>'
            + '<line x1="33" y1="38" x2="52" y2="38" stroke="#93C5FD" stroke-width="2.5" stroke-linecap="round"/>'
            + '<line x1="33" y1="46" x2="45" y2="46" stroke="#93C5FD" stroke-width="2.5" stroke-linecap="round"/>'
            + '<circle cx="58" cy="52" r="14" fill="#FFFFFF" stroke="#0066FF" stroke-width="3"/>'
            + '<circle cx="58" cy="52" r="10" fill="#E0F2FE" fill-opacity="0.4"/>'
            + '<line x1="68" y1="62" x2="78" y2="72" stroke="#0066FF" stroke-width="3.5" stroke-linecap="round"/>'
            + '<path d="M18 28 L20 22 L22 28 L28 30 L22 32 L20 38 L18 32 L12 30 Z" fill="#93C5FD" opacity="0.7"/>'
            + '<path d="M76 16 L77.5 12 L79 16 L83 17.5 L79 19 L77.5 23 L76 19 L72 17.5 Z" fill="#93C5FD" opacity="0.6"/>'
            + '</svg>'
            + '<div class="empty-title">No recent requests</div>'
            + '<div class="empty-desc">New leave or permission requests from your team will appear here.</div>'
            + '</div>';
        } else {
          let htmlCards = '';
          processedRequests.forEach(function(req) {
            const isPerm = !!req.isPermission;
            const empName = req.employeeName || req.name || 'Sneha Reddy';
            const empInitials = req.employeeInitials || req.initials || (empName.split(' ').map(function(w){return w[0];}).join('').toUpperCase().slice(0, 2)) || 'SR';
            const empRole = req.employeeRole || req.role || (isPerm ? 'UI/UX Designer' : 'Senior Software Engineer');
            const reqType = req.leaveType || req.type || (isPerm ? 'Early Going' : 'Casual Leave');
            const duration = req.daysText || req.duration || req.totalDays || (isPerm ? '2 Hours' : '2 Days');
            const dates = req.date || (req.fromDate === req.toDate ? req.fromDate : (req.fromDate + ' – ' + (req.toDate || req.fromDate)));
            const reason = req.reason || (isPerm ? 'Personal work / checkup' : "Family function - attending sister's wedding ceremony in Bangalore.");
            const status = (req.status || 'pending').toLowerCase();
            const statusLabel = status === 'approved' ? 'Approved' : (status === 'rejected' ? 'Rejected' : 'Pending');

            // Card without circled Active button (Requirement 3)
            htmlCards += '<div class="recent-req-item" onclick="handleCardNav(\\'tpl-LeaveApprovalDetail\\', \\'' + (req.id || 'priya') + '\\')" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:14px; padding:14px 16px; margin-bottom:12px; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.03); transition:all 0.2s;">'
              + '<div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">'
              + '<div style="display:flex; align-items:center; gap:10px;">'
              + '<div style="width:38px; height:38px; border-radius:50%; background:#2563EB; color:#FFFFFF; font-weight:700; font-size:14px; display:flex; align-items:center; justify-content:center;">' + empInitials + '</div>'
              + '<div>'
              + '<div style="font-size:14px; font-weight:700; color:#0F172A;">' + empName + '</div>'
              + '<div style="font-size:11.5px; color:#64748B;">' + empRole + '</div>'
              + '</div>'
              + '</div>'
              + '</div>'

              + '<div style="display:flex; align-items:center; gap:8px; font-size:12px; margin-bottom:6px;">'
              + '<span style="background:#EFF6FF; color:#0066FF; border:1px solid #DBEAFE; padding:3px 10px; border-radius:8px; font-weight:600;">' + reqType + ' (' + duration + ')</span>'
              + '<span style="color:#475569; font-weight:500;">' + dates + '</span>'
              + '<span style="margin-left:auto; font-size:11.5px; font-weight:700; padding:3px 10px; border-radius:8px; background:' + (status === 'approved' ? '#DCFCE7' : '#FEE2E2') + '; color:' + (status === 'approved' ? '#15803D' : '#DC2626') + ';">' + statusLabel + '</span>'
              + '</div>'

              + '<div style="font-size:12.5px; color:#475569; background:#F8FAFC; padding:8px 12px; border-radius:8px; line-height:1.4; border-left:3px solid #0066FF;">'
              + '"' + reason + '"'
              + '</div>'
              + '</div>';
          });
          requestsList.innerHTML = htmlCards;
        }
      }`;

    js = js.substring(0, startIdx) + replacement + js.substring(endIdx + endMarker.length);
    fs.writeFileSync(previewJsPath, js, 'utf8');
    console.log('[OK] Updated preview.js in ManagerDashboard');
  } else {
    console.error('[ERR] Could not locate recent requests markers in preview.js');
  }
}

// 2. UPDATE EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/preview.html
const ladPreviewPath = 'EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/preview.html';
if (fs.existsSync(ladPreviewPath)) {
  let html = fs.readFileSync(ladPreviewPath, 'utf8');

  // Update handleDetailLeaveDecision in ladPreview
  const oldFn = 'function handleDetailLeaveDecision(status) {';
  const fnIdx = html.indexOf(oldFn);
  if (fnIdx !== -1) {
    const fnEndIdx = html.indexOf('function handleRemarksInput', fnIdx);
    // Or find end of handleDetailLeaveDecision
    // Let's replace the inner state handling of handleDetailLeaveDecision
    const oldPdata = 'activeRecord.status = status;';
    if (html.includes(oldPdata)) {
      html = html.replace(
        'activeRecord.status = status;',
        'activeRecord.status = status;\n      activeRecord.managerDecisionSubmitted = true;\n      activeRecord.decisionSubmitted = true;\n      if (isApproved) activeRecord.approvedAt = Date.now(); else activeRecord.rejectedAt = Date.now();\n      store.MANAGER_SUBMITTED_DECISIONS = store.MANAGER_SUBMITTED_DECISIONS || {};\n      store.MANAGER_SUBMITTED_DECISIONS["priya"] = true;\n      if (currentPermId) store.MANAGER_SUBMITTED_DECISIONS[currentPermId] = true;'
      );
      fs.writeFileSync(ladPreviewPath, html, 'utf8');
      console.log('[OK] Updated LeaveApprovalDetail preview.html');
    }
  }
}

// 3. UPDATE ALL 4 APP HTML FILES
const appHtmlFiles = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

appHtmlFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  let c = fs.readFileSync(filePath, 'utf8');

  // A. Update initial PERM_STATE declaration: perm-init-1 status to 'pending' and managerDecisionSubmitted: false
  c = c.replace(
    /\{\s*id:\s*'perm-init-1',\s*type:\s*'Early Going',\s*date:\s*'04-Sep-2026',\s*duration:\s*'2 Hours',\s*reason:\s*'Personal work',\s*status:\s*'rejected',/g,
    `{
              id: 'perm-init-1',
              type: 'Early Going',
              date: '04-Sep-2026',
              duration: '2 Hours',
              reason: 'Personal work',
              status: 'pending',
              managerDecisionSubmitted: false,`
  );

  // B. Update syncManagerDashboard inside tpl-ManagerDashboard AND in outer script
  // Search for '// 3. Recent Requests Section'
  const targetSnippet1 = `// 3. Recent Requests Section
      // Only requests that have been approved or rejected by the manager appear in Recent Requests.
      // Newly submitted pending requests do not appear here until approved/rejected.
      const processedRequests = allRequests.filter(function(r) {
        const s = (r.status || '').toLowerCase();
        return s === 'approved' || s === 'rejected';
      });`;

  const newSnippet1 = `// 3. Recent Requests Section
      // Only requests that have been approved or rejected by the manager AND submitted appear in Recent Requests.
      // Newly submitted pending requests do not appear here until approved/rejected and submitted.
      const submittedMap = store.MANAGER_SUBMITTED_DECISIONS || {};
      const processedRequests = allRequests.filter(function(r) {
        const s = (r.status || '').toLowerCase();
        const isDecided = s === 'approved' || s === 'rejected';
        const isSubmitted = r.managerDecisionSubmitted === true || r.decisionSubmitted === true || !!submittedMap[r.id] || !!r.approvedAt || !!r.rejectedAt;
        return isDecided && isSubmitted;
      });`;

  if (c.includes(targetSnippet1)) {
    c = c.replace(targetSnippet1, newSnippet1);
  }

  // Also replace in outer syncManagerDashboard if it has allRequests.length
  const targetSnippet2 = `// 3. Recent Requests Section (matching Image 3)
      const requestsLabel = doc.getElementById('mgr-dash-requests-label');
      const requestsList = doc.getElementById('mgr-dash-requests-list');

      if (requestsLabel) {
        requestsLabel.textContent = 'Recent Requests (' + allRequests.length + ')';
      }`;

  const newSnippet2 = `// 3. Recent Requests Section
      const submittedMap = store.MANAGER_SUBMITTED_DECISIONS || {};
      const processedRequests = allRequests.filter(function(r) {
        const s = (r.status || '').toLowerCase();
        const isDecided = s === 'approved' || s === 'rejected';
        const isSubmitted = r.managerDecisionSubmitted === true || r.decisionSubmitted === true || !!submittedMap[r.id] || !!r.approvedAt || !!r.rejectedAt;
        return isDecided && isSubmitted;
      });

      const requestsLabel = doc.getElementById('mgr-dash-requests-label');
      const requestsList = doc.getElementById('mgr-dash-requests-list');

      if (requestsLabel) {
        requestsLabel.textContent = 'Recent Requests (' + processedRequests.length + ')';
      }`;

  if (c.includes(targetSnippet2)) {
    c = c.replace(targetSnippet2, newSnippet2);
  }

  // Also replace in case outer script had allRequests.forEach instead of processedRequests.forEach
  // Check occurrences of profile-status-pill in recent-req-item
  // Specifically:
  /*
              // Employee Status Button (Requirement 1)
              + '<div class="profile-status-pill ' + (isEmpInactive ? 'inactive-status' : 'active-status') + '" style="' + empStatusPillStyle + ' padding:4px 10px; border-radius:999px; display:inline-flex; align-items:center; gap:5px; font-size:11.5px; font-weight:700;">'
              + '<span class="profile-status-dot" style="' + empStatusDotStyle + ' width:7px; height:7px; border-radius:50%; display:inline-block;"></span>'
              + '<span class="profile-status-text" style="' + empStatusTextStyle + '">' + empStatusText + '</span>'
              + '</div>'
  */
  const pillSnippet = `              // Employee Status Button (Requirement 1)
              + '<div class="profile-status-pill ' + (isEmpInactive ? 'inactive-status' : 'active-status') + '" style="' + empStatusPillStyle + ' padding:4px 10px; border-radius:999px; display:inline-flex; align-items:center; gap:5px; font-size:11.5px; font-weight:700;">'
              + '<span class="profile-status-dot" style="' + empStatusDotStyle + ' width:7px; height:7px; border-radius:50%; display:inline-block;"></span>'
              + '<span class="profile-status-text" style="' + empStatusTextStyle + '">' + empStatusText + '</span>'
              + '</div>'`;

  while (c.includes(pillSnippet)) {
    c = c.replace(pillSnippet, '');
  }

  // In outer script, replace allRequests.forEach with processedRequests.forEach if present:
  c = c.replace(
    /if \(allRequests\.length === 0\) \{\s*\/\/ Empty state matching Image 3\s*requestsList\.innerHTML = '<div class="empty-requests-wrap">[\s\S]*?\} else \{\s*let htmlCards = '';\s*allRequests\.forEach\(function\(req\)/g,
    function(match) {
      return match.replace('allRequests.length === 0', 'processedRequests.length === 0').replace('allRequests.forEach', 'processedRequests.forEach');
    }
  );

  // C. Update handleDetailLeaveDecision in all app files to record managerDecisionSubmitted
  const ladTarget = `if (store.PERSON_DATA[currentPerson]) {
            store.PERSON_DATA[currentPerson].status = status;
          }`;
  const ladReplacement = `if (store.PERSON_DATA[currentPerson]) {
            store.PERSON_DATA[currentPerson].status = status;
            store.PERSON_DATA[currentPerson].managerDecisionSubmitted = true;
            store.PERSON_DATA[currentPerson].decisionSubmitted = true;
            if (isApproved) store.PERSON_DATA[currentPerson].approvedAt = Date.now();
            else store.PERSON_DATA[currentPerson].rejectedAt = Date.now();
          }
          store.MANAGER_SUBMITTED_DECISIONS = store.MANAGER_SUBMITTED_DECISIONS || {};
          store.MANAGER_SUBMITTED_DECISIONS[currentPerson] = true;
          if (String(currentPerson).startsWith('perm-')) {
            store.MANAGER_SUBMITTED_DECISIONS[String(currentPerson).replace('perm-', '')] = true;
          } else {
            store.MANAGER_SUBMITTED_DECISIONS['perm-' + currentPerson] = true;
          }`;

  if (c.includes(ladTarget)) {
    c = c.replace(ladTarget, ladReplacement);
  }

  // Also in store.LAST_LEAVE_DECISION:
  c = c.replace(
    /store\.LAST_LEAVE_DECISION = \{\s*id: currentPerson === 'priya' \? '1' : currentPerson,\s*personKey: currentPerson,\s*status: status,/g,
    `store.LAST_LEAVE_DECISION = {
            id: currentPerson === 'priya' ? '1' : currentPerson,
            personKey: currentPerson,
            status: status,
            managerDecisionSubmitted: true,
            decisionSubmitted: true,
            approvedAt: isApproved ? Date.now() : null,
            rejectedAt: !isApproved ? Date.now() : null,`
  );

  // Also in store.PERM_STATE inside handleDetailLeaveDecision:
  c = c.replace(
    /if \(String\(req\.id\) === String\(currentPerson\) \|\| req\.type === store\.PERSON_DATA\[currentPerson\]\.leaveType\) \{\s*req\.status = status;\s*\}/g,
    `if (String(req.id) === String(currentPerson) || req.type === store.PERSON_DATA[currentPerson].leaveType || req.id === 'perm-init-1') {
                  req.status = status;
                  req.managerDecisionSubmitted = true;
                  req.decisionSubmitted = true;
                  if (isApproved) req.approvedAt = Date.now();
                  else req.rejectedAt = Date.now();
                }`
  );

  // Also in store.EMP_LEAVE_REQUESTS inside handleDetailLeaveDecision:
  c = c.replace(
    /if \(idMatch \|\| detailMatch\) \{\s*req\.status = status;\s*if \(isApproved\) req\.approvedAt = Date\.now\(\);\s*\}/g,
    `if (idMatch || detailMatch) {
                req.status = status;
                req.managerDecisionSubmitted = true;
                req.decisionSubmitted = true;
                if (isApproved) req.approvedAt = Date.now();
                else req.rejectedAt = Date.now();
              }`
  );

  fs.writeFileSync(filePath, c, 'utf8');
  console.log(`[OK] Updated ${filePath}`);
});

console.log('\n=== RECENT REQUESTS & CARD FIXES COMPLETE ===');
