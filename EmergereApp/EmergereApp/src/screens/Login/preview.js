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
  const input = document.getElementById(id) || document.getElementById('password') || document.getElementById('pwd');
  if (!input) return;
  const eyeBtn = document.getElementById(input.id + '-eye') || document.getElementById('toggle-pwd-btn') || (input.parentElement ? input.parentElement.querySelector('.eye-btn, .login-eye-btn') : null);
  if (!eyeBtn) return;
  eyeBtn.style.display = 'inline-flex';
  eyeBtn.innerHTML = input.type === 'password' ? EYE_SVG_ICON : EYE_OFF_SVG_ICON;
  eyeBtn.setAttribute('title', input.type === 'password' ? 'Show password' : 'Hide password');
  eyeBtn.setAttribute('aria-label', input.type === 'password' ? 'Show password' : 'Hide password');
}

function toggleVisibility(id) {
  const input = document.getElementById(id) || document.getElementById('password') || document.getElementById('pwd');
  if (!input) return;
  const isPass = input.type === 'password';
  input.type = isPass ? 'text' : 'password';
  const eyeBtn = document.getElementById(input.id + '-eye') || document.getElementById('toggle-pwd-btn') || (input.parentElement ? input.parentElement.querySelector('.eye-btn, .login-eye-btn') : null);
  if (eyeBtn) {
    eyeBtn.innerHTML = isPass ? EYE_OFF_SVG_ICON : EYE_SVG_ICON;
    eyeBtn.setAttribute('title', isPass ? 'Hide password' : 'Show password');
    eyeBtn.setAttribute('aria-label', isPass ? 'Hide password' : 'Show password');
  }
}

function isPasswordMatch(expected, actual) {
  if (!expected || !actual) return false;
  const exp = String(expected).trim();
  const act = String(actual).trim();
  return exp === act || exp.toLowerCase() === act.toLowerCase();
}

function navigateAfterLogin(targetScreen, role, profile) {
  const pWin = (window.parent && window.parent !== window) ? window.parent : null;

  // 1. If running inside a parent container / iframe harness (index.html or preview_app.html)
  if (pWin) {
    try {
      if (typeof pWin.setAuthUser === 'function') {
        pWin.setAuthUser(role, profile);
      } else {
        pWin.AUTH_USER = { ...profile, role: role };
        pWin.USER_PROFILE = profile;
      }
      try { pWin.sessionStorage.setItem('USER_PROFILE', JSON.stringify(profile)); } catch(e) {}
      try { pWin.sessionStorage.setItem('AUTH_USER', JSON.stringify({ ...profile, role: role })); } catch(e) {}
    } catch(e) {}

    try {
      if (typeof pWin.loadScreen === 'function') {
        pWin.loadScreen('tpl-' + targetScreen);
        return;
      }
      if (typeof pWin.navigateScreen === 'function') {
        pWin.navigateScreen(targetScreen);
        return;
      }
      if (typeof pWin.postMessage === 'function') {
        pWin.postMessage({ type: 'NAVIGATE', screen: targetScreen, role: role, profile: profile }, '*');
        return;
      }
    } catch(e) {}
  }

  // 2. Standalone browser execution fallback (direct file or local server)
  try {
    sessionStorage.setItem('USER_PROFILE', JSON.stringify(profile));
    sessionStorage.setItem('AUTH_USER', JSON.stringify({ ...profile, role: role }));
    localStorage.setItem('USER_PROFILE', JSON.stringify(profile));
    localStorage.setItem('AUTH_USER', JSON.stringify({ ...profile, role: role }));
  } catch(e) {}

  window.AUTH_USER = { ...profile, role: role };
  window.USER_PROFILE = profile;

  // Direct page navigation based on file system screen path
  const currentPath = window.location.pathname || '';
  if (currentPath.includes('/screens/Login') || currentPath.includes('\\screens\\Login')) {
    window.location.href = '../' + targetScreen + '/preview.html';
  } else if (typeof window.loadScreen === 'function') {
    window.loadScreen('tpl-' + targetScreen);
  } else {
    window.location.href = '../' + targetScreen + '/preview.html';
  }
}

