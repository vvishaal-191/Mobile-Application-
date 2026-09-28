const fs = require('fs');

// ==========================================
// 1. UPDATE ApplyPermissionScreen.jsx
// ==========================================
const jsxPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

// Replace showCalendarModal with isCalendarOpen
jsx = jsx.replace(
  "const [showCalendarModal, setShowCalendarModal] = useState(false);",
  "const [isCalendarOpen, setIsCalendarOpen] = useState(false);"
);
jsx = jsx.replace(/setShowCalendarModal\(false\)/g, "setIsCalendarOpen(false)");
jsx = jsx.replace(/setShowCalendarModal\(true\)/g, "setIsCalendarOpen(true)");

// Remove old Modal
jsx = jsx.replace(
  /\{\/\* Calendar Date Picker Modal \(Image 1 Design\) \*\/\}[\s\S]*?<\/Modal>\s*/m,
  ""
);

// Add dropdown calendar right below Date field
const oldDateField = `<View style={styles.field}>
            <Text style={styles.label}>
              Date <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={styles.inputCard}
              activeOpacity={0.8}
              onPress={() => setShowCalendarModal(true)}
            >
              <Text style={styles.cardInputText}>{date}</Text>
              <TouchableOpacity
                style={styles.calendarIconBtn}
                activeOpacity={0.7}
                onPress={() => setShowCalendarModal(true)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="calendar" size={18} color="#111827" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>`;

const newDateField = `<View style={styles.field}>
            <Text style={styles.label}>
              Date <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[styles.inputCard, isCalendarOpen && styles.selectCardActive]}
              activeOpacity={0.8}
              onPress={() => {
                setIsCalendarOpen(!isCalendarOpen);
                setIsTypeOpen(false);
                setIsDurationOpen(false);
                setIsManagerOpen(false);
              }}
            >
              <Text style={styles.cardInputText}>{date}</Text>
              <TouchableOpacity
                style={styles.calendarIconBtn}
                activeOpacity={0.7}
                onPress={() => {
                  setIsCalendarOpen(!isCalendarOpen);
                  setIsTypeOpen(false);
                  setIsDurationOpen(false);
                  setIsManagerOpen(false);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="calendar" size={18} color="#111827" />
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Dropdown Calendar directly below Date Field (Image 1 Design) */}
            {isCalendarOpen && (
              <View style={styles.calendarDropdownCard}>
                {/* Header */}
                <View style={styles.calHeader}>
                  <View style={styles.calMonthSelector}>
                    <Text style={styles.calMonthYearText}>
                      {MONTH_NAMES[calendarMonth]} {calendarYear}
                    </Text>
                    <Feather name="chevron-down" size={14} color="#111827" style={styles.calCaret} />
                  </View>

                  <View style={styles.calNavArrows}>
                    <TouchableOpacity
                      style={styles.calArrowBtn}
                      onPress={() => {
                        if (calendarMonth === 0) {
                          setCalendarMonth(11);
                          setCalendarYear(calendarYear - 1);
                        } else {
                          setCalendarMonth(calendarMonth - 1);
                        }
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityLabel="Previous month"
                    >
                      <Feather name="arrow-up" size={18} color="#111827" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.calArrowBtn}
                      onPress={() => {
                        if (calendarMonth === 11) {
                          setCalendarMonth(0);
                          setCalendarYear(calendarYear + 1);
                        } else {
                          setCalendarMonth(calendarMonth + 1);
                        }
                      }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      accessibilityLabel="Next month"
                    >
                      <Feather name="arrow-down" size={18} color="#111827" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Weekday headers */}
                <View style={styles.calWeekRow}>
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((wd, i) => (
                    <Text key={i} style={styles.calWeekDayText}>{wd}</Text>
                  ))}
                </View>

                {/* 42-Cell Days Grid */}
                <View style={styles.calDaysGrid}>
                  {calendarCells.map((cell, idx) => {
                    const isSelected =
                      cell.month === selectedMonth &&
                      cell.year === selectedYear &&
                      cell.day === selectedDay;

                    const isToday =
                      cell.month === todayMonth &&
                      cell.year === todayYear &&
                      cell.day === todayDay;

                    return (
                      <TouchableOpacity
                        key={\`cell-\${idx}\`}
                        style={[
                          styles.calDayCell,
                          isSelected && styles.calDayCellSelected,
                          !isSelected && isToday && styles.calDayCellToday,
                        ]}
                        onPress={() => handleSelectDate(cell.day, cell.month, cell.year)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.calDayText,
                            !cell.isCurrentMonth && styles.calDayTextMuted,
                            isSelected && styles.calDayTextSelected,
                            !isSelected && isToday && styles.calDayTextToday,
                          ]}
                        >
                          {cell.day}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Footer with Clear and Today */}
                <View style={styles.calFooter}>
                  <TouchableOpacity onPress={handleClearDate} activeOpacity={0.7}>
                    <Text style={styles.calFooterLink}>Clear</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleTodayDate} activeOpacity={0.7}>
                    <Text style={styles.calFooterLink}>Today</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>`;

jsx = jsx.replace(oldDateField, newDateField);

// Also ensure opening other dropdowns closes calendar
jsx = jsx.replace("setIsTypeOpen(!isTypeOpen);", "setIsTypeOpen(!isTypeOpen);\n                setIsCalendarOpen(false);");
jsx = jsx.replace("setIsDurationOpen(!isDurationOpen);", "setIsDurationOpen(!isDurationOpen);\n                setIsCalendarOpen(false);");
jsx = jsx.replace("setIsManagerOpen(!isManagerOpen);", "setIsManagerOpen(!isManagerOpen);\n                setIsCalendarOpen(false);");

fs.writeFileSync(jsxPath, jsx, 'utf8');
console.log('Updated ApplyPermissionScreen.jsx');

// ==========================================
// 2. UPDATE ApplyPermissionScreen.styles.js
// ==========================================
const stylesPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.styles.js';
let stylesContent = fs.readFileSync(stylesPath, 'utf8');

const oldStylesRegex = /\/\* Calendar Modal Styles \(Image 1 Design\) \*\/[\s\S]*?\}\);?/;
const newStyles = `/* Dropdown Calendar Card directly below Date Field (Image 1 Design) */
  calendarDropdownCard: {
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  calHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  calMonthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  calMonthYearText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
  },
  calCaret: {
    marginTop: 1,
    marginLeft: 2,
  },
  calNavArrows: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calArrowBtn: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calWeekDayText: {
    width: 32,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  calDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 2,
  },
  calDayCell: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginVertical: 1,
  },
  calDayCellSelected: {
    backgroundColor: '#0066FF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 2,
  },
  calDayCellToday: {
    borderWidth: 1,
    borderColor: '#71717A',
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  calDayText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  calDayTextMuted: {
    color: '#94A3B8',
  },
  calDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  calDayTextToday: {
    color: '#111827',
    fontWeight: '600',
  },
  calFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 4,
    paddingHorizontal: 4,
  },
  calFooterLink: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0070F3',
  },
});`;

stylesContent = stylesContent.replace(oldStylesRegex, newStyles);
fs.writeFileSync(stylesPath, stylesContent, 'utf8');
console.log('Updated ApplyPermissionScreen.styles.js');

// ==========================================
// 3. UPDATE WEB FILES
// ==========================================
const calDropdownCss = `
        /* Calendar Dropdown directly below Date Field (Image 1 Design) */
        .perm-calendar-dropdown {
          display: none;
          margin-top: 6px;
          background: #FFFFFF;
          border-radius: 8px;
          border: 1px solid #D1D5DB;
          padding: 14px 14px 12px 14px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          box-sizing: border-box;
          user-select: none;
          animation: permCalFadeIn 0.15s ease-out;
        }

        .perm-calendar-dropdown.open {
          display: block;
        }

        @keyframes permCalFadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cal-dropdown-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
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
          font-size: 13px;
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

        .cal-dropdown-footer {
          margin-top: 12px;
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

const calDropdownHtml = `
              <!-- Calendar Dropdown directly below Date field (Image 1 Design) -->
              <div class="perm-calendar-dropdown" id="perm-calendar-dropdown" style="display: none;" onclick="event.stopPropagation()">
                <!-- Header -->
                <div class="cal-dropdown-header">
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
                  <!-- Dynamically populated -->
                </div>

                <!-- Footer with Clear and Today links -->
                <div class="cal-dropdown-footer">
                  <button type="button" class="cal-footer-link" onclick="clearPermDate()">Clear</button>
                  <button type="button" class="cal-footer-link" onclick="selectTodayPermDate()">Today</button>
                </div>
              </div>`;

const calDropdownJs = `
        var permCalState = {
          isOpen: false,
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

        function togglePermCalendar(e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          if (permCalState.isOpen) {
            closePermCalendar();
          } else {
            openPermCalendar();
          }
        }
        window.togglePermCalendar = togglePermCalendar;

        function openPermCalendar(e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          var dropdown = document.getElementById('perm-calendar-dropdown');
          if (!dropdown) return;
          
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
          dropdown.style.display = 'block';
          dropdown.classList.add('open');
          permCalState.isOpen = true;
        }
        window.openPermCalendar = openPermCalendar;

        function closePermCalendar() {
          var dropdown = document.getElementById('perm-calendar-dropdown');
          if (!dropdown) return;
          dropdown.style.display = 'none';
          dropdown.classList.remove('open');
          permCalState.isOpen = false;
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
  const oldCssRegex = /\/\* Calendar Date Picker Modal[\s\S]*?\.cal-footer-link:hover\s*\{[^}]*\}/;
  if (oldCssRegex.test(tpl)) {
    tpl = tpl.replace(oldCssRegex, calDropdownCss.trim());
  }

  // 2. Remove old modal overlay HTML
  const oldModalHtmlRegex = /<!-- Calendar Date Picker Modal[\s\S]*?id="perm-calendar-modal"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
  if (oldModalHtmlRegex.test(tpl)) {
    tpl = tpl.replace(oldModalHtmlRegex, '');
  }

  // 3. Update Date field to include togglePermCalendar and dropdown HTML directly inside perm-field
  const oldDateFieldRegex = /<div class="perm-input-card" id="perm-date-card"[\s\S]*?<\/div>\s*<\/div>\s*<!-- Permission Type/m;
  const newDateFieldHtml = `<div class="perm-input-card" id="perm-date-card" onclick="togglePermCalendar(event)">
                <span class="perm-card-value" id="perm-date-display">09/04/2026</span>
                <div class="perm-card-icon" id="perm-calendar-icon-btn" onclick="togglePermCalendar(event)" title="Choose date">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <input type="hidden" id="perm-date-input" value="09/04/2026" />
              </div>
${calDropdownHtml}
            </div>

            <!-- Permission Type`;

  tpl = tpl.replace(oldDateFieldRegex, newDateFieldHtml);

  // 4. Replace JS functions
  const oldJsRegex = /var permCalState = \{[\s\S]*?window\.selectTodayPermDate = selectTodayPermDate;/;
  if (oldJsRegex.test(tpl)) {
    tpl = tpl.replace(oldJsRegex, calDropdownJs.trim());
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
const oldStandCssRegex = /\/\* Calendar Date Picker Modal[\s\S]*?\.cal-footer-link:hover\s*\{[^}]*\}/;
if (oldStandCssRegex.test(standCss)) {
  standCss = standCss.replace(oldStandCssRegex, calDropdownCss.trim());
}
fs.writeFileSync(standaloneCssPath, standCss, 'utf8');
console.log('Updated ' + standaloneCssPath);

const standaloneHtmlPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/preview.html';
let standHtml = fs.readFileSync(standaloneHtmlPath, 'utf8');

// Remove old modal overlay HTML
const oldStandModalRegex = /<!-- Calendar Date Picker Modal[\s\S]*?id="perm-calendar-modal"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
if (oldStandModalRegex.test(standHtml)) {
  standHtml = standHtml.replace(oldStandModalRegex, '');
}

// Update date field in preview.html
const oldStandDateFieldRegex = /<div class="perm-input-card" id="perm-date-card"[\s\S]*?<\/div>\s*<\/div>\s*<!-- Permission Type/m;
const newStandDateFieldHtml = `<div class="perm-input-card" id="perm-date-card" onclick="togglePermCalendar(event)">
          <span class="perm-card-value" id="perm-date-display">09/04/2026</span>
          <div class="perm-card-icon" id="perm-calendar-icon-btn" onclick="togglePermCalendar(event)" title="Choose date">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <input type="hidden" id="perm-date-input" value="09/04/2026" />
        </div>
${calDropdownHtml}
      </div>

      <!-- Permission Type`;

standHtml = standHtml.replace(oldStandDateFieldRegex, newStandDateFieldHtml);

const oldStandJsRegex = /var permCalState = \{[\s\S]*?window\.selectTodayPermDate = selectTodayPermDate;/;
if (oldStandJsRegex.test(standHtml)) {
  standHtml = standHtml.replace(oldStandJsRegex, calDropdownJs.trim());
}
fs.writeFileSync(standaloneHtmlPath, standHtml, 'utf8');
console.log('Updated ' + standaloneHtmlPath);
