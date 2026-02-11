# Fix Goal Tiles Visibility Epic

**Status**: 📋 PLANNED  
**Goal**: Ensure goal tiles are visibly rendered during real Life Garden gameplay.

## Overview

WHY: Goal tiles currently pass reducer/render unit tests but are not visible in live gameplay, which removes the objective loop and makes challenge mode unclear for players.

---

## Runtime Goal Initialization

Define a deterministic setup path that guarantees goals are present in state when a Life Garden run starts or resets.

**Requirements**:
- Given a switch into Life Garden mode, should initialize non-empty `goalTiles` for gameplay when no map payload is provided.
- Given reset/restart actions in Life Garden mode, should preserve or re-apply the active run's goal tiles.
- Given classic mode active, should keep goal initialization inert and not alter sandbox behavior.

---

## State-to-Canvas Wiring Validation

Verify that runtime goal state reaches the rendering layer in the same path users execute.

**Requirements**:
- Given app-level render in Life Garden mode, should pass non-empty `goalTiles` through container selectors into `GridCanvas` props.
- Given runtime state transitions (mode change, reset, replay), should keep goal prop wiring stable without requiring manual developer setup.

---

## Integration Verification

Add app-flow verification that fails if goals disappear from real gameplay.

**Requirements**:
- Given Life Garden gameplay bootstrapped from normal UI controls, should render at least one visible goal marker.
- Given goal overlap with live cells, should show reached-goal visuals and win feedback exactly once.
- Given regression checks in classic mode, should not render goal markers or alter classic interactions.

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED
