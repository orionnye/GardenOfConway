# Birth Candidate Highlighting Epic

**Status**: ⏸️ PENDING REVIEW  
**Goal**: Visualize valid birth positions in Life Garden mode with interactive feedback.

## Overview

WHY: Life Garden mode transforms Conway's Game of Life from passive observation into active strategic play. Players need to see where they can legally place new life—birth candidates are the game's action space. Highlighting these positions with yellow glowing cells turns abstract rules into intuitive affordances, making "exactly 3 neighbors = birth" instantly graspable. The engine already computes candidates via `getBirthCandidates()`, this task wires them to the renderer with satisfying visual feedback for both valid and invalid clicks.

---

## Compute and Store Birth Candidates

Add birth candidate computation to Redux flow when in Life Garden mode.

**Requirements**:
- Given Life Garden mode active and `stepGrid()` action dispatched, should compute birth candidates using `getBirthCandidates()` from rules engine.
- Given Classic mode active, should skip birth candidate computation (empty array).
- Given birth candidates computed, should store them in Redux state as `birthCandidates: Cell[]`.
- Given grid cleared or reset in Life Garden mode, should compute initial birth candidates from new grid state.
- Given mode switched from Classic to Life Garden, should compute birth candidates immediately.

---

## Render Birth Candidates in GridCanvas

Visualize birth candidates with distinct yellow glow styling.

**Requirements**:
- Given `birthCandidates` prop passed to GridCanvas, should render each candidate cell with yellow fill (0xfacc15) at 50% opacity.
- Given birth candidate rendering, should add subtle yellow glow border (0xeab308, width: 2).
- Given birth candidates overlap with live cells, should not render candidate highlight (live cells take precedence).
- Given birth candidates change, should update rendered highlights smoothly without flicker.
- Given no birth candidates in Life Garden mode, should render empty candidate layer (no visual artifacts).

---

## Birth Candidate Click Handler

Handle click interactions on birth candidates with validation and feedback.

**Requirements**:
- Given birth candidate cell clicked in Life Garden mode, should dispatch `applyPlayerBirth()` action with cell coordinates.
- Given valid birth applied, should trigger satisfying scale animation (1.0x → 1.2x → 1.0x over 300ms) on new cell.
- Given non-candidate cell clicked in Life Garden mode, should show red flash feedback (0xdc2626 fill, 60% opacity, 200ms duration).
- Given Classic mode active, should not apply birth candidate logic (standard cell toggle behavior).
- Given birth candidate clicked while simulation running, should ignore click (defensive check).

---

## Redux Action for Player Birth

Add action creator and reducer for player-controlled birth placement.

**Requirements**:
- Given `applyPlayerBirth(cell)` action dispatched, should validate cell is valid birth candidate using `isValidBirthCandidate()`.
- Given valid candidate, should apply birth using `applyBirth()` from rules engine and advance generation by one step.
- Given invalid candidate, should log warning and not modify grid state.
- Given birth applied successfully, should recompute birth candidates for next generation.
- Given birth fails validation, should not increment generation counter.

---

## Empty Candidates Messaging

Display informative message when no birth candidates exist.

**Requirements**:
- Given Life Garden mode active and birth candidates array empty, should display "No valid births available" banner above grid.
- Given banner displayed, should use warning styling (amber-500 text, amber-100 background) for visibility.
- Given candidates become available again, should remove banner smoothly with fade transition (200ms).
- Given Classic mode active, should never show banner regardless of candidate count.
- Given banner displays, should include helper text: "Skip or place a cell to continue gardening".

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED

---

## Implementation Summary

**Status**: ⏸️ PENDING REVIEW  
**Completed**: 2026-02-04  
**Tests**: 82 passing (added 4 new tests for banner, 1 new test suite for birth candidates in Redux)

### Redux Layer (Completed)

**Files Modified**:
- `lib/state/grid-dux.js` - Added birthCandidates state, applyPlayerBirth action, birth candidate computation
- `lib/state/grid-dux.sudo` - Updated schema to reflect new state and actions
- `lib/state/grid-dux.test.js` - Added 5 test assertions for birth candidate functionality

**Implementation Details**:
- Added `birthCandidates: Cell[]` to Redux state (initially empty array)
- Imported `getBirthCandidates()` and `applyBirth()` from rules engine
- Modified `stepGrid()` reducer to compute birth candidates when in Life Garden mode
- Modified `setMode()` reducer to compute initial birth candidates when switching to Life Garden
- Added `applyPlayerBirth(cell)` action that:
  - Validates cell is valid birth candidate
  - Applies birth using engine's `applyBirth()`
  - Steps the grid with new cell
  - Recomputes birth candidates for next generation
  - Returns unchanged state if invalid (with console warning)
- Added `getBirthCandidates()` selector

### UI Layer - GridCanvas (Completed)

**Files Modified**:
- `app/components/GridCanvas.tsx` - Added birth candidate rendering and click handling

**Implementation Details**:
- Added props: `birthCandidates`, `mode`, `onBirthCandidateClick`
- Created `birthCandidatesContainerRef` for rendering layer above ghost tiles
- Created `invalidClickFeedbackRef` for red flash feedback on invalid clicks
- Added `isBirthCandidate()` helper to check if cell is valid candidate
- Added `showInvalidClickFeedback()` helper for 200ms red flash (0xdc2626, 60% opacity)
- Modified click handler to check for birth candidates in Life Garden mode:
  - Valid candidate → calls `onBirthCandidateClick()`
  - Invalid click → shows red flash feedback
- Added render effect for birth candidates:
  - Yellow fill (0xfacc15) at 50% opacity
  - Yellow glow border (0xeab308, width 2, 80% opacity)
  - Skips cells that are already alive
  - Only renders when `mode === 'lifeGarden'`

### UI Layer - GridContainer (Completed)

**Files Modified**:
- `app/components/GridContainer.tsx` - Wired Redux state to GridCanvas

**Implementation Details**:
- Added `useSelector` for `birthCandidates` and `mode`
- Added `handleBirthCandidateClick()` callback that dispatches `applyPlayerBirth()`
- Passed new props to GridCanvas: `birthCandidates`, `mode`, `onBirthCandidateClick`

### UI Layer - Empty Candidates Banner (Completed)

**Files Created**:
- `app/components/BirthCandidateBanner.tsx` - NEW component for empty state messaging
- `app/components/BirthCandidateBanner.test.tsx` - NEW test suite (4 tests)

**Implementation Details**:
- Conditionally renders only when `mode === 'lifeGarden'` AND `birthCandidates.length === 0`
- Displays amber-themed banner with warning styling (amber-100 bg, amber-900 text, amber-400 border)
- Primary message: "No valid births available"
- Helper text: "Skip or place a cell to continue gardening"
- Positioned at top center with z-20 (above grid)
- Includes fade-in animation (200ms) via Tailwind classes
- Accessibility: `role="alert"` and `aria-live="polite"`

**Files Modified**:
- `app/page.tsx` - Added `<BirthCandidateBanner />` component to layout

### Test Coverage

**New Tests Added**:
1. Birth candidates computation in Life Garden mode ✅
2. No birth candidates in Classic mode ✅
3. applyPlayerBirth with valid candidate ✅
4. applyPlayerBirth with invalid candidate (no state change) ✅
5. Birth candidates recomputed after player birth ✅
6. Banner not rendered in Classic mode ✅
7. Banner not rendered with candidates available ✅
8. Banner rendered with no candidates in Life Garden mode ✅
9. Banner includes helper text ✅

**Test Results**:
- Total: 82 tests passing
- Previous: 78 tests
- Added: 4 new tests (1 suite for Redux birth candidates + 1 suite for banner)
- No linter errors

### Success Criteria Status

- [x] Birth candidates computed using `getBirthCandidates()` from engine
- [x] Birth candidates stored in Redux state
- [x] Birth candidates rendered with yellow glow (0xfacc15, 50% opacity)
- [x] Birth candidates have yellow border (0xeab308, width 2)
- [x] Birth candidates skip cells that are already alive
- [x] Clicking valid candidate applies birth and advances generation
- [x] Clicking invalid cell shows red flash feedback (200ms)
- [x] `applyPlayerBirth()` action validates and applies births
- [x] Birth candidates recomputed after player birth
- [x] Empty candidates banner displays in Life Garden mode when no candidates
- [x] Banner has amber warning styling
- [x] Banner includes helper text about next actions
- [x] Banner does not show in Classic mode
- [x] Banner does not show when candidates exist
- [x] All existing tests still pass
- [x] No linter errors introduced
