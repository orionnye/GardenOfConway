# Scroll-to-Pan Instead of Zoom

**Status**: ⏸️ PENDING REVIEW  
**Goal**: Map scroll/trackpad input to panning the viewport instead of zooming. Assume players have the context and scale they need (e.g. from puzzle playspace fit); prioritize comfortable pan for navigation, with trackpad users in mind.

## Overview

Current behavior: mouse wheel (and trackpad vertical scroll) zooms in/out. User wants scroll to **pan** instead, so that two-finger scroll on a trackpad (and mouse wheel) moves the view. Zoom can remain available via a modifier (e.g. Ctrl+scroll) or the existing Reset View for initial framing.

---

## Requirements

### Scroll and trackpad → pan

- Given a vertical scroll (deltaY) on wheel or trackpad, should pan the viewport up or down (e.g. positive deltaY → content moves up → viewport y increases).
- Given horizontal scroll (deltaX), when available (e.g. trackpad two-finger horizontal), should pan the viewport left or right.
- Given scroll input, should apply pan within existing viewport pan boundaries (reuse `clampViewport` / pan limits).
- Pan amount should feel responsive: use scroll deltas directly (with a tunable multiplier if needed). Trackpads often send `deltaMode === 0` (pixels) with smooth fractional deltas; mouse wheels may send `deltaMode === 1` (lines). Consider normalizing so both feel consistent, or use a single multiplier that works for typical trackpad and wheel deltas.

### Zoom (optional secondary behavior)

- Either remove zoom-from-scroll entirely, or keep zoom on a modifier (e.g. Ctrl+scroll or Cmd+scroll) so scroll-by-default is pan but power users can still zoom. Document the choice.
- "Reset View" button continues to restore initial view/scale; no change to that behavior.

### Trackpad-specific notes

- Use both `event.deltaX` and `event.deltaY` in the wheel handler. Many trackpads send both for diagonal or horizontal scroll; supporting deltaX gives natural 2D pan.
- `WheelEvent.deltaMode` (0 = pixels, 1 = lines, 2 = page): if needed, scale line/page deltas to approximate pixel-like pan distance so mouse wheel and trackpad behave similarly.
- No code change needed for "trackpad" per se—using deltaX/deltaY and optionally deltaMode is sufficient; trackpads and wheels both use the same WheelEvent API.

---

## Implementation notes

- **File**: `app/components/GridCanvas.tsx`. Replace or branch the current `handleWheel` logic: instead of changing `scale` and recomputing x/y for zoom-to-cursor, add `event.deltaX` to viewport x and `event.deltaY` to viewport y (with sign chosen so scroll direction matches pan direction), then clamp with existing `clampViewport`.
- **Pan multiplier**: e.g. `viewport.x -= deltaX`, `viewport.y -= deltaY` (or plus, depending on desired mapping). If pan feels too fast or slow, introduce a multiplier (e.g. 1.0 or 1.2). Optionally scale by `deltaMode` (e.g. multiply line deltas by ~40 to approximate pixels).
- **Optional zoom on modifier**: if `event.ctrlKey` or `event.metaKey` is true, keep current zoom-to-cursor behavior; otherwise do scroll-to-pan. That preserves zoom for power users without changing default scroll behavior.
- **Tests**: Update or add tests in `GridCanvas.viewport.test.tsx` (or equivalent) that assert wheel events change viewport position (x, y) instead of (or in addition to) scale when not holding modifier. Remove or adjust tests that expect wheel to always zoom.

---

## Verification

- Vertical scroll (wheel or trackpad) pans the grid up/down without zooming.
- Horizontal scroll (trackpad) pans the grid left/right when deltaX is present.
- Pan stays within existing pan limits (no infinite scroll).
- If implemented: Ctrl+scroll (or Cmd+scroll) still zooms; otherwise Reset View restores initial zoom.
- Behavior is comfortable on a laptop trackpad (smooth, predictable direction).

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED
