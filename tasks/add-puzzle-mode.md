# Add Puzzle Mode Epic

**Status**: ✅ COMPLETED  
**Goal**: Add a dedicated puzzle mode with pre-seeded stable life, pre-generated goals, and constrained player resources.

## Overview

WHY: Puzzle mode turns open-ended Life Garden play into a level-based challenge where players guide growth from a curated starting state toward explicit goals with limited seeds and inert blockers.

---

## Puzzle Mode Entry and Rules

Define puzzle mode as a separate gameplay mode with deterministic setup and challenge constraints.

**Requirements**:
- Given the player selects puzzle mode, should load a puzzle run configuration with pre-seeded stable life and one or more goals.
- Given puzzle mode is active, should keep Conway survival/death rules while restricting player influence to allowed placement turns.
- Given puzzle mode exits, should restore non-puzzle modes without carrying puzzle-only constraints.

---

## Puzzle Map Configuration

Represent puzzle runs as map data containing goals, obstacles, seed limits, and initial cells.

**Requirements**:
- Given puzzle map data, should define `initialCells`, `goalTiles`, `obstacles`, and `seedLimit` in a deterministic format.
- Given puzzle map load, should initialize state from map data without requiring manual runtime injection.
- Given invalid or incomplete puzzle map data, should fail safely and keep the previous valid run state.

---

## Goal, Seed, and Obstacle Mechanics

Implement challenge mechanics so players can route growth under constraints.

**Requirements**:
- Given puzzle mode starts, should set a finite `seedsRemaining` budget and decrement only on valid player births.
- Given seeds are exhausted, should prevent additional births while allowing legal non-birth progression actions.
- Given obstacles exist, should treat obstacle cells as permanently inert and non-placeable by player or growth.
- Given any live cell reaches any goal tile, should transition run state to `won` exactly once.

---

## Puzzle UX and Feedback

Provide clear challenge context and actionable run feedback for puzzle play.

**Requirements**:
- Given puzzle mode is active, should communicate current puzzle objective, seeds remaining, and run outcome state.
- Given the player wins or fails, should provide a deterministic restart path for the same puzzle map.
- Given puzzle mode is inactive, should hide puzzle-only informational feedback.

---

## Verification Coverage

Validate reducer, mode-flow, and app integration behavior for puzzle runs.

**Requirements**:
- Given reducer tests, should verify puzzle initialization, seed consumption rules, obstacle inert behavior, and goal win transitions.
- Given integration tests, should verify puzzle map state flows from mode entry through rendering and controls in real app wiring.
- Given regressions, should verify classic and lifeGarden behavior remain unchanged when puzzle mode is off.

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED
