# Grid Zoom and Pan Epic

**Status**: ⏸️ PENDING REVIEW  
**Goal**: Enable users to zoom and pan the grid viewport to track patterns that move beyond the visible area.

## Overview

WHY: Patterns like gliders move diagonally and can walk off the edge of the visible grid, making them impossible to follow. Users need the ability to pan (drag) the viewport and zoom in/out to keep patterns in view and explore different regions of the 60×60 grid at their preferred detail level.

---

## Implement Viewport Transform System

Add PixiJS viewport transformation to support pan and zoom operations.

**Requirements**:
- Given the GridCanvas component, should maintain viewport state (x, y offset and zoom scale).
- Given viewport transformation applied, should render cells and grid lines in transformed space.
- Given zoom scale changes, should recalculate cell size based on zoom level.
- Given viewport offset changes, should translate cell and grid line positions accordingly.

---

## Add Mouse Pan Controls

Enable click-and-drag panning of the grid viewport.

**Requirements**:
- Given user holds mouse button and drags, should pan the viewport in drag direction.
- Given drag operation in progress, should prevent cell click events from firing.
- Given pan operation, should update viewport offset smoothly without lag.
- Given viewport bounds, should allow panning beyond grid edges for better UX.

---

## Add Zoom Controls

Implement mouse wheel zoom centered on cursor position.

**Requirements**:
- Given mouse wheel scroll up, should zoom in (increase scale) centered on cursor position.
- Given mouse wheel scroll down, should zoom out (decrease scale) centered on cursor position.
- Given zoom limits, should constrain zoom between min (0.5x) and max (4x) scale.
- Given cursor position during zoom, should maintain that point as the zoom center (zoom to cursor).

---

## Add Viewport Reset Control

Provide a way to reset viewport to default position and zoom.

**Requirements**:
- Given viewport has been panned or zoomed, should provide reset button to return to initial state.
- Given reset action triggered, should animate smoothly back to default (1x zoom, centered at 0,0).
- Given GridControls component, should add "Reset View" button alongside other controls.

---

## Preserve Cell Interaction in Transformed Space

Ensure cell clicking works correctly with viewport transformations.

**Requirements**:
- Given viewport is panned or zoomed, should accurately convert screen coordinates to grid coordinates.
- Given transformed viewport, should apply inverse transformation to click coordinates.
- Given cell click in transformed space, should toggle correct cell regardless of viewport state.

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED
