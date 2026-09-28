const fs = require('fs');

const calModalCssImg1 = `
        /* Calendar Date Picker Modal - Exact Image 1 Design */
        .perm-calendar-modal-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.45);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1000;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
          opacity: 0;
          transition: opacity 0.18s ease;
        }

        .perm-calendar-modal-overlay.active {
          display: flex;
          opacity: 1;
        }

        .perm-calendar-modal-card {
          background: #FFFFFF;
          border-radius: 6px;
          border: 1px solid #D1D5DB;
          padding: 16px 16px 14px 16px;
          width: 275px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          transform: scale(0.95);
          transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
          user-select: none;
        }

        .perm-calendar-modal-overlay.active .perm-calendar-modal-card {
          transform: scale(1);
        }

        .cal-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          padding: 0 2px;
        }

        .cal-month-selector {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }

        .cal-month-title {
          font-size: 15px;
          font-weight: 700;
          color: #000000;
          letter-spacing: -0.2px;
        }

        .cal-caret-svg {
          color: #111827;
          margin-top: 1px;
        }

        .cal-nav-arrows {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .cal-arrow-btn {
          background: transparent;
          border: none;
          color: #111827;
          padding: 2px 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border-radius: 4px;
          transition: background 0.15s ease, color 0.15s ease;
        }

        .cal-arrow-btn:hover {
          background: #F1F5F9;
          color: #0066FF;
        }

        .cal-weekdays-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 8px;
        }

        .cal-weekdays-row span {
          font-size: 13.5px;
          font-weight: 600;
          color: #111827;
          padding: 2px 0;
        }

        .cal-days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          row-gap: 2px;
          column-gap: 2px;
        }

        .cal-day-cell {
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13.5px;
          font-weight: 500;
          color: #111827;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.12s ease;
          box-sizing: border-box;
        }

        .cal-day-cell.muted {
          color: #94A3B8;
        }

        .cal-day-cell:hover:not(.selected) {
          background: #F1F5F9;
        }

        .cal-day-cell.today:not(.selected) {
          border: 1px solid #71717A;
          background: #FFFFFF;
          color: #111827;
          font-weight: 600;
        }

        .cal-day-cell.selected {
          background: #0066FF !important;
          border: 2px solid #000000 !important;
          color: #FFFFFF !important;
          font-weight: 700 !important;
        }

        .cal-modal-footer {
          margin-top: 14px;
          padding-top: 4px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-left: 4px;
          padding-right: 4px;
        }

        .cal-footer-link {
          background: transparent;
          border: none;
          color: #0070F3;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 6px;
          border-radius: 4px;
          transition: color 0.15s ease, background 0.15s ease;
        }

        .cal-footer-link:hover {
          color: #0051B3;
          background: #EFF6FF;
        }
`;

const calModalHtmlImg1 = `
    <!-- Calendar Date Picker Modal (Image 1 Design) -->
    <div class="perm-calendar-modal-overlay" id="perm-calendar-modal" onclick="if(event.target===this)closePermCalendar()">
      <div class="perm-calendar-modal-card" onclick="event.stopPropagation()">
        <!-- Header -->
        <div class="cal-modal-header">
          <div class="cal-month-selector">
            <span class="cal-month-title" id="perm-cal-month-title">September 2026</span>
            <svg class="cal-caret-svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z"></path>
            </svg>
          </div>
          <div class="cal-nav-arrows">
            <button type="button" class="cal-arrow-btn" onclick="changePermCalMonth(-1)" aria-label="Previous month" title="Previous month">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="19" x2="12" y2="5"></line>
                <polyline points="5 12 12 5 19 12"></polyline>
              </svg>
            </button>
            <button type="button" class="cal-arrow-btn" onclick="changePermCalMonth(1)" aria-label="Next month" title="Next month">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <!-- Weekday headers -->
        <div class="cal-weekdays-row">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>

        <!-- 42-Cell Days Grid -->
        <div class="cal-days-grid" id="perm-cal-days-grid">
          <!-- Dynamically populated with 42 cells -->
        </div>

        <!-- Footer with Clear and Today links -->
        <div class="cal-modal-footer">
          <button type="button" class="cal-footer-link" onclick="clearPermDate()">Clear</button>
          <button type="button" class="cal-footer-link" onclick="selectTodayPermDate()">Today</button>
        </div>
      </div>
    </div>
`;

const calJsFunctionsImg1 = `
        var permCalState = {
          currentMonth: 8, // September (0-indexed)
          currentYear: 2026,
          selectedDay: 4,
          selectedMonth: 8,
          selectedYear: 2026,
          todayDay: 28,
          todayMonth: 8,
          todayYear: 2026
        };

        var PERM_MONTH_NAMES = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];

        function openPermCalendar(e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          var modal = document.getElementById('perm-calendar-modal');
          if (!modal) return;
          
          var displayEl = document.getElementById('perm-date-display');
          if (displayEl && displayEl.textContent && displayEl.textContent.includes('/')) {
            var parts = displayEl.textContent.trim().split('/');
            if (parts.length === 3) {
              permCalState.selectedMonth = parseInt(parts[0], 10) - 1;
              permCalState.selectedDay = parseInt(parts[1], 10);
              permCalState.selectedYear = parseInt(parts[2], 10);
              permCalState.currentMonth = permCalState.selectedMonth;
              permCalState.currentYear = permCalState.selectedYear;
            }
          }
          
          renderPermCalendar();
          modal.style.display = 'flex';
          setTimeout(function() {
            modal.classList.add('active');
          }, 10);
        }
        window.openPermCalendar = openPermCalendar;

        function closePermCalendar() {
          var modal = document.getElementById('perm-calendar-modal');
          if (!modal) return;
          modal.classList.remove('active');
          setTimeout(function() {
            modal.style.display = 'none';
          }, 180);
        }
        window.closePermCalendar = closePermCalendar;

        function changePermCalMonth(delta) {
          permCalState.currentMonth += delta;
          if (permCalState.currentMonth < 0) {
            permCalState.currentMonth = 11;
            permCalState.currentYear--;
          } else if (permCalState.currentMonth > 11) {
            permCalState.currentMonth = 0;
            permCalState.currentYear++;
          }
          renderPermCalendar();
        }
        window.changePermCalMonth = changePermCalMonth;

        function renderPermCalendar() {
          var titleEl = document.getElementById('perm-cal-month-title');
          var gridEl = document.getElementById('perm-cal-days-grid');
          if (!titleEl || !gridEl) return;

          titleEl.textContent = PERM_MONTH_NAMES[permCalState.currentMonth] + ' ' + permCalState.currentYear;
          gridEl.innerHTML = '';

          var year = permCalState.currentYear;
          var month = permCalState.currentMonth;

          var firstDayOfWeek = new Date(year, month, 1).getDay();
          var daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
          var daysInPrevMonth = new Date(year, month, 0).getDate();

          var cells = [];

          // 1. Prev month trailing days
          for (var i = firstDayOfWeek - 1; i >= 0; i--) {
            var dPrev = daysInPrevMonth - i;
            var mPrev = month === 0 ? 11 : month - 1;
            var yPrev = month === 0 ? year - 1 : year;
            cells.push({ day: dPrev, month: mPrev, year: yPrev, isCurrent: false });
          }

          // 2. Current month days
          for (var d = 1; d <= daysInCurrentMonth; d++) {
            cells.push({ day: d, month: month, year: year, isCurrent: true });
          }

          // 3. Next month leading days (fill up to 42 cells total)
          var remaining = 42 - cells.length;
          for (var dNext = 1; dNext <= remaining; dNext++) {
            var mNext = month === 11 ? 0 : month + 1;
            var yNext = month === 11 ? year + 1 : year;
            cells.push({ day: dNext, month: mNext, year: yNext, isCurrent: false });
          }

          // Render all 42 cells
          cells.forEach(function(c) {
            var cell = document.createElement('div');
            cell.className = 'cal-day-cell';
            cell.textContent = c.day;

            if (!c.isCurrent) {
              cell.classList.add('muted');
            }

            var isSelected = (
              c.month === permCalState.selectedMonth &&
              c.year === permCalState.selectedYear &&
              c.day === permCalState.selectedDay
            );

            var isToday = (
              c.month === permCalState.todayMonth &&
              c.year === permCalState.todayYear &&
              c.day === permCalState.todayDay
            );

            if (isSelected) {
              cell.classList.add('selected');
            } else if (isToday) {
              cell.classList.add('today');
            }

            cell.onclick = function(ev) {
              ev.stopPropagation();
              selectPermDate(c.day, c.month, c.year);
            };

            gridEl.appendChild(cell);
          });
        }
        window.renderPermCalendar = renderPermCalendar;

        function selectPermDate(day, month, year) {
          if (month === undefined) month = permCalState.currentMonth;
          if (year === undefined) year = permCalState.currentYear;

          permCalState.selectedDay = day;
          permCalState.selectedMonth = month;
          permCalState.selectedYear = year;
          permCalState.currentMonth = month;
          permCalState.currentYear = year;

          var mm = String(month + 1).padStart(2, '0');
          var dd = String(day).padStart(2, '0');
          var yyyy = year;
          var formatted = mm + '/' + dd + '/' + yyyy;

          var displayEl = document.getElementById('perm-date-display');
          if (displayEl) displayEl.textContent = formatted;

          var inputEl = document.getElementById('perm-date-input');
          if (inputEl) inputEl.value = formatted;

          closePermCalendar();
        }
        window.selectPermDate = selectPermDate;

        function clearPermDate() {
          var displayEl = document.getElementById('perm-date-display');
          if (displayEl) displayEl.textContent = 'MM/DD/YYYY';

          var inputEl = document.getElementById('perm-date-input');
          if (inputEl) inputEl.value = '';

          permCalState.selectedDay = null;
          permCalState.selectedMonth = null;
          permCalState.selectedYear = null;

          closePermCalendar();
        }
        window.clearPermDate = clearPermDate;

        function selectTodayPermDate() {
          selectPermDate(permCalState.todayDay, permCalState.todayMonth, permCalState.todayYear);
        }
        window.selectTodayPermDate = selectTodayPermDate;
`;

function updateHtmlBundle(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const tplStart = content.indexOf('<template id="tpl-ApplyPermission">');
  if (tplStart === -1) {
    console.error('tpl-ApplyPermission not found in ' + filePath);
    return;
  }
  const tplEnd = content.indexOf('</template>', tplStart);
  let tpl = content.substring(tplStart, tplEnd + 11);

  // 1. Replace CSS
  const oldCssRegex = /\/\* Calendar Date Picker Modal[\s\S]*?\.cal-close-btn:hover\s*\{[^}]*\}/;
  if (oldCssRegex.test(tpl)) {
    tpl = tpl.replace(oldCssRegex, calModalCssImg1.trim());
  } else if (!tpl.includes('.cal-month-selector')) {
    tpl = tpl.replace('</style>', calModalCssImg1 + '\n      </style>');
  }

  // 2. Replace Modal HTML
  const oldModalHtmlRegex = /<!-- Calendar Date Picker Modal[\s\S]*?id="perm-calendar-modal"[\s\S]*?<\/div>\s*<\/div>/;
  if (oldModalHtmlRegex.test(tpl)) {
    tpl = tpl.replace(oldModalHtmlRegex, calModalHtmlImg1.trim());
  }

  // 3. Replace JS functions
  const oldJsRegex = /var permCalState = \{[\s\S]*?window\.selectPermDate = selectPermDate;/;
  if (oldJsRegex.test(tpl)) {
    tpl = tpl.replace(oldJsRegex, calJsFunctionsImg1.trim());
  }

  content = content.substring(0, tplStart) + tpl + content.substring(tplEnd + 11);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + filePath);
}

// Update the 4 html bundles
updateHtmlBundle('preview_app.html');
updateHtmlBundle('index.html');
updateHtmlBundle('EmergereApp/EmergereApp/preview_app.html');
updateHtmlBundle('EmergereApp/EmergereApp/index.html');

// Update standalone preview.css and preview.html
const standaloneCssPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.css';
let standCss = fs.readFileSync(standaloneCssPath, 'utf8');
const oldStandCssRegex = /\/\* Calendar Date Picker Modal[\s\S]*?\.cal-close-btn:hover\s*\{[^}]*\}/;
if (oldStandCssRegex.test(standCss)) {
  standCss = standCss.replace(oldStandCssRegex, calModalCssImg1.trim());
} else {
  standCss += '\n' + calModalCssImg1;
}
fs.writeFileSync(standaloneCssPath, standCss, 'utf8');
console.log('Updated ' + standaloneCssPath);

const standaloneHtmlPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.html';
let standHtml = fs.readFileSync(standaloneHtmlPath, 'utf8');
const oldStandModalRegex = /<!-- Calendar Date Picker Modal[\s\S]*?id="perm-calendar-modal"[\s\S]*?<\/div>\s*<\/div>/;
if (oldStandModalRegex.test(standHtml)) {
  standHtml = standHtml.replace(oldStandModalRegex, calModalHtmlImg1.trim());
}

const oldStandJsRegex = /var permCalState = \{[\s\S]*?window\.selectPermDate = selectPermDate;/;
if (oldStandJsRegex.test(standHtml)) {
  standHtml = standHtml.replace(oldStandJsRegex, calJsFunctionsImg1.trim());
}
fs.writeFileSync(standaloneHtmlPath, standHtml, 'utf8');
console.log('Updated ' + standaloneHtmlPath);
