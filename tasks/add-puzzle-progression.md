# Add Puzzle Progression Epic

**Status**: ✅ COMPLETED  
**Goal**: Generate and advance to subsequent puzzle maps after player-confirmed victory.

## Overview

WHY: Puzzle mode currently supports a single challenge setup, but long-term engagement needs a progression loop where each confirmed win unlocks and loads the next puzzle.

---

## Victory Confirmation Flow

Use explicit player confirmation to finalize a win and trigger progression.

**Requirements**:
- Given puzzle run state is `won`, should present a confirmation action for the player to acknowledge victory.
- Given the player clicks `I won`, should finalize the current puzzle as completed exactly once.
- Given the player does not confirm victory, should keep the current puzzle loaded without advancing progression.

---

## Puzzle Sequence State

Track puzzle ordering and completion progress in deterministic state.

**Requirements**:
- Given puzzle mode starts, should load a deterministic ordered puzzle list with a stable current index.
- Given a confirmed win, should increment progression to the next available puzzle index.
- Given the final puzzle is completed, should enter a deterministic terminal completion state.

---

## Next Puzzle Loading

Load the next puzzle map immediately after confirmation with full run reset semantics.

**Requirements**:
- Given progression advances, should initialize the next puzzle with its own `initialCells`, `goalTiles`, `obstacles`, and `seedLimit`.
- Given next puzzle load, should reset run-scoped state such as generation, `runState`, and `seedsRemaining`.
- Given puzzle load fails, should fail safely and preserve the previous valid puzzle state.

---

## Puzzle Feedback and Controls

Expose progression context so players understand where they are in the sequence.

**Requirements**:
- Given puzzle mode is active, should communicate current puzzle number and total puzzle count.
- Given a victory is confirmed, should provide clear transition feedback to the next puzzle or campaign completion.
- Given puzzle mode is inactive, should hide puzzle-progression-only feedback and controls.

---

## Verification Coverage

Validate progression behavior from confirmation through next-map initialization.

**Requirements**:
- Given reducer tests, should verify win confirmation, index advancement, and end-of-sequence behavior.
- Given integration tests, should verify `I won` confirmation triggers next puzzle load in real app flow.
- Given regressions, should verify classic and lifeGarden flows remain unchanged.

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED
