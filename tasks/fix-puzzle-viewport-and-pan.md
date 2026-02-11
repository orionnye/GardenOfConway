# Fix Puzzle Viewport and Pan Navigation

**Status**: ⏸️ PENDING REVIEW  
**Goal**: Restore reliable pan/zoom navigation in the grid and improve puzzle viewport so the grid is not too large for some puzzles.

## Overview

Users report: (1) the grid is still too large for some puzzles, and (2) they cannot navigate the space with the cursor anymore (pan/zoom was a built feature). Review identified a viewport-reset bug and playspace/zoom limits as causes.

---

## Root cause: viewport reset on every cells change

**Problem**  
In `GridCanvas.tsx`, the effect that sets the initial viewport runs when `[mode, cells, goalTiles, obstacles, bounds.width, bounds.height, getInitialViewport]` change. Because `cells` is in the dependency array, **every** update to the grid (e.g. placing a birth, simulation step) triggers `setViewport(getInitialViewport())`. So the user pans or zooms, then any action that updates `cells` causes the viewport to snap back. Pan and zoom appear broken.

**Requirements**  
- Given the user has panned or zoomed the viewport, should **not** reset viewport when only `cells` (or birthCandidates) change.
- Given mode switch (e.g. classic ↔ lifeGarden ↔ puzzle), should set viewport to the appropriate initial view (full grid or playspace-fit).
- Given puzzle load (new puzzle: different goalTiles/obstacles or puzzle index), should set viewport to fit the new playspace.
- Given bounds change (e.g. resize), may recalculate initial viewport or keep current viewport; document choice and keep behavior consistent.

**Implementation notes**  
- Remove `cells` from the dependency array of the “set viewport on mode/puzzle” effect. Optionally use a stable “puzzle id” or compare goalTiles/obstacles to detect puzzle load instead of reacting to every cells change.
- Ensure reset view (e.g. “Reset View” button) still calls `getInitialViewport()` so users can return to the intended default view.

---

## Puzzle viewport: grid still too large for some puzzles

**Problem**  
Even when the viewport is not constantly reset, some puzzles may show a region that feels too large: playspace derivation or zoom limits may be too conservative.

**Requirements**  
- Given puzzle mode with a small playspace (few cells + goals + obstacles), should zoom in so the playspace fits comfortably (e.g. with configurable padding) and is readable.
- Given puzzle mode with a large or full-grid playspace, should not break (e.g. fall back to full-grid view or a sensible max zoom-out).
- Given the same puzzle, viewport should remain stable across turns (no reset on `cells` change), per the fix above.

**Implementation notes**  
- In `lib/viewport/playspace.ts`, review `getViewportToFitPlayspace`: scale is capped at `Math.min(scaleX, scaleY, 4)`. Consider a higher cap or no cap when fitting a small playspace so small puzzles are not forced to appear small.
- Review padding and margin (e.g. `paddingRatio`, `defaultMargin`) so the framed region is not excessively large.
- Optionally add pan/zoom limits in puzzle mode so the playspace stays roughly in view, without resetting on every state change.

---

## Pan interaction and discoverability

**Current behavior**  
Pan is implemented for right-click (button 2), middle-click (button 1), and Shift + pointer. Cursor shows `grabbing` when `isPanning` is true.

**Requirements**  
- Given right-click or middle-click (or Shift + drag), should start pan and move viewport with pointer movement; release should end pan. (Already implemented; verify after viewport-reset fix.)
- Given pan in progress, should not fire cell click or birth placement. (Already separated from left-click handling.)
- Optional: Consider left-drag on “empty” space (e.g. not over a birth candidate in puzzle/lifeGarden) to pan for discoverability; if added, document and keep conflict with drag-paint clear.

**Implementation notes**  
- After fixing the viewport-reset effect, manually verify: enter puzzle mode, right-drag to pan, place a birth; viewport must not snap back.
- Ensure DOM canvas listeners for mousedown/mousemove/mouseup and optional touch handlers still receive events; no code changes needed if the only bug was the effect.

---

## Verification

- Given puzzle mode, pan with right-drag (or middle-drag / Shift-drag), then place a birth or advance a turn: viewport must **not** reset.
- Given mode switch to puzzle, viewport should initially fit playspace; after that, only explicit “Reset View” or puzzle load should reset it.
- Given a small puzzle (small playspace), initial view should be zoomed in enough to read; “grid too large” should be addressed.
- Existing tests: ensure no regressions in viewport or pan tests; add or update tests that assert viewport is not reset when only `cells` (or birthCandidates) change.

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED
