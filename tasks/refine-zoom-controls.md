# Refine Zoom Controls Epic

**Status**: ⏸️ PENDING REVIEW  
**Goal**: Improve zoom control usability with dynamic limits and slower zoom rate.

## Overview

WHY: Current zoom limits (0.5x-4x) are arbitrary and don't relate to actual grid content. Zoom rate is too fast, making it hard to control precisely. Users need zoom limits that make sense relative to the grid size (showing the whole grid at minimum, zooming to a few cells at maximum) and a slower zoom rate for fine control.

---

## Calculate Dynamic Zoom Limits

Replace fixed zoom limits with limits based on grid dimensions and viewport size.

**Requirements**:
- Given grid bounds and canvas dimensions, should calculate minimum zoom to fit entire grid plus 10% margin.
- Given grid bounds and canvas dimensions, should calculate maximum zoom to show approximately 4-5 cells.
- Given viewport resize, should recalculate zoom limits dynamically.
- Given current zoom outside new limits after resize, should clamp to nearest valid zoom.

---

## Reduce Zoom Speed

Slow down zoom rate for more precise control.

**Requirements**:
- Given mouse wheel scroll, should apply smaller zoom increment (0.05 instead of 0.1).
- Given zoom operation, should maintain smooth zoom-to-cursor behavior.
- Given rapid scrolling, should handle multiple zoom steps without instability.

---

## Update Zoom Limit Enforcement

Apply dynamic limits during zoom operations.

**Requirements**:
- Given zoom in operation, should clamp at dynamic maximum zoom.
- Given zoom out operation, should clamp at dynamic minimum zoom.
- Given initial viewport load, should start at calculated default zoom (grid fits in view).

---

## Add Pan Boundary Constraints

Prevent panning the grid completely off screen.

**Requirements**:
- Given pan operation, should constrain viewport so at least 20% of grid remains visible.
- Given pan beyond boundaries, should clamp offset to keep grid partially on screen.
- Given zoom level changes, should recalculate pan boundaries based on current grid size.
- Given user attempts to pan grid off screen, should resist at boundaries while still allowing some overpan for UX.

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED
