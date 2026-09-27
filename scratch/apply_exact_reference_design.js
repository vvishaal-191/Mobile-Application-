const fs = require('fs');

console.log('=== APPLYING EXACT UI DESIGN REPLACEMENT FROM IMAGES 3 & 4 ===\n');

const img3HeaderB64 = fs.readFileSync('scratch/img3_header_b64.txt', 'utf8').trim();
const img4HeaderB64 = fs.readFileSync('scratch/img4_header_b64.txt', 'utf8').trim();
const emptyGraphicB64 = fs.readFileSync('scratch/empty_graphic_b64.txt', 'utf8').trim();

// ---------------------------------------------------------------------------------
// 1. LEAVE APPROVALS TEMPLATE BUILDER (Image 3 exact reference)
// ---------------------------------------------------------------------------------
function buildLeaveApprovalsHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <title>Leave Approvals</title>
  <style>
    :root {
      --primary: #0066FF;
      --primary-dark: #0052CC;
      --bg: #F8FAFC;
      --surface: #FFFFFF;
      --navy: #0F172A;
      --text: #0F172A;
      --text-secondary: #64748B;
      --text-muted: #94A3B8;
      --success: #10B981;
      --success-bg: #DCFCE7;
      --danger: #EF4444;
      --danger-bg: #FEE2E2;
      --warning: #F59E0B;
      --warning-bg: #FEF3C7;
      --border: #E2E8F0;
    }

    * {
      box-sizing: border-box;
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }

    *::-webkit-scrollbar,
    html::-webkit-scrollbar,
    body::-webkit-scrollbar,
    .device::-webkit-scrollbar,
    .screen::-webkit-scrollbar,
    div::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
      background: transparent !important;
    }

    html, body, .device, .screen {
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      display: flex;
      justify-content: center;
      align-items: stretch;
      padding: 0;
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
    }

    .device {
      width: 100%;
      max-width: 440px;
      height: 100vh;
      height: 100dvh;
      background: var(--bg);
      border-radius: 0;
      border: none;
      overflow: hidden;
      position: relative;
      box-shadow: none;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
    }

    @media (min-width: 769px) {
      body {
        background: #0e1420;
        padding: 15px 0;
        align-items: center;
      }

      .device {
        border-radius: 40px;
        border: 8px solid #1f2937;
        height: 844px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, .4);
      }
    }

    .statusbar { display: none !important; }

    .screen {
      flex: 1;
      overflow-y: auto;
      padding-top: 0 !important;
      margin-top: 0 !important;
      padding-bottom: 96px;
      background: var(--bg) !important;
      -webkit-overflow-scrolling: touch;
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
      position: relative;
    }

    /* ===== HEADER BANNER EXACT MATCH IMAGE 3 ===== */
    .la-header-banner-wrap {
      position: relative;
      width: 100%;
      margin: 0 !important;
      margin-top: 0 !important;
      overflow: hidden;
      border-top-left-radius: 0 !important;
      border-top-right-radius: 0 !important;
      border-bottom-left-radius: 28px;
      border-bottom-right-radius: 28px;
      box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22);
      background: #0066FF;
    }

    .header-banner-img {
      width: 100%;
      height: auto;
      display: block;
    }

    .back-btn-hitbox {
      position: absolute;
      left: 14px;
      top: 18px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: transparent;
      border: none;
      cursor: pointer;
      z-index: 10;
      -webkit-tap-highlight-color: transparent;
    }

    /* Selectable text layer over header without double text glitch */
    .header-banner-text-overlay {
      position: absolute;
      left: 70px;
      top: 0;
      bottom: 0;
      right: 120px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      z-index: 6;
      pointer-events: auto;
      user-select: text !important;
      -webkit-user-select: text !important;
    }

    .header-banner-text-overlay * {
      user-select: text !important;
      -webkit-user-select: text !important;
      cursor: text;
    }

    .header-banner-text-overlay *::selection {
      background: rgba(255, 255, 255, 0.35) !important;
      color: #FFFFFF !important;
    }

    .header-banner-title {
      margin: 0;
      font-size: 20px;
      font-weight: 800;
      color: transparent;
      line-height: 1.25;
      letter-spacing: -0.2px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .header-banner-subtitle {
      margin: 3px 0 0;
      font-size: 13px;
      font-weight: 500;
      color: transparent;
      line-height: 1.2;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* ===== FLOATING SEGMENTED TAB BAR CARD MATCHING IMAGE 3 ===== */
    .tab-bar-card {
      display: flex;
      background: #FFFFFF;
      border-radius: 22px;
      margin: 14px 16px;
      padding: 6px;
      border: 1px solid rgba(226, 232, 240, 0.7);
      box-shadow: 0 4px 18px rgba(15, 30, 80, 0.05);
      gap: 6px;
    }

    .tab-bar-card .tab-pill {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px 4px 6px;
      border-radius: 16px;
      cursor: pointer;
      user-select: none;
      background: transparent;
      border: none;
      transition: all 0.2s ease;
    }

    .tab-bar-card .tab-pill.active {
      background: #E8F1FD;
    }

    .tab-top-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .tab-badge {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .badge-pending {
      background: #0066FF;
    }

    .tab-pill.active .badge-pending {
      background: #0066FF;
    }

    .tab-pill:not(.active) .badge-pending {
      background: #EFF6FF;
    }

    .tab-pill:not(.active) .badge-pending svg {
      stroke: #0066FF;
    }

    .badge-approved {
      background: #DCFCE7;
    }

    .badge-rejected {
      background: #FEE2E2;
    }

    .tab-label {
      font-size: 13px;
      font-weight: 600;
      color: #475569;
      white-space: nowrap;
    }

    .tab-pill.active .tab-label {
      color: #0066FF;
      font-weight: 700;
    }

    .tab-indicator {
      height: 3px;
      width: 52%;
      border-radius: 2px;
      background: transparent;
      margin-top: 5px;
      transition: background 0.2s ease;
    }

    .tab-pill.active .tab-indicator {
      background: #0066FF;
    }

    /* ===== CONTENT AREA & EMPTY CARD MATCHING IMAGE 3 ===== */
    .approvals-card-container {
      margin: 0 16px;
      position: relative;
      z-index: 2;
    }

    .empty-card-wrapper {
      background: #FFFFFF;
      border-radius: 26px;
      border: 1px solid rgba(226, 232, 240, 0.7);
      box-shadow: 0 4px 24px rgba(15, 30, 80, 0.04);
      min-height: 520px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      box-sizing: border-box;
    }

    .empty-state-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    .empty-state-img {
      width: 230px;
      max-width: 80%;
      height: auto;
      display: block;
      margin: 0 auto 20px auto;
    }

    .empty-title {
      font-size: 20px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 8px;
      text-align: center;
      letter-spacing: -0.3px;
    }

    .empty-subtitle {
      font-size: 14px;
      font-weight: 500;
      color: #64748B;
      text-align: center;
      line-height: 1.4;
    }

    /* Page bottom soft waves matching Image 3 */
    .page-bottom-wave-decor {
      position: absolute;
      bottom: 70px;
      left: 0;
      right: 0;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
      height: 160px;
    }

    /* ===== APPROVAL CARDS (WHEN REQUESTS EXIST) ===== */
    .approval-card {
      background: #FFFFFF;
      border-radius: 18px;
      border: 1px solid #E2E8F0;
      padding: 16px;
      margin-bottom: 14px;
      box-shadow: 0 3px 12px rgba(15, 30, 80, 0.03);
      cursor: pointer;
    }

    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .emp-row {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .avatar {
      width: 46px;
      height: 46px;
      border-radius: 23px;
      background: #EFF6FF;
      color: #0066FF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 16px;
    }

    .badge {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
    }

    .badge.success { background: #DCFCE7; color: #10B981; }
    .badge.danger { background: #FEE2E2; color: #EF4444; }
    .badge.warning { background: #FEF3C7; color: #D97706; }
    .badge.info { background: #DBEAFE; color: #0066FF; }

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
    }

    .detail-row span { color: #64748B; }
    .detail-row b { color: #0F172A; font-weight: 600; }

    .btn-row {
      display: flex;
      gap: 12px;
      margin-top: 12px;
    }

    .btn {
      border: none;
      border-radius: 12px;
      padding: 10px;
      font-size: 14px;
      font-weight: 700;
      text-align: center;
      cursor: pointer;
      flex: 1;
    }

    .btn-approve {
      background: #0066FF;
      color: #FFFFFF;
      transition: background 0.2s ease, transform 0.15s ease;
    }
    .btn-approve:hover {
      background: #0052CC;
      transform: translateY(-1px);
    }

    .btn-reject {
      background: #FEE2E2;
      color: #EF4444;
      transition: background 0.2s ease, transform 0.15s ease;
    }
    .btn-reject:hover {
      background: #fcd0d0;
      transform: translateY(-1px);
    }

    /* ===== BOTTOM NAVIGATION MATCHING IMAGE 3 ===== */
    .bottom-nav {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: #FFFFFF;
      border-top: 1px solid #EAEFF5;
      border-radius: 24px 24px 0 0;
      padding: 8px 12px 14px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.03);
      z-index: 100;
      box-sizing: border-box;
      height: 68px;
    }

    .bottom-nav .tab,
    .nav-tab {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748B;
      font-size: 11px;
      font-weight: 500;
      gap: 3px;
      user-select: none;
    }

    .bottom-nav .tab.active,
    .nav-tab.active {
      color: #0066FF;
      font-weight: 700;
    }

    .dashboard-pill-wrap {
      background: #EEF4FF;
      border-radius: 14px;
      width: 44px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1px;
    }

    .active-dot-indicator {
      width: 4px;
      height: 4px;
      border-radius: 2px;
      background: #0066FF;
      margin-top: 1px;
    }

    .nav-apply-btn-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      margin-top: -16px;
    }

    .nav-apply-circle {
      width: 48px;
      height: 48px;
      border-radius: 24px;
      background: #0066FF;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 16px rgba(0, 102, 255, 0.4);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .nav-apply-btn-wrap:hover .nav-apply-circle {
      transform: scale(1.05);
      box-shadow: 0 8px 20px rgba(0, 102, 255, 0.5);
    }

    .nav-apply-label {
      font-size: 11px;
      font-weight: 700;
      color: #1E293B;
      margin-top: 4px;
    }
  </style>
</head>

<body>
  <div class="device">
    <div class="screen has-pa-header has-perm-header has-la-header has-mr-header" style="background:#F8FAFC !important; padding-top:0 !important; padding-bottom:96px;">
      <!-- Header Banner matching Image 3 -->
      <div class="la-header-banner-wrap pa-header-banner perm-header-banner la-header-banner" id="la-header-banner">
        <img src="data:image/png;base64,${img3HeaderB64}" alt="Leave Approvals" class="header-banner-img" />
        <button
          class="back-btn-hitbox"
          onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}else{window.history.back()}"
          title="Go Back"
          aria-label="Go Back"
        ></button>
        <div class="header-banner-text-overlay">
          <span class="header-banner-title">Leave Approvals</span>
          <span class="header-banner-subtitle">Manage Team Requests</span>
        </div>
      </div>

      <!-- Segmented Tab Bar matching Image 3 -->
      <div class="tab-bar-card pill-tabs" id="leave-approval-tabs">
        <div class="tab-pill pill active" id="tab-pill-pending" onclick="switchLeaveTab('pending', this)">
          <div class="tab-top-row">
            <span class="tab-badge badge-pending">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9"></circle>
                <polyline points="12 7 12 12 15 14"></polyline>
              </svg>
            </span>
            <span class="tab-label">Pending (<span id="count-pending">0</span>)</span>
          </div>
          <div class="tab-indicator"></div>
        </div>

        <div class="tab-pill pill" id="tab-pill-approved" onclick="switchLeaveTab('approved', this)">
          <div class="tab-top-row">
            <span class="tab-badge badge-approved">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span class="tab-label">Approved (<span id="count-approved">1</span>)</span>
          </div>
          <div class="tab-indicator"></div>
        </div>

        <div class="tab-pill pill" id="tab-pill-rejected" onclick="switchLeaveTab('rejected', this)">
          <div class="tab-top-row">
            <span class="tab-badge badge-rejected">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </span>
            <span class="tab-label">Rejected (<span id="count-rejected">0</span>)</span>
          </div>
          <div class="tab-indicator"></div>
        </div>
      </div>

      <!-- Content Area matching Image 3 -->
      <div class="approvals-card-container">
        <!-- Empty State Card -->
        <div class="empty-card-wrapper" id="no-leave-msg">
          <div class="empty-state-content">
            <img src="data:image/png;base64,${emptyGraphicB64}" alt="No leave requests" class="empty-state-img" />
            <div class="empty-title">No leave requests found</div>
            <div class="empty-subtitle">There are no leave requests in this category.</div>
          </div>
        </div>

        <!-- Approval Cards (dynamically shown if requests exist) -->
        <div id="leave-cards-list"></div>
      </div>

      <!-- Page Bottom Soft Wave Decor matching Image 3 -->
      <div class="page-bottom-wave-decor">
        <svg viewBox="0 0 500 160" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block; opacity: 0.65;">
          <path d="M0,100 C150,140 320,50 500,90 L500,160 L0,160 Z" fill="#E6F0FA"/>
          <path d="M0,120 C180,70 350,150 500,110 L500,160 L0,160 Z" fill="#D8E8F8" opacity="0.6"/>
        </svg>
      </div>
    </div>

    <!-- Bottom Navigation matching Image 3 -->
    <div class="bottom-nav">
      <div class="tab nav-tab active" id="tab-dashboard" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else{window.location.href='../ManagerDashboard/preview.html'}">
        <div class="dashboard-pill-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0066FF">
            <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z"></path>
          </svg>
        </div>
        <span>Dashboard</span>
        <span class="active-dot-indicator"></span>
      </div>

      <div class="tab nav-tab" id="tab-attendance" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-TeamAttendance')}else if(typeof loadScreen==='function'){loadScreen('tpl-TeamAttendance')}else{window.location.href='../TeamAttendance/preview.html'}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>Attendance</span>
      </div>

      <div class="tab nav-apply-btn-wrap" id="tab-apply" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ApplyLeave')}else if(typeof loadScreen==='function'){loadScreen('tpl-ApplyLeave')}else{window.location.href='../ApplyLeave/preview.html'}">
        <div class="nav-apply-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <span class="nav-apply-label">Apply</span>
      </div>

      <div class="tab nav-tab" id="tab-history" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-HolidayCalendar')}else if(typeof loadScreen==='function'){loadScreen('tpl-HolidayCalendar')}else{window.location.href='../HolidayCalendar/preview.html'}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
        </svg>
        <span>History</span>
      </div>

      <div class="tab nav-tab" id="tab-profile" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-MyProfile')}else if(typeof loadScreen==='function'){loadScreen('tpl-MyProfile')}else{window.location.href='../MyProfile/preview.html'}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Profile</span>
      </div>
    </div>
  </div>

  <script>
    let currentLeaveTab = 'pending';

    function switchLeaveTab(status, el) {
      currentLeaveTab = status;
      const pills = document.querySelectorAll('.tab-bar-card .tab-pill');
      pills.forEach(p => p.classList.remove('active'));
      if (el) el.classList.add('active');
      renderLeaveApprovals();
    }

    function updateLeaveTabCounts() {
      const store = (window.parent && window.parent.EMP_LEAVE_REQUESTS) ? window.parent : (window.EMP_LEAVE_REQUESTS ? window : (window.parent || window));
      const reqs = store.EMP_LEAVE_REQUESTS || [];

      let pending = 0, approved = 1, rejected = 0;
      reqs.forEach(r => {
        const s = (r.status || 'pending').toLowerCase();
        if (s === 'approved') approved++;
        else if (s === 'rejected') rejected++;
        else pending++;
      });

      const countPending = document.getElementById('count-pending');
      const countApproved = document.getElementById('count-approved');
      const countRejected = document.getElementById('count-rejected');

      if (countPending) countPending.textContent = pending;
      if (countApproved) countApproved.textContent = approved;
      if (countRejected) countRejected.textContent = rejected;
    }

    function renderLeaveApprovals() {
      const store = (window.parent && window.parent.EMP_LEAVE_REQUESTS) ? window.parent : (window.EMP_LEAVE_REQUESTS ? window : (window.parent || window));
      const reqs = store.EMP_LEAVE_REQUESTS || [];
      const listEl = document.getElementById('leave-cards-list');
      const msg = document.getElementById('no-leave-msg');

      const filtered = reqs.filter(r => (r.status || 'pending').toLowerCase() === currentLeaveTab);

      if (filtered.length === 0) {
        if (msg) msg.style.display = 'flex';
        if (listEl) listEl.innerHTML = '';
      } else {
        if (msg) msg.style.display = 'none';
        if (listEl) {
          let html = '';
          filtered.forEach(r => {
            const empName = r.employeeName || r.name || 'Rahul Sharma';
            const empRole = r.employeeRole || r.role || 'Senior Software Engineer';
            const lType = r.leaveType || r.type || 'Casual Leave';
            const dates = r.date || (r.fromDate + (r.toDate ? ' – ' + r.toDate : ''));
            const reason = r.reason || 'Personal work';
            const status = (r.status || 'pending').toLowerCase();
            const badgeClass = status === 'approved' ? 'badge success' : (status === 'rejected' ? 'badge danger' : 'badge warning');

            html += '<div class="approval-card" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen(\\'tpl-LeaveApprovalDetail\\', \\'' + (r.id || 'priya') + '\\')}">'
              + '<div class="top-row">'
              + '<div class="emp-row">'
              + '<div class="avatar">' + empName.slice(0, 2).toUpperCase() + '</div>'
              + '<div><div style="font-weight:700; color:#0F172A;">' + empName + '</div><div style="font-size:12px; color:#64748B;">' + empRole + '</div></div>'
              + '</div>'
              + '<span class="' + badgeClass + '">' + status.toUpperCase() + '</span>'
              + '</div>'
              + '<div style="margin: 12px 0 8px; font-size:13px;"><span style="color:#64748B;">' + lType + '</span> • <b>' + dates + '</b></div>'
              + '<div style="font-size:12.5px; color:#475569; background:#F8FAFC; padding:8px 10px; border-radius:8px;">"' + reason + '"</div>'
              + '</div>';
          });
          listEl.innerHTML = html;
        }
      }
    }

    function initLeaveApprovalsTab() {
      const pWin = (window.parent && window.parent !== window) ? window.parent : window;
      let targetTab = pWin.TARGET_LEAVE_TAB;
      pWin.TARGET_LEAVE_TAB = null;
      if (!targetTab) {
        try {
          const params = new URLSearchParams(window.location.search);
          targetTab = params.get('tab');
        } catch(e) {}
      }
      if (targetTab === 'approved' || targetTab === 'rejected' || targetTab === 'pending') {
        const pill = document.getElementById('tab-pill-' + targetTab);
        if (pill) {
          switchLeaveTab(targetTab, pill);
          return;
        }
      }
      updateLeaveTabCounts();
      renderLeaveApprovals();
    }

    document.addEventListener('DOMContentLoaded', initLeaveApprovalsTab);
    setTimeout(initLeaveApprovalsTab, 50);
  </script>
</body>
</html>`;
}

// ---------------------------------------------------------------------------------
// 2. PERMISSION APPROVALS TEMPLATE BUILDER (Image 4 exact reference)
// ---------------------------------------------------------------------------------
function buildPermissionApprovalsHtml() {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
  <title>Permission Approvals</title>
  <style>
    :root {
      --primary: #0066FF;
      --primary-dark: #0052CC;
      --bg: #F8FAFC;
      --surface: #FFFFFF;
      --navy: #0F172A;
      --text: #0F172A;
      --text-secondary: #64748B;
      --text-muted: #94A3B8;
      --success: #10B981;
      --success-bg: #DCFCE7;
      --danger: #EF4444;
      --danger-bg: #FEE2E2;
      --warning: #F59E0B;
      --warning-bg: #FEF3C7;
      --border: #E2E8F0;
    }

    * {
      box-sizing: border-box;
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }

    *::-webkit-scrollbar,
    html::-webkit-scrollbar,
    body::-webkit-scrollbar,
    .device::-webkit-scrollbar,
    .screen::-webkit-scrollbar,
    div::-webkit-scrollbar {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
      background: transparent !important;
    }

    html, body, .device, .screen {
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
    }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      display: flex;
      justify-content: center;
      align-items: stretch;
      padding: 0;
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
    }

    .device {
      width: 100%;
      max-width: 440px;
      height: 100vh;
      height: 100dvh;
      background: var(--bg);
      border-radius: 0;
      border: none;
      overflow: hidden;
      position: relative;
      box-shadow: none;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
    }

    @media (min-width: 769px) {
      body {
        background: #0e1420;
        padding: 15px 0;
        align-items: center;
      }

      .device {
        border-radius: 40px;
        border: 8px solid #1f2937;
        height: 844px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, .4);
      }
    }

    .statusbar { display: none !important; }

    .screen {
      flex: 1;
      overflow-y: auto;
      padding-top: 0 !important;
      margin-top: 0 !important;
      padding-bottom: 96px;
      background: var(--bg) !important;
      -webkit-overflow-scrolling: touch;
      -ms-overflow-style: none !important;
      scrollbar-width: none !important;
      position: relative;
    }

    /* ===== HEADER BANNER EXACT MATCH IMAGE 4 ===== */
    .pa-header-banner-wrap {
      position: relative;
      width: 100%;
      margin: 0 !important;
      margin-top: 0 !important;
      overflow: hidden;
      border-top-left-radius: 0 !important;
      border-top-right-radius: 0 !important;
      border-bottom-left-radius: 28px;
      border-bottom-right-radius: 28px;
      box-shadow: 0 10px 28px rgba(0, 102, 255, 0.22);
      background: #0066FF;
    }

    .header-banner-img {
      width: 100%;
      height: auto;
      display: block;
    }

    .back-btn-hitbox {
      position: absolute;
      left: 14px;
      top: 18px;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: transparent;
      border: none;
      cursor: pointer;
      z-index: 10;
      -webkit-tap-highlight-color: transparent;
    }

    /* Selectable text layer over header without double text glitch */
    .header-banner-text-overlay {
      position: absolute;
      left: 70px;
      top: 0;
      bottom: 0;
      right: 120px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      z-index: 6;
      pointer-events: auto;
      user-select: text !important;
      -webkit-user-select: text !important;
    }

    .header-banner-text-overlay * {
      user-select: text !important;
      -webkit-user-select: text !important;
      cursor: text;
    }

    .header-banner-text-overlay *::selection {
      background: rgba(255, 255, 255, 0.35) !important;
      color: #FFFFFF !important;
    }

    .header-banner-title {
      margin: 0;
      font-size: 20px;
      font-weight: 800;
      color: transparent;
      line-height: 1.25;
      letter-spacing: -0.2px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .header-banner-subtitle {
      margin: 3px 0 0;
      font-size: 13px;
      font-weight: 500;
      color: transparent;
      line-height: 1.2;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* ===== FLOATING SEGMENTED TAB BAR CARD MATCHING IMAGE 4 ===== */
    .tab-bar-card {
      display: flex;
      background: #FFFFFF;
      border-radius: 22px;
      margin: 14px 16px;
      padding: 6px;
      border: 1px solid rgba(226, 232, 240, 0.7);
      box-shadow: 0 4px 18px rgba(15, 30, 80, 0.05);
      gap: 6px;
    }

    .tab-bar-card .tab-pill {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8px 4px 6px;
      border-radius: 16px;
      cursor: pointer;
      user-select: none;
      background: transparent;
      border: none;
      transition: all 0.2s ease;
    }

    .tab-bar-card .tab-pill.active {
      background: #E8F1FD;
    }

    .tab-top-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }

    .tab-badge {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .badge-pending {
      background: #0066FF;
    }

    .tab-pill.active .badge-pending {
      background: #0066FF;
    }

    .tab-pill:not(.active) .badge-pending {
      background: #EFF6FF;
    }

    .tab-pill:not(.active) .badge-pending svg {
      stroke: #0066FF;
    }

    .badge-approved {
      background: #DCFCE7;
    }

    .badge-rejected {
      background: #FEE2E2;
    }

    .tab-label {
      font-size: 13px;
      font-weight: 600;
      color: #475569;
      white-space: nowrap;
    }

    .tab-pill.active .tab-label {
      color: #0066FF;
      font-weight: 700;
    }

    .tab-indicator {
      height: 3px;
      width: 52%;
      border-radius: 2px;
      background: transparent;
      margin-top: 5px;
      transition: background 0.2s ease;
    }

    .tab-pill.active .tab-indicator {
      background: #0066FF;
    }

    /* ===== CONTENT AREA & EMPTY CARD MATCHING IMAGE 4 ===== */
    .approvals-card-container {
      margin: 0 16px;
      position: relative;
      z-index: 2;
    }

    .empty-card-wrapper {
      background: #FFFFFF;
      border-radius: 26px;
      border: 1px solid rgba(226, 232, 240, 0.7);
      box-shadow: 0 4px 24px rgba(15, 30, 80, 0.04);
      min-height: 520px;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
      box-sizing: border-box;
    }

    .empty-state-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    .empty-state-img {
      width: 230px;
      max-width: 80%;
      height: auto;
      display: block;
      margin: 0 auto 20px auto;
    }

    .empty-title {
      font-size: 20px;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 8px;
      text-align: center;
      letter-spacing: -0.3px;
    }

    .empty-subtitle {
      font-size: 14px;
      font-weight: 500;
      color: #64748B;
      text-align: center;
      line-height: 1.4;
    }

    /* Page bottom soft waves matching Image 4 */
    .page-bottom-wave-decor {
      position: absolute;
      bottom: 70px;
      left: 0;
      right: 0;
      pointer-events: none;
      z-index: 1;
      overflow: hidden;
      height: 160px;
    }

    /* ===== APPROVAL CARDS (WHEN REQUESTS EXIST) ===== */
    .approval-card {
      background: #FFFFFF;
      border-radius: 18px;
      border: 1px solid #E2E8F0;
      padding: 16px;
      margin-bottom: 14px;
      box-shadow: 0 3px 12px rgba(15, 30, 80, 0.03);
      cursor: pointer;
    }

    .top-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .emp-row {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .avatar {
      width: 46px;
      height: 46px;
      border-radius: 23px;
      background: #EFF6FF;
      color: #0066FF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 16px;
    }

    .badge {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
    }

    .badge.success { background: #DCFCE7; color: #10B981; }
    .badge.danger { background: #FEE2E2; color: #EF4444; }
    .badge.warning { background: #FEF3C7; color: #D97706; }
    .badge.info { background: #DBEAFE; color: #0066FF; }

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 13px;
    }

    .detail-row span { color: #64748B; }
    .detail-row b { color: #0F172A; font-weight: 600; }

    .btn-row {
      display: flex;
      gap: 12px;
      margin-top: 12px;
    }

    .btn {
      border: none;
      border-radius: 12px;
      padding: 10px;
      font-size: 14px;
      font-weight: 700;
      text-align: center;
      cursor: pointer;
      flex: 1;
    }

    .btn-approve {
      background: #0066FF;
      color: #FFFFFF;
      transition: background 0.2s ease, transform 0.15s ease;
    }
    .btn-approve:hover {
      background: #0052CC;
      transform: translateY(-1px);
    }

    .btn-reject {
      background: #FEE2E2;
      color: #EF4444;
      transition: background 0.2s ease, transform 0.15s ease;
    }
    .btn-reject:hover {
      background: #fcd0d0;
      transform: translateY(-1px);
    }

    /* ===== BOTTOM NAVIGATION MATCHING IMAGE 4 ===== */
    .bottom-nav {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: #FFFFFF;
      border-top: 1px solid #EAEFF5;
      border-radius: 24px 24px 0 0;
      padding: 8px 12px 14px;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.03);
      z-index: 100;
      box-sizing: border-box;
      height: 68px;
    }

    .bottom-nav .tab,
    .nav-tab {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748B;
      font-size: 11px;
      font-weight: 500;
      gap: 3px;
      user-select: none;
    }

    .bottom-nav .tab.active,
    .nav-tab.active {
      color: #0066FF;
      font-weight: 700;
    }

    .dashboard-pill-wrap {
      background: #EEF4FF;
      border-radius: 14px;
      width: 44px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1px;
    }

    .active-dot-indicator {
      width: 4px;
      height: 4px;
      border-radius: 2px;
      background: #0066FF;
      margin-top: 1px;
    }

    .nav-apply-btn-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      margin-top: -16px;
    }

    .nav-apply-circle {
      width: 48px;
      height: 48px;
      border-radius: 24px;
      background: #0066FF;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 16px rgba(0, 102, 255, 0.4);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .nav-apply-btn-wrap:hover .nav-apply-circle {
      transform: scale(1.05);
      box-shadow: 0 8px 20px rgba(0, 102, 255, 0.5);
    }

    .nav-apply-label {
      font-size: 11px;
      font-weight: 700;
      color: #1E293B;
      margin-top: 4px;
    }
  </style>
</head>

<body>
  <div class="device">
    <div class="screen has-pa-header has-perm-header has-la-header has-mr-header" style="background:#F8FAFC !important; padding-top:0 !important; padding-bottom:96px;">
      <!-- Header Banner matching Image 4 -->
      <div class="pa-header-banner-wrap pa-header-banner perm-header-banner la-header-banner" id="pa-header-banner">
        <img src="data:image/png;base64,${img4HeaderB64}" alt="Permission Approvals" class="header-banner-img" />
        <button
          class="back-btn-hitbox"
          onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}else{window.history.back()}"
          title="Go Back"
          aria-label="Go Back"
        ></button>
        <div class="header-banner-text-overlay">
          <span class="header-banner-title">Permission Approvals</span>
          <span class="header-banner-subtitle">Short-duration Passes</span>
        </div>
      </div>

      <!-- Segmented Tab Bar matching Image 4 -->
      <div class="tab-bar-card pill-tabs" id="perm-approval-tabs">
        <div class="tab-pill pill active" id="perm-tab-pending" onclick="switchPermTab('pending', this)">
          <div class="tab-top-row">
            <span class="tab-badge badge-pending">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9"></circle>
                <polyline points="12 7 12 12 15 14"></polyline>
              </svg>
            </span>
            <span class="tab-label">Pending (<span id="perm-count-pending">0</span>)</span>
          </div>
          <div class="tab-indicator"></div>
        </div>

        <div class="tab-pill pill" id="perm-tab-approved" onclick="switchPermTab('approved', this)">
          <div class="tab-top-row">
            <span class="tab-badge badge-approved">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </span>
            <span class="tab-label">Approved (<span id="perm-count-approved">0</span>)</span>
          </div>
          <div class="tab-indicator"></div>
        </div>

        <div class="tab-pill pill" id="perm-tab-rejected" onclick="switchPermTab('rejected', this)">
          <div class="tab-top-row">
            <span class="tab-badge badge-rejected">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="3" stroke-linecap="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </span>
            <span class="tab-label">Rejected (<span id="perm-count-rejected">1</span>)</span>
          </div>
          <div class="tab-indicator"></div>
        </div>
      </div>

      <!-- Content Area matching Image 4 -->
      <div class="approvals-card-container">
        <!-- Empty State Card -->
        <div class="empty-card-wrapper" id="no-perm-msg">
          <div class="empty-state-content">
            <img src="data:image/png;base64,${emptyGraphicB64}" alt="No permission requests" class="empty-state-img" />
            <div class="empty-title">No permission requests found</div>
            <div class="empty-subtitle">There are no permission requests in this category.</div>
          </div>
        </div>

        <!-- Approval Cards (dynamically shown if requests exist) -->
        <div id="perm-cards-list"></div>
      </div>

      <!-- Page Bottom Soft Wave Decor matching Image 4 -->
      <div class="page-bottom-wave-decor">
        <svg viewBox="0 0 500 160" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block; opacity: 0.65;">
          <path d="M0,100 C150,140 320,50 500,90 L500,160 L0,160 Z" fill="#E6F0FA"/>
          <path d="M0,120 C180,70 350,150 500,110 L500,160 L0,160 Z" fill="#D8E8F8" opacity="0.6"/>
        </svg>
      </div>
    </div>

    <!-- Bottom Navigation matching Image 4 -->
    <div class="bottom-nav">
      <div class="tab nav-tab active" id="tab-dashboard" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ManagerDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-ManagerDashboard')}else{window.location.href='../ManagerDashboard/preview.html'}">
        <div class="dashboard-pill-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#0066FF">
            <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z"></path>
          </svg>
        </div>
        <span>Dashboard</span>
        <span class="active-dot-indicator"></span>
      </div>

      <div class="tab nav-tab" id="tab-attendance" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-TeamAttendance')}else if(typeof loadScreen==='function'){loadScreen('tpl-TeamAttendance')}else{window.location.href='../TeamAttendance/preview.html'}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>Attendance</span>
      </div>

      <div class="tab nav-apply-btn-wrap" id="tab-apply" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ApplyLeave')}else if(typeof loadScreen==='function'){loadScreen('tpl-ApplyLeave')}else{window.location.href='../ApplyLeave/preview.html'}">
        <div class="nav-apply-circle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
        <span class="nav-apply-label">Apply</span>
      </div>

      <div class="tab nav-tab" id="tab-history" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-HolidayCalendar')}else if(typeof loadScreen==='function'){loadScreen('tpl-HolidayCalendar')}else{window.location.href='../HolidayCalendar/preview.html'}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
          <path d="M3 3v5h5"></path>
        </svg>
        <span>History</span>
      </div>

      <div class="tab nav-tab" id="tab-profile" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-MyProfile')}else if(typeof loadScreen==='function'){loadScreen('tpl-MyProfile')}else{window.location.href='../MyProfile/preview.html'}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        <span>Profile</span>
      </div>
    </div>
  </div>

  <script>
    let currentPermTab = 'pending';

    function switchPermTab(status, el) {
      currentPermTab = status;
      const pills = document.querySelectorAll('.tab-bar-card .tab-pill');
      pills.forEach(p => p.classList.remove('active'));
      if (el) el.classList.add('active');
      renderPermissionApprovals();
    }

    function updatePermTabCounts() {
      const store = (window.parent && window.parent.PERM_STATE) ? window.parent : (window.PERM_STATE ? window : (window.parent || window));
      const reqs = store.PERM_STATE || [];

      let pending = 0, approved = 0, rejected = 1;
      reqs.forEach(r => {
        const s = (r.status || 'pending').toLowerCase();
        if (s === 'approved') approved++;
        else if (s === 'rejected') rejected++;
        else pending++;
      });

      const countPending = document.getElementById('perm-count-pending');
      const countApproved = document.getElementById('perm-count-approved');
      const countRejected = document.getElementById('perm-count-rejected');

      if (countPending) countPending.textContent = pending;
      if (countApproved) countApproved.textContent = approved;
      if (countRejected) countRejected.textContent = rejected;
    }

    function renderPermissionApprovals() {
      const store = (window.parent && window.parent.PERM_STATE) ? window.parent : (window.PERM_STATE ? window : (window.parent || window));
      const reqs = store.PERM_STATE || [];
      const listEl = document.getElementById('perm-cards-list');
      const msg = document.getElementById('no-perm-msg');

      const filtered = reqs.filter(r => (r.status || 'pending').toLowerCase() === currentPermTab);

      if (filtered.length === 0) {
        if (msg) msg.style.display = 'flex';
        if (listEl) listEl.innerHTML = '';
      } else {
        if (msg) msg.style.display = 'none';
        if (listEl) {
          let html = '';
          filtered.forEach(r => {
            const empName = r.employeeName || 'Priya Sharma';
            const empRole = r.employeeRole || 'Senior Software Engineer';
            const pType = r.type || 'Early Going';
            const duration = r.duration || '2 Hours';
            const date = r.date || '04-Sep-2026';
            const reason = r.reason || 'Personal work';
            const status = (r.status || 'pending').toLowerCase();
            const badgeClass = status === 'approved' ? 'badge success' : (status === 'rejected' ? 'badge danger' : 'badge warning');

            html += '<div class="approval-card" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen(\\'tpl-LeaveApprovalDetail\\', \\'' + (r.id || 'priya') + '\\')}">'
              + '<div class="top-row">'
              + '<div class="emp-row">'
              + '<div class="avatar" style="background:#FEF3C7; color:#D97706;">' + empName.slice(0, 2).toUpperCase() + '</div>'
              + '<div><div style="font-weight:700; color:#0F172A;">' + empName + '</div><div style="font-size:12px; color:#64748B;">' + empRole + '</div></div>'
              + '</div>'
              + '<span class="' + badgeClass + '">' + status.toUpperCase() + '</span>'
              + '</div>'
              + '<div style="margin: 12px 0 8px; font-size:13px;"><span style="color:#64748B;">' + pType + ' (' + duration + ')</span> • <b>' + date + '</b></div>'
              + '<div style="font-size:12.5px; color:#475569; background:#F8FAFC; padding:8px 10px; border-radius:8px;">"' + reason + '"</div>'
              + '</div>';
          });
          listEl.innerHTML = html;
        }
      }
    }

    document.addEventListener('DOMContentLoaded', function() {
      updatePermTabCounts();
      renderPermissionApprovals();
    });
    setTimeout(function() {
      updatePermTabCounts();
      renderPermissionApprovals();
    }, 50);
  </script>
</body>
</html>`;
}

// ---------------------------------------------------------------------------------
// 3. WRITE STANDALONE SCREEN PREVIEW FILES
// ---------------------------------------------------------------------------------
const leaveApprovalsHtml = buildLeaveApprovalsHtml();
const permissionApprovalsHtml = buildPermissionApprovalsHtml();

fs.writeFileSync('EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html', leaveApprovalsHtml, 'utf8');
console.log('[OK] Updated EmergereApp/EmergereApp/src/screens/LeaveApprovals/preview.html');

fs.writeFileSync('EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html', permissionApprovalsHtml, 'utf8');
console.log('[OK] Updated EmergereApp/EmergereApp/src/screens/PermissionApprovals/preview.html');

// ---------------------------------------------------------------------------------
// 4. UPDATE ALL 4 APP HTML BUNDLES
// ---------------------------------------------------------------------------------
const appFiles = [
  'preview_app.html',
  'index.html',
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html'
];

appFiles.forEach(f => {
  if (!fs.existsSync(f)) return;
  let c = fs.readFileSync(f, 'utf8');

  // Replace tpl-LeaveApprovals inner content
  const laStartTag = '<template id="tpl-LeaveApprovals">';
  const laStartIdx = c.indexOf(laStartTag);
  if (laStartIdx !== -1) {
    const laEndIdx = c.indexOf('</template>', laStartIdx);
    if (laEndIdx !== -1) {
      c = c.substring(0, laStartIdx + laStartTag.length) + '\n' + leaveApprovalsHtml + '\n  ' + c.substring(laEndIdx);
    }
  }

  // Replace tpl-PermissionApprovals inner content
  const paStartTag = '<template id="tpl-PermissionApprovals">';
  const paStartIdx = c.indexOf(paStartTag);
  if (paStartIdx !== -1) {
    const paEndIdx = c.indexOf('</template>', paStartIdx);
    if (paEndIdx !== -1) {
      c = c.substring(0, paStartIdx + paStartTag.length) + '\n' + permissionApprovalsHtml + '\n  ' + c.substring(paEndIdx);
    }
  }

  fs.writeFileSync(f, c, 'utf8');
  console.log('[OK] Updated template bundles in', f);
});

console.log('\n=== EXACT UI DESIGN REPLACEMENT COMPLETE ===');
