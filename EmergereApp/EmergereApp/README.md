# Emergere — Leave & Attendance Management App

A React Native (Expo) conversion of the Emergere HRMS mobile UI: employee
attendance, leave/permission requests, and manager approval workflows.

## Getting started (React Native / Expo)

```bash
npm install
npm start        # then press 'i' for iOS simulator, 'a' for Android, 'w' for web
```

`App.js` wires all 15 screens together with a minimal built-in navigator
(no external nav library required to run this out of the box). To use
React Navigation instead, install `@react-navigation/native` +
`@react-navigation/native-stack` and swap the `SCREENS` map in `App.js`
for a `<Stack.Navigator>` — every screen already calls
`navigation.navigate('ScreenName')` / `navigation.goBack()`, so no screen
code needs to change.

## Folder structure

```
EmergereApp/
├── App.js                        # root navigator
├── package.json
├── assets/
│   └── emergere-logo.png
├── preview/                      # shared assets for the standalone HTML previews
│   ├── base.css                  # device frame + design tokens (colors, cards, badges, nav)
│   └── shared.js                 # tiny helpers (tab switching, password toggle)
└── src/
    ├── theme/
    │   └── theme.js               # colors, spacing, radius, typography tokens
    ├── components/                # shared, reusable UI building blocks
    │   ├── Avatar.jsx
    │   ├── BottomNavBar.jsx
    │   ├── Card.jsx
    │   ├── PillTabs.jsx
    │   ├── ScreenHeader.jsx
    │   └── StatusBadge.jsx
    └── screens/
        ├── Login/
        ├── EmployeeDashboard/
        ├── MyAttendance/
        ├── ApplyLeave/
        ├── ApplyPermission/
        ├── LeaveBalance/
        ├── LeaveHistory/
        ├── HolidayCalendar/
        ├── Notifications/
        ├── MyProfile/
        ├── ManagerDashboard/
        ├── TeamAttendance/
        ├── LeaveApprovals/
        ├── LeaveApprovalDetail/
        └── PermissionApprovals/
```

## Each screen folder contains

| File | Purpose |
|---|---|
| `<Screen>.jsx` | The real React Native component (View/Text/ScrollView/etc.) |
| `<Screen>.styles.js` | `StyleSheet.create` styles for that screen |
| `index.js` | Re-export so the screen can be imported as `./screens/ScreenName` |
| `preview.html` | Standalone browser preview (device-frame mockup) of the screen |
| `preview.css` | Screen-specific CSS for the preview (imports shared `preview/base.css`) |
| `preview.js` | Small JS for the preview's interactive bits (tab switching, etc.) |

The `preview.html` files are **not** part of the React Native app — they
exist so the visual design can be checked instantly in any browser
without running Metro/Expo. Open any `preview.html` file directly to see
that screen rendered as a phone mockup.

## Design tokens

All colors, spacing, and radii live in `src/theme/theme.js` (RN) and are
mirrored as CSS variables in `preview/base.css` (web), so the two stay
visually in sync:

- Primary blue: `#2F6BFF`
- Success green / Danger red / Warning amber / Purple accent
- Background `#F5F7FA`, Surface (cards) `#FFFFFF`
- Login screen uses a dark navy background `#1B2333`

## Screens implemented (15)

1. Login
2. Employee Dashboard
3. My Attendance
4. Apply Leave
5. Apply Permission
6. Leave Balance
7. Leave & Permission History ("My Requests")
8. Holiday Calendar
9. Notifications
10. My Profile
11. Manager Dashboard ("Manager Hub")
12. Team Attendance
13. Leave Approvals
14. Leave Approval Detail
15. Permission Approvals

## Notes / next steps for a production build

- Replace the in-memory `App.js` navigator with **React Navigation** for
  proper stack/tab transitions, deep linking, and back-gesture support.
- Wire the demo arrays at the top of each screen (e.g. `LEAVE_BALANCES`,
  `PENDING`, `MEMBERS`) up to your real API/data layer.
- Add form validation and date/time pickers (`@react-native-community/datetimepicker`)
  to Apply Leave / Apply Permission.
- Add authentication state handling around the Login screen.
