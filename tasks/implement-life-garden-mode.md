# Implement Life Garden Mode Epic

**Status**: ⏸️ PENDING REVIEW  
**Goal**: Add Life Garden game mode where players control births while survival/death remain automatic.

## Overview

WHY: The current app is a classic GoL sandbox, but Life Garden mode transforms passive observation into active gardening. Players see highlighted birth candidates each generation and choose where (or whether) to place new life, creating strategic depth and "one more generation" engagement. The simulation engine already has `getBirthCandidates()` and `applyBirth()` ready—this task wires them to the UI with mode switching and player controls.

---

## Mode Toggle System

Add UI to switch between Classic GoL and Life Garden modes.

**Requirements**:
- Given mode selector in header, should toggle between "Classic" and "Life Garden" modes.
- Given mode switch to Life Garden, should pause simulation automatically.
- Given mode switch to Classic, should restore standard simulation behavior.
- Given current mode in Redux state, should persist across page refreshes (localStorage).
- Given Life Garden mode active, should disable Play button (only Step allowed).

---

## Birth Candidate Highlighting

Visualize valid birth positions when in Life Garden mode.

**Requirements**:
- Given Life Garden mode active, should compute birth candidates using `getBirthCandidates()` from engine.
- Given birth candidates exist, should render them with distinct visual style (yellow glow, 50% opacity).
- Given no birth candidates, should display "No valid births available" message.
- Given birth candidate clicked, should apply birth using `applyBirth()` and advance generation.
- Given non-candidate cell clicked in Life Garden mode, should show subtle rejection feedback (red flash).

---

## Player Birth Controls

Add Skip button and birth placement interaction for Life Garden mode.

**Requirements**:
- Given Life Garden mode active, should display "Skip" button in controls.
- Given Skip button clicked, should advance generation without placing birth.
- Given birth candidate clicked, should place cell with satisfying animation (scale up 1.2x → 1.0x over 200ms).
- Given birth placement successful, should auto-advance to next generation and compute new candidates.
- Given simulation in Life Garden mode, should pause after each generation awaiting player choice.

---

## Generation Flow Control

Implement turn-based flow for Life Garden mode.

**Requirements**:
- Given Life Garden mode generation advances, should enter CHOICE phase (candidates highlighted, awaiting input).
- Given player selects birth or skip, should enter ADVANCE phase (apply rules, update grid).
- Given ADVANCE phase completes, should enter REVEAL phase (show new grid state).
- Given REVEAL phase after 300ms, should transition back to CHOICE phase for next generation.
- Given overgrown condition (all cells alive), should display "Garden Overgrown!" game over message.

---

## Redux State Integration

Add mode and candidate state to grid-dux.

**Requirements**:
- Given grid state, should include `mode: 'classic' | 'lifeGarden'` field.
- Given grid state, should include `birthCandidates: Cell[]` field.
- Given `setMode()` action dispatched, should update mode and reset simulation state.
- Given `stepGrid()` in Life Garden mode, should compute and store birth candidates.
- Given `applyPlayerBirth()` action, should validate candidate and apply birth before stepping.

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED

---

## Success Criteria

- [x] Mode toggle switches between Classic and Life Garden
- [ ] Birth candidates highlighted in yellow with 50% opacity
- [ ] Clicking candidate places birth and advances generation
- [ ] Skip button advances without birth
- [ ] Generation pauses after each step in Life Garden mode
- [ ] "No valid births" message displays when candidates empty
- [ ] Birth placement has satisfying scale animation
- [x] Mode persists in localStorage
- [x] All existing tests pass (76 tests passing)
- [x] New tests cover mode toggle logic

---

## Implementation Status: Mode Toggle System ✅

**Completed** (2026-02-04):

### Redux State Changes
- Added `mode: 'classic' | 'lifeGarden'` to grid state
- Added `setMode()` action creator
- Added reducer handler with auto-pause on Life Garden switch
- Added `getMode()` selector
- Updated `.sudo` file to reflect new state shape

### UI Components
- Created `ModeToggle.tsx` component with localStorage persistence
- Added mode toggle to app header
- Updated `GridControls` to disable Play button in Life Garden mode
- Added visual feedback (blue for Classic, green for Life Garden)

### Tests
- Added 4 new tests for ModeToggle component (rendering, localStorage)
- Added 1 new test for GridControls Play button disable behavior
- Updated 1 existing test to include mode in initial state
- All 76 tests passing (was 70, added 6 new tests)

### Files Modified
- `lib/state/grid-dux.js` - Added mode state and action
- `lib/state/grid-dux.sudo` - Updated schema
- `lib/state/grid-dux.test.js` - Added mode toggle tests
- `app/components/ModeToggle.tsx` - NEW component
- `app/components/ModeToggle.test.tsx` - NEW tests
- `app/components/GridControls.tsx` - Added mode selector and Play disable logic
- `app/components/GridControls.test.tsx` - Added Life Garden mode test
- `app/page.tsx` - Added header with ModeToggle

### Next Subtasks
- Birth Candidate Highlighting (uses `getBirthCandidates()` from engine)
- Player Birth Controls (Skip button, click handlers)
- Generation Flow Control (turn-based CHOICE → ADVANCE → REVEAL)
