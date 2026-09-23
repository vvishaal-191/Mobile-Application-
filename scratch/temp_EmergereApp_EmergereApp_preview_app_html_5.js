
        function activatePill(el, groupSelector) {
          document.querySelectorAll(groupSelector).forEach(function(p) { p.classList.remove('active'); });
          el.classList.add('active');
        }

        function toggleVisibility(id) {
          var input = document.getElementById(id);
          if (!input) return;
          input.type = input.type === 'password' ? 'text' : 'password';
        }

        function setActiveNav(el) {
          document.querySelectorAll('.bottom-nav .tab').forEach(function(t) { t.classList.remove('active'); });
          el.classList.add('active');
        }
      