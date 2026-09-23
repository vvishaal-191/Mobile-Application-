// Screen-specific preview JS
let isRememberChecked = true;

const PREDEFINED_EMPLOYEES = [
  { name: 'John Doe', email: 'john@gmail.com', password: 'employee@123', role: 'Senior Software Engineer', empId: 'EMP-2024-0101', initials: 'JD', phone: '+91 98765 11001', reportingManager: 'Vishnu Kumar' },
  { name: 'Jack Ryan', email: 'jack@gmail.com', password: 'employee@123', role: 'QA Engineer', empId: 'EMP-2024-0102', initials: 'JR', phone: '+91 98765 11002', reportingManager: 'Ram Prasad' },
  { name: 'Sneha Reddy', email: 'sneha@gmail.com', password: 'employee@123', role: 'UI/UX Designer', empId: 'EMP-2024-0103', initials: 'SR', phone: '+91 98765 11003', reportingManager: 'Rahul Sharma' }
];

const PREDEFINED_MANAGERS = [
  { name: 'Vishnu Kumar', email: 'vishnu@gmail.com', password: 'manager@123', role: 'Engineering Manager', empId: 'MGR-2024-0010', initials: 'VK', phone: '+91 98765 22001', reportingManager: 'Director of Engineering' },
  { name: 'Ram Prasad', email: 'ram@gmail.com', password: 'manager@123', role: 'Technical Lead / Manager', empId: 'MGR-2024-0011', initials: 'RP', phone: '+91 98765 22002', reportingManager: 'Director of Engineering' },
  { name: 'Rahul Sharma', email: 'rahul@gmail.com', password: 'manager@123', role: 'Operations Manager', empId: 'MGR-2024-0012', initials: 'RS', phone: '+91 98765 22003', reportingManager: 'Vice President' }
];

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

function isPasswordMatch(expected, actual) {
  if (!expected || !actual) return false;
  const exp = String(expected).trim();
  const act = String(actual).trim();
  return exp === act || exp.toLowerCase() === act.toLowerCase();
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
      errBox.textContent = 'Please enter both email address and password.';
      errBox.style.display = 'block';
    }
    return;
  }

  // 1. Check Manager (vishnu@gmail.com, ram@gmail.com, rahul@gmail.com)
  const matchedManager = PREDEFINED_MANAGERS.find(
    m => m.email.toLowerCase() === emailVal
  );
  if (matchedManager && isPasswordMatch(matchedManager.password, pwdVal)) {
    if (window.parent && typeof window.parent.setAuthUser === 'function') {
      window.parent.setAuthUser('manager', matchedManager);
    }
    if (window.parent && window.parent.loadScreen) {
      window.parent.loadScreen('tpl-ManagerDashboard');
    } else {
      alert('Manager login successful! Redirecting to Manager Dashboard.');
    }
    return;
  }

  // 2. Check Employee (john@gmail.com, jack@gmail.com, sneha@gmail.com)
  const matchedEmp = PREDEFINED_EMPLOYEES.find(
    e => e.email.toLowerCase() === emailVal
  );
  if (matchedEmp && isPasswordMatch(matchedEmp.password, pwdVal)) {
    if (window.parent && typeof window.parent.setAuthUser === 'function') {
      window.parent.setAuthUser('employee', matchedEmp);
    }
    if (window.parent && window.parent.loadScreen) {
      window.parent.loadScreen('tpl-EmployeeDashboard');
    } else {
      alert('Employee login successful! Redirecting to Employee Dashboard.');
    }
    return;
  }

  // Invalid
  if (errBox) {
    errBox.textContent = 'Invalid email address or password. Please check your credentials and try again.';
    errBox.style.display = 'block';
  }
}

function toggleRemember(el) {
  isRememberChecked = !isRememberChecked;
  const chk = el ? el.querySelector('.chk-box') : document.querySelector('.chk-box');
  if (chk) {
    if (isRememberChecked) {
      chk.classList.remove('unchecked');
      chk.textContent = '✓';
    } else {
      chk.classList.add('unchecked');
      chk.textContent = '';
    }
  }
}

function toggleLoginTheme() {
  const wrap = document.getElementById('login-screen-wrap');
  if (wrap) {
    wrap.classList.toggle('dark-mode');
  }
}

function handleSocialClick(platform) {
  const emailInput = document.getElementById('email');
  const pwdInput = document.getElementById('pwd');
  if (emailInput) {
    emailInput.value = 'sneha@gmail.com';
    if (pwdInput) {
      pwdInput.value = 'employee@123';
      updatePasswordEyeVisibility('pwd');
    }
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
