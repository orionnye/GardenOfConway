# Add Goal Tiles Epic

**Status**: 🚧 IN PROGRESS  
**Goal**: Add map goal tiles and win detection so Life Garden runs have a clear objective.

## Overview

WHY: Life Garden currently has strategic placement but no explicit victory target, which weakens progression and challenge clarity. Goal tiles create a concrete objective loop by asking players to route growth toward target cells, enabling level design, win feedback, and meaningful success states that can later combine with obstacles and seed limits.

---

## Runtime Issue Log

### 2026-02-10 - Goal tiles not visible during gameplay

**Observed**:
- Goal visuals are not appearing during live play in user testing.
- This indicates goals may not be reaching runtime state/UI, even though rendering and reducer tests pass.

**Impact**:
- Core challenge objective is not visible to players.
- Win loop is not reliably discoverable in real gameplay.

**Required follow-up work (no direct fix yet)**:
- Add a deterministic gameplay setup path that injects `goalTiles` into runtime state when entering Life Garden mode and when starting/restarting a run.
- Add integration coverage from page/container level to verify that non-empty `goalTiles` flow into `GridCanvas` props in live app wiring.
- Add manual verification steps for gameplay:
  - Enter Life Garden mode.
  - Confirm at least one visible goal marker appears on map.
  - Advance simulation and verify marker reached styling and win feedback.
- Add a debug-safe temporary visibility check in test harness to assert whether `goalTiles` are empty at runtime in the app integration path.
- Re-run regression checks to ensure classic mode visuals and interactions remain unchanged.

---

## Goal Tile State Model

Add goal tile coordinates to Life Garden state with selectors and update actions.

**Requirements**:
- Given Life Garden state initialization, should include `goalTiles` as a coordinate collection supporting one or many goal cells.
- Given level reset or map load, should replace `goalTiles` from level data in a deterministic order.
- Given classic mode active, should keep goal tile state inert without affecting sandbox behavior.
- Given duplicate goal coordinates in input, should store a de-duplicated goal set.

---

## Goal Tile Rendering

Render goals as a distinct immutable layer that is visually separate from live cells and birth candidates.

**Requirements**:
- Given one or more goal tiles, should render each goal marker at exact grid coordinates with stable placement under pan/zoom.
- Given a goal tile that is currently dead, should display an unmistakable target marker style distinct from cells, candidates, and obstacles.
- Given a goal tile that becomes occupied by live growth, should render a reached state variant without hiding core cell state.
- Given mode switch to classic, should hide goal visuals unless challenge mode is active.

---

## Goal-Reached Win Detection

Detect success when any live cell reaches any goal tile.

**Requirements**:
- Given simulation step completion in Life Garden mode, should evaluate win condition as `liveCells ∩ goalTiles != ∅`.
- Given one or more goals reached on the same generation, should trigger a single win event.
- Given win condition already true, should prevent duplicate win transitions on later renders or steps.
- Given no overlap between live cells and goals, should keep game state in active play.

---

## Win Feedback and Run State

Add clear success feedback and lock gameplay flow after victory.

**Requirements**:
- Given a newly reached goal, should transition challenge state to `won` and pause further simulation stepping.
- Given challenge state `won`, should display success UI with concise messaging and a clear next action.
- Given challenge state `won`, should disable further birth placement while still allowing reset/restart.
- Given run reset, should clear win state and restore goal tiles for replay.

---

## Verification Coverage

Plan tests for state modeling, rendering behavior, and win-state transitions.

**Requirements**:
- Given reducer tests, should verify goal tile set/update/reset behavior including de-duplication.
- Given selector tests, should verify goal-reached logic for zero, one, and multiple goal overlaps.
- Given UI tests, should verify goal markers render and success UI appears exactly when a goal is reached.
- Given regression coverage, should verify classic sandbox interactions remain unchanged when challenge mode is off.

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED
