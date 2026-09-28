const fs = require('fs');

const path = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.styles.js';
let content = fs.readFileSync(path, 'utf8');

// Check if cardInputText is already present
if (!content.includes('cardInputText:')) {
  content = content.replace(
    /cardInput:\s*\{[^}]+\},/,
    `cardInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#111827',
    fontWeight: '500',
  },
  cardInputText: {
    fontSize: 14.5,
    color: '#111827',
    fontWeight: '500',
  },
  calendarIconBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },`
  );
}

// Add calendar modal styles if not present
if (!content.includes('calModalOverlay:')) {
  content = content.replace(
    /submitText:\s*\{[^}]+\},?\s*\}\);?/,
    `submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  /* Calendar Modal Styles */
  calModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  calHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  calNavBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calMonthYearText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  calWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  calWeekDayText: {
    width: 36,
    textAlign: 'center',
    fontSize: 12.5,
    fontWeight: '700',
    color: '#64748B',
  },
  calDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calDayCellEmpty: {
    width: '14.28%',
    height: 38,
  },
  calDayCell: {
    width: '14.28%',
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 2,
  },
  calDayCellSelected: {
    backgroundColor: '#0066FF',
    shadowColor: '#0066FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 3,
  },
  calDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  calDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  calCloseBtn: {
    marginTop: 18,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  calCloseBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
});`
  );
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated ApplyPermissionScreen.styles.js');
