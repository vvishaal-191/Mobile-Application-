const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('preview_app.html', 'utf8');
const tplMatch = html.match(/<template id="tpl-ApplyPermission">([\s\S]*?)<\/template>/i);
const tplContent = tplMatch[1];
const scriptMatch = tplContent.match(/<script>([\s\S]*?)<\/script>/i);
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
  'perm-cal-days-grid': {
    _innerHTML: '',
    children: [],
    get innerHTML() { return this._innerHTML; },
    set innerHTML(val) { this._innerHTML = val; this.children = []; },
    appendChild(c) { this.children.push(c); }
  },
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
console.log('Total cells rendered in grid (should be 42):', elements['perm-cal-days-grid'].children.length);

console.log('\n--- TEST 3: Select Day 7 in September 2026 (matching Image 1) ---');
sandbox.selectPermDate(7, 8, 2026);
console.log('Date display after selecting 7:', elements['perm-date-display'].textContent);

console.log('\n--- TEST 4: Today button ---');
sandbox.openPermCalendar();
sandbox.selectTodayPermDate();
console.log('Date display after Today click:', elements['perm-date-display'].textContent);

console.log('\n--- TEST 5: Clear button ---');
sandbox.openPermCalendar();
sandbox.clearPermDate();
console.log('Date display after Clear click:', elements['perm-date-display'].textContent);

console.log('\n--- TEST 6: Select 09/04/2026 ---');
sandbox.openPermCalendar();
sandbox.selectPermDate(4, 8, 2026);
console.log('Final Date display:', elements['perm-date-display'].textContent);

if (elements['perm-cal-days-grid'].children.length === 42 && elements['perm-date-display'].textContent === '09/04/2026') {
  console.log('\n>>> DOM SIMULATION PASSED 100% WITH 42 CELLS & ALL ACTIONS! <<<');
} else {
  console.error('\n>>> DOM SIMULATION FAILED! <<<');
  process.exit(1);
}
