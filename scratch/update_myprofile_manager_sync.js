const fs = require('fs');
const path = require('path');

const targetFiles = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'preview_app.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'index.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'preview_app.html'),
  path.join(__dirname, '..', 'EmergereApp', 'EmergereApp', 'src', 'screens', 'MyProfile', 'preview.html')
];

const targetSaveFragment = `    var pDoc = (window.parent && window.parent.document) || document;
    var empTpl = pDoc.getElementById('tpl-EmployeeDashboard');
    if (empTpl) {
      var tplHtml = empTpl.innerHTML;
      tplHtml = tplHtml.replace(/<h1 class="greeting"[^>]*>[\\s\\S]*?<\\/h1>/i, '<h1 class="greeting" id="dash-greeting">Hello, ' + name + '</h1>');
      if (tplHtml.indexOf('dash-role-meta') !== -1) {
        tplHtml = tplHtml.replace(/<p class="dash-role-meta"[^>]*>[\\s\\S]*?<\\/p>/i, '<p class="dash-role-meta" id="dash-role-meta"><span id="dash-role-text">' + role + '</span> &bull; <span id="dash-id-text">' + id + '</span></p>');
      } else {
        tplHtml = tplHtml.replace(/(<h1 class="greeting"[^>]*>[\\s\\S]*?<\\/h1>)/i, '$1\\n          <p class="dash-role-meta" id="dash-role-meta"><span id="dash-role-text">' + role + '</span> &bull; <span id="dash-id-text">' + id + '</span></p>');
      }
      empTpl.innerHTML = tplHtml;
    }`;

const replacementSaveFragment = `    var pDoc = (window.parent && window.parent.document) || document;
    var empTpl = pDoc.getElementById('tpl-EmployeeDashboard');
    if (empTpl) {
      var tplHtml = empTpl.innerHTML;
      tplHtml = tplHtml.replace(/<h1 class="greeting"[^>]*>[\\s\\S]*?<\\/h1>/i, '<h1 class="greeting" id="dash-greeting">Hello, ' + name + '</h1>');
      if (tplHtml.indexOf('dash-role-meta') !== -1) {
        tplHtml = tplHtml.replace(/<p class="dash-role-meta"[^>]*>[\\s\\S]*?<\\/p>/i, '<p class="dash-role-meta" id="dash-role-meta"><span id="dash-role-text">' + role + '</span> &bull; <span id="dash-id-text">' + id + '</span></p>');
      } else {
        tplHtml = tplHtml.replace(/(<h1 class="greeting"[^>]*>[\\s\\S]*?<\\/h1>)/i, '$1\\n          <p class="dash-role-meta" id="dash-role-meta"><span id="dash-role-text">' + role + '</span> &bull; <span id="dash-id-text">' + id + '</span></p>');
      }
      empTpl.innerHTML = tplHtml;
    }
    var mgrTpl = pDoc.getElementById('tpl-ManagerDashboard');
    if (mgrTpl) {
      var mgrHtml = mgrTpl.innerHTML;
      mgrHtml = mgrHtml.replace(/<div class="mgr-user-name"[^>]*>[\\s\\S]*?<\\/div>/i, '<div class="mgr-user-name">' + name + '</div>');
      mgrTpl.innerHTML = mgrHtml;
    }`;

const oldDomContentEnd = `      if (p.phone) {
        var phEl = document.getElementById('val-phone');
        if (phEl) phEl.textContent = p.phone;
        var inPhone = document.getElementById('input-phone');
        if (inPhone) inPhone.value = p.phone;
      }
    }
  });`;

const newDomContentEnd = `      if (p.phone) {
        var phEl = document.getElementById('val-phone');
        if (phEl) phEl.textContent = p.phone;
        var inPhone = document.getElementById('input-phone');
        if (inPhone) inPhone.value = p.phone;
      }
    }

    var isManager = false;
    try {
      var pWin = (window.parent && window.parent !== window) ? window.parent : window;
      if (pWin.AUTH_USER && pWin.AUTH_USER.role === 'manager') isManager = true;
      else if (window.AUTH_USER && window.AUTH_USER.role === 'manager') isManager = true;
      else if (p && (p.role || '').toLowerCase().indexOf('manager') !== -1) isManager = true;
    } catch(e) {}
    if (isManager) {
      var histSpan = document.querySelector('#tab-history span');
      if (histSpan) histSpan.textContent = 'Calendar';
      var subEl = document.querySelector('.profile-header-subtitle');
      if (subEl) subEl.textContent = 'Manager Details';
    }
  });`;

targetFiles.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');
  let mod = false;
  if (c.includes(targetSaveFragment)) {
    c = c.replace(targetSaveFragment, replacementSaveFragment);
    mod = true;
  }
  if (c.includes(oldDomContentEnd)) {
    c = c.replace(oldDomContentEnd, newDomContentEnd);
    mod = true;
  }
  if (mod) {
    fs.writeFileSync(f, c, 'utf8');
    console.log('Updated Manager Profile sync in:', path.basename(f));
  } else {
    console.warn('Could not update in:', path.basename(f));
  }
});
