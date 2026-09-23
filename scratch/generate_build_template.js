const fs = require('fs');

const logoDataUri = fs.readFileSync('scratch/logo_base64.txt', 'utf8').trim();

const tplContent = `  <template id="tpl-EmployeeDashboard">
    <!DOCTYPE html>
    <html>

    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        :root {
          --primary: #2F6BFF;
          --primary-dark: #1D4ED8;
          --bg: #F4F7FB;
          --surface: #FFFFFF;
          --navy: #1B2333;
          --text: #0F172A;
          --text-secondary: #64748B;
          --text-muted: #94A3B8;
          --success: #1FAE6E;
          --success-bg: #E3F8EE;
          --danger: #E5484D;
          --danger-bg: #FCE4E4;
          --warning: #F5A623;
          --warning-bg: #FDF0DA;
          --purple: #8B5CF6;
          --purple-bg: #EFE9FE;
          --info: #2F6BFF;
          --info-bg: #E7EEFF;
          --border: #E7EAF0;
          --chip: #EEF2FF;
        }

        * {
          box-sizing: border-box;
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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

        .screen {
          flex: 1;
          overflow-y: auto;
          padding-top: 0 !important;
          padding-bottom: 96px;
          -webkit-overflow-scrolling: touch;
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }

        .screen::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* ── Header Aligned Upward ── */
        .dash-header {
          margin-top: 0 !important;
          background: linear-gradient(135deg, #0937A0 0%, #0A4FD5 45%, #1862EE 78%, #2B76FB 100%);
          position: relative;
          border-radius: 0 0 28px 28px;
          padding: 24px 18px 22px 18px;
          color: #FFFFFF;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(10, 79, 213, 0.18);
        }

        .dash-header::before {
          content: '';
          position: absolute;
          top: -40px;
          right: -40px;
          width: 320px;
          height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 60%, transparent 80%);
          pointer-events: none;
        }

        .dash-header::after {
          content: '';
          position: absolute;
          bottom: -60px;
          left: -20px;
          width: 260px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .header-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 2;
        }

        .header-left-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hamburger-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 8px;
          transition: background 0.15s ease;
        }
        .hamburger-btn:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .brand-block {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .brand-logo-img {
          width: 24px;
          height: 24px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .header-dashboard-title-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .header-dashboard-title {
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          line-height: 1.2;
          letter-spacing: -0.2px;
        }

        .header-dashboard-circle {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #FFFFFF;
          margin-top: 3px;
        }

        .header-bell-wrap {
          position: relative;
          width: 38px;
          height: 38px;
          border-radius: 19px;
          background: #0B2568;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .header-bell-wrap:hover {
          transform: scale(1.05);
        }

        .header-bell-dot {
          position: absolute;
          top: 3px;
          right: 4px;
          width: 8px;
          height: 8px;
          border-radius: 4px;
          background: #EF4444;
          border: 1.5px solid #0B2568;
        }

        @keyframes bellPulseGlow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(77, 150, 255, 0.5), 0 0 12px rgba(47, 107, 255, 0.6);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(77, 150, 255, 0.15), 0 0 20px rgba(47, 107, 255, 0.9);
          }
        }

        .header-bell-wrap.has-glow {
          animation: bellPulseGlow 2s infinite ease-in-out;
        }

        /* Header Profile / Greeting Block */
        .header-profile-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 20px;
          position: relative;
          z-index: 2;
        }

        .profile-greeting-col {
          display: flex;
          flex-direction: column;
        }

        .profile-hello {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 400;
          line-height: 1.2;
        }

        .profile-name-title {
          font-size: 24px;
          font-weight: 800;
          color: #FFFFFF;
          line-height: 1.25;
          margin: 2px 0 3px;
          letter-spacing: -0.3px;
        }

        .profile-meta-role {
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.85);
          font-weight: 500;
          margin-bottom: 8px;
        }

        .profile-date-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12.5px;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }

        .profile-avatar-block {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }

        .avatar-circle-wrap {
          width: 74px;
          height: 74px;
          border-radius: 50%;
          background: #EBF3FE;
          border: 3.5px solid #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }

        .avatar-caption {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.92);
          font-weight: 500;
          margin-top: 6px;
          text-align: center;
        }

        .avatar-line-accent {
          width: 22px;
          height: 2px;
          background: #93C5FD;
          border-radius: 1px;
          margin-top: 3px;
        }

        /* ── 4 Action Cards (2x2 Grid) - Perfectly Aligned Top Edges & Uniform Heights ── */
        .dash-action-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin: 14px 16px 14px 16px;
          padding: 0;
          align-items: stretch;
        }

        .dash-action-card {
          background: #FFFFFF;
          border: 1px solid #EAEFF5;
          border-radius: 18px;
          padding: 14px 13px 13px 13px;
          height: 126px;
          min-height: 126px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.025);
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s ease;
          user-select: none;
        }

        .dash-action-card:hover {
          transform: translateY(-2px);
          border-color: #D3E0FF;
          box-shadow: 0 8px 24px rgba(47, 107, 255, 0.1), 0 2px 6px rgba(47, 107, 255, 0.04);
        }

        .dash-action-card.card-leave {
          background-image: radial-gradient(circle at 100% 100%, #D4E5FC 0%, #D4E5FC 28%, rgba(212, 229, 252, 0.5) 45%, transparent 68%);
        }

        .dash-action-card.card-perm {
          background-image: radial-gradient(circle at 100% 100%, #D2F6FA 0%, #D2F6FA 28%, rgba(210, 246, 250, 0.5) 45%, transparent 68%);
        }

        .dash-action-card.card-reqs {
          background-image: radial-gradient(circle at 100% 100%, #ECE6FE 0%, #ECE6FE 28%, rgba(236, 230, 254, 0.5) 45%, transparent 68%);
        }

        .dash-action-card.card-holiday {
          background-image: radial-gradient(circle at 100% 100%, #FEEBD7 0%, #FEEBD7 28%, rgba(254, 235, 215, 0.5) 45%, transparent 68%);
        }

        .action-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 40px;
        }

        .action-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        }

        .action-chevron-btn {
          width: 26px;
          height: 26px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .dash-action-card:hover .action-chevron-btn {
          transform: translateX(2px);
        }

        .action-text-col {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          margin-top: 8px;
        }

        .action-main-title {
          font-size: 15px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.2px;
          line-height: 1.25;
        }

        .action-sub-text {
          font-size: 11px;
          color: #64748B;
          margin-top: 3px;
          line-height: 1.2;
          font-weight: 500;
        }

        /* ── Leave Balances Card ── */
        .leave-balances-card {
          background: #FFFFFF;
          border: 1px solid #EAEFF5;
          border-radius: 18px;
          padding: 16px 16px 14px 16px;
          margin: 0 16px 14px 16px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.025);
        }

        .balances-card-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
        }

        .balances-card-title {
          font-size: 15.5px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.2px;
        }

        .balance-item-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 13px;
        }

        .balance-item-row:last-child {
          margin-bottom: 0;
        }

        .balance-icon-circle {
          width: 38px;
          height: 38px;
          border-radius: 19px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .balance-content-col {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .balance-title-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .balance-item-label {
          font-size: 13px;
          font-weight: 700;
          color: #0F172A;
        }

        .balance-item-val {
          font-size: 12px;
          font-weight: 700;
          color: #2563EB;
        }

        .balance-sub-label {
          font-size: 10.5px;
          color: #64748B;
          margin: 1px 0 6px;
        }

        .balance-progress-track {
          width: 100%;
          height: 7px;
          background: #E2E8F0;
          border-radius: 4px;
          overflow: hidden;
        }

        .balance-progress-fill {
          height: 100%;
          background: #1D4ED8;
          border-radius: 4px;
        }

        /* ── Recent Requests Card (Image 4 - Displayed ONLY on Manager Approval/Rejection) ── */
        .recent-requests-section {
          margin: 0 16px 14px 16px;
          display: none; /* Hidden by default */
        }

        .recent-requests-header {
          font-size: 11.5px;
          font-weight: 700;
          color: #94A3B8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0 4px 8px;
        }

        .recent-request-card {
          background: #FFFFFF;
          border: 1px solid #EAEFF5;
          border-radius: 18px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.025);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .recent-request-card:hover {
          transform: translateY(-2px);
          border-color: #D3E0FF;
          box-shadow: 0 6px 20px rgba(47, 107, 255, 0.08);
        }

        .recent-request-left {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
          min-width: 0;
        }

        .recent-request-title {
          font-size: 14.5px;
          font-weight: 800;
          color: #0F172A;
          letter-spacing: -0.2px;
          line-height: 1.25;
        }

        .recent-request-sub {
          font-size: 12px;
          color: #64748B;
          font-weight: 500;
          line-height: 1.25;
        }

        .recent-request-meta {
          font-size: 11px;
          color: #64748B;
          font-weight: 500;
          line-height: 1.25;
          margin-top: 1px;
        }

        .recent-request-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          margin-left: 12px;
        }

        .recent-request-badge {
          background: #DCFCE7;
          color: #16A34A;
          font-size: 11.5px;
          font-weight: 700;
          padding: 5px 12px;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .recent-request-dismiss-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: opacity 0.15s ease, transform 0.15s ease;
        }

        .recent-request-dismiss-btn:hover {
          opacity: 0.75;
          transform: scale(1.1);
        }

        /* ── Sidebar Drawer Overlay & Menu (Image 2 & Image 4) ── */
        .sidebar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 15, 29, 0.65);
          backdrop-filter: blur(4px);
          z-index: 1000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }

        .sidebar-drawer {
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          width: 290px;
          max-width: 82%;
          background: #1B2333;
          padding: 24px 18px 24px 18px;
          display: flex;
          flex-direction: column;
          box-shadow: 10px 0 30px rgba(0, 0, 0, 0.45);
          transform: translateX(-100%);
          transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
          overflow-y: auto;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .sidebar-drawer::-webkit-scrollbar {
          display: none;
        }

        .sidebar-overlay.open .sidebar-drawer {
          transform: translateX(0);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 18px;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sidebar-logo {
          width: 24px;
          height: 24px;
          object-fit: contain;
          flex-shrink: 0;
        }

        .sidebar-title {
          font-size: 16px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.2px;
        }

        .sidebar-close-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: background 0.15s ease;
        }

        .sidebar-close-btn:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .sidebar-close-btn svg line {
          stroke: #94A3B8;
          transition: stroke 0.15s ease;
        }

        .sidebar-close-btn:hover svg line {
          stroke: #FFFFFF;
        }

        .sidebar-profile-card {
          background: #242E42;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 14px 14px 12px 14px;
          margin-bottom: 18px;
        }

        .sidebar-profile-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-avatar-circle {
          width: 44px;
          height: 44px;
          border-radius: 22px;
          background: #2F6BFF;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 700;
        }

        .sidebar-profile-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-profile-name {
          font-size: 15px;
          font-weight: 700;
          color: #FFFFFF;
          letter-spacing: -0.2px;
        }

        .sidebar-role-badge {
          background: #3B82F6;
          color: #FFFFFF;
          font-size: 10.5px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
          letter-spacing: 0.3px;
          align-self: flex-start;
        }

        .sidebar-logout-btn {
          width: 100%;
          margin-top: 12px;
          background: #382A3A;
          border: 1px solid rgba(239, 68, 68, 0.25);
          border-radius: 10px;
          padding: 8px 12px;
          color: #F87171;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: background 0.15s ease, border-color 0.15s ease;
        }

        .sidebar-logout-btn:hover {
          background: #4F3851;
          border-color: rgba(239, 68, 68, 0.4);
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-nav-item {
          width: 100%;
          background: transparent;
          border: none;
          border-radius: 12px;
          padding: 12px 14px;
          color: #CBD5E1;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
          cursor: pointer;
          display: flex;
          align-items: center;
          transition: background 0.15s ease, color 0.15s ease;
          user-select: none;
        }

        .sidebar-nav-item:hover {
          background: #242E42;
          color: #FFFFFF;
        }

        .sidebar-nav-item.highlight {
          background: #2B3448;
          color: #FFFFFF;
        }

        .sidebar-nav-item.active {
          background: #2F6BFF !important;
          color: #FFFFFF !important;
          font-weight: 700 !important;
        }

        /* ── Bottom Navigation Bar ── */
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
        }

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

        .nav-tab.active {
          color: #2563EB;
          font-weight: 700;
        }

        .dashboard-pill-wrap {
          background: #EEF4FF;
          border-radius: 16px;
          padding: 6px 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1px;
        }

        .active-dot-indicator {
          width: 4px;
          height: 4px;
          border-radius: 2px;
          background: #2563EB;
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
          margin-top: -14px;
        }

        .nav-apply-circle {
          width: 48px;
          height: 48px;
          border-radius: 24px;
          background: #2F6BFF;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 16px rgba(47, 107, 255, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .nav-apply-btn-wrap:hover .nav-apply-circle {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(47, 107, 255, 0.5);
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
        <div class="screen">
          <!-- Header Aligned Upward with Image 3 Logo and Dashboard title with dot below -->
          <div class="dash-header">
            <div class="header-top">
              <div class="header-left-brand">
                <button class="hamburger-btn" aria-label="Menu" onclick="openSidebarDrawer()">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round">
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </svg>
                </button>
                <div class="brand-block">
                  <img src="${logoDataUri}" alt="Logo" class="brand-logo-img" />
                  <div class="header-dashboard-title-wrap">
                    <span class="header-dashboard-title">Dashboard</span>
                    <span class="header-dashboard-circle"></span>
                  </div>
                </div>
              </div>

              <div class="header-bell-wrap" id="dash-bell-btn" onclick="openNotificationsFromDashboard()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span class="header-bell-dot"></span>
              </div>
            </div>

            <!-- Profile & Greeting -->
            <div class="header-profile-row">
              <div class="profile-greeting-col">
                <span class="profile-hello">Hello,</span>
                <h1 class="profile-name-title" id="dash-greeting">Sneha Reddy</h1>
                <div class="profile-meta-role" id="dash-role-meta">
                  <span id="dash-role-text">UI/UX Designer</span> &bull; <span id="dash-id-text">EMP-2024-0103</span>
                </div>
                <div class="profile-date-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Thu, Sep 03 2026</span>
                </div>
              </div>

              <div class="profile-avatar-block">
                <div class="avatar-circle-wrap">
                  <svg width="46" height="46" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="7" r="4.2" fill="#3B82F6"></circle>
                    <path d="M4 20c0-4 3.5-6.5 8-6.5s8 2.5 8 6.5" fill="#3B82F6"></path>
                  </svg>
                </div>
                <span class="avatar-caption">Have a great day!</span>
                <span class="avatar-line-accent"></span>
              </div>
            </div>
          </div>

          <!-- 2x2 Action Cards (Level Top Edges & Uniform Heights) -->
          <div class="dash-action-grid">
            <!-- Apply Leave -->
            <div class="dash-action-card card-leave" id="btn-action-leave" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ApplyLeave')}else if(typeof loadScreen==='function'){loadScreen('tpl-ApplyLeave')}">
              <div class="action-top-row">
                <div class="action-icon-box" style="background:#1C6AFD;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                    <circle cx="8" cy="14" r="1" fill="#FFFFFF"></circle>
                    <circle cx="12" cy="14" r="1" fill="#FFFFFF"></circle>
                    <circle cx="16" cy="14" r="1" fill="#FFFFFF"></circle>
                  </svg>
                </div>
                <div class="action-chevron-btn" style="background:#EDF3FF;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
              <div class="action-text-col">
                <span class="action-main-title">Apply Leave</span>
                <span class="action-sub-text">Plan your time off</span>
              </div>
            </div>

            <!-- Apply Permission -->
            <div class="dash-action-card card-perm" id="btn-action-perm" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ApplyPermission')}else if(typeof loadScreen==='function'){loadScreen('tpl-ApplyPermission')}">
              <div class="action-top-row">
                <div class="action-icon-box" style="background:#097717;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div class="action-chevron-btn" style="background:#EDF3FF;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#1D4ED8" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
              <div class="action-text-col">
                <span class="action-main-title">Apply Permission</span>
                <span class="action-sub-text">Request short leave</span>
              </div>
            </div>

            <!-- My Requests -->
            <div class="dash-action-card card-reqs" id="btn-action-reqs" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-MyRequests')}else if(typeof loadScreen==='function'){loadScreen('tpl-MyRequests')}">
              <div class="action-top-row">
                <div class="action-icon-box" style="background:#8B5CF6;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="5" y="4" width="14" height="16" rx="2" ry="2"></rect>
                    <line x1="9" y1="9" x2="15" y2="9"></line>
                    <line x1="9" y1="13" x2="15" y2="13"></line>
                    <line x1="9" y1="17" x2="13" y2="17"></line>
                  </svg>
                </div>
                <div class="action-chevron-btn" style="background:#ECE6FE;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
              <div class="action-text-col">
                <span class="action-main-title">My Requests</span>
                <span class="action-sub-text">Track leaves & permissions</span>
              </div>
            </div>

            <!-- Holiday Calendar -->
            <div class="dash-action-card card-holiday" id="btn-action-holiday" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-HolidayCalendar')}else if(typeof loadScreen==='function'){loadScreen('tpl-HolidayCalendar')}">
              <div class="action-top-row">
                <div class="action-icon-box" style="background:#FA6400;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                    <circle cx="8" cy="14" r="1" fill="#FFFFFF"></circle>
                    <circle cx="12" cy="14" r="1" fill="#FFFFFF"></circle>
                    <circle cx="16" cy="14" r="1" fill="#FFFFFF"></circle>
                  </svg>
                </div>
                <div class="action-chevron-btn" style="background:#FEEBD7;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C2410C" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </div>
              <div class="action-text-col">
                <span class="action-main-title">Holiday Calendar</span>
                <span class="action-sub-text">View upcoming holidays</span>
              </div>
            </div>
          </div>

          <!-- Leave Balances Card -->
          <div class="leave-balances-card" id="dash-leave-balance-card">
            <div class="balances-card-header">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" stroke="#2563EB" stroke-width="2.8" stroke-linecap="round"></path>
                <path d="M22 12A10 10 0 0 0 12 2v10z" fill="#2563EB"></path>
              </svg>
              <span class="balances-card-title">Leave Balances</span>
            </div>

            <!-- Casual Leave -->
            <div class="balance-item-row">
              <div class="balance-icon-circle" style="background:#EBF3FF;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
                  <line x1="12" y1="12" x2="12" y2="12.01"></line>
                </svg>
              </div>
              <div class="balance-content-col">
                <div class="balance-title-row">
                  <span class="balance-item-label">Casual Leave</span>
                  <span class="balance-item-val">8 / 12 Days</span>
                </div>
                <span class="balance-sub-label">For personal time</span>
                <div class="balance-progress-track">
                  <div class="balance-progress-fill" style="width: 66.6%;"></div>
                </div>
              </div>
            </div>

            <!-- Sick Leave -->
            <div class="balance-item-row">
              <div class="balance-icon-circle" style="background:#FEE2E2;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="10" y1="11" x2="14" y2="11"></line>
                </svg>
              </div>
              <div class="balance-content-col">
                <div class="balance-title-row">
                  <span class="balance-item-label">Sick Leave</span>
                  <span class="balance-item-val">5 / 7 Days</span>
                </div>
                <span class="balance-sub-label">For your well-being</span>
                <div class="balance-progress-track">
                  <div class="balance-progress-fill" style="width: 71.4%;"></div>
                </div>
              </div>
            </div>

            <!-- WFH -->
            <div class="balance-item-row">
              <div class="balance-icon-circle" style="background:#DCFCE7;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              </div>
              <div class="balance-content-col">
                <div class="balance-title-row">
                  <span class="balance-item-label">WFH</span>
                  <span class="balance-item-val">10 / 15 Days</span>
                </div>
                <span class="balance-sub-label">Work from home</span>
                <div class="balance-progress-track">
                  <div class="balance-progress-fill" style="width: 66.6%;"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Requests Section matching Image 4 (Displayed ONLY when manager approves or rejects request) -->
          <div class="recent-requests-section" id="emp-recent-requests-section" style="display: none;">
            <div class="recent-requests-header" id="emp-dash-requests-label">RECENT REQUESTS (0)</div>
            <div id="emp-dash-requests-list"></div>
          </div>
        </div>

        <!-- Bottom Navigation Bar -->
        <div class="bottom-nav">
          <!-- Dashboard (Active) -->
          <div class="tab nav-tab active">
            <div class="dashboard-pill-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#2563EB">
                <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z"></path>
              </svg>
            </div>
            <span>Dashboard</span>
            <span class="active-dot-indicator"></span>
          </div>

          <!-- Attendance -->
          <div class="tab nav-tab" id="tab-attendance" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-MyAttendance')}else if(typeof loadScreen==='function'){loadScreen('tpl-MyAttendance')}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>Attendance</span>
          </div>

          <!-- Apply (Elevated Center Button) -->
          <div class="tab nav-apply-btn-wrap" id="tab-apply" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ApplyLeave')}else if(typeof loadScreen==='function'){loadScreen('tpl-ApplyLeave')}">
            <div class="nav-apply-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </div>
            <span class="nav-apply-label">Apply</span>
          </div>

          <!-- History -->
          <div class="tab nav-tab" id="tab-history" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-LeaveHistory')}else if(typeof loadScreen==='function'){loadScreen('tpl-LeaveHistory')}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
              <path d="M3 3v5h5"></path>
              <polyline points="12 7 12 12 15 15"></polyline>
            </svg>
            <span>History</span>
          </div>

          <!-- Profile -->
          <div class="tab nav-tab" id="tab-profile" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-MyProfile')}else if(typeof loadScreen==='function'){loadScreen('tpl-MyProfile')}">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Profile</span>
          </div>
        </div>

        <!-- Sidebar Drawer Overlay (Image 2 & Image 4) -->
        <div id="sidebar-overlay" class="sidebar-overlay" onclick="closeSidebarDrawer()">
          <div class="sidebar-drawer" onclick="event.stopPropagation()">
            <!-- Header matching Image 2 with Image 3 Logo -->
            <div class="sidebar-header">
              <div class="sidebar-brand">
                <img src="${logoDataUri}" alt="Logo" class="sidebar-logo" />
                <span class="sidebar-title">Mobile Application</span>
              </div>
              <button class="sidebar-close-btn" onclick="closeSidebarDrawer()" aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <!-- Profile Card -->
            <div class="sidebar-profile-card">
              <div class="sidebar-profile-top">
                <div class="sidebar-avatar-circle" id="sidebar-avatar-circle">
                  <span id="sidebar-initials">SR</span>
                </div>
                <div class="sidebar-profile-info">
                  <div class="sidebar-profile-name" id="sidebar-name">Sneha Reddy</div>
                  <span class="sidebar-role-badge">EMPLOYEE</span>
                </div>
              </div>
              <button class="sidebar-logout-btn" onclick="handleSidebarLogout()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                <span>Log Out</span>
              </button>
            </div>

            <!-- Navigation Links -->
            <nav class="sidebar-nav">
              <button class="sidebar-nav-item highlight" onclick="handleSidebarNav('tpl-EmployeeDashboard')">Employee Dashboard</button>
              <button class="sidebar-nav-item active" onclick="handleSidebarNav('tpl-MyAttendance')">My Attendance</button>
              <button class="sidebar-nav-item" onclick="handleSidebarNav('tpl-ApplyLeave')">Apply Leave</button>
              <button class="sidebar-nav-item" onclick="handleSidebarNav('tpl-ApplyPermission')">Apply Permission</button>
              <button class="sidebar-nav-item" onclick="handleSidebarNav('tpl-LeaveBalance')">Leave Balance</button>
              <button class="sidebar-nav-item" onclick="handleSidebarNav('tpl-MyRequests')">My Requests (History)</button>
              <button class="sidebar-nav-item" onclick="handleSidebarNav('tpl-HolidayCalendar')">Holiday Calendar</button>
              <button class="sidebar-nav-item" onclick="handleSidebarNav('tpl-Notifications')">Notifications</button>
              <button class="sidebar-nav-item" onclick="handleSidebarNav('tpl-MyProfile')">My Profile</button>
            </nav>
          </div>
        </div>
      </div>

      <script>
        function openSidebarDrawer() {
          var overlay = document.getElementById('sidebar-overlay');
          if (overlay) overlay.classList.add('open');
          var pWin = (window.parent && window.parent !== window) ? window.parent : window;
          var prof = pWin.USER_PROFILE || window.USER_PROFILE || {};
          var nameEl = document.getElementById('sidebar-name');
          var initialsEl = document.getElementById('sidebar-initials');
          var curName = prof.name || (window.AUTH_USER && window.AUTH_USER.name) || 'Sneha Reddy';
          if (nameEl) nameEl.textContent = curName;
          if (initialsEl) {
            var parts = curName.trim().split(/\\\\s+/);
            initialsEl.textContent = parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : curName.slice(0, 2).toUpperCase();
          }
        }

        function closeSidebarDrawer() {
          var overlay = document.getElementById('sidebar-overlay');
          if (overlay) overlay.classList.remove('open');
        }

        function handleSidebarNav(screenId) {
          closeSidebarDrawer();
          setTimeout(function() {
            var pWin = (window.parent && window.parent !== window) ? window.parent : window;
            if (pWin.loadScreen) {
              pWin.loadScreen(screenId);
            } else if (typeof loadScreen === 'function') {
              loadScreen(screenId);
            }
          }, 120);
        }

        function handleSidebarLogout() {
          closeSidebarDrawer();
          setTimeout(function() {
            var pWin = (window.parent && window.parent !== window) ? window.parent : window;
            if (pWin.logout) {
              pWin.logout();
            } else if (typeof logout === 'function') {
              logout();
            } else if (pWin.loadScreen) {
              pWin.loadScreen('tpl-Login');
            } else if (typeof loadScreen === 'function') {
              loadScreen('tpl-Login');
            }
          }, 100);
        }

        function dismissRecentRequest(cardId, e) {
          if (e && e.stopPropagation) e.stopPropagation();
          var card = cardId ? document.getElementById(cardId) : document.querySelector('.recent-request-card');
          if (card) {
            card.style.transition = 'all 0.25s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(function() {
              card.remove();
              var reqList = document.getElementById('emp-dash-requests-list');
              var remainingCards = reqList ? reqList.querySelectorAll('.recent-request-card').length : 0;
              var label = document.getElementById('emp-dash-requests-label');
              var sec = document.getElementById('emp-recent-requests-section');
              if (label) label.textContent = 'RECENT REQUESTS (' + remainingCards + ')';
              if (remainingCards === 0 && sec) {
                sec.style.display = 'none';
              }
            }, 250);
          }
        }

        function syncDashboardRequests() {
          var pWin = (window.parent && window.parent !== window) ? window.parent : window;
          var docRef = document;
          setTimeout(function() {
            var sec = docRef.getElementById('emp-recent-requests-section');
            var reqList = docRef.getElementById('emp-dash-requests-list');
            var label = docRef.getElementById('emp-dash-requests-label');
            if (!sec || !reqList) return;

            var allReqs = [];
            try {
              if (pWin.EMP_LEAVE_REQUESTS && pWin.EMP_LEAVE_REQUESTS.length > 0) {
                allReqs = pWin.EMP_LEAVE_REQUESTS.slice();
              } else if (window.EMP_LEAVE_REQUESTS && window.EMP_LEAVE_REQUESTS.length > 0) {
                allReqs = window.EMP_LEAVE_REQUESTS.slice();
              } else if (pWin.ALL_SUBMITTED_REQUESTS && pWin.ALL_SUBMITTED_REQUESTS.length > 0) {
                allReqs = pWin.ALL_SUBMITTED_REQUESTS.slice();
              } else if (window.ALL_SUBMITTED_REQUESTS && window.ALL_SUBMITTED_REQUESTS.length > 0) {
                allReqs = window.ALL_SUBMITTED_REQUESTS.slice();
              } else {
                var stored = sessionStorage.getItem('ALL_SUBMITTED_REQUESTS') || (pWin.sessionStorage && pWin.sessionStorage.getItem('ALL_SUBMITTED_REQUESTS'));
                if (stored) allReqs = JSON.parse(stored);
              }
            } catch (e) {}

            var lastDecision = pWin.LAST_LEAVE_DECISION || window.LAST_LEAVE_DECISION || pWin.lastLeaveDecision || window.lastLeaveDecision;
            if (lastDecision && (lastDecision.status === 'approved' || lastDecision.status === 'rejected')) {
              var alreadyIn = allReqs.some(function(r) { return String(r.id) === String(lastDecision.id); });
              if (!alreadyIn) {
                allReqs.unshift({
                  id: lastDecision.id || ('dec-' + Date.now()),
                  leaveType: lastDecision.lType || 'Casual Leave',
                  title: (lastDecision.lType || 'Casual Leave') + ' (1.0 Day)',
                  subtitle: (lastDecision.fromDate || '07-Sep-2026') + ' \u2022 Personal Work',
                  fromDate: lastDecision.fromDate || '07-Sep-2026',
                  reason: 'Personal Work',
                  status: lastDecision.status,
                  employeeName: lastDecision.empName || (pWin.USER_PROFILE && pWin.USER_PROFILE.name) || 'Sneha Reddy',
                  employeeId: 'EMP-2024-0103'
                });
              }
            }

            // Filter ONLY approved or rejected requests (Image 4 format)
            var approvedOrRejected = allReqs.filter(function(r) {
              if (pWin.DELETED_REQUEST_IDS && pWin.DELETED_REQUEST_IDS.indexOf(String(r.id)) !== -1) return false;
              if (window.DELETED_REQUEST_IDS && window.DELETED_REQUEST_IDS.indexOf(String(r.id)) !== -1) return false;
              var st = (r.status || '').toLowerCase();
              return st === 'approved' || st === 'rejected';
            });

            if (approvedOrRejected.length === 0) {
              sec.style.display = 'none';
              reqList.innerHTML = '';
              if (label) label.textContent = 'RECENT REQUESTS (0)';
              return;
            }

            // Display Recent Requests
            sec.style.display = 'block';
            if (label) label.textContent = 'RECENT REQUESTS (' + approvedOrRejected.length + ')';
            reqList.innerHTML = '';

            approvedOrRejected.forEach(function(req) {
              var isApp = (req.status || '').toLowerCase() === 'approved';
              var badgeBg = isApp ? '#DCFCE7' : '#FCE4E4';
              var badgeColor = isApp ? '#16A34A' : '#E5484D';
              var badgeText = isApp ? 'Approved' : 'Rejected';
              var title = req.title || ((req.leaveType || req.type || 'Casual Leave') + ' (' + (req.daysText || req.totalDays || req.duration || '1.0 Day') + ')');
              var sub = req.subtitle || ((req.fromDate || req.date || '07-Sep-2026') + ' \u2022 ' + (req.reason || 'Personal Work'));
              var meta = (req.employeeName || (pWin.USER_PROFILE && pWin.USER_PROFILE.name) || 'Sneha Reddy') + ' \u2022 ' + (req.employeeId || (pWin.USER_PROFILE && pWin.USER_PROFILE.employeeId) || 'EMP-2024-0103');
              var reqId = 'emp-recent-req-' + (req.id || Math.random().toString(36).substr(2, 6));

              var c = docRef.createElement('div');
              c.className = 'recent-request-card';
              c.id = reqId;
              c.style.marginTop = '8px';
              c.onclick = function() {
                if (pWin.loadScreen) pWin.loadScreen('tpl-MyRequests');
                else if (typeof loadScreen === 'function') loadScreen('tpl-MyRequests');
              };
              c.innerHTML = '<div class="recent-request-left">'
                + '<div class="recent-request-title">' + title + '</div>'
                + '<div class="recent-request-sub">' + sub + '</div>'
                + '<div class="recent-request-meta">' + meta + '</div>'
                + '</div>'
                + '<div class="recent-request-right">'
                + '<span class="recent-request-badge" style="background:' + badgeBg + ';color:' + badgeColor + ';">' + badgeText + '</span>'
                + '<button class="recent-request-dismiss-btn" aria-label="Dismiss" onclick="event.stopPropagation(); dismissRecentRequest(\\'' + reqId + '\\', event);">'
                + '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#94A3B8" stroke-width="1.8" fill="none"/><line x1="15" y1="9" x2="9" y2="15" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round"/><line x1="9" y1="9" x2="15" y2="15" stroke="#94A3B8" stroke-width="1.8" stroke-linecap="round"/></svg>'
                + '</button>'
                + '</div>';
              reqList.appendChild(c);
            });
          }, 150);
        }

        function openNotificationsFromDashboard() {
          var pWin = (window.parent && window.parent !== window) ? window.parent : window;
          pWin.HAS_NEW_NOTIFICATION = false;
          window.HAS_NEW_NOTIFICATION = false;
          try { sessionStorage.removeItem('HAS_NEW_NOTIFICATION'); } catch (e) {}
          try { pWin.sessionStorage.removeItem('HAS_NEW_NOTIFICATION'); } catch (e) {}
          var bell = document.getElementById('dash-bell-btn') || document.querySelector('.bell');
          if (bell) bell.classList.remove('has-glow');
          if (pWin.loadScreen) {
            pWin.loadScreen('tpl-Notifications');
          } else if (typeof loadScreen === 'function') {
            loadScreen('tpl-Notifications');
          }
        }

        function syncBellGlow() {
          var pWin = (window.parent && window.parent !== window) ? window.parent : window;
          var hasNew = false;
          try {
            hasNew = !!(pWin.HAS_NEW_NOTIFICATION || window.HAS_NEW_NOTIFICATION || sessionStorage.getItem('HAS_NEW_NOTIFICATION') === 'true' || pWin.sessionStorage.getItem('HAS_NEW_NOTIFICATION') === 'true');
          } catch (e) {
            hasNew = !!(pWin.HAS_NEW_NOTIFICATION || window.HAS_NEW_NOTIFICATION);
          }
          var bell = document.getElementById('dash-bell-btn') || document.querySelector('.bell');
          if (bell) {
            if (hasNew) {
              bell.classList.add('has-glow');
            } else {
              bell.classList.remove('has-glow');
            }
          }
        }
        syncBellGlow();
        syncDashboardRequests();
        document.addEventListener('DOMContentLoaded', function() {
          syncBellGlow();
          syncDashboardRequests();
        });
      </script>
    </body>
    </html>
  </template>`;

const outCode = `const fs = require('fs');

const tplContent = \`${tplContent}\`;

module.exports = { tplContent };
`;

fs.writeFileSync('scratch/build_template.js', outCode, 'utf8');
console.log('Successfully wrote scratch/build_template.js, length:', outCode.length);
