# Implement Pure Simulation Engine Epic

**Status**: 🔄 IN PROGRESS  
**Goal**: Build the deterministic Conway's Game of Life engine with pure functions and comprehensive tests.

## Overview

WHY: The simulation engine is the core logic that powers both classic GoL sandbox and Life Garden mode. It must be pure, deterministic, and thoroughly tested before wiring to UI.

---

## Grid Representation

Define grid data structures and basic operations.

**Requirements**:
- Given a cell coordinate, should represent it as `{x, y}` object.
- Given a grid bounds, should represent it as `{width, height}` object.
- Given a set of live cells, should store as array of coordinates.
- Given a cell coordinate and bounds, should validate if cell is within bounds.

---

## Neighbor Counting

Implement Moore neighborhood (8-adjacent) neighbor counting.

**Requirements**:
- Given a cell coordinate and list of live cells, should count how many of the 8 adjacent cells are alive.
- Given a cell at grid edge, should treat out-of-bounds neighbors as dead (no wraparound for MVP).
- Given an empty grid, should return 0 neighbors for any cell.
- Given a cell surrounded by 8 live cells, should return 8.

---

## Classic GoL Rules (Step Function)

Implement the standard Conway rules for one generation step.

**Requirements**:
- Given a live cell with 2 or 3 neighbors, should survive to next generation.
- Given a live cell with <2 neighbors, should die (underpopulation).
- Given a live cell with >3 neighbors, should die (overpopulation).
- Given a dead cell with exactly 3 neighbors, should become alive (reproduction).
- Given a dead cell with ≠3 neighbors, should stay dead.
- Given the step function is called, should return new cells array without mutating input.

---

## Life Garden Mode Support

Add functions to support player-controlled births.

**Requirements**:
- Given a grid state, should compute all valid birth candidates (empty cells with exactly 3 neighbors).
- Given a cell coordinate and candidates list, should validate if cell is a valid birth candidate.
- Given a grid state and a valid birth cell, should apply birth without running full step (manual birth injection).

---

## Pattern Serialization (Basic)

Support importing/exporting patterns.

**Requirements**:
- Given a cells array and bounds, should serialize to JSON format.
- Given a JSON string, should deserialize to cells array and bounds.
- Given serialization round-trip, should preserve exact cell coordinates.
