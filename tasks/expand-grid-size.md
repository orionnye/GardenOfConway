# Expand Grid Size Epic

**Status**: ⏸️ PENDING REVIEW  
**Goal**: Increase default grid size to provide more space for pattern exploration.

## Overview

WHY: The current 30×30 grid is too small for many interesting patterns to evolve properly. Classic patterns like the R-Pentomino need more space to stabilize, and users should have room to experiment with multiple patterns simultaneously without running out of bounds.

---

## Increase Default Grid Bounds

Update grid size from 30×30 to 60×60 for better pattern visibility.

**Requirements**:
- Given initial state, should set default bounds to 60×60 instead of 30×30.
- Given existing tests, should update test fixtures to use new grid size.
- Given GridCanvas component, should maintain cell size calculations for responsive sizing.
- Given pattern library patterns, should still render centered on larger grid.
- Given accessibility label, should update to reflect new grid dimensions.

---

## Update Pattern Centering

Ensure loaded patterns appear centered on the larger grid.

**Requirements**:
- Given pattern loaded from library, should calculate center offset for 60×60 grid.
- Given pattern with bounds smaller than grid, should position at center of visible area.
- Given pattern coordinates, should translate to centered position on load.

---

## Performance Validation

Verify rendering performance remains acceptable with larger grid.

**Requirements**:
- Given 60×60 grid with 500 live cells, should maintain 60fps rendering.
- Given grid lines for 60×60 grid, should render without visible lag.
- Given cell painting on larger grid, should respond immediately to clicks.

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED
