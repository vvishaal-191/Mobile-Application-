
        function formatDateString(dateVal) {
          if (!dateVal) return '07-Sep-2026';
          var parts = dateVal.split('-');
          var yr = parts[0];
          var mIdx = parseInt(parts[1], 10) - 1;
          var day = parts[2];
          var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return day + '-' + (months[mIdx] || 'Sep') + '-' + yr;
        }

        function updateLeaveDates() {
          var fromPicker = document.getElementById('from-date-picker');
          var toPicker = document.getElementById('to-date-picker');
          var fromDisplay = document.getElementById('from-date-display');
          var toDisplay = document.getElementById('to-date-display');
          var daysBox = document.getElementById('days-count-box');

          if (fromPicker && fromDisplay && fromPicker.value) {
            fromDisplay.value = formatDateString(fromPicker.value);
          }
          if (toPicker && toDisplay && toPicker.value) {
            toDisplay.value = formatDateString(toPicker.value);
          }

          var isHalf = document.getElementById('half-day-check') && document.getElementById('half-day-check').checked;
          if (isHalf && daysBox) {
            daysBox.textContent = '0.5 Day (Half Day)';
            return;
          }

          if (fromPicker && toPicker && daysBox && fromPicker.value && toPicker.value) {
            var d1 = new Date(fromPicker.value);
            var d2 = new Date(toPicker.value);
            if (!isNaN(d1) && !isNaN(d2)) {
              var diffTime = d2.getTime() - d1.getTime();
              var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
              if (diffDays < 1) diffDays = 1;
              daysBox.textContent = diffDays + '.0 Day' + (diffDays > 1 ? 's' : '') + ' (Auto-calculated)';
            }
          }
        }

        function openCalPicker(pickerId, btnEl) {
          var picker = document.getElementById(pickerId);
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
          var display = document.getElementById('perm-date-display');
          if (display && val) {
            display.value = formatDateString(val);
          }
          if (typeof calcPermDuration === 'function') {
            calcPermDuration();
          }
        }

        document.querySelectorAll('.bottom-nav .tab').forEach(function(t) {
          t.addEventListener('click', function() { setActiveNav(t); });
        });
      