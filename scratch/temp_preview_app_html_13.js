
            function filterHolidayMonth(monthKey, el) {
              if (el) {
                const pills = el.parentElement.querySelectorAll('.pill');
                pills.forEach(p => p.classList.remove('active'));
                el.classList.add('active');
              }
              const groups = document.querySelectorAll('.hol-month-group');
              groups.forEach(g => {
                if (monthKey === 'all' || g.getAttribute('data-month') === monthKey) {
                  g.style.display = 'block';
                } else {
                  g.style.display = 'none';
                }
              });
            }
          