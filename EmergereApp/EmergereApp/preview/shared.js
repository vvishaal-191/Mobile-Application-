// preview/shared.js
// Small reusable helpers for the static HTML previews (tab switching, etc).
// Real interactivity/state lives in the React Native .jsx files - these
// previews are just for visually checking the markup/CSS in a browser.

function activatePill(el, groupSelector) {
  document.querySelectorAll(groupSelector).forEach((p) => p.classList.remove('active'));
  el.classList.add('active');
}

function toggleVisibility(id) {
  const input = document.getElementById(id);
  if (!input) return;
  input.type = input.type === 'password' ? 'text' : 'password';
}

function setActiveNav(el) {
  document.querySelectorAll('.bottom-nav .tab').forEach((t) => t.classList.remove('active'));
  el.classList.add('active');
}
