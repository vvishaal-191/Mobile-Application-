
        // Renders the Sep 2026 calendar grid with demo status dots (mirrors design).
        const statusByDay = {
          1: '#1FAE6E', 2: '#8B5CF6', 3: '#1FAE6E', 4: '#1FAE6E', 5: '#8C93A3', 6: '#8C93A3',
          7: '#2F6BFF', 8: '#1FAE6E', 9: '#1FAE6E', 10: '#F5A623', 11: '#1FAE6E', 12: '#8C93A3', 13: '#8C93A3',
          14: '#1FAE6E', 15: '#E5484D', 16: '#1FAE6E', 17: '#1FAE6E', 18: '#1FAE6E', 19: '#8C93A3', 20: '#8C93A3',
          21: '#1FAE6E', 22: '#1FAE6E', 23: '#1FAE6E', 24: '#1FAE6E', 25: '#1FAE6E', 26: '#8C93A3', 27: '#8C93A3'
        };

        const dayDetailsMap = {
          '#1FAE6E': { status: 'Present', color: '#1FAE6E', checkin: '09:15 AM', checkout: '06:15 PM', hours: '8h 30m' },
          '#E5484D': { status: 'Absent', color: '#E5484D', checkin: '--:--', checkout: '--:--', hours: '0h 0m' },
          '#2F6BFF': { status: 'On Leave', color: '#2F6BFF', checkin: '--:--', checkout: '--:--', hours: '0h 0m' },
          '#F5A623': { status: 'Permission (Early Exit)', color: '#F5A623', checkin: '09:15 AM', checkout: '04:15 PM', hours: '6h 30m' },
          '#8B5CF6': { status: 'Work From Home', color: '#8B5CF6', checkin: '09:00 AM', checkout: '06:00 PM', hours: '8h 30m' },
          '#8C93A3': { status: 'Week-Off / Holiday', color: '#8C93A3', checkin: '--:--', checkout: '--:--', hours: '0h 0m' }
        };

        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const monthsArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        let currentYear = 2026;
        let currentMonthIdx = 8; // Sep (0-indexed)

        function renderCalendarGrid() {
          const grid = document.getElementById('grid');
          if (!grid) return;
          let html = '<div class="date-cell" style="opacity:0.4"><span class="num">31</span></div>';
          for (let d = 1; d <= 27; d++) {
            const sel = d === 3 ? 'selected' : '';
            const color = statusByDay[d] || '#1FAE6E';
            html += `<div class="date-cell ${sel}" onclick="selectCalendarDate(${d})" style="cursor:pointer;"><span class="num">${d}</span><span class="dot" style="background:${color}"></span></div>`;
          }
          grid.innerHTML = html;
        }

        function selectCalendarDate(day) {
          document.querySelectorAll('.date-cell').forEach(c => c.classList.remove('selected'));
          const cells = document.querySelectorAll('.date-cell');
          if (cells[day]) {
            cells[day].classList.add('selected');
          }
          const color = statusByDay[day] || '#1FAE6E';
          const info = dayDetailsMap[color] || dayDetailsMap['#1FAE6E'];
          const dayStr = String(day).padStart(2, '0');
          const monthName = monthsArr[currentMonthIdx].substring(0, 3);

          const dateObj = new Date(currentYear, currentMonthIdx, day);
          const dayOfWeek = daysOfWeek[dateObj.getDay()];

          document.getElementById('det-date').textContent = `${monthName} ${dayStr}, ${currentYear} (${dayOfWeek})`;
          document.getElementById('det-checkin').textContent = info.checkin;
          document.getElementById('det-checkout').textContent = info.checkout;
          document.getElementById('det-hours').textContent = info.hours;
          const statEl = document.getElementById('det-status');
          statEl.textContent = info.status;
          statEl.style.color = info.color;
        }

        function onMonthChange(val) {
          if (!val) return;
          const parts = val.split('-');
          currentYear = parseInt(parts[0], 10);
          currentMonthIdx = parseInt(parts[1], 10) - 1;
          const monthName = monthsArr[currentMonthIdx];
          const fullText = `${monthName} ${currentYear}`;

          const titleEl = document.getElementById('att-month-title');
          if (titleEl) titleEl.textContent = fullText;

          const labelEl = document.getElementById('picker-label');
          if (labelEl) labelEl.textContent = fullText;

          renderCalendarGrid();
          selectCalendarDate(1);
        }

        renderCalendarGrid();

        document.querySelectorAll('.bottom-nav .tab').forEach((t) => t.addEventListener('click', () => setActiveNav(t)));

      