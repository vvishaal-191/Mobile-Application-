const fs = require('fs');

const calModalCss = `
        /* Calendar Date Picker Modal */
        .perm-calendar-modal-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 1000;
          align-items: center;
          justify-content: center;
          padding: 20px;
          box-sizing: border-box;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .perm-calendar-modal-overlay.active {
          display: flex;
          opacity: 1;
        }

        .perm-calendar-modal-card {
          background: #FFFFFF;
          border-radius: 24px;
          padding: 22px 20px 18px 20px;
          width: 100%;
          max-width: 340px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.22);
          transform: scale(0.92);
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-sizing: border-box;
        }

        .perm-calendar-modal-overlay.active .perm-calendar-modal-card {
          transform: scale(1);
        }

        .cal-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .cal-month-title {
          font-size: 16px;
          font-weight: 700;
          color: #0F172A;
          letter-spacing: -0.2px;
        }

        .cal-nav-btn {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          border: 1px solid #E2E8F0;
          background: #F8FAFC;
          color: #1E293B;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .cal-nav-btn:hover {
          background: #EEF4FB;
          border-color: #CBD5E1;
          color: #0066FF;
        }

        .cal-weekdays-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          margin-bottom: 10px;
        }

        .cal-weekdays-row span {
          font-size: 12.5px;
          font-weight: 700;
          color: #64748B;
          padding: 4px 0;
        }

        .cal-days-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .cal-day-cell {
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          color: #1E293B;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.15s ease;
          user-select: none;
        }

        .cal-day-cell:hover:not(.empty):not(.selected) {
          background: #EFF6FF;
          color: #0066FF;
        }

        .cal-day-cell.selected {
          background: #0066FF;
          color: #FFFFFF;
          font-weight: 700;
          box-shadow: 0 4px 10px rgba(0, 102, 255, 0.35);
        }

        .cal-day-cell.empty {
          cursor: default;
        }

        .cal-modal-footer {
          margin-top: 16px;
          display: flex;
          justify-content: flex-end;
        }

        .cal-close-btn {
          width: 100%;
          padding: 11px 0;
          border-radius: 12px;
          border: none;
          background: #F1F5F9;
          color: #475569;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .cal-close-btn:hover {
          background: #E2E8F0;
          color: #1E293B;
        }
`;

const calModalHtml = `
    <!-- Calendar Date Picker Modal -->
    <div class="perm-calendar-modal-overlay" id="perm-calendar-modal" onclick="if(event.target===this)closePermCalendar()">
      <div class="perm-calendar-modal-card" onclick="event.stopPropagation()">
        <div class="cal-modal-header">
          <button type="button" class="cal-nav-btn" onclick="changePermCalMonth(-1)" aria-label="Previous month">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div class="cal-month-title" id="perm-cal-month-title">September 2026</div>
          <button type="button" class="cal-nav-btn" onclick="changePermCalMonth(1)" aria-label="Next month">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
        <div class="cal-weekdays-row">
          <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
        </div>
        <div class="cal-days-grid" id="perm-cal-days-grid">
          <!-- Dynamically populated -->
        </div>
        <div class="cal-modal-footer">
          <button type="button" class="cal-close-btn" onclick="closePermCalendar()">Close</button>
        </div>
      </div>
    </div>
`;

const calJsFunctions = `
        var permCalState = {
          currentMonth: 8, // September (0-indexed)
          currentYear: 2026,
          selectedDay: 4,
          selectedMonth: 8,
          selectedYear: 2026
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
          if (displayEl && displayEl.textContent) {
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
          }, 200);
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

          var firstDay = new Date(permCalState.currentYear, permCalState.currentMonth, 1).getDay();
          var daysInMonth = new Date(permCalState.currentYear, permCalState.currentMonth + 1, 0).getDate();

          for (var i = 0; i < firstDay; i++) {
            var emptyCell = document.createElement('div');
            emptyCell.className = 'cal-day-cell empty';
            gridEl.appendChild(emptyCell);
          }

          for (var d = 1; d <= daysInMonth; d++) {
            var cell = document.createElement('div');
            cell.className = 'cal-day-cell';
            cell.textContent = d;

            var isSelected = (
              permCalState.currentMonth === permCalState.selectedMonth &&
              permCalState.currentYear === permCalState.selectedYear &&
              d === permCalState.selectedDay
            );
            if (isSelected) {
              cell.classList.add('selected');
            }

            (function(dayNum) {
              cell.onclick = function(ev) {
                ev.stopPropagation();
                selectPermDate(dayNum);
              };
            })(d);

            gridEl.appendChild(cell);
          }
        }
        window.renderPermCalendar = renderPermCalendar;

        function selectPermDate(day) {
          permCalState.selectedDay = day;
          permCalState.selectedMonth = permCalState.currentMonth;
          permCalState.selectedYear = permCalState.currentYear;

          var mm = String(permCalState.selectedMonth + 1).padStart(2, '0');
          var dd = String(day).padStart(2, '0');
          var yyyy = permCalState.selectedYear;
          var formatted = mm + '/' + dd + '/' + yyyy;

          var displayEl = document.getElementById('perm-date-display');
          if (displayEl) displayEl.textContent = formatted;

          var inputEl = document.getElementById('perm-date-input');
          if (inputEl) inputEl.value = formatted;

          closePermCalendar();
        }
        window.selectPermDate = selectPermDate;
`;

function updateHtmlFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const tplStart = content.indexOf('<template id="tpl-ApplyPermission">');
  if (tplStart === -1) {
    console.error('tpl-ApplyPermission not found in ' + filePath);
    return;
  }
  const tplEnd = content.indexOf('</template>', tplStart);
  let tpl = content.substring(tplStart, tplEnd + 11);

  // 1. Add CSS before </style> in tpl if not present
  if (!tpl.includes('.perm-calendar-modal-overlay')) {
    tpl = tpl.replace('</style>', calModalCss + '\n      </style>');
  }

  // 2. Update Date input card to be clickable and include onclick="openPermCalendar(event)"
  // Find date field:
  tpl = tpl.replace(
    /<div class="perm-input-card" id="perm-date-card"[\s\S]*?<\/div>\s*<\/div>\s*<!-- Permission Type/m,
    `<div class="perm-input-card" id="perm-date-card" onclick="openPermCalendar(event)">
                <span class="perm-card-value" id="perm-date-display">09/04/2026</span>
                <div class="perm-card-icon" id="perm-calendar-icon-btn" onclick="openPermCalendar(event)" title="Choose date">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <input type="hidden" id="perm-date-input" value="09/04/2026" />
              </div>
            </div>

            <!-- Permission Type`
  );

  // 3. Add Calendar Modal HTML if not present
  if (!tpl.includes('id="perm-calendar-modal"')) {
    // Add before <!-- Success Popup Modal --> or closing div
    if (tpl.includes('<!-- Success Popup Modal -->')) {
      tpl = tpl.replace('<!-- Success Popup Modal -->', calModalHtml + '\n    <!-- Success Popup Modal -->');
    } else if (tpl.includes('<div class="success-modal-overlay" id="perm-success-modal"')) {
      tpl = tpl.replace('<div class="success-modal-overlay" id="perm-success-modal"', calModalHtml + '\n    <div class="success-modal-overlay" id="perm-success-modal"');
    }
  }

  // 4. Add JS functions if not present
  if (!tpl.includes('function openPermCalendar')) {
    tpl = tpl.replace('</script>', calJsFunctions + '\n      </script>');
  }

  content = content.substring(0, tplStart) + tpl + content.substring(tplEnd + 11);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated ' + filePath);
}

// Update the 4 html bundles
updateHtmlFile('preview_app.html');
updateHtmlFile('index.html');
updateHtmlFile('EmergereApp/EmergereApp/preview_app.html');
updateHtmlFile('EmergereApp/EmergereApp/index.html');
