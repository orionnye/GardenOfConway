# Fix Grid Canvas Re-render Bug

**Status**: ✅ COMPLETED (2026-02-04)  
**Goal**: Stop PixiJS app from destroying/recreating on every cell update, eliminating blinking and input blocking.

## Overview

WHY: The grid blinks uncontrollably and blocks all user input because the PixiJS application is being destroyed and recreated on every cell state change. The root cause is unstable callback dependencies (`isCellAlive`, `flushDragBatch`, `addCellToBatch`) in the main initialization `useEffect` (line 107-241 in `GridCanvas.tsx`). When cells change, these callbacks get new references, triggering the effect to re-run and tear down the entire canvas. This makes the application completely unusable.

**Impact**: CRITICAL — Blocks all user interaction with the grid.

**Affected File**: `app/components/GridCanvas.tsx`

---

## Stabilize Initialization Effect Dependencies

Remove unstable callback dependencies from PixiJS initialization effect.

**Requirements**:
- Given cell state changes, should NOT trigger PixiJS app re-initialization.
- Given bounds change, should trigger PixiJS app re-initialization (valid use case).
- Given user clicks cell, should register interaction without canvas blinking.
- Given user drags to paint cells, should paint smoothly without interruption.
- Given existing tests, should continue passing without modification.

---

## Use Refs for Latest Callback Values

Store latest callback references in refs to avoid triggering re-initialization.

**Requirements**:
- Given `onCellClick` prop changes, should use latest callback without re-initializing canvas.
- Given `onDragPaint` prop changes, should use latest callback without re-initializing canvas.
- Given event handler fires, should access current callback via ref.
- Given component unmounts, should properly cleanup event listeners.

---

## Verify Interaction Stability

Confirm all user interactions work without visual artifacts.

**Requirements**:
- Given rapid cell clicking, should paint cells immediately without delay or blinking.
- Given drag painting across multiple cells, should paint smooth path without gaps or flashing.
- Given clicking while simulation running, should pause and accept input immediately.
- Given pattern load, should render new cells without canvas reconstruction.

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED
