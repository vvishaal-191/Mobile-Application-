// Screen-specific preview JS
let isRememberChecked = true;

const PREDEFINED_EMPLOYEES = [
  { name: 'Priya Sharma', email: 'priya.sharma@emergere.com', password: 'Employee@123', role: 'Senior Software Engineer', empId: 'EMP-2024-0156', initials: 'PS', reportingManager: 'Rahul Sharma', phone: '+91 98765 43210' },
  { name: 'Amit Patel', email: 'amit.patel@emergere.com', password: 'Employee@123', role: 'UI/UX Designer', empId: 'EMP-2024-0142', initials: 'AP', reportingManager: 'Rahul Sharma', phone: '+91 98765 43211' },
  { name: 'Sneha Reddy', email: 'sneha.reddy@emergere.com', password: 'Employee@123', role: 'QA Engineer', empId: 'EMP-2024-0188', initials: 'SR', reportingManager: 'Rahul Sharma', phone: '+91 98765 43212' },
  { name: 'Rohit Verma', email: 'rohit.verma@emergere.com', password: 'Employee@123', role: 'Backend Developer', empId: 'EMP-2024-0165', initials: 'RV', reportingManager: 'Rahul Sharma', phone: '+91 98765 43213' },
  { name: 'Ananya Iyer', email: 'ananya.iyer@emergere.com', password: 'Employee@123', role: 'Frontend Developer', empId: 'EMP-2024-0173', initials: 'AI', reportingManager: 'Rahul Sharma', phone: '+91 98765 43214' }
];

const PREDEFINED_MANAGERS = [
  { name: 'Rahul Sharma', email: 'rahul.sharma@emergere.com', altEmail: 'manager@emergere.com', password: 'Manager@123', role: 'Engineering Lead / Manager', empId: 'MGR-2024-0012', initials: 'RS', reportingManager: 'Board of Directors', phone: '+91 98765 00001' },
  { name: 'Vikram Malhotra', email: 'vikram.malhotra@emergere.com', password: 'Manager@123', role: 'Operations Manager', empId: 'MGR-2024-0008', initials: 'VM', reportingManager: 'Board of Directors', phone: '+91 98765 00002' },
  { name: 'Neha Kapoor', email: 'neha.kapoor@emergere.com', password: 'Manager@123', role: 'Project & HR Manager', empId: 'MGR-2024-0015', initials: 'NK', reportingManager: 'Board of Directors', phone: '+91 98765 00003' }
];

document.addEventListener('DOMContentLoaded', () => {
  renderEmpList();
});

const EYE_SVG_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
const EYE_OFF_SVG_ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="23" x2="23" y2="1"></line></svg>';

function updatePasswordEyeVisibility(id) {
  const input = document.getElementById(id || 'pwd');
  if (!input) return;
  const eyeBtn = document.getElementById(input.id + '-eye') || (input.parentElement ? input.parentElement.querySelector('.eye-btn') : null);
  if (!eyeBtn) return;
  if (input.value && input.value.length > 0) {
    eyeBtn.style.display = 'flex';
    eyeBtn.innerHTML = input.type === 'password' ? EYE_SVG_ICON : EYE_OFF_SVG_ICON;
    eyeBtn.setAttribute('title', input.type === 'password' ? 'View password' : 'Hide password');
  } else {
    eyeBtn.style.display = 'none';
  }
}

function toggleVisibility(id) {
  const input = document.getElementById(id);
  if (!input) return;
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  const eyeBtn = document.getElementById(id + '-eye') || (input.parentElement ? input.parentElement.querySelector('.eye-btn') : null);
  if (eyeBtn) {
    eyeBtn.innerHTML = isPass ? EYE_OFF_SVG_ICON : EYE_SVG_ICON;
    eyeBtn.setAttribute('title', isPass ? 'Hide password' : 'View password');
  }
}

function renderEmpList() {
  const container = document.getElementById('emp-list');
  if (!container) return;

  const empSectionHtml = `
    <div style="margin:2px 2px 5px;">
      <span style="font-size:11px; font-weight:800; color:#475569; text-transform:uppercase; letter-spacing:0.8px;">Employee</span>
    </div>
    ${PREDEFINED_EMPLOYEES.map((emp, idx) => `
      <div onclick="selectAccount('employee', ${idx})" style="padding:8px 12px; border-radius:10px; background:#F8FAFC; border:1px solid #E2E8F0; cursor:pointer; transition:all 0.16s ease; margin-bottom:5px;" onmouseover="this.style.background='#EEF2FF';this.style.borderColor='#2F6BFF';this.style.transform='translateY(-1px)';" onmouseout="this.style.background='#F8FAFC';this.style.borderColor='#E2E8F0';this.style.transform='none';">
        <div style="font-size:13px; font-weight:600; color:#1E293B; word-break:break-all; line-height:1.25;">${emp.email}</div>
        <div style="font-size:12px; letter-spacing:2.5px; color:#64748B; margin-top:2px; font-weight:700; user-select:none;">••••••••</div>
      </div>
    `).join('')}
  `;

  const mgrSectionHtml = `
    <div style="margin:8px 2px 5px;">
      <span style="font-size:12px; font-weight:800; color:#475569; text-transform:uppercase; letter-spacing:0.8px;">Manager</span>
    </div>
    ${PREDEFINED_MANAGERS.map((mgr, idx) => `
      <div onclick="selectAccount('manager', ${idx})" style="padding:8px 12px; border-radius:10px; background:#F8FAFC; border:1px solid #E2E8F0; cursor:pointer; transition:all 0.16s ease; margin-bottom:5px;" onmouseover="this.style.background='#EEF2FF';this.style.borderColor='#6366F1';this.style.transform='translateY(-1px)';" onmouseout="this.style.background='#F8FAFC';this.style.borderColor='#E2E8F0';this.style.transform='none';">
        <div style="font-size:13px; font-weight:600; color:#1E293B; word-break:break-all; line-height:1.25;">${mgr.email}</div>
        <div style="font-size:12px; letter-spacing:2.5px; color:#64748B; margin-top:2px; font-weight:700; user-select:none;">••••••••</div>
      </div>
    `).join('')}
  `;

  container.innerHTML = empSectionHtml + mgrSectionHtml;
}

function selectAccount(role, idx) {
  const account = role === 'manager' ? PREDEFINED_MANAGERS[idx] : PREDEFINED_EMPLOYEES[idx];
  if (!account) return;
  const emailInput = document.getElementById('email');
  const pwdInput = document.getElementById('pwd');
  const errBox = document.getElementById('login-auth-err');
  const pwdErr = document.getElementById('pwd-error');

  // Smooth fade-out transition
  closeEmpModal();

  if (emailInput) emailInput.value = account.email;
  if (pwdInput) {
    pwdInput.value = account.password;
    pwdInput.type = 'password';
    updatePasswordEyeVisibility('pwd');
  }
  if (errBox) errBox.style.display = 'none';
  if (pwdErr) pwdErr.style.display = 'none';
}

function openEmpModal() {
  const modal = document.getElementById('emp-modal');
  if (modal) {
    renderEmpList();
    modal.style.display = 'flex';
    void modal.offsetWidth; // Force reflow for smooth transition
    modal.classList.add('active');
    modal.style.opacity = '1';
  }
}

function closeEmpModal() {
  const modal = document.getElementById('emp-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.style.display = 'none';
    }, 280);
  }
}

function handleLogin() {
  const emailInput = document.getElementById('email');
  const pwdInput = document.getElementById('pwd');
  const errBox = document.getElementById('login-auth-err');
  const pwdErr = document.getElementById('pwd-error');

  if (errBox) errBox.style.display = 'none';
  if (pwdErr) pwdErr.style.display = 'none';

  const emailVal = emailInput ? emailInput.value.trim().toLowerCase() : '';
  const pwdVal = pwdInput ? pwdInput.value.trim() : '';

  if (!emailVal || !pwdVal) {
    if (errBox) {
      errBox.textContent = 'Please enter both email and password.';
      errBox.style.display = 'block';
    }
    return;
  }

  // 1. Check Manager (3 predefined manager accounts)
  const matchedManager = PREDEFINED_MANAGERS.find(
    m => m.email.toLowerCase() === emailVal || (m.altEmail && m.altEmail.toLowerCase() === emailVal)
  );
  if (matchedManager) {
    const validPass = [matchedManager.password, 'Manager@123', 'manager123'];
    if (validPass.includes(pwdVal)) {
      if (window.parent && typeof window.parent.setAuthUser === 'function') {
        window.parent.setAuthUser('manager', {
          name: matchedManager.name,
          role: matchedManager.role,
          employeeId: matchedManager.empId,
          initials: matchedManager.initials,
          email: matchedManager.email,
          phone: matchedManager.phone,
          reportingManager: matchedManager.reportingManager
        });
      }
      if (window.parent && window.parent.loadScreen) {
        window.parent.loadScreen('tpl-ManagerDashboard');
      } else {
        alert('Manager login successful! Redirecting to Manager Dashboard.');
      }
      return;
    } else {
      if (errBox) {
        errBox.textContent = 'Invalid password for Manager account.';
        errBox.style.display = 'block';
      }
      return;
    }
  }

  // 2. Check Employee (5 predefined employee accounts)
  const matchedEmp = PREDEFINED_EMPLOYEES.find(e => e.email.toLowerCase() === emailVal);
  if (matchedEmp) {
    const validPass = [matchedEmp.password, 'Employee@123', 'employee123', 'password123'];
    if (validPass.includes(pwdVal)) {
      if (window.parent && typeof window.parent.setAuthUser === 'function') {
        window.parent.setAuthUser('employee', matchedEmp);
      }
      if (window.parent && window.parent.loadScreen) {
        window.parent.loadScreen('tpl-EmployeeDashboard');
      } else {
        alert('Employee login successful! Redirecting to Employee Dashboard.');
      }
      return;
    } else {
      if (errBox) {
        errBox.textContent = 'Invalid password for employee account.';
        errBox.style.display = 'block';
      }
      return;
    }
  }

  // Invalid
  if (errBox) {
    errBox.textContent = 'Invalid credentials. Click the search icon in the email field to pick an employee or manager account.';
    errBox.style.display = 'block';
  }
}

function toggleRemember(el) {
  isRememberChecked = !isRememberChecked;
  const chk = el.querySelector('.chk-box');
  if (chk) {
    chk.textContent = isRememberChecked ? '✓' : '';
    chk.style.background = isRememberChecked ? '#8EC4EA' : 'transparent';
  }
}

function openForgotModal() {
  const forgotEmail = document.getElementById('forgot-email');
  const forgotContact = document.getElementById('forgot-contact');
  const modalErr = document.getElementById('modal-err');
  
  if (forgotEmail) forgotEmail.value = '';
  if (forgotContact) forgotContact.value = '';
  if (modalErr) modalErr.style.display = 'none';

  const modal = document.getElementById('forgot-modal');
  if (modal) modal.style.display = 'flex';
}

function closeForgotModal() {
  const modal = document.getElementById('forgot-modal');
  if (modal) modal.style.display = 'none';
}

function confirmForgot() {
  const emailInput = document.getElementById('forgot-email');
  const contactInput = document.getElementById('forgot-contact');
  const modalErr = document.getElementById('modal-err');

  const emailVal = emailInput ? emailInput.value.trim() : '';
  const contactVal = contactInput ? contactInput.value.trim() : '';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  if (!emailVal || !emailRegex.test(emailVal)) {
    if (modalErr) {
      modalErr.textContent = 'Please enter a valid registered Email ID.';
      modalErr.style.display = 'block';
    }
    return;
  }

  if (!contactVal || !phoneRegex.test(contactVal.replace(/[\s-]/g, ''))) {
    if (modalErr) {
      modalErr.textContent = 'Please enter a valid 10-digit registered Contact Number.';
      modalErr.style.display = 'block';
    }
    return;
  }

  if (modalErr) modalErr.style.display = 'none';
  closeForgotModal();

  if (window.parent && window.parent.loadScreen) {
    window.parent.loadScreen('tpl-EmployeeDashboard');
  } else {
    alert('Verification successful! Redirecting to Employee Dashboard.');
  }
}
