
        function enableProfileEdit() {
          document.getElementById('profile-view-mode').style.display = 'none';
          document.getElementById('profile-edit-mode').style.display = 'block';
          document.getElementById('job-read-mode').style.display = 'none';
          document.getElementById('job-edit-mode').style.display = 'flex';
          document.getElementById('contact-read-mode').style.display = 'none';
          document.getElementById('contact-edit-mode').style.display = 'flex';

          document.getElementById('profile-edit-btn-wrap').style.display = 'none';
          document.getElementById('profile-save-cancel-wrap').style.display = 'flex';
        }

        function cancelProfileEdit() {
          const p = (window.parent && window.parent.USER_PROFILE) || window.USER_PROFILE;
          if (p) {
            if (document.getElementById('edit-profile-name') && p.name) document.getElementById('edit-profile-name').value = p.name;
            if (document.getElementById('edit-profile-role') && p.role) document.getElementById('edit-profile-role').value = p.role;
            if (document.getElementById('edit-profile-id') && p.employeeId) document.getElementById('edit-profile-id').value = p.employeeId;
            if (document.getElementById('input-dept') && p.department) document.getElementById('input-dept').value = p.department;
            if (document.getElementById('input-team') && p.team) document.getElementById('input-team').value = p.team;
            if (document.getElementById('input-manager') && p.reportingManager) document.getElementById('input-manager').value = p.reportingManager;
            if (document.getElementById('input-location') && p.workLocation) document.getElementById('input-location').value = p.workLocation;
            if (document.getElementById('input-date') && p.joiningDate) document.getElementById('input-date').value = p.joiningDate;
            if (document.getElementById('input-email') && p.email) document.getElementById('input-email').value = p.email;
            if (document.getElementById('input-phone') && p.phone) document.getElementById('input-phone').value = p.phone;
          }
          document.getElementById('profile-view-mode').style.display = 'block';
          document.getElementById('profile-edit-mode').style.display = 'none';
          document.getElementById('job-read-mode').style.display = 'block';
          document.getElementById('job-edit-mode').style.display = 'none';
          document.getElementById('contact-read-mode').style.display = 'block';
          document.getElementById('contact-edit-mode').style.display = 'none';

          document.getElementById('profile-edit-btn-wrap').style.display = 'block';
          document.getElementById('profile-save-cancel-wrap').style.display = 'none';
        }

        function saveProfileEdit() {
          const name = document.getElementById('edit-profile-name').value;
          const role = document.getElementById('edit-profile-role').value;
          const id = document.getElementById('edit-profile-id').value;

          document.getElementById('profile-name-display').textContent = name;
          document.getElementById('profile-role-display').textContent = role;
          document.getElementById('profile-id-display').textContent = id;

          let initials = 'PS';
          if (name) {
            const parts = name.trim().split(' ').filter(Boolean);
            if (parts.length >= 2) initials = (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            else initials = name.substring(0, 2).toUpperCase();
          }
          document.getElementById('profile-avatar-display').textContent = initials;

          const dept = document.getElementById('input-dept').value;
          const team = document.getElementById('input-team').value;
          const mgr = document.getElementById('input-manager').value;
          const loc = document.getElementById('input-location').value;
          const date = document.getElementById('input-date').value;

          document.getElementById('val-dept').textContent = dept;
          document.getElementById('val-team').textContent = team;
          document.getElementById('val-manager').textContent = mgr;
          document.getElementById('val-location').textContent = loc;
          document.getElementById('val-date').textContent = date;

          const email = document.getElementById('input-email').value;
          const phone = document.getElementById('input-phone').value;

          document.getElementById('val-email').textContent = email;
          document.getElementById('val-phone').textContent = phone;

          const profileData = {
            name: name,
            role: role,
            employeeId: id,
            initials: initials,
            department: dept,
            team: team,
            reportingManager: mgr,
            workLocation: loc,
            joiningDate: date,
            email: email,
            phone: phone
          };

          window.USER_PROFILE = profileData;
          if (window.parent) {
            window.parent.USER_PROFILE = profileData;
            if (window.parent.PERSON_DATA && window.parent.PERSON_DATA['priya']) {
              window.parent.PERSON_DATA['priya'].name = name;
              window.parent.PERSON_DATA['priya'].role = role;
              window.parent.PERSON_DATA['priya'].empId = id;
              window.parent.PERSON_DATA['priya'].initials = initials;
              window.parent.PERSON_DATA['priya'].contact = phone;
            }
          }

          try {
            sessionStorage.setItem('USER_PROFILE', JSON.stringify(profileData));
          } catch(e) {}

          var pDoc = (window.parent && window.parent.document) || document;
          var empTpl = pDoc.getElementById('tpl-EmployeeDashboard');
          if (empTpl) {
            var tplHtml = empTpl.innerHTML;
            tplHtml = tplHtml.replace(/<h1 class="greeting"[^>]*>[\s\S]*?<\/h1>/i, '<h1 class="greeting" id="dash-greeting">Hello, ' + name + '</h1>');
            if (tplHtml.indexOf('dash-role-meta') !== -1) {
              tplHtml = tplHtml.replace(/<p class="dash-role-meta"[^>]*>[\s\S]*?<\/p>/i, '<p class="dash-role-meta" id="dash-role-meta"><span id="dash-role-text">' + role + '</span> &bull; <span id="dash-id-text">' + id + '</span></p>');
            } else {
              tplHtml = tplHtml.replace(/(<h1 class="greeting"[^>]*>[\s\S]*?<\/h1>)/i, '$1\n          <p class="dash-role-meta" id="dash-role-meta"><span id="dash-role-text">' + role + '</span> &bull; <span id="dash-id-text">' + id + '</span></p>');
            }
            empTpl.innerHTML = tplHtml;
          }

          var profTpl = pDoc.getElementById('tpl-MyProfile');
          if (profTpl) {
            var pHtml = profTpl.innerHTML;
            pHtml = pHtml.replace(/<h2 id="profile-name-display"[^>]*>[\s\S]*?<\/h2>/i, '<h2 id="profile-name-display">' + name + '</h2>');
            pHtml = pHtml.replace(/<p class="role" id="profile-role-display"[^>]*>[\s\S]*?<\/p>/i, '<p class="role" id="profile-role-display">' + role + '</p>');
            pHtml = pHtml.replace(/<span class="id-chip" id="profile-id-display"[^>]*>[\s\S]*?<\/span>/i, '<span class="id-chip" id="profile-id-display">' + id + '</span>');
            pHtml = pHtml.replace(/<div class="avatar big" id="profile-avatar-display"[^>]*>[\s\S]*?<\/div>/i, '<div class="avatar big" id="profile-avatar-display">' + initials + '</div>');
            pHtml = pHtml.replace(/id="edit-profile-name" value="[^"]*"/i, 'id="edit-profile-name" value="' + name.replace(/"/g, '&quot;') + '"');
            pHtml = pHtml.replace(/id="edit-profile-role" value="[^"]*"/i, 'id="edit-profile-role" value="' + role.replace(/"/g, '&quot;') + '"');
            pHtml = pHtml.replace(/id="edit-profile-id" value="[^"]*"/i, 'id="edit-profile-id" value="' + id.replace(/"/g, '&quot;') + '"');
            profTpl.innerHTML = pHtml;
          }

          document.getElementById('profile-view-mode').style.display = 'block';
          document.getElementById('profile-edit-mode').style.display = 'none';
          document.getElementById('job-read-mode').style.display = 'block';
          document.getElementById('job-edit-mode').style.display = 'none';
          document.getElementById('contact-read-mode').style.display = 'block';
          document.getElementById('contact-edit-mode').style.display = 'none';

          document.getElementById('profile-edit-btn-wrap').style.display = 'block';
          document.getElementById('profile-save-cancel-wrap').style.display = 'none';
        }
      