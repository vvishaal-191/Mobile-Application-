
        function formatDateString(dateVal) {
          if (!dateVal) return '07-Sep-2026';
          const parts = dateVal.split('-');
          const yr = parts[0];
          const mIdx = parseInt(parts[1], 10) - 1;
          const day = parts[2];
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return `${day}-${months[mIdx]}-${yr}`;
        }

        function updateLeaveDates() {
          const fromPicker = document.getElementById('from-date-picker');
          const toPicker = document.getElementById('to-date-picker');
          const fromDisplay = document.getElementById('from-date-display');
          const toDisplay = document.getElementById('to-date-display');
          const daysBox = document.getElementById('days-count-box');

          if (fromPicker && fromDisplay && fromPicker.value) {
            fromDisplay.value = formatDateString(fromPicker.value);
          }
          if (toPicker && toDisplay && toPicker.value) {
            toDisplay.value = formatDateString(toPicker.value);
          }

          if (fromPicker && toPicker && daysBox && fromPicker.value && toPicker.value) {
            const d1 = new Date(fromPicker.value);
            const d2 = new Date(toPicker.value);
            if (!isNaN(d1) && !isNaN(d2)) {
              const diffTime = d2.getTime() - d1.getTime();
              let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
              if (diffDays < 1) diffDays = 1;
              daysBox.textContent = `${diffDays}.0 Day${diffDays > 1 ? 's' : ''} (Auto-calculated)`;
            }
          }
        }

        function openCalPicker(pickerId, btnEl) {
          const picker = document.getElementById(pickerId);
          let targetBtn = btnEl;
          if (!targetBtn && pickerId) {
            targetBtn = document.querySelector(`label[for="${pickerId}"]`);
          }
          if (targetBtn) {
            targetBtn.classList.remove('clicked');
            void targetBtn.offsetWidth;
            targetBtn.classList.add('clicked');
          }
          if (picker) {
            if (typeof picker.showPicker === 'function') {
              try {
                picker.showPicker();
              } catch (e) {
                picker.click();
              }
            } else {
              picker.click();
            }
          }
        }

        function syncPermDate(val) {
          const display = document.getElementById('perm-date-display');
          if (display && val) {
            display.value = formatDateString(val);
          }
          if (typeof calcPermDuration === 'function') {
            calcPermDuration();
          }
        }

        document.querySelectorAll('.bottom-nav .tab').forEach((t) => t.addEventListener('click', () => setActiveNav(t)));

      