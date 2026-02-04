# Add Drag Paint Ghost Tiles Epic

**Status**: ⏸️ PENDING REVIEW  
**Goal**: Show visual preview of cells that will be painted/erased during drag operation.

## Overview

WHY: Users currently have no visual feedback during drag painting, making it difficult to see which cells will be affected when they release the mouse. Adding ghost tile overlays will provide immediate visual confirmation of the drag path, improving accuracy and confidence when drawing patterns. This reduces frustration and enables more precise pattern creation.

---

## Render Ghost Tile Overlay

Create visual overlay layer for previewing drag paint operations.

**Requirements**:
- Given drag operation in progress, should render semi-transparent overlay tiles on affected cells.
- Given draw mode active, should show ghost tiles in green with 40% opacity.
- Given erase mode active, should show ghost tiles in red with 40% opacity.
- Given drag ends, should clear all ghost tiles immediately.
- Given ghost tile rendered, should not interfere with existing cell rendering.

---

## Track Ghost Tile State

Maintain separate state for ghost tiles distinct from committed cells.

**Requirements**:
- Given cells added to drag batch, should add corresponding ghost tiles to preview state.
- Given ghost tile already exists at position, should not duplicate in preview.
- Given drag session ends, should clear ghost tile state completely.
- Given pointer leaves grid bounds, should maintain existing ghost tiles but stop adding new ones.

---

## Layer Management

Ensure ghost tiles render at correct z-index without blocking interaction.

**Requirements**:
- Given PixiJS stage, should create dedicated ghost tile container above grid lines but below controls.
- Given ghost tiles rendered, should not capture pointer events or block cell interaction.
- Given viewport zoom/pan, should transform ghost tile container in sync with cell container.
- Given ghost tiles cleared, should remove all graphics from ghost container efficiently.

---

## Performance Optimization

Ensure ghost tile rendering doesn't impact drag responsiveness.

**Requirements**:
- Given 50+ cells in drag path, should render ghost tiles without noticeable lag.
- Given rapid mouse movement, should batch ghost tile renders with existing 50ms batch cycle.
- Given same cell painted multiple times in drag, should only render one ghost tile.
- Given ghost tiles reused across drags, should pool graphics objects instead of recreating.

---

## Visual Polish

Match ghost tile style with overall grid aesthetics.

**Requirements**:
- Given ghost tile in draw mode, should use green (#22c55e) at 40% opacity with subtle border.
- Given ghost tile in erase mode, should use red (#dc2626) at 40% opacity with subtle border.
- Given ghost tile rendered, should use same cell size and positioning as live cells.
- Given ghost tile overlaying live cell in erase mode, should dim the live cell visually.

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED
