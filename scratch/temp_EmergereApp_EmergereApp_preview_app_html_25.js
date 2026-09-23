
        // preview/shared.js
        function activatePill(el, groupSelector) {
          document.querySelectorAll(groupSelector).forEach((p) => p.classList.remove('active'));
          el.classList.add('active');
        }

        function toggleVisibility(id) {
          const input = document.getElementById(id);
          if (!input) return;
          input.type = input.type === 'password' ? 'text' : 'password';
        }

        function setActiveNav(el) {
          document.querySelectorAll('.bottom-nav .tab').forEach((t) => t.classList.remove('active'));
          el.classList.add('active');
        }
      