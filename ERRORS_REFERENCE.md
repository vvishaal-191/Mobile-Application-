# Runtime & Post-Deployment Errors Reference & Resolution Log

This document records runtime errors detected during local application inspection and testing, detailing their symptoms, root cause, line mapping, deployment cache behavior, and applied fixes.

---

## 1. SVG `<path>` Attribute `d` Syntax Error

### Console Error Logs

#### A. Main Console (13 Occurrences)
```text
▼ 13  Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".
 ⊗    Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".  about:srcdoc:578
 ⊗ ▶  Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".
 ... (repeated 13 times across preview iframe renders)
```

#### B. Isolated Frame Inspection Console (`frame (about:srcdoc...)`)
```text
Context: frame (about:srcdoc...)
 ⊗ Error: <path> attribute d: Expected number, "... 8-4 8-11 8-11-8z".  about:srcdoc:578
   Neumorphic Login preview ready                                      VM141 about:srcdoc:208
```

---

### Exact Source & Line Mapping

The application uses an `<iframe>` preview stage (`#frame`) where individual screen templates are injected dynamically:
```javascript
var tpl = document.getElementById(tplId);
frame.srcdoc = tpl.innerHTML;
```

For the Login screen:
1. `<template id="tpl-Login">` begins at **Line 359** in `index.html` and `preview_app.html`.
2. Inside `tpl.innerHTML`, **Line 578** is:
   ```html
   <button type="button" id="pwd-eye" class="eye-btn" onclick="toggleVisibility('pwd')" title="View password" style="display:none;">
     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
       <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"></path>  <!-- Line 578 of srcdoc / Line 936 of index.html -->
       <circle cx="12" cy="12" r="3"></circle>
     </svg>
   </button>
   ```
3. Inside the template's embedded `<script>`, **Line 208** is:
   ```javascript
   console.log('Neumorphic Login preview ready'); // Line 208 of script / Line 1201 of index.html
   ```

Because `about:srcdoc` assigns line numbers relative to the injected template string, `about:srcdoc:578` points directly to this SVG path.

---

### Root Cause Analysis

#### 1. SVG Path Specification for Command `s` (Smooth Cubic Bézier Curveto)
In the SVG specification (W3C), the relative smooth curveto command `s` takes coordinate arguments in **multiples of four**:
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

---

### Resolution

The path was updated to the official Feather Icons `eye` definition, adding the missing `-11-8` coordinate pair (`-11-8-11-8z`):
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

### Post-Deployment & Browser Cache Note

If this error is still observed immediately after running `git push`:
1. **Deployment Propagation**: Remote hosting platforms (such as Vercel) typically take 30–60 seconds to finish building and deploying the new commit (`dc7b380`).
2. **Browser Caching**: Browsers aggressively cache HTML files and inline `iframe.srcdoc` buffers.
   - Perform a **Hard Refresh**:
     - Windows/Linux: `Ctrl + F5` or `Ctrl + Shift + R`
     - macOS: `Cmd + Shift + R`
   - Or test in a **Private / Incognito window** to confirm the newly deployed bundle is served.

---

### Verification
- An automated SVG path validator verified all 134+ `<path>` elements across all HTML preview files.
- Live HTTP server check on port 3000 verified:
  - `Has broken path: false`
  - `Has fixed path: true`
- Repository scan confirmed 0 instances of the malformed path.
