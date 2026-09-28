const fs = require('fs');

// Test the HTML and JS logic directly
const html = fs.readFileSync('preview_app.html', 'utf8');

// Simulate DOM interaction
const vm = require('vm');

const tplMatch = html.match(/<template id="tpl-ApplyPermission">([\s\S]*?)<\/template>/i);
if (!tplMatch) {
  console.error('Template not found');
  process.exit(1);
}

const tplContent = tplMatch[1];
const scriptMatch = tplContent.match(/<script>([\s\S]*?)<\/script>/i);
if (!scriptMatch) {
  console.error('Script not found');
  process.exit(1);
}

const jsCode = scriptMatch[1];

const modalSet = new Set();
const elements = {
  'perm-calendar-modal': {
    style: { display: 'none' },
    classList: {
      add: (c) => modalSet.add(c),
      remove: (c) => modalSet.delete(c),
      contains: (c) => modalSet.has(c)
    },
    addEventListener: () => {}
  },
  'perm-date-display': { textContent: '09/04/2026' },
  'perm-date-input': { value: '09/04/2026' },
  'perm-cal-month-title': { textContent: '' },
  'perm-cal-days-grid': { innerHTML: '', children: [], appendChild(c) { this.children.push(c); } },
};

const mockDocument = {
  getElementById: (id) => elements[id] || null,
  createElement: (tag) => {
    return {
      tagName: tag,
      className: '',
      textContent: '',
      classList: {
        add(c) { this.className += ' ' + c; },
        remove(c) { this.className = this.className.replace(c, ''); },
        contains(c) { return this.className.includes(c); }
      },
      onclick: null
    };
  }
};

const sandbox = {
  document: mockDocument,
  window: { AUTH_USER: { role: 'employee' } },
  setTimeout: (fn) => fn(),
  setInterval: (fn) => {},
  clearInterval: (id) => {},
  console: console,
  Date: Date,
  parseInt: parseInt,
  String: String,
};

vm.createContext(sandbox);
vm.runInContext(jsCode, sandbox);

console.log('--- TEST 1: Initial state ---');
console.log('Date display:', elements['perm-date-display'].textContent);

console.log('\n--- TEST 2: Open calendar ---');
sandbox.openPermCalendar();
console.log('Modal display:', elements['perm-calendar-modal'].style.display);
console.log('Month title:', elements['perm-cal-month-title'].textContent);
console.log('Days rendered in grid:', elements['perm-cal-days-grid'].children.length);

console.log('\n--- TEST 3: Navigate month forward ---');
sandbox.changePermCalMonth(1);
console.log('Month title after +1 month:', elements['perm-cal-month-title'].textContent);

console.log('\n--- TEST 4: Select Day 15 ---');
sandbox.selectPermDate(15);
console.log('Date display after select:', elements['perm-date-display'].textContent);
console.log('Date input value after select:', elements['perm-date-input'].value);

console.log('\n--- TEST 5: Select Day 28 in September 2026 ---');
sandbox.openPermCalendar();
sandbox.changePermCalMonth(-1); // Back to September
sandbox.selectPermDate(28);
console.log('Date display after select 28:', elements['perm-date-display'].textContent);
console.log('Modal display after close:', elements['perm-calendar-modal'].style.display);

if (elements['perm-date-display'].textContent === '09/28/2026') {
  console.log('\n>>> DOM SIMULATION TEST COMPLETED WITH 100% SUCCESS! <<<');
} else {
  console.error('\n>>> DOM SIMULATION TEST FAILED! <<<');
  process.exit(1);
}
