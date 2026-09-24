const fs = require('fs');
const path = require('path');

const newTplApplyPermission = `<template id="tpl-ApplyPermission">
    <!DOCTYPE html>
    <html>

    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <title>Apply Permission</title>
      <style>
        :root {
          --perm-primary: #0066FF;
          --perm-primary-dark: #0050EA;
          --perm-bg: #EEF4FB;
          --perm-card-bg: #FFFFFF;
          --perm-border: #E2E8F0;
          --perm-text-main: #111827;
          --perm-text-sub: #64748B;
          --perm-text-muted: #94A3B8;
          --perm-danger: #EF4444;
          --primary: #0066FF;
          --surface: #FFFFFF;
          --text: #111827;
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

        body {
          background: var(--perm-bg) !important;
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .device {
          background: var(--perm-bg) !important;
          position: relative;
          overflow: hidden;
          width: 100%;
          min-height: 100vh;
        }

        .screen {
          background: var(--perm-bg) !important;
          padding-bottom: 96px;
          min-height: 100vh;
          box-sizing: border-box;
          position: relative;
        }

        .screen.has-perm-header {
          padding-top: 0 !important;
        }

        /* Header Gradient Banner - Flush to top with vibrant blue gradient */
        .perm-header-banner {
          background: linear-gradient(135deg, #005CE6 0%, #0066FF 45%, #1877F2 100%);
          padding: 22px 20px 48px 20px;
          margin-top: 0 !important;
          border-top-left-radius: 0 !important;
          border-top-right-radius: 0 !important;
          border-bottom-left-radius: 28px;
          border-bottom-right-radius: 28px;
          position: relative;
          overflow: hidden;
        }

        /* Glowing curved orbs matching Image 2 */
        .perm-header-banner::before {
          content: '';
          position: absolute;
          top: -30px;
          right: -20px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0) 70%);
          pointer-events: none;
        }

        .perm-header-banner::after {
          content: '';
          position: absolute;
          bottom: -35px;
          left: -20px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0) 70%);
          pointer-events: none;
        }

        .perm-header-decor-wave {
          position: absolute;
          top: 10px;
          right: 50px;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0) 75%);
          pointer-events: none;
        }

        /* Back Button */
        .perm-back-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.22);
          border: 1px solid rgba(255, 255, 255, 0.35);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          margin-bottom: 14px;
          transition: transform 0.2s ease, background 0.2s ease;
          position: relative;
          z-index: 3;
        }

        .perm-back-btn:hover {
          background: rgba(255, 255, 255, 0.32);
          transform: scale(1.05);
        }

        .perm-header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          position: relative;
          z-index: 2;
        }

        .perm-header-left {
          flex: 1;
          padding-right: 10px;
        }

        .perm-header-title {
          font-size: 22px;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
          letter-spacing: -0.3px;
          line-height: 1.2;
        }

        .perm-header-subtitle {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.88);
          margin: 5px 0 0 0;
          font-weight: 400;
        }

        /* 3D Calendar Illustration Badge */
        .perm-header-badge {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          margin-top: -32px;
          flex-shrink: 0;
        }

        .perm-calendar-svg {
          filter: drop-shadow(0 10px 18px rgba(0, 35, 120, 0.28));
          display: block;
        }

        /* Main White Form Card Container */
        .perm-form-card {
          margin: -24px 14px 20px 14px;
          background: #FFFFFF;
          border-radius: 26px;
          padding: 22px 16px 24px 16px;
          box-shadow: 0 10px 30px rgba(15, 30, 80, 0.07);
          border: 1px solid rgba(226, 232, 240, 0.8);
          position: relative;
          z-index: 2;
        }

        .perm-field {
          margin-bottom: 18px;
        }

        .perm-label {
          display: block;
          font-size: 13.5px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .perm-required {
          color: var(--perm-danger);
          margin-left: 2px;
          font-weight: 700;
        }

        /* Input / Select Row Card */
        .perm-input-card {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 52px;
          padding: 0 16px;
          border: 1.5px solid var(--perm-border);
          border-radius: 14px;
          background: #FFFFFF;
          cursor: pointer;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .perm-input-card:hover {
          border-color: #93C5FD;
        }

        .perm-input-card:focus-within {
          border-color: var(--perm-primary);
          box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
        }

        .perm-card-value {
          font-size: 14.5px;
          font-weight: 500;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
        }

        .perm-card-icon {
          color: #111827;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          pointer-events: none;
        }

        /* Native invisible overlays for interactive date & select */
        .perm-native-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          z-index: 2;
          font-size: 16px;
        }

        /* Reason Textarea Card */
        .perm-textarea-card {
          border: 1.5px solid var(--perm-border);
          border-radius: 14px;
          background: #FFFFFF;
          padding: 14px 16px 28px 16px;
          position: relative;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .perm-textarea-card:focus-within {
          border-color: var(--perm-primary);
          box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.1);
        }

        .perm-textarea {
          width: 100%;
          border: none;
          background: transparent;
          padding: 0;
          font-size: 14.5px;
          color: #111827;
          font-family: inherit;
          resize: vertical;
          min-height: 72px;
          line-height: 1.45;
          box-sizing: border-box;
        }

        .perm-textarea:focus {
          outline: none;
        }

        .perm-textarea::placeholder {
          color: var(--perm-text-muted);
          font-weight: 400;
        }

        .perm-char-counter {
          position: absolute;
          right: 22px;
          bottom: 8px;
          font-size: 12px;
          color: var(--perm-text-muted);
          font-weight: 500;
          pointer-events: none;
        }

        .perm-resize-grip {
          position: absolute;
          right: 6px;
          bottom: 6px;
          width: 10px;
          height: 10px;
          opacity: 0.35;
          pointer-events: none;
        }

        /* Submit Request Button */
        .perm-submit-btn {
          width: 100%;
          height: 52px;
          background: linear-gradient(135deg, #0066FF 0%, #0050EA 100%);
          border: none;
          border-radius: 16px;
          color: #FFFFFF;
          font-size: 16px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(0, 102, 255, 0.38);
          transition: all 0.2s ease;
          font-family: inherit;
          margin-top: 6px;
        }

        .perm-submit-btn:hover {
          background: linear-gradient(135deg, #005AE0 0%, #0044CC 100%);
          box-shadow: 0 10px 28px rgba(0, 102, 255, 0.48);
          transform: translateY(-1px);
        }

        .perm-submit-btn:active {
          transform: translateY(0);
          box-shadow: 0 4px 12px rgba(0, 102, 255, 0.3);
        }

        /* Bottom Nav */
        .bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #FFFFFF;
          border-top: 1px solid #E2E8F0;
          display: flex;
          align-items: flex-end;
          padding: 8px 0 16px;
          height: 68px;
          box-sizing: border-box;
          z-index: 10;
        }

        .bottom-nav .tab {
          flex: 1;
          text-align: center;
          font-size: 11px;
          font-weight: 500;
          color: #94A3B8;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          cursor: pointer;
          transition: color 0.15s ease;
          text-decoration: none;
          position: relative;
        }

        .bottom-nav .tab.active {
          color: #2563EB;
          font-weight: 700;
        }

        .nav-apply-btn-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: -24px;
        }

        .nav-apply-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #2563EB;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35);
          border: 4px solid #FFFFFF;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          margin-bottom: 2px;
        }

        .nav-apply-btn-wrap:hover .nav-apply-circle {
          transform: scale(1.06);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.45);
        }

        .active-dot-indicator {
          width: 4px;
          height: 4px;
          background: #2563EB;
          border-radius: 50%;
          position: absolute;
          bottom: -7px;
        }

        /* Success Popup Modal */
        .success-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.65);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 9999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s ease;
          backdrop-filter: blur(4px);
        }

        .success-modal-overlay.show {
          opacity: 1;
          pointer-events: auto;
        }

        .success-modal-card {
          background: #FFFFFF;
          border-radius: 24px;
          padding: 32px 24px;
          width: 100%;
          max-width: 320px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          transform: scale(0.9);
          transition: transform 0.25s ease;
        }

        .success-modal-overlay.show .success-modal-card {
          transform: scale(1);
        }

        .success-modal-icon-wrap {
          width: 64px;
          height: 64px;
          border-radius: 32px;
          background: #E3F8EE;
          border: 6px solid #F0FDF4;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: #1FAE6E;
        }

        .success-modal-title {
          font-size: 20px;
          font-weight: 800;
          color: #111827;
          margin: 0 0 8px;
        }

        .success-modal-msg {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.45;
          margin: 0 0 24px;
        }

        .success-modal-btn {
          width: 100%;
          background: #0066FF;
          color: #FFFFFF;
          border: none;
          border-radius: 14px;
          padding: 13px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 102, 255, 0.35);
          transition: all 0.2s ease;
        }

        .success-modal-btn:hover {
          background: #0050EA;
        }
      </style>
    </head>

    <body>
      <div class="device">
        <div class="screen has-perm-header">
          <!-- Header Gradient Banner - Flush to top with vibrant blue gradient -->
          <div class="perm-header-banner">
            <div class="perm-header-decor-wave"></div>
            <button class="perm-back-btn" onclick="handleBackNav()" title="Back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <div class="perm-header-content">
              <div class="perm-header-left">
                <h1 class="perm-header-title">Apply Permission</h1>
                <p class="perm-header-subtitle">Request short duration permission</p>
              </div>
              <!-- 3D Calendar Illustration with Clock Badge -->
              <div class="perm-header-badge">
                <svg class="perm-calendar-svg" width="76" height="76" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <!-- Calendar Card Body -->
                  <rect x="14" y="20" width="62" height="56" rx="14" fill="#FFFFFF"/>
                  <!-- Blue Top Header Bar -->
                  <path d="M14 34C14 26.268 20.268 20 28 20H62C69.732 20 76 26.268 76 34V36H14V34Z" fill="#3B82F6"/>
                  <!-- Binder Rings -->
                  <rect x="24" y="13" width="5.5" height="13" rx="2.75" fill="#BFDBFE"/>
                  <rect x="42" y="13" width="5.5" height="13" rx="2.75" fill="#BFDBFE"/>
                  <rect x="60" y="13" width="5.5" height="13" rx="2.75" fill="#BFDBFE"/>
                  <!-- Date Grid Squares -->
                  <!-- Row 1 -->
                  <rect x="22" y="43" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
                  <rect x="35" y="43" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
                  <rect x="48" y="43" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
                  <rect x="61" y="43" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
                  <!-- Row 2 -->
                  <rect x="22" y="55" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
                  <rect x="35" y="55" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
                  <rect x="48" y="55" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
                  <rect x="61" y="55" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
                  <!-- Row 3 -->
                  <rect x="22" y="65" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
                  <rect x="35" y="65" width="7.5" height="7.5" rx="2" fill="#BFDBFE" fill-opacity="0.85"/>
                  <!-- Circular Clock / Timer Badge -->
                  <circle cx="70" cy="70" r="19" fill="#0066FF" stroke="#FFFFFF" stroke-width="3.5"/>
                  <!-- Clock hands -->
                  <circle cx="70" cy="70" r="12" stroke="#FFFFFF" stroke-width="1.8" stroke-opacity="0.9" fill="none"/>
                  <path d="M70 63V70L75 73" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Main White Form Card Container -->
          <div class="perm-form-card">
            <!-- Date * -->
            <div class="perm-field">
              <label class="perm-label">Date <span class="perm-required">*</span></label>
              <div class="perm-input-card" id="perm-date-card">
                <span class="perm-card-value" id="perm-date-display">09/04/2026</span>
                <div class="perm-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
                <input type="date" id="perm-date-input" class="perm-native-overlay" value="2026-09-04" onchange="onPermDateChange(this.value)" />
              </div>
            </div>

            <!-- Permission Type * -->
            <div class="perm-field">
              <label class="perm-label">Permission Type <span class="perm-required">*</span></label>
              <div class="perm-input-card" id="perm-type-card">
                <span class="perm-card-value" id="perm-type-display">Early Going</span>
                <div class="perm-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <select id="perm-type-select" class="perm-native-overlay" onchange="onPermTypeChange(this.value)">
                  <option value="Early Going" selected>Early Going</option>
                  <option value="Late Coming">Late Coming</option>
                  <option value="Personal Work">Personal Work</option>
                  <option value="Official Work">Official Work</option>
                </select>
              </div>
            </div>

            <!-- Duration * -->
            <div class="perm-field">
              <label class="perm-label">Duration <span class="perm-required">*</span></label>
              <div class="perm-input-card" id="perm-duration-card">
                <span class="perm-card-value" id="perm-duration-display">2 Hours</span>
                <div class="perm-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <!-- Hidden text input to preserve backward-compatibility with scripts reading perm-duration-input -->
                <input type="hidden" id="perm-duration-input" value="2 Hours" />
                <select id="perm-duration-select" class="perm-native-overlay" onchange="onPermDurationSelect(this.value)">
                  <option value="1 Hour">1 Hour</option>
                  <option value="2 Hours" selected>2 Hours</option>
                  <option value="3 Hours">3 Hours</option>
                  <option value="4 Hours">4 Hours</option>
                  <option value="5 Hours">5 Hours</option>
                </select>
              </div>
            </div>

            <!-- Reason * -->
            <div class="perm-field">
              <label class="perm-label">Reason <span class="perm-required">*</span></label>
              <div class="perm-textarea-card">
                <textarea id="perm-reason-text" class="perm-textarea" rows="4" maxlength="500" placeholder="E.g., Medical checkup, personal work..." oninput="updatePermCharCount(this)"></textarea>
                <div class="perm-char-counter" id="perm-char-counter">0/500</div>
                <!-- Diagonal resize grip svg icon -->
                <svg class="perm-resize-grip" viewBox="0 0 10 10" fill="none" stroke="#94A3B8" stroke-width="1.5">
                  <line x1="8" y1="2" x2="2" y2="8"></line>
                  <line x1="9" y1="5" x2="5" y2="9"></line>
                </svg>
              </div>
            </div>

            <!-- Approving Manager (No red asterisk, matches Image 2) -->
            <div class="perm-field">
              <label class="perm-label">Approving Manager</label>
              <div class="perm-input-card" id="perm-manager-card">
                <span class="perm-card-value" id="perm-manager-display">Vishnu (Reporting Manager)</span>
                <div class="perm-card-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                <select id="perm-manager-select" class="perm-native-overlay" onchange="onPermManagerChange(this.value)">
                  <option value="Vishnu (Reporting Manager)" selected>Vishnu (Reporting Manager)</option>
                  <option value="Ram (Reporting Manager)">Ram (Reporting Manager)</option>
                  <option value="Rahul (Reporting Manager)">Rahul (Reporting Manager)</option>
                </select>
              </div>
            </div>

            <!-- Submit Request Button with Paper Airplane Icon -->
            <button class="perm-submit-btn" id="perm-submit-btn" onclick="handleApplyPermissionSubmit()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              <span>Submit Request</span>
            </button>
          </div>

          <!-- Bottom Navigation Bar -->
          <div class="bottom-nav">
            <div class="tab nav-tab" id="tab-dashboard" onclick="if(window.parent&&window.parent.loadScreen){window.parent.loadScreen('tpl-EmployeeDashboard')}else if(typeof loadScreen==='function'){loadScreen('tpl-EmployeeDashboard')}else if(typeof navTo==='function'){navTo('Dashboard')}">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
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
            <div class="tab nav-apply-btn-wrap active" id="tab-apply">
              <div class="nav-apply-circle">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </div>
              <span class="nav-apply-label" style="color: #2563EB; font-weight: 700;">Apply</span>
              <span class="active-dot-indicator"></span>
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

          <!-- Success Popup Modal -->
          <div class="success-modal-overlay" id="perm-success-modal" onclick="if(event.target===this)closePermSuccessModal()">
            <div class="success-modal-card">
              <div class="success-modal-icon-wrap">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 class="success-modal-title">Request Submitted!</h2>
              <p class="success-modal-msg">Your permission request has been submitted successfully.</p>
              <button class="success-modal-btn" onclick="closePermSuccessModal()">Done</button>
            </div>
          </div>
        </div>
      </div>

      <script>
        function handleBackNav() {
          var parentWin = window.parent || window;
          if (parentWin.loadScreen) {
            parentWin.loadScreen('tpl-EmployeeDashboard');
          } else if (typeof loadScreen === 'function') {
            loadScreen('tpl-EmployeeDashboard');
          } else {
            location.href = '../EmployeeDashboard/preview.html';
          }
        }
        window.handleBackNav = handleBackNav;

        function onPermDateChange(val) {
          if (!val) return;
          var parts = val.split('-');
          if (parts.length === 3) {
            var formatted = parts[1] + '/' + parts[2] + '/' + parts[0];
            var displayEl = document.getElementById('perm-date-display');
            if (displayEl) displayEl.textContent = formatted;
          }
          if (typeof calcPermDuration === 'function') calcPermDuration();
        }
        window.onPermDateChange = onPermDateChange;

        function onPermTypeChange(val) {
          var displayEl = document.getElementById('perm-type-display');
          if (displayEl) displayEl.textContent = val;
        }
        window.onPermTypeChange = onPermTypeChange;

        function onPermDurationSelect(val) {
          var displayEl = document.getElementById('perm-duration-display');
          if (displayEl) displayEl.textContent = val;
          var inputEl = document.getElementById('perm-duration-input');
          if (inputEl) inputEl.value = val;
        }
        window.onPermDurationSelect = onPermDurationSelect;

        function onPermManagerChange(val) {
          var displayEl = document.getElementById('perm-manager-display');
          if (displayEl) displayEl.textContent = val;
        }
        window.onPermManagerChange = onPermManagerChange;

        function updatePermCharCount(el) {
          var counter = document.getElementById('perm-char-counter');
          if (counter && el) {
            counter.textContent = el.value.length + '/500';
          }
        }
        window.updatePermCharCount = updatePermCharCount;

        function calcPermDuration() {
          var durationInput = document.getElementById('perm-duration-input');
          var durationDisplay = document.getElementById('perm-duration-display');
          var durationSelect = document.getElementById('perm-duration-select');
          var startInput = document.getElementById('perm-start-time');
          var endInput = document.getElementById('perm-end-time');
          if (startInput && endInput && startInput.value && endInput.value) {
            var sParts = startInput.value.split(':').map(Number);
            var eParts = endInput.value.split(':').map(Number);
            var diff = (eParts[0] * 60 + eParts[1]) - (sParts[0] * 60 + sParts[1]);
            if (diff < 0) diff += 24 * 60;
            var hours = Math.floor(diff / 60);
            var mins = diff % 60;
            var text = '';
            if (hours > 0 && mins > 0) text = hours + ' Hr ' + mins + ' Mins';
            else if (hours > 0) text = hours + ' Hour' + (hours > 1 ? 's' : '');
            else text = mins + ' Mins';
            if (durationInput) durationInput.value = text;
            if (durationDisplay) durationDisplay.textContent = text;
          } else if (durationInput && !durationInput.value) {
            durationInput.value = '2 Hours';
            if (durationDisplay) durationDisplay.textContent = '2 Hours';
            if (durationSelect) durationSelect.value = '2 Hours';
          }
        }
        window.calcPermDuration = calcPermDuration;

        function handleApplyPermissionSubmit() {
          var permDateInput  = document.getElementById('perm-date-input');
          var permTypeSelect = document.getElementById('perm-type-select');
          var durationInput  = document.getElementById('perm-duration-input');
          var reasonText     = document.getElementById('perm-reason-text');
          var permManagerEl  = document.getElementById('perm-manager-select');

          var rawDate   = permDateInput ? permDateInput.value : '2026-09-04';
          var months    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          var dp = rawDate.split('-');
          var fmtDate = dp.length === 3 ? (dp[2] + '-' + (months[parseInt(dp[1],10)-1]||'Sep') + '-' + dp[0]) : rawDate;

          var pType     = permTypeSelect ? permTypeSelect.value : 'Early Going';
          var pDuration = durationInput  ? (durationInput.value.trim() || '2 Hours') : '2 Hours';
          var pReason   = reasonText     ? (reasonText.value.trim()   || 'Personal work / checkup') : 'Personal work / checkup';

          var newId = 'perm-' + Date.now();
          var parentWin = window.parent || window;
          var permProf = parentWin.USER_PROFILE || {};
          var permEmpName = permProf.name || (parentWin.AUTH_USER && parentWin.AUTH_USER.name) || 'Sneha Reddy';
          var permEmpEmail = (permProf.email || (parentWin.AUTH_USER && parentWin.AUTH_USER.email) || 'sneha@gmail.com').toLowerCase();
          var permEmpInitials = permProf.initials || (permEmpName.split(' ').map(function(w){return w[0];}).join('').toUpperCase().slice(0,2)) || 'SR';
          var permEmpId = permProf.employeeId || (parentWin.AUTH_USER && parentWin.AUTH_USER.empId) || 'EMP-2024-0103';
          var permEmpRole = permProf.role || (parentWin.AUTH_USER && parentWin.AUTH_USER.jobTitle) || 'UI/UX Designer';
          var defPermMgr = permProf.reportingManager ? (permProf.reportingManager.indexOf('(') !== -1 ? permProf.reportingManager : permProf.reportingManager.split(' ')[0] + ' (Reporting Manager)') : 'Vishnu (Reporting Manager)';
          var pManager = permManagerEl ? permManagerEl.value : defPermMgr;

          var entry = {
            id: newId,
            type: pType,
            leaveType: pType,
            permissionType: pType,
            date: fmtDate,
            fromDate: fmtDate,
            toDate: fmtDate,
            duration: pDuration,
            daysText: pDuration,
            reason: pReason,
            status: 'pending',
            isPermission: true,
            employeeName: permEmpName,
            employeeEmail: permEmpEmail,
            employeeInitials: permEmpInitials,
            employeeId: permEmpId,
            employeeRole: permEmpRole,
            approvingManager: pManager,
            createdAt: Date.now()
          };
          if (!parentWin.PERM_STATE) parentWin.PERM_STATE = [];
          var existsPerm = parentWin.PERM_STATE.some(function(p){ return p.type === pType && p.date === fmtDate && p.reason === pReason; });
          if (!existsPerm) {
            parentWin.PERM_STATE.unshift(entry);
          }

          if (!parentWin.EMP_LEAVE_REQUESTS) parentWin.EMP_LEAVE_REQUESTS = [];
          var existsEmpReq = parentWin.EMP_LEAVE_REQUESTS.some(function(r){ return r.leaveType === pType && r.fromDate === fmtDate && r.reason === pReason; });
          if (!existsEmpReq) {
            parentWin.EMP_LEAVE_REQUESTS.unshift({ id: newId, leaveType: pType, fromDate: fmtDate, daysText: pDuration, reason: pReason, isPermission: true, employeeName: permEmpName, employeeEmail: permEmpEmail, employeeId: permEmpId, employeeRole: permEmpRole, status: 'pending' });
          }

          var permPersonObj = {
            id: newId,
            isPermission: true,
            type: pType,
            leaveType: pType,
            permissionType: pType,
            name: permEmpName,
            initials: permEmpInitials,
            role: permProf.role || 'Senior Software Engineer',
            empId: permEmpId,
            employeeId: permEmpId,
            employeeName: permEmpName,
            employeeInitials: permEmpInitials,
            status: 'pending',
            date: fmtDate,
            fromDate: fmtDate,
            toDate: fmtDate,
            duration: pDuration,
            totalDays: pDuration,
            reason: pReason,
            approvingManager: pManager,
            contact: pManager,
            emergencyContact: pManager,
            subtitle: pType + ' Application',
            appliedPath: permEmpName.split(' ')[0] + ' (Applied)',
            title: pType + ' (' + pDuration + ')',
            subtitleReq: fmtDate + ' • ' + pReason
          };
          if (!parentWin.PERSON_DATA) parentWin.PERSON_DATA = {};
          parentWin.PERSON_DATA[newId] = permPersonObj;
          parentWin.PERSON_DATA['priya'] = permPersonObj;
          parentWin.LATEST_REQUEST = permPersonObj;
          parentWin.LATEST_PERMISSION_REQUEST = permPersonObj;
          parentWin.SELECTED_PERSON = newId;

          var modal = document.getElementById('perm-success-modal');
          if (modal) {
            modal.classList.add('show');
          } else if (parentWin.loadScreen) {
            parentWin.loadScreen('tpl-EmployeeDashboard');
          }
        }
        window.handleApplyPermissionSubmit = handleApplyPermissionSubmit;

        function closePermSuccessModal() {
          var modal = document.getElementById('perm-success-modal');
          if (modal) modal.classList.remove('show');
          var parentWin = window.parent || window;
          if (parentWin.loadScreen) {
            parentWin.loadScreen('tpl-EmployeeDashboard');
          } else if (typeof loadScreen === 'function') {
            loadScreen('tpl-EmployeeDashboard');
          }
        }
        window.closePermSuccessModal = closePermSuccessModal;

        // Auto sync and prefill
        setInterval(function() {
          var mEl = document.getElementById('perm-manager-select');
          var mDisp = document.getElementById('perm-manager-display');
          if (mEl && mDisp && mDisp.textContent !== mEl.value) {
            mDisp.textContent = mEl.value;
          }
          var dInput = document.getElementById('perm-duration-input');
          var dDisp = document.getElementById('perm-duration-display');
          var dSelect = document.getElementById('perm-duration-select');
          if (dSelect && dDisp && dDisp.textContent !== dSelect.value) {
            dDisp.textContent = dSelect.value;
          }
        }, 300);
      </script>
    </body>

    </html>
  </template>`;

const targetFiles = [
  'EmergereApp/EmergereApp/preview_app.html',
  'EmergereApp/EmergereApp/index.html',
  'preview_app.html',
  'index.html'
];

const regex = /<template\s+id=["']tpl-ApplyPermission["']>[\s\S]*?<\/template>/i;

for (const relPath of targetFiles) {
  if (fs.existsSync(relPath)) {
    let content = fs.readFileSync(relPath, 'utf8');
    if (regex.test(content)) {
      content = content.replace(regex, newTplApplyPermission);
      
      // Also update the pre-fill code in preview_app / index so perm-manager-display is updated immediately
      const targetPrefill = "if (!permMatched && permOpts.length > 0) {\\s*permManagerEl.value = permOpts\\[0\\]\\.value;\\s*}";
      const replacementPrefill = "if (!permMatched && permOpts.length > 0) {\\n                permManagerEl.value = permOpts[0].value;\\n              }\\n              var pDisp = doc.getElementById('perm-manager-display');\\n              if (pDisp) pDisp.textContent = permManagerEl.value;";
      const prefillRegex = new RegExp(targetPrefill, 'g');
      content = content.replace(prefillRegex, replacementPrefill);
      
      fs.writeFileSync(relPath, content, 'utf8');
      console.log('Successfully updated:', relPath);
    } else {
      console.warn('Regex did not match in:', relPath);
    }
  } else {
    console.warn('File does not exist:', relPath);
  }
}
