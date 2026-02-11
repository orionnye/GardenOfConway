# Puzzle Playspace View Epic

**Status**: ⏸️ PENDING REVIEW  
**Goal**: Limit visible grid and zoom/center the view on the puzzle playspace so the action is focused and readable.

## Overview

WHY: Puzzles use a full 60×60 grid but gameplay happens in a small region; zooming and centering on the playspace makes levels easier to read and play without changing puzzle logic.

---

## Playspace Region

Define the region that contains all puzzle-relevant content for framing the view.

**Requirements**:
- Given puzzle mode with current puzzle data, should derive or use a playspace region that contains initial cells, goals, and obstacles (with configurable margin).
- Given classic or lifeGarden mode, should continue to use full grid bounds for viewport; no playspace restriction.
- Given invalid or empty playspace, should fall back to full bounds without breaking render or controls.

---

## Viewport Focus and Zoom

On puzzle load or reset, frame the view on the playspace.

**Requirements**:
- Given puzzle mode entry or puzzle reset/advance, should set viewport scale and position so the playspace region is centered and fits comfortably in the canvas (with optional padding).
- Given puzzle mode, should allow pan/zoom within reasonable limits so the playspace stays the primary focus (e.g. restrict pan so playspace remains visible or clamp zoom range).
- Given mode switch away from puzzle, should restore default full-grid view behavior for classic/lifeGarden.

---

## Grid and Rendering

Keep simulation on full grid; only change what is framed by the view.

**Requirements**:
- Given puzzle mode, should not change grid dimensions or cell coordinates; only the initial viewport and optional zoom/pan limits.
- Given resize or puzzle change, should recalculate and re-center view on playspace without flicker or incorrect hit-testing.

---

## Verification

Validate viewport and playspace behavior in tests.

**Requirements**:
- Given reducer or viewport helper tests, should verify playspace derivation from puzzle data and default fallbacks.
- Given integration or component tests, should verify puzzle mode triggers centered/zoomed view (e.g. initial scale/position) when applicable.
- Given regressions, should verify classic and lifeGarden view behavior unchanged.

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED
