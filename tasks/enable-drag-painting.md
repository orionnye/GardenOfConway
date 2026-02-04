# Enable Drag Painting Epic

**Status**: ⏸️ PENDING REVIEW  
**Goal**: Allow users to paint multiple cells by clicking and dragging across the grid.

## Overview

WHY: Currently users can only toggle one cell at a time, making it tedious to draw complex patterns. Adding drag-to-paint functionality will dramatically improve the drawing experience, letting users quickly sketch patterns by dragging the mouse/touch across the grid.

---

## Track Mouse/Touch Drag State

Implement drag detection for continuous cell painting.

**Requirements**:
- Given user presses mouse button on cell, should enter "painting mode".
- Given user moves mouse while button pressed, should paint cells along the path.
- Given user releases mouse button, should exit "painting mode".
- Given touch input on mobile, should support touch drag for painting.
- Given drag starts on empty cell, should paint (add) cells along drag path.
- Given drag starts on live cell, should erase (remove) cells along drag path.

---

## Batch Cell Updates

Optimize Redux dispatches to avoid performance issues during drag.

**Requirements**:
- Given rapid cell changes during drag, should batch updates every 50ms.
- Given drag completion, should dispatch final cell state once.
- Given batched updates, should not create unnecessary re-renders.
- Given 50-cell drag stroke, should dispatch maximum 1 action per 50ms.

---

## Visual Drag Feedback

Provide immediate visual feedback during drag operations.

**Requirements**:
- Given drag in progress, should show cursor style indicating paint/erase mode.
- Given hover over cell during drag, should preview cell state change.
- Given drag path, should visually highlight cells being modified.
- Given pointer leaves grid bounds during drag, should stop painting but maintain drag state.
- Given pointer returns to grid during drag, should resume painting.

---

## Prevent Accidental Scrolling

Ensure touch dragging doesn't trigger page scroll on mobile.

**Requirements**:
- Given touch drag on grid canvas, should call `preventDefault()` to stop scrolling.
- Given touch drag on controls area, should allow normal scrolling.
- Given touch outside grid, should not prevent default browser behavior.

---

## Draw/Erase Mode Toggle

Let users choose between drawing and erasing modes.

**Requirements**:
- Given drag starting on empty cell, should default to "draw mode" for that drag.
- Given drag starting on live cell, should default to "erase mode" for that drag.
- Given keyboard modifier (Shift key), should invert mode (draw becomes erase).
- Given mode indicator in UI, should show current paint/erase mode.

---

## Testing Strategy

Verify drag painting works correctly with various scenarios.

**Requirements**:
- Given simulated drag across 5 cells, should update cell state for all 5.
- Given rapid drag movements, should not miss cells along the path.
- Given drag that revisits same cell, should maintain consistent state.
- Given Redux store, should verify batched dispatch behavior.

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED
