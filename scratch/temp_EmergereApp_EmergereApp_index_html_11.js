
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
        document.querySelectorAll('.bottom-nav .tab').forEach((t) => t.addEventListener('click', () => setActiveNav(t)));
      