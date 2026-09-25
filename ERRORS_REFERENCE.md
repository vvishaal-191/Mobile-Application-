# Runtime Errors Reference & Resolution Log

This document records runtime errors detected during local application inspection and testing, detailing their symptoms, root cause, and applied fixes.

---

## 1. SVG `<path>` Attribute `d` Syntax Error

### Console Error Logs (13 Occurrences)

```text
▼ 13  Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".
 ⊗    Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".  about:srcdoc:578
 ⊗ ▶  Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".
 ⊗ ▶  Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".
 ⊗ ▶  Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".
 ⊗ ▶  Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".
 ⊗ ▶  Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".
 ⊗ ▶  Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".
 ⊗ ▶  Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".
 ⊗ ▶  Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".
 ⊗ ▶  Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".
 ⊗ ▶  Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".
 ⊗ ▶  Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".
 ⊗ ▶  Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".
```

---

### Root Cause Analysis

#### 1. SVG Path Specification for Command `s` (Smooth Cubic Bézier Curveto)
In the SVG specification (W3C), the relative smooth curveto command `s` takes coordinate arguments in groups of four:
```text
s (dx2 dy2, dx dy)+
```
Each curveto segment must supply:
1. `dx2`: x-coordinate of the second control point (relative to current point)
2. `dy2`: y-coordinate of the second control point (relative to current point)
3. `dx`: x-coordinate of the end point (relative to current point)
4. `dy`: y-coordinate of the end point (relative to current point)

#### 2. The Malformed Path Data
The password visibility toggle (`eye` icon) was defined with:
```xml
<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>
```

Breaking down the command arguments after `s`:
| Segment | Coordinates Provided | Parameter Count | Status |
|---|---|---|---|
| Segment 1 | `4 -8 11 -8` | 4 numbers (`dx2=4, dy2=-8, dx=11, dy=-8`) | Valid |
| Segment 2 | `11 8 11 8` | 4 numbers (`dx2=11, dy2=8, dx=11, dy=8`) | Valid |
| Segment 3 | `-4 8 -11 8` | 4 numbers (`dx2=-4, dy2=8, dx=-11, dy=8`) | Valid |
| Segment 4 | `-11 -8` followed immediately by `z` | **2 numbers** (`dx2=-11, dy2=-8`, missing `dx, dy`) | **Invalid** |

Because Segment 4 had only 2 numbers before the closing `z` command, the browser's SVG parser encountered `z` while still expecting the remaining 2 numbers for `s`, triggering the console error:
```text
Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".
```

#### 3. Why It Appeared 13 Times & in `about:srcdoc:578`
Screen templates are injected into `<iframe>` preview containers using `frame.srcdoc = tpl.innerHTML;`. When multiple screens/iframes render or re-render during local preview navigation, each instance parses the SVG and throws this error.

---

### Resolution

The path was updated to the official Feather Icons `eye` definition, adding the missing `-11-8` coordinate pair:
```xml
<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
```

#### Diff
```diff
- <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>
+ <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
```

---

### Files Updated
1. `preview_app.html` (Lines 936 & 1009)
2. `index.html` (Lines 936 & 1009)
3. `EmergereApp/EmergereApp/preview_app.html` (Lines 936 & 1009)
4. `EmergereApp/EmergereApp/index.html` (Lines 936 & 1009)
5. `scratch/apply_login_redesign_to_htmls.js` (Lines 582 & 655)

---

### Verification
- An automated SVG path validator verified all 134+ `<path>` elements across all HTML preview files.
- Result: **0 errors**.