function handleLogin() {
  const emailInput = document.getElementById('email');
  const pwdInput = document.getElementById('password') || document.getElementById('pwd');
  const errBox = document.getElementById('login-auth-err');
  const pwdErr = document.getElementById('pwd-error') || document.getElementById('password-err');
  const emailErr = document.getElementById('email-err');

  if (errBox) errBox.style.display = 'none';
  if (pwdErr) pwdErr.style.display = 'none';
  if (emailErr) emailErr.style.display = 'none';

  let emailVal = emailInput ? emailInput.value.trim().toLowerCase() : '';
  let pwdVal = pwdInput ? pwdInput.value.trim() : '';

  // If both fields are empty, default to demo employee credentials for instant one-click login testing
  if (!emailVal && !pwdVal) {
    emailVal = 'john@gmail.com';
    pwdVal = 'employee@123';
    if (emailInput) emailInput.value = emailVal;
    if (pwdInput) pwdInput.value = pwdVal;
  }

  let hasErr = false;
  if (!emailVal) {
    if (emailErr) emailErr.style.display = 'block';
    hasErr = true;
  }
  if (!pwdVal) {
    if (pwdErr) pwdErr.style.display = 'block';
    hasErr = true;
  }

  if (hasErr) {
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
  if (matchedManager) {
    if (isPasswordMatch(matchedManager.password, pwdVal) || pwdVal.length >= 4) {
      const mgrProfile = {
        name: matchedManager.name,
        role: matchedManager.role,
        employeeId: matchedManager.empId,
        initials: matchedManager.initials,
        email: matchedManager.email,
        department: 'Management',
        team: 'Leadership',
        workLocation: 'Bangalore',
        joiningDate: 'Jun 01, 2022',
        phone: matchedManager.phone,
        reportingManager: matchedManager.reportingManager
      };
      navigateAfterLogin('ManagerDashboard', 'manager', mgrProfile);
      return;
    } else {
      if (errBox) {
        errBox.textContent = 'Invalid manager password. Use: manager@123';
        errBox.style.display = 'block';
      }
      return;
    }
  }

  // 2. Check Employee (john@gmail.com, jack@gmail.com, sneha@gmail.com)
  const matchedEmp = PREDEFINED_EMPLOYEES.find(
    e => e.email.toLowerCase() === emailVal
  );
  if (matchedEmp) {
    if (isPasswordMatch(matchedEmp.password, pwdVal) || pwdVal.length >= 4) {
      const empProfile = {
        name: matchedEmp.name,
        role: matchedEmp.role,
        employeeId: matchedEmp.empId,
        initials: matchedEmp.initials,
        email: matchedEmp.email,
        department: 'Engineering',
        team: 'Mobile Development',
        workLocation: 'Bangalore - Tech Park',
        joiningDate: '15-Jan-2024',
        phone: matchedEmp.phone,
        reportingManager: matchedEmp.reportingManager
      };
      navigateAfterLogin('EmployeeDashboard', 'employee', empProfile);
      return;
    } else {
      if (errBox) {
        errBox.textContent = 'Invalid employee password. Use: employee@123';
        errBox.style.display = 'block';
      }
      return;
    }
  }

  // 3. Fallback credentials if length >= 4
  if (pwdVal.length >= 4) {
    const fallbackProfile = {
      name: emailVal.split('@')[0],
      email: emailVal,
      role: 'Senior Software Engineer',
      employeeId: 'EMP-2024-0101',
      initials: 'JD',
      department: 'Engineering',
      team: 'Mobile Development',
      workLocation: 'Bangalore - Tech Park',
      joiningDate: '15-Jan-2024',
      phone: '+91 98765 11001',
      reportingManager: 'Vishnu Kumar'
    };
    navigateAfterLogin('EmployeeDashboard', 'employee', fallbackProfile);
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
      chk.innerHTML = '&#10003;';
    } else {
      chk.classList.add('unchecked');
      chk.innerHTML = '';
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
  const pwdInput = document.getElementById('password') || document.getElementById('pwd');
  if (emailInput) {
    emailInput.value = 'sneha@gmail.com';
    if (pwdInput) {
      pwdInput.value = 'employee@123';
      updatePasswordEyeVisibility('password');
    }
  }
}

function openForgotModal() {
  const forgotEmail = document.getElementById('forgot-email') || document.getElementById('modal-email-input');
  const forgotContact = document.getElementById('forgot-contact') || document.getElementById('modal-contact-input');
  const modalErr = document.getElementById('modal-err');
  
  if (forgotEmail) forgotEmail.value = '';
  if (forgotContact) forgotContact.value = '';
  if (modalErr) modalErr.style.display = 'none';

  const modal = document.getElementById('forgot-modal') || document.getElementById('forgot-pwd-modal');
  if (modal) modal.style.display = 'flex';
}

function closeForgotModal() {
  const modal = document.getElementById('forgot-modal') || document.getElementById('forgot-pwd-modal');
  if (modal) modal.style.display = 'none';
}

function confirmForgot() {
  const emailInput = document.getElementById('forgot-email') || document.getElementById('modal-email-input');
  const contactInput = document.getElementById('forgot-contact') || document.getElementById('modal-contact-input');
  const modalErr = document.getElementById('modal-err');

  const emailVal = emailInput ? emailInput.value.trim().toLowerCase() : '';
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

  const matchedUser = [...PREDEFINED_EMPLOYEES, ...PREDEFINED_MANAGERS].find(u => u.email.toLowerCase() === emailVal) || PREDEFINED_EMPLOYEES[0];
  const role = PREDEFINED_MANAGERS.some(m => m.email.toLowerCase() === emailVal) ? 'manager' : 'employee';
  const target = role === 'manager' ? 'ManagerDashboard' : 'EmployeeDashboard';
  navigateAfterLogin(target, role, matchedUser);
}

function initLoginScreen() {
  const loginBtn = document.getElementById('btn-login-submit') || document.getElementById('btn-login');
  if (loginBtn) {
    loginBtn.onclick = handleLogin;
    loginBtn.addEventListener('click', handleLogin);
  }
  const toggleBtn = document.getElementById('toggle-pwd-btn');
  if (toggleBtn) {
    toggleBtn.onclick = function() { toggleVisibility('password'); };
  }
  const rememberRow = document.getElementById('remember-me-toggle');
  if (rememberRow) {
    rememberRow.onclick = function() { toggleRemember(rememberRow); };
  }
  const forgotLnk = document.getElementById('forgot-password-link');
  if (forgotLnk) {
    forgotLnk.onclick = openForgotModal;
  }
  const modalClose = document.getElementById('modal-close-btn');
  if (modalClose) {
    modalClose.onclick = closeForgotModal;
  }
  const modalCancel = document.getElementById('modal-cancel-btn');
  if (modalCancel) {
    modalCancel.onclick = closeForgotModal;
  }
  const modalSubmit = document.getElementById('modal-submit-btn');
  if (modalSubmit) {
    modalSubmit.onclick = confirmForgot;
  }

  // Allow Enter key in inputs to trigger Login
  const emailInput = document.getElementById('email');
  const pwdInput = document.getElementById('password') || document.getElementById('pwd');
  [emailInput, pwdInput].forEach(inp => {
    if (inp && typeof inp.addEventListener === 'function') {
      inp.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleLogin();
        }
      });
    }
  });
}

// Ensure execution whether DOM is loading or already interactive/complete
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoginScreen);
} else {
  initLoginScreen();
}

window.handleLogin = handleLogin;
window.initLoginScreen = initLoginScreen;
window.navigateAfterLogin = navigateAfterLogin;
