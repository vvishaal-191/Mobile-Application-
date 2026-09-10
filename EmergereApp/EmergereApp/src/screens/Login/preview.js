// Screen-specific preview JS (uses helpers from preview/shared.js)
let isRememberChecked = true;

document.addEventListener('DOMContentLoaded', () => {
  console.log('Login preview ready');
});

function handleLogin() {
  const pwdInput = document.getElementById('pwd');
  const pwdErr = document.getElementById('pwd-error');
  if (!pwdInput || pwdInput.value.length < 8) {
    if (pwdErr) pwdErr.style.display = 'block';
    return;
  }
  if (pwdErr) pwdErr.style.display = 'none';
  if (window.parent && window.parent.loadScreen) {
    window.parent.loadScreen('tpl-EmployeeDashboard');
  } else {
    alert('Login successful! Redirecting to Employee Dashboard.');
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
  const emailVal = document.getElementById('email') ? document.getElementById('email').value : '';
  const forgotEmail = document.getElementById('forgot-email');
  const forgotContact = document.getElementById('forgot-contact');
  const modalErr = document.getElementById('modal-err');
  
  if (forgotEmail) forgotEmail.value = emailVal;
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
