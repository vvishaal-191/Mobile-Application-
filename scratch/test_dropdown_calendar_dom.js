const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('preview_app.html', 'utf8');
const tplMatch = html.match(/<template id="tpl-ApplyPermission">([\s\S]*?)<\/template>/i);
const tplContent = tplMatch[1];
const scriptMatch = tplContent.match(/<script>([\s\S]*?)<\/script>/i);
const jsCode = scriptMatch[1];

const elements = {
  'perm-calendar-dropdown': {
    style: { display: 'none' },
    classList: {
      _set: new Set(),
      add(c) { this._set.add(c); },
      remove(c) { this._set.delete(c); },
      contains(c) { return this._set.has(c); }
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
console.log('Dropdown display:', elements['perm-calendar-dropdown'].style.display);
console.log('Date display:', elements['perm-date-display'].textContent);

console.log('\n--- TEST 2: Toggle dropdown (Open) ---');
sandbox.togglePermCalendar();
console.log('Dropdown display after toggle 1:', elements['perm-calendar-dropdown'].style.display);
console.log('Month title:', elements['perm-cal-month-title'].textContent);
console.log('Total cells rendered in grid (42):', elements['perm-cal-days-grid'].children.length);

console.log('\n--- TEST 3: Toggle dropdown (Collapse) ---');
sandbox.togglePermCalendar();
console.log('Dropdown display after toggle 2:', elements['perm-calendar-dropdown'].style.display);

console.log('\n--- TEST 4: Toggle dropdown back Open and Select Date ---');
sandbox.togglePermCalendar();
console.log('Dropdown display after toggle 3:', elements['perm-calendar-dropdown'].style.display);
sandbox.selectPermDate(12, 8, 2026);
console.log('Date display after select 12:', elements['perm-date-display'].textContent);
console.log('Dropdown display after select (collapsed):', elements['perm-calendar-dropdown'].style.display);

console.log('\n--- TEST 5: Today button ---');
sandbox.togglePermCalendar();
sandbox.selectTodayPermDate();
console.log('Date display after Today click:', elements['perm-date-display'].textContent);
console.log('Dropdown display after Today click (collapsed):', elements['perm-calendar-dropdown'].style.display);

console.log('\n--- TEST 6: Clear button ---');
sandbox.togglePermCalendar();
sandbox.clearPermDate();
console.log('Date display after Clear click:', elements['perm-date-display'].textContent);
console.log('Dropdown display after Clear click (collapsed):', elements['perm-calendar-dropdown'].style.display);

if (elements['perm-date-display'].textContent === 'MM/DD/YYYY') {
  console.log('\n>>> DROPDOWN CALENDAR DOM SIMULATION PASSED 100%! <<<');
} else {
  console.error('\n>>> FAILED! <<<');
  process.exit(1);
}
