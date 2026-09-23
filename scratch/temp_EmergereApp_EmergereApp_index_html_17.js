
        function clearAllNotifications() {
          const container = document.getElementById('notif-container');
          if (container) {
            container.innerHTML = '<div style="text-align:center; padding:60px 20px; color:#9AA3B2;"><div style="font-size:52px; margin-bottom:12px;">🔔</div><b style="font-size:17px; color:#111827; display:block; margin-bottom:6px;">No Notifications</b><p style="font-size:14px; color:#6B7280; margin:0;">All notifications have been cleared.</p></div>';
          }
          const btn = document.getElementById('clear-btn');
          if (btn) btn.style.display = 'none';
          var pWin = (window.parent && window.parent !== window) ? window.parent : window;
          pWin.HAS_NEW_NOTIFICATION = false;
          window.HAS_NEW_NOTIFICATION = false;
          try { sessionStorage.removeItem('HAS_NEW_NOTIFICATION'); } catch(e){}
          try { pWin.sessionStorage.removeItem('HAS_NEW_NOTIFICATION'); } catch(e){}
          pWin.PERM_NOTIFICATIONS = [];
        }

        function removeSingleNotif(el) {
          const card = el.closest('.notif-card');
          if (card) {
            card.remove();
          }
          const remaining = document.querySelectorAll('#notif-container .notif-card');
          if (remaining.length === 0) {
            clearAllNotifications();
          }
        }
      