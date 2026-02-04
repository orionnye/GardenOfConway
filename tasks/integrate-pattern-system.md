# Integrate Pattern System Epic

**Status**: ✅ COMPLETED (2026-02-04)  
**Goal**: Wire pattern serialization to Redux state and add missing simulation functions.

## Overview

WHY: The simulation engine has core rules and pattern serialization, but needs Redux integration for state management and a missing manual birth function for Life Garden mode. Without this integration, patterns can't be loaded into the app state, and Life Garden mode can't function properly.

---

## Manual Birth Function

Implement the missing `applyBirth()` function for Life Garden mode player-controlled births.

**Requirements**:
- Given a valid birth candidate cell and current live cells, should add the cell to live cells array.
- Given an invalid candidate (already alive), should throw descriptive error.
- Given an invalid candidate (out of bounds), should throw descriptive error.
- Given an invalid candidate (not exactly 3 neighbors), should throw descriptive error.
- Given a valid birth applied, should return new array without mutating input.
- Given a birth at position (5,5), should include that cell in returned array.

---

## Redux Pattern Actions

Add pattern loading/saving actions to grid-dux.

**Requirements**:
- Given a serialized pattern JSON, should load cells and bounds into grid state.
- Given current grid state, should serialize to JSON pattern.
- Given a pattern name from library (e.g., "GLIDER"), should load that pattern into state.
- Given grid state with cells, should preserve generation counter when loading new pattern.
- Given invalid pattern data, should handle error gracefully without corrupting state.

---

## Pattern Selectors

Create selectors for pattern export and validation.

**Requirements**:
- Given current grid state, should select cells and bounds for serialization.
- Given current grid state, should compute URL-safe encoded pattern string.
- Given current grid state, should export as RLE format.
- Given grid state, should validate if pattern is empty (no cells).
- Given grid state, should compute pattern bounds (min/max occupied cells).

---

## URL State Sync

Wire pattern encoding to URL parameters for sharing.

**Requirements**:
- Given a URL with pattern parameter, should decode and load pattern on mount.
- Given grid state changes, should debounce URL updates (avoid history spam).
- Given invalid URL pattern parameter, should show error message and use empty grid.
- Given successful pattern load from URL, should update browser history.

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED
