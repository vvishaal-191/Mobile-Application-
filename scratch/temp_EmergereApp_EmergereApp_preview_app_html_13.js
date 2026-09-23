
        function filterHistory(cat, el) {
          const pills = el.parentElement.querySelectorAll('.pill');
          pills.forEach(p => p.classList.remove('active'));
          el.classList.add('active');

          const cards = document.querySelectorAll('.req-card');
          cards.forEach(card => {
            const type = card.getAttribute('data-type');
            if (cat === 'all' || type === cat) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          });
        }
        window.filterHistory = filterHistory;

        function toggleCardDetails(btn) {
          const card = btn.closest('.card') || btn.closest('.req-card');
          if (!card) return;
          const details = card.querySelector('.req-expanded-details');
          if (!details) return;
          if (details.style.display === 'none' || !details.style.display) {
            details.style.display = 'block';
            btn.textContent = 'Hide Details ∧';
          } else {
            details.style.display = 'none';
            btn.textContent = 'View Details ›';
          }
        }
        window.toggleCardDetails = toggleCardDetails;

        function openDetails(catType, title, date, duration, applied, reason, status, tone, remark) {
          var catEl = document.getElementById('m-cat');
          if (catEl) catEl.textContent = catType === 'leave' ? 'LEAVE REQUEST DETAILS' : 'PERMISSION REQUEST DETAILS';
          var tEl = document.getElementById('m-title');
          if (tEl) tEl.textContent = title || '';
          var dEl = document.getElementById('m-date');
          if (dEl) dEl.textContent = date || '';
          var durEl = document.getElementById('m-duration');
          if (durEl) durEl.textContent = duration || '';
          var appEl = document.getElementById('m-applied');
          if (appEl) appEl.textContent = applied || '';
          var rEl = document.getElementById('m-reason');
          if (rEl) rEl.textContent = reason || '';
          var remEl = document.getElementById('m-remark');
          if (remEl) remEl.textContent = remark || '';

          var badge = document.getElementById('m-badge');
          if (badge) {
            badge.textContent = status || '';
            badge.className = 'badge ' + (tone || '');
          }

          var modal = document.getElementById('details-modal');
          if (modal) modal.classList.add('open');
        }
        window.openDetails = openDetails;

        function closeDetails() {
          var modal = document.getElementById('details-modal');
          if (modal) modal.classList.remove('open');
        }
        window.closeDetails = closeDetails;

        function closeDetailsModal(e) {
          if (e && e.target && e.target.id === 'details-modal') {
            closeDetails();
          }
        }
        window.closeDetailsModal = closeDetailsModal;

        document.querySelectorAll('.bottom-nav .tab').forEach((t) => t.addEventListener('click', () => setActiveNav(t)));
      