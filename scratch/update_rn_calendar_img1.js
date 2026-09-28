const fs = require('fs');

// 1. Update ApplyPermissionScreen.jsx
const jsxPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.jsx';
let jsx = fs.readFileSync(jsxPath, 'utf8');

// Replace date selection handlers & logic
const oldLogicTarget = `  const handleSelectDate = (day) => {
    const mm = String(calendarMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const yyyy = calendarYear;
    setDate(\`\${mm}/\${dd}/\${yyyy}\`);
    setShowCalendarModal(false);
  };

  const parsedDateParts = date.split('/');
  const selectedMonth = parsedDateParts.length === 3 ? parseInt(parsedDateParts[0], 10) - 1 : 8;
  const selectedDay = parsedDateParts.length === 3 ? parseInt(parsedDateParts[1], 10) : 4;
  const selectedYear = parsedDateParts.length === 3 ? parseInt(parsedDateParts[2], 10) : 2026;

  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();`;

const newLogic = `  const handleSelectDate = (day, m = calendarMonth, y = calendarYear) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const yyyy = y;
    setDate(\`\${mm}/\${dd}/\${yyyy}\`);
    setCalendarMonth(m);
    setCalendarYear(y);
    setShowCalendarModal(false);
  };

  const handleClearDate = () => {
    setDate('MM/DD/YYYY');
    setShowCalendarModal(false);
  };

  const handleTodayDate = () => {
    const todayDay = 28;
    const todayMonth = 8; // September (0-indexed)
    const todayYear = 2026;
    const mm = String(todayMonth + 1).padStart(2, '0');
    const dd = String(todayDay).padStart(2, '0');
    setDate(\`\${mm}/\${dd}/\${todayYear}\`);
    setCalendarMonth(todayMonth);
    setCalendarYear(todayYear);
    setShowCalendarModal(false);
  };

  const parsedDateParts = date && date.includes('/') ? date.split('/') : [];
  const selectedMonth = parsedDateParts.length === 3 ? parseInt(parsedDateParts[0], 10) - 1 : -1;
  const selectedDay = parsedDateParts.length === 3 ? parseInt(parsedDateParts[1], 10) : -1;
  const selectedYear = parsedDateParts.length === 3 ? parseInt(parsedDateParts[2], 10) : -1;

  const todayDay = 28;
  const todayMonth = 8;
  const todayYear = 2026;

  // Generate 42 calendar cells (6 rows x 7 cols) for exact Image 1 design
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();
  const daysInCurrentMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(calendarYear, calendarMonth, 0).getDate();

  const calendarCells = [];
  // 1. Prev month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = calendarMonth === 0 ? 11 : calendarMonth - 1;
    const y = calendarMonth === 0 ? calendarYear - 1 : calendarYear;
    calendarCells.push({ day: d, month: m, year: y, isCurrentMonth: false });
  }
  // 2. Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    calendarCells.push({ day: d, month: calendarMonth, year: calendarYear, isCurrentMonth: true });
  }
  // 3. Next month leading days (fill up to 42)
  const remainingCells = 42 - calendarCells.length;
  for (let d = 1; d <= remainingCells; d++) {
    const m = calendarMonth === 11 ? 0 : calendarMonth + 1;
    const y = calendarMonth === 11 ? calendarYear + 1 : calendarYear;
    calendarCells.push({ day: d, month: m, year: y, isCurrentMonth: false });
  }`;

jsx = jsx.replace(oldLogicTarget, newLogic);

// Replace Modal markup with Image 1 style modal
const oldModalRegex = /\{\/\* Calendar Date Picker Modal \*\/\}[\s\S]*?<\/Modal>/;
const newModal = `{/* Calendar Date Picker Modal (Image 1 Design) */}
      <Modal
        visible={showCalendarModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalendarModal(false)}
      >
        <TouchableOpacity
          style={styles.calModalOverlay}
          activeOpacity={1}
          onPress={() => setShowCalendarModal(false)}
        >
          <TouchableOpacity
            style={styles.calModalCard}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Header: Month Year with Dropdown caret on left, Up and Down arrows on right */}
            <View style={styles.calHeader}>
              <View style={styles.calMonthSelector}>
                <Text style={styles.calMonthYearText}>
                  {MONTH_NAMES[calendarMonth]} {calendarYear}
                </Text>
                <Feather name="chevron-down" size={14} color="#111827" style={styles.calCaret} />
              </View>

              <View style={styles.calNavArrows}>
                <TouchableOpacity
                  style={styles.calArrowBtn}
                  onPress={() => {
                    if (calendarMonth === 0) {
                      setCalendarMonth(11);
                      setCalendarYear(calendarYear - 1);
                    } else {
                      setCalendarMonth(calendarMonth - 1);
                    }
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel="Previous month"
                >
                  <Feather name="arrow-up" size={18} color="#111827" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.calArrowBtn}
                  onPress={() => {
                    if (calendarMonth === 11) {
                      setCalendarMonth(0);
                      setCalendarYear(calendarYear + 1);
                    } else {
                      setCalendarMonth(calendarMonth + 1);
                    }
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityLabel="Next month"
                >
                  <Feather name="arrow-down" size={18} color="#111827" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Weekday headers */}
            <View style={styles.calWeekRow}>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((wd, i) => (
                <Text key={i} style={styles.calWeekDayText}>{wd}</Text>
              ))}
            </View>

            {/* 42-Cell Days Grid */}
            <View style={styles.calDaysGrid}>
              {calendarCells.map((cell, idx) => {
                const isSelected =
                  cell.month === selectedMonth &&
                  cell.year === selectedYear &&
                  cell.day === selectedDay;

                const isToday =
                  cell.month === todayMonth &&
                  cell.year === todayYear &&
                  cell.day === todayDay;

                return (
                  <TouchableOpacity
                    key={\`cell-\${idx}\`}
                    style={[
                      styles.calDayCell,
                      isSelected && styles.calDayCellSelected,
                      !isSelected && isToday && styles.calDayCellToday,
                    ]}
                    onPress={() => handleSelectDate(cell.day, cell.month, cell.year)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.calDayText,
                        !cell.isCurrentMonth && styles.calDayTextMuted,
                        isSelected && styles.calDayTextSelected,
                        !isSelected && isToday && styles.calDayTextToday,
                      ]}
                    >
                      {cell.day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Footer with Clear and Today */}
            <View style={styles.calFooter}>
              <TouchableOpacity onPress={handleClearDate} activeOpacity={0.7}>
                <Text style={styles.calFooterLink}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleTodayDate} activeOpacity={0.7}>
                <Text style={styles.calFooterLink}>Today</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>`;

jsx = jsx.replace(oldModalRegex, newModal);
fs.writeFileSync(jsxPath, jsx, 'utf8');
console.log('Updated ApplyPermissionScreen.jsx');

// 2. Update ApplyPermissionScreen.styles.js
const stylesPath = 'EmergereApp/EmergereApp/src/screens/ApplyPermission/ApplyPermissionScreen.styles.js';
let stylesContent = fs.readFileSync(stylesPath, 'utf8');

const oldStylesRegex = /\/\* Calendar Modal Styles \*\/[\s\S]*?\}\);?/;
const newStyles = `/* Calendar Modal Styles (Image 1 Design) */
  calModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  calModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    width: '100%',
    maxWidth: 290,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  calHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 2,
  },
  calMonthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  calMonthYearText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
  },
  calCaret: {
    marginTop: 1,
    marginLeft: 2,
  },
  calNavArrows: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calArrowBtn: {
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calWeekDayText: {
    width: 34,
    textAlign: 'center',
    fontSize: 13.5,
    fontWeight: '600',
    color: '#111827',
  },
  calDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 2,
  },
  calDayCell: {
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    marginVertical: 1,
  },
  calDayCellSelected: {
    backgroundColor: '#0066FF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 2,
  },
  calDayCellToday: {
    borderWidth: 1,
    borderColor: '#71717A',
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  calDayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  calDayTextMuted: {
    color: '#94A3B8',
  },
  calDayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  calDayTextToday: {
    color: '#111827',
    fontWeight: '600',
  },
  calFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 4,
    paddingHorizontal: 6,
  },
  calFooterLink: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0066FF',
  },
});`;

stylesContent = stylesContent.replace(oldStylesRegex, newStyles);
fs.writeFileSync(stylesPath, stylesContent, 'utf8');
console.log('Updated ApplyPermissionScreen.styles.js');
