const fs = require('fs');
const path = require('path');

const cleanDetailScript = `function handleDetailLeaveDecision(status) {
          const isApproved = status === 'approved';
          const labelText = isApproved ? 'Approved' : 'Rejected';
          const badgeClass = isApproved ? 'badge success' : 'badge danger';

          const store = window.parent || window;
          const parentDoc = (window.parent && window.parent.document) ? window.parent.document : document;
          const currentPerson = (store.SELECTED_PERSON) || 'priya';

          if (!store.PERSON_DATA) store.PERSON_DATA = {};
          if (store.PERSON_DATA[currentPerson]) {
            store.PERSON_DATA[currentPerson].status = status;
            store.PERSON_DATA[currentPerson].managerDecisionSubmitted = true;
            store.PERSON_DATA[currentPerson].decisionSubmitted = true;
            if (isApproved) store.PERSON_DATA[currentPerson].approvedAt = Date.now();
            else store.PERSON_DATA[currentPerson].rejectedAt = Date.now();
          }

          if (typeof activeRecord !== 'undefined' && activeRecord) {
            activeRecord.status = status;
            activeRecord.managerDecisionSubmitted = true;
            activeRecord.decisionSubmitted = true;
            if (isApproved) activeRecord.approvedAt = Date.now();
            else activeRecord.rejectedAt = Date.now();
          }

          if (!store.MANAGER_SUBMITTED_DECISIONS) store.MANAGER_SUBMITTED_DECISIONS = {};
          store.MANAGER_SUBMITTED_DECISIONS[currentPerson] = true;
          store.MANAGER_SUBMITTED_DECISIONS[String(currentPerson)] = true;

          const pData = (store.PERSON_DATA && store.PERSON_DATA[currentPerson]) || (typeof activeRecord !== 'undefined' ? activeRecord : null);
          const isPerm = !!(
            (pData && pData.isPermission === true) ||
            String(currentPerson).startsWith('perm-') ||
            (pData && pData.permissionType) ||
            (pData && pData.type && (pData.type.includes('Going') || pData.type.includes('Coming') || pData.type.includes('Permission'))) ||
            (pData && pData.leaveType && (pData.leaveType.includes('Going') || pData.leaveType.includes('Coming') || pData.leaveType.includes('Permission')))
          );

          if (isPerm) {
            store.LAST_PERMISSION_DECISION = {
              id: currentPerson,
              status: status,
              type: (pData && (pData.permissionType || pData.leaveType || pData.type)) || 'Early Going',
              date: (pData && (pData.schedule || pData.fromDate || pData.date)) || '04-Sep-2026',
              managerDecisionSubmitted: true,
              decisionSubmitted: true,
              approvedAt: isApproved ? Date.now() : null,
              rejectedAt: !isApproved ? Date.now() : null
            };
            if (store.PERM_STATE && Array.isArray(store.PERM_STATE)) {
              store.PERM_STATE.forEach(function(req) {
                var idMatch = String(req.id) === String(currentPerson) || ('perm-' + req.id) === String(currentPerson) || String(req.id) === ('perm-' + currentPerson);
                var detailMatch = pData && (req.employeeName === (pData.name || pData.employeeName)) && (req.type === (pData.type || pData.leaveType || pData.permissionType));
                if (idMatch || detailMatch) {
                  req.status = status;
                  req.managerDecisionSubmitted = true;
                  req.decisionSubmitted = true;
                  if (isApproved) req.approvedAt = Date.now();
                  else req.rejectedAt = Date.now();
                  store.MANAGER_SUBMITTED_DECISIONS[req.id] = true;
                }
              });
            }
            if (store.PERMISSION_REQUESTS && Array.isArray(store.PERMISSION_REQUESTS)) {
              store.PERMISSION_REQUESTS.forEach(function(req) {
                var idMatch = String(req.id) === String(currentPerson) || ('perm-' + req.id) === String(currentPerson) || String(req.id) === ('perm-' + currentPerson);
                var detailMatch = pData && (req.employeeName === (pData.name || pData.employeeName)) && (req.type === (pData.type || pData.leaveType || pData.permissionType));
                if (idMatch || detailMatch) {
                  req.status = status;
                  req.managerDecisionSubmitted = true;
                  req.decisionSubmitted = true;
                  if (isApproved) req.approvedAt = Date.now();
                  else req.rejectedAt = Date.now();
                  store.MANAGER_SUBMITTED_DECISIONS[req.id] = true;
                }
              });
            }
          } else {
            store.LAST_LEAVE_DECISION = {
              id: currentPerson === 'priya' ? '1' : currentPerson,
              personKey: currentPerson,
              status: status,
              managerDecisionSubmitted: true,
              decisionSubmitted: true,
              approvedAt: isApproved ? Date.now() : null,
              rejectedAt: !isApproved ? Date.now() : null,
              labelText: labelText,
              badgeClass: badgeClass,
              lType: (pData && (pData.leaveType || pData.type)) || 'Casual Leave'
            };
            store.lastLeaveDecision = store.LAST_LEAVE_DECISION;

            if (store.EMP_LEAVE_REQUESTS && Array.isArray(store.EMP_LEAVE_REQUESTS)) {
              store.EMP_LEAVE_REQUESTS.forEach(function(req) {
                var idMatch = String(req.id) === String(currentPerson) || (currentPerson === 'priya' && String(req.id) === '1') || (currentPerson === '1' && String(req.id) === '1');
                var detailMatch = pData && (req.employeeName === (pData.name || pData.employeeName)) && (req.leaveType === (pData.leaveType || pData.type));
                if (idMatch || detailMatch) {
                  req.status = status;
                  req.managerDecisionSubmitted = true;
                  req.decisionSubmitted = true;
                  if (isApproved) req.approvedAt = Date.now();
                  else req.rejectedAt = Date.now();
                  store.MANAGER_SUBMITTED_DECISIONS[req.id] = true;
                }
              });
              if (typeof store.updateEmploymentStatusAfterApproval === 'function') {
                store.updateEmploymentStatusAfterApproval((pData && (pData.name || pData.employeeName)), (pData && (pData.leaveType || pData.type)), status);
              }
            }
          }`;

const files = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'EmergereApp/EmergereApp/src/screens/LeaveApprovalDetail/preview.html'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  const targetPattern = /function handleDetailLeaveDecision\(status\)\s*\{[\s\S]*?if \(typeof store\.updateEmploymentStatusAfterApproval === 'function'\)\s*\{\s*store\.updateEmploymentStatusAfterApproval[\s\S]*?\}\s*\}\s*\}/;
  if (targetPattern.test(c)) {
    c = c.replace(targetPattern, cleanDetailScript);
    fs.writeFileSync(f, c, 'utf8');
    console.log('Updated clean handleDetailLeaveDecision in:', f);
  } else {
    console.log('Pattern not matched in:', f);
  }
});
