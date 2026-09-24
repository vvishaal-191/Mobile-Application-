const fs = require('fs');
const path = require('path');

const newTplNotifications = `<template id="tpl-Notifications">
    <!DOCTYPE html>
    <html>

    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <title>Notifications - Preview</title>
      <style>
        :root {
          --primary: #0066FF;
          --primary-dark: #0050EA;
          --bg: #F0F4FA;
          --surface: #FFFFFF;
          --text: #0F172A;
          --text-secondary: #64748B;
          --text-muted: #94A3B8;
          --success: #10B981;
          --danger: #EF4444;
          --warning: #F5A623;
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
        }

        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background-color: transparent;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          color: var(--text);
          overflow: hidden;
        }

        .device {
          width: 100%;
          height: 100%;
          position: relative;
          background-color: var(--bg);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .screen {
          width: 100%;
          height: 100%;
          padding: 0 !important;
          background: #F0F4FA !important;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }

        /* Header Banner with Curved Bottom */
        .notif-header-banner {
          position: relative;
          background: linear-gradient(135deg, #0056D6 0%, #0066FF 45%, #1877F2 100%);
          border-radius: 0 0 28px 28px;
          padding: 24px 20px 26px 20px;
          color: #FFFFFF;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 80, 220, 0.22);
          flex-shrink: 0;
          z-index: 10;
        }

        .notif-header-banner::before {
          content: "";
          position: absolute;
          top: -40px;
          right: -30px;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 70%);
          pointer-events: none;
        }

        .notif-header-banner::after {
          content: "";
          position: absolute;
          bottom: -30px;
          left: 20%;
          width: 160px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 70%);
          pointer-events: none;
        }

        .notif-header-content {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .notif-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        /* Frosted Circular Back Button */
        .notif-back-btn {
          width: 38px;
          height: 38px;
          min-width: 38px;
          min-height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.22);
          border: 1px solid rgba(255, 255, 255, 0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #FFFFFF;
          transition: all 0.2s ease;
          flex-shrink: 0;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          padding: 0;
        }

        .notif-back-btn:hover {
          background: rgba(255, 255, 255, 0.32);
          transform: translateX(-1px);
        }

        .notif-title-group {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .notif-title-group h1 {
          margin: 0 !important;
          padding: 0 !important;
          font-size: 22px !important;
          font-weight: 800 !important;
          color: #FFFFFF !important;
          letter-spacing: -0.3px !important;
          line-height: 1.18 !important;
        }

        .notif-title-group p {
          margin: 4px 0 0 0 !important;
          padding: 0 !important;
          font-size: 13px !important;
          font-weight: 400 !important;
          color: rgba(255, 255, 255, 0.88) !important;
          line-height: 1.2 !important;
          letter-spacing: 0.1px !important;
        }

        /* 3D Ringing Bell Art with sound waves */
        .notif-bell-art {
          width: 68px;
          height: 68px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        /* Scrollable Body Container */
        .notif-body {
          padding: 16px 16px 85px;
          flex: 1;
          overflow-y: auto;
        }

        /* Top Controls Row */
        .notif-controls-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
        }

        .notif-recent-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #0066FF;
          color: #FFFFFF;
          border-radius: 20px;
          padding: 7px 18px 7px 14px;
          font-size: 13.5px;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(0, 102, 255, 0.28);
          border: none;
          cursor: default;
        }

        .notif-recent-pill svg {
          width: 15px;
          height: 15px;
          fill: none;
          stroke: #FFFFFF;
          stroke-width: 2.2;
        }

        .notif-clear-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #0066FF;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          background: transparent;
          border: none;
          padding: 6px 4px;
          transition: opacity 0.2s ease, transform 0.15s ease;
        }

        .notif-clear-btn:hover {
          opacity: 0.8;
          transform: scale(0.98);
        }

        .notif-clear-btn svg {
          width: 16px;
          height: 16px;
          stroke: #0066FF;
          fill: none;
          stroke-width: 2;
        }

        /* Section Header */
        .notif-section-title {
          font-size: 16px;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 12px 2px;
          letter-spacing: -0.2px;
        }

        /* Notification List Container */
        #notif-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        /* Notification Cards */
        .notif-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          border-left-width: 4.5px !important;
          padding: 14px 12px 14px 14px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          position: relative;
          transition: transform 0.15s ease, opacity 0.25s ease, box-shadow 0.15s ease;
        }

        .notif-card:hover {
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
        }

        .notif-card.fade-out {
          opacity: 0;
          transform: translateX(20px);
        }

        .notif-card.type-approved {
          border-left-color: #10B981 !important;
          background: #FFFFFF;
        }

        .notif-card.type-permission,
        .notif-card.unread {
          border-left-color: #0066FF !important;
          background: #FFFFFF;
        }

        .notif-card.type-rejected {
          border-left-color: #EF4444 !important;
          background: #FFFDFD;
        }

        .notif-card.type-holiday {
          border-left-color: #F59E0B !important;
          background: #FFFFFE;
        }

        .notif-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          position: relative;
        }

        .notif-badge {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notif-badge.badge-green,
        .ico-wrap.success {
          background: #DCFCE7;
        }

        .notif-badge.badge-blue,
        .ico-wrap.info {
          background: #DBEAFE;
        }

        .notif-badge.badge-red,
        .ico-wrap.danger {
          background: #FEE2E2;
        }

        .notif-badge.badge-amber,
        .ico-wrap.warning {
          background: #FEF3C7;
        }

        .ico-wrap {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          flex-shrink: 0;
        }

        .notif-text {
          flex: 1;
          min-width: 0;
          padding-right: 6px;
        }

        .notif-text p {
          margin: 0;
          font-size: 13.5px;
          font-weight: 600;
          line-height: 1.45;
          color: #0F172A;
        }

        .text-highlight-green {
          color: #059669;
          font-weight: 700;
        }

        .text-highlight-blue {
          color: #0066FF;
          font-weight: 700;
        }

        .text-highlight-red {
          color: #DC2626;
          font-weight: 700;
        }

        .text-highlight-amber {
          color: #D97706;
          font-weight: 700;
        }

        .notif-time-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 7px;
          color: #94A3B8;
          font-size: 12.5px;
          font-weight: 500;
        }

        .notif-time-row svg {
          width: 14px;
          height: 14px;
          stroke: #94A3B8;
          fill: none;
          stroke-width: 2;
          flex-shrink: 0;
        }

        .notif-dismiss-btn,
        .close-item-btn {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #EFF6FF;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          border: none;
          color: #3B82F6;
          transition: all 0.15s ease;
          padding: 0;
        }

        .notif-card.type-rejected .notif-dismiss-btn {
          background: #FEE2E2;
          color: #EF4444;
        }

        .notif-card.type-holiday .notif-dismiss-btn {
          background: #FEF3C7;
          color: #D97706;
        }

        .notif-dismiss-btn:hover,
        .close-item-btn:hover {
          filter: brightness(0.92);
          transform: scale(1.08);
        }

        .notif-dismiss-btn svg {
          width: 11px;
          height: 11px;
          stroke: currentColor;
          stroke-width: 2.2;
        }

        .notif-empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .notif-empty-icon {
          width: 68px;
          height: 68px;
          border-radius: 34px;
          background: #EFF6FF;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 14px;
        }

        .notif-empty-icon svg {
          width: 32px;
          height: 32px;
          stroke: #0066FF;
          fill: none;
          stroke-width: 2;
        }

        .notif-empty-title {
          font-size: 18px;
          font-weight: 800;
          color: #0F172A;
          margin: 0 0 6px;
        }

        .notif-empty-subtitle {
          font-size: 13.5px;
          color: #64748B;
          margin: 0;
        }

        .dot {
          display: none;
        }

        /* Bottom Nav: Default styling, Dashboard tab is not highlighted */
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
          color: #2563EB;
          font-weight: 700;
        }

        .dashboard-pill-wrap,
        .nav-pill-wrap {
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
        <div class="screen has-notif-header has-al-header">
          
          <!-- Royal Blue Gradient Header Banner -->
          <div class="notif-header-banner al-header-banner">
            <div class="notif-header-content">
              <div class="notif-header-left">
                <div class="notif-back-btn" onclick="handleBackNav()" title="Go Back">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"></line>
                    <polyline points="12 19 5 12 12 5"></polyline>
                  </svg>
                </div>
                <div class="notif-title-group">
                  <h1>Notifications</h1>
                  <p>Stay updated with your requests</p>
                </div>
              </div>

              <!-- 3D Ringing Bell Art with sound waves -->
              <div class="notif-bell-art">
                <svg width="68" height="68" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="bellGrad" x1="26" y1="20" x2="68" y2="65" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stop-color="#FFFFFF"/>
                      <stop offset="50%" stop-color="#F0F6FF"/>
                      <stop offset="85%" stop-color="#C7DEFE"/>
                      <stop offset="100%" stop-color="#A5C9FD"/>
                    </linearGradient>
                    <filter id="bellShadow" x="18" y="16" width="60" height="60" filterUnits="userSpaceOnUse">
                      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#002A80" flood-opacity="0.25"/>
                    </filter>
                  </defs>

                  <path d="M26 28C24 23 20 18 14 14" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.9"/>
                  <path d="M33 21C30 14 24 8 16 4" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>

                  <circle cx="48" cy="67" r="5.5" fill="#2563EB"/>

                  <g filter="url(#bellShadow)">
                    <path d="M48 22C41.5 22 37 27 36 36C35.2 44.5 32 54 26 59C24 60.8 25 64 28 64H68C71 64 72 60.8 70 59C64 54 60.8 44.5 60 36C59 27 54.5 22 48 22Z" fill="url(#bellGrad)"/>
                    <path d="M38 32C38 32 43 25 48 25C53 25 58 32 58 32" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity="0.7"/>
                    <ellipse cx="48" cy="63.5" rx="21" ry="3" fill="#93C5FD" opacity="0.4"/>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <!-- Body Area -->
          <div class="notif-body">
            <!-- Controls Row: Recent Pill & Clear All -->
            <div class="notif-controls-row">
              <div class="notif-recent-pill">
                <svg viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <span>Recent</span>
              </div>
              <button class="notif-clear-btn" id="clear-btn" onclick="clearAllNotifications()" title="Clear all notifications">
                <svg viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
                <span>Clear All</span>
              </button>
            </div>

            <!-- Section Title -->
            <div class="notif-section-title">Recent Notifications</div>

            <!-- Notifications List Container -->
            <div id="notif-container">
              <!-- Card 1: Approved Casual Leave (Green) -->
              <div class="card notif-card type-approved" data-id="1">
                <div class="notif-row">
                  <div class="notif-badge badge-green">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#10B981"/>
                      <path d="M8 12.3l2.6 2.6 5.4-5.4" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                  <div class="notif-text">
                    <p>Your <span class="text-highlight-green">Casual Leave</span> request for Sep 02 has been <span class="text-highlight-green">Approved</span> by Rahul Sharma</p>
                    <div class="notif-time-row">
                      <svg viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>2 hours ago</span>
                    </div>
                  </div>
                  <button class="notif-dismiss-btn close-item-btn" onclick="removeSingleNotif(this)" title="Dismiss">
                    <svg viewBox="0 0 24 24" fill="none">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Card 2: Permission request submitted (Blue) -->
              <div class="card notif-card type-permission" data-id="2">
                <div class="notif-row">
                  <div class="notif-badge badge-blue">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#0066FF"/>
                      <line x1="12" y1="11" x2="12" y2="16" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round"/>
                      <circle cx="12" cy="7.5" r="1.3" fill="#FFFFFF"/>
                    </svg>
                  </div>
                  <div class="notif-text">
                    <p>New <span class="text-highlight-blue">Permission request</span> submitted for review</p>
                    <div class="notif-time-row">
                      <svg viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>5 hours ago</span>
                    </div>
                  </div>
                  <button class="notif-dismiss-btn close-item-btn" onclick="removeSingleNotif(this)" title="Dismiss">
                    <svg viewBox="0 0 24 24" fill="none">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Card 3: Sick Leave Rejected (Red) -->
              <div class="card notif-card type-rejected" data-id="3">
                <div class="notif-row">
                  <div class="notif-badge badge-red">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#EF4444"/>
                      <line x1="8.5" y1="8.5" x2="15.5" y2="15.5" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round"/>
                      <line x1="15.5" y1="8.5" x2="8.5" y2="15.5" stroke="#FFFFFF" stroke-width="2.3" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div class="notif-text">
                    <p>Your <span class="text-highlight-red">Sick Leave</span> request for Sep 15 was <span class="text-highlight-red">Rejected</span>. Reason: Insufficient balance</p>
                    <div class="notif-time-row">
                      <svg viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>1 day ago</span>
                    </div>
                  </div>
                  <button class="notif-dismiss-btn close-item-btn" onclick="removeSingleNotif(this)" title="Dismiss">
                    <svg viewBox="0 0 24 24" fill="none">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Card 4: Holiday Alert (Amber) -->
              <div class="card notif-card type-holiday" data-id="4">
                <div class="notif-row">
                  <div class="notif-badge badge-amber">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="#D97706" stroke="#D97706" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#D97706" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <div class="notif-text">
                    <p><span class="text-highlight-amber">Holiday Alert:</span> Ganesh Chaturthi on Sep 10</p>
                    <div class="notif-time-row">
                      <svg viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>2 days ago</span>
                    </div>
                  </div>
                  <button class="notif-dismiss-btn close-item-btn" onclick="removeSingleNotif(this)" title="Dismiss">
                    <svg viewBox="0 0 24 24" fill="none">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Navigation Bar: Home icon is NOT highlighted, navigates directly to EmployeeDashboard -->
          <div class="bottom-nav">
            <div class="tab nav-tab" id="tab-dashboard" onclick="navigateToDashboard()">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5z"></path>
              </svg>
              <span>Dashboard</span>
            </div>
            <div class="tab nav-tab" id="tab-attendance" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-MyAttendance')}else if(typeof loadScreen==='function'){loadScreen('tpl-MyAttendance')}else if(typeof navTo==='function'){navTo('Attendance')}">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Attendance</span>
            </div>
            <div class="tab nav-apply-btn-wrap" id="tab-apply" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-ApplyLeave')}else if(typeof loadScreen==='function'){loadScreen('tpl-ApplyLeave')}else if(typeof navTo==='function'){navTo('Apply')}">
              <div class="nav-apply-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <span class="nav-apply-label">Apply</span>
            </div>
            <div class="tab nav-tab" id="tab-history" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-LeaveHistory')}else if(typeof loadScreen==='function'){loadScreen('tpl-LeaveHistory')}else if(typeof navTo==='function'){navTo('History')}">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
                <polyline points="12 7 12 12 15 15"></polyline>
              </svg>
              <span>History</span>
            </div>
            <div class="tab nav-tab" id="tab-profile" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-MyProfile')}else if(typeof loadScreen==='function'){loadScreen('tpl-MyProfile')}else if(typeof navTo==='function'){navTo('Profile')}">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Profile</span>
            </div>
          </div>
        </div>
        <script>
          function navigateToDashboard() {
            var parentWin = (window.parent && window.parent.loadScreen) ? window.parent : window;
            if (typeof parentWin.loadScreen === 'function') {
              parentWin.loadScreen('tpl-EmployeeDashboard');
            } else if (typeof loadScreen === 'function') {
              loadScreen('tpl-EmployeeDashboard');
            } else if (typeof navTo === 'function') {
              navTo('EmployeeDashboard');
            } else {
              window.location.href = '../EmployeeDashboard/preview.html';
            }
          }

          function handleBackNav() {
            var parentWin = (window.parent && window.parent.loadScreen) ? window.parent : window;
            if (typeof parentWin.loadScreen === 'function') {
              parentWin.loadScreen('tpl-EmployeeDashboard');
            } else if (typeof loadScreen === 'function') {
              loadScreen('tpl-EmployeeDashboard');
            } else if (typeof navTo === 'function') {
              navTo('EmployeeDashboard');
            } else if (window.history.length > 1) {
              window.history.back();
            } else {
              window.location.href = '../EmployeeDashboard/preview.html';
            }
          }

          function clearAllNotifications() {
            const container = document.getElementById('notif-container');
            if (container) {
              container.innerHTML = \`
                <div class="notif-empty-state">
                  <div class="notif-empty-icon">
                    <svg viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                    <line x1="2" y1="2" x2="22" y2="22"></line>
                    </svg>
                  </div>
                  <div class="notif-empty-title">No Notifications</div>
                  <p class="notif-empty-subtitle">All notifications have been cleared.</p>
                </div>\`;
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
              card.classList.add('fade-out');
              setTimeout(function() {
                card.remove();
                const remaining = document.querySelectorAll('#notif-container .notif-card');
                if (remaining.length === 0) {
                  clearAllNotifications();
                }
              }, 180);
            }
          }
        </script>
      </body>
    </html>
  </template>`;

const targetFiles = [
  path.join(__dirname, '../preview_app.html'),
  path.join(__dirname, '../index.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/preview_app.html'),
  path.join(__dirname, '../EmergereApp/EmergereApp/index.html'),
];

targetFiles.forEach((file) => {
  if (!fs.existsSync(file)) {
    console.log('File not found:', file);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');

  // Replace <template id="tpl-Notifications">...</template>
  const startTag = '<template id="tpl-Notifications">';
  const endTag = '</template>';
  const startIdx = content.indexOf(startTag);
  if (startIdx === -1) {
    console.log('Template tpl-Notifications not found in', file);
    return;
  }
  const endIdx = content.indexOf(endTag, startIdx);
  if (endIdx === -1) {
    console.log('Closing template tag not found in', file);
    return;
  }

  content = content.substring(0, startIdx) + newTplNotifications + content.substring(endIdx + endTag.length);

  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated:', file);
});
