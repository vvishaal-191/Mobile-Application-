// Screen-specific preview JS
let isRememberChecked = true;

const PREDEFINED_EMPLOYEES = [
  { name: 'Priya Sharma', email: 'priya.sharma@emergere.com', role: 'Senior Software Engineer', empId: 'EMP-2024-0156', initials: 'PS', reportingManager: 'Rahul Sharma', phone: '+91 98765 43210' },
  { name: 'Amit Patel', email: 'amit.patel@emergere.com', role: 'UI/UX Designer', empId: 'EMP-2024-0142', initials: 'AP', reportingManager: 'Rahul Sharma', phone: '+91 98765 43211' },
  { name: 'Sneha Reddy', email: 'sneha.reddy@emergere.com', role: 'QA Engineer', empId: 'EMP-2024-0188', initials: 'SR', reportingManager: 'Rahul Sharma', phone: '+91 98765 43212' },
  { name: 'Rohit Verma', email: 'rohit.verma@emergere.com', role: 'Backend Developer', empId: 'EMP-2024-0165', initials: 'RV', reportingManager: 'Rahul Sharma', phone: '+91 98765 43213' },
  { name: 'Ananya Iyer', email: 'ananya.iyer@emergere.com', role: 'Frontend Developer', empId: 'EMP-2024-0173', initials: 'AI', reportingManager: 'Rahul Sharma', phone: '+91 98765 43214' }
];

const MANAGER_CREDENTIALS = {
  emails: ['manager@emergere.com', 'rahul.sharma@emergere.com'],
  name: 'Rahul Sharma',
  role: 'Engineering Lead / Manager',
  empId: 'MGR-2024-0012',
  initials: 'RS',
  passwords: ['Manager@123', 'manager123']
};

document.addEventListener('DOMContentLoaded', () => {
  renderEmpList();
});

function renderEmpList() {
  const container = document.getElementById('emp-list');
  if (!container) return;
  container.innerHTML = PREDEFINED_EMPLOYEES.map((emp, idx) => `
    <div onclick="selectEmployee(${idx})" style="display:flex; align-items:center; padding:10px 12px; border-radius:12px; background:#F8FAFC; border:1px solid #E2E8F0; cursor:pointer; transition:all 0.15s ease;" onmouseover="this.style.background='#EEF2FF';this.style.borderColor='#2F6BFF';" onmouseout="this.style.background='#F8FAFC';this.style.borderColor='#E2E8F0';">
      <div style="width:38px; height:38px; border-radius:19px; background:#2F6BFF; color:#FFFFFF; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; margin-right:12px; flex-shrink:0;">
        ${emp.initials}
      </div>
      <div style="flex:1; min-width:0;">
        <div style="font-size:14px; font-weight:700; color:#1E293B; line-height:1.2;">${emp.name}</div>
        <div style="font-size:11px; color:#64748B; margin-top:2px;">${emp.role} • ${emp.empId}</div>
        <div style="font-size:12px; color:#2F6BFF; font-weight:600; margin-top:2px; word-break:break-all;">${emp.email}</div>
      </div>
      <div style="color:#94A3B8; font-size:14px; margin-left:8px;">›</div>
    </div>
  `).join('');
}

function selectEmployee(idx) {
  const emp = PREDEFINED_EMPLOYEES[idx];
  if (!emp) return;
  const emailInput = document.getElementById('email');
  const pwdInput = document.getElementById('pwd');
  const errBox = document.getElementById('login-auth-err');
  const pwdErr = document.getElementById('pwd-error');

  if (emailInput) emailInput.value = emp.email;
  if (pwdInput) pwdInput.value = 'Employee@123';
  if (errBox) errBox.style.display = 'none';
  if (pwdErr) pwdErr.style.display = 'none';

  closeEmpModal();
}

function openEmpModal() {
  const modal = document.getElementById('emp-modal');
  if (modal) {
    modal.style.display = 'flex';
    renderEmpList();
  }
}

function closeEmpModal() {
  const modal = document.getElementById('emp-modal');
  if (modal) modal.style.display = 'none';
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

  // Check Manager
  const isManagerEmail = MANAGER_CREDENTIALS.emails.some(m => m.toLowerCase() === emailVal);
  if (isManagerEmail) {
    if (MANAGER_CREDENTIALS.passwords.includes(pwdVal)) {
      if (window.parent && typeof window.parent.setAuthUser === 'function') {
        window.parent.setAuthUser('manager', {
          name: MANAGER_CREDENTIALS.name,
          role: MANAGER_CREDENTIALS.role,
          employeeId: MANAGER_CREDENTIALS.empId,
          initials: MANAGER_CREDENTIALS.initials,
          email: emailVal
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

  // Check Employee
  const matchedEmp = PREDEFINED_EMPLOYEES.find(e => e.email.toLowerCase() === emailVal);
  if (matchedEmp) {
    const validPass = ['Employee@123', 'employee123', 'password123'];
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
    errBox.textContent = 'Invalid credentials. Click the search icon in the email field to pick an employee, or log in as Manager.';
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
