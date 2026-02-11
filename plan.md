# Plan

## ✅ Completed: Foundation Docs

- ✅ Created `vision.md` — Product vision (GoL sandbox primary, Life Garden as optional mode)
- ✅ Created `ARCHITECTURE.md` — Technical structure, module boundaries, data flow, and rendering strategy
- ✅ Created `LIFE-GARDEN-MVP.md` — Implementable MVP extraction from GDD
- ✅ Created `tasks/life-garden-mvp-spec.md` — Epic plan for MVP spec work

## ✅ Completed

- ✅ **Bootstrap project** — Minimal Next.js setup with "Hello World" on port 8080
  - Epic: `tasks/bootstrap-project.md`
- ✅ **Setup PixiJS + Vitest** — WebGL rendering and test framework
  - Epic: `tasks/setup-pixi-vitest.md`
- ✅ **Setup Redux + redux-saga** — State management with Autodux pattern
  - Epic: `tasks/setup-redux-saga.md`

## ✅ Completed: Critical Bug Fixes

- ✅ **Fix grid canvas re-render bug** — Stopped PixiJS from destroying/recreating on every cell update
  - Epic: `tasks/fix-grid-canvas-rerender-bug.md` (COMPLETED 2026-02-04)
  - Fixed unstable useEffect dependencies causing blinking and input blocking
  - All 58 tests passing

## 🚧 In Progress: Core Engine

- 🔄 **Implement simulation engine** — Core GoL rules with TDD
  - Epic: `tasks/implement-simulation-engine.md`
  - Status: ~85% complete (rules done, patterns done, needs applyBirth)
- ✅ **Pattern serialization** — Save/load/share patterns (JSON, RLE, URL encoding)
  - Epic: `tasks/implement-pattern-serialization.md` (COMPLETED 2026-02-04)
- 📋 **Pattern system integration** — Wire patterns to Redux state and add manual birth
  - Epic: `tasks/integrate-pattern-system.md`

## ✅ Completed: Critical Fix

- ✅ **Fix Buffer browser compatibility** — Replaced Node.js `Buffer` with `btoa`/`atob`
  - Epic: `tasks/fix-buffer-browser-compatibility.md` (COMPLETED 2026-02-04)

## ✅ Completed: Rendering & UI

- ✅ **Build grid renderer** — PixiJS visualization with interactive controls
  - Epic: `tasks/build-grid-renderer.md` (COMPLETED 2026-02-04)
  - All 70 tests passing
  - Full grid renderer with zoom/pan, drag painting, pattern library

## ⏸️ Pending Review: Grid UX Improvements

- ⏸️ **Expand grid size** — Increase from 30×30 to 60×60 for better pattern space
  - Epic: `tasks/expand-grid-size.md`
  - Status: Implementation complete with pattern centering, awaiting user verification
  - All 54 tests passing

- ⏸️ **Enable drag painting** — Allow continuous cell painting by dragging mouse/touch
  - Epic: `tasks/enable-drag-painting.md`
  - Status: Implementation complete, awaiting user verification
  - All 58 tests passing
  
## ⏸️ Pending Review: Zoom and Pan

- ⏸️ **Grid zoom and pan** — Enable viewport zoom and drag to track moving patterns
  - Epic: `tasks/implement-grid-zoom-pan.md`
  - Status: Implementation complete, awaiting user verification
  - All 66 tests passing

## Next: Grid Renderer UX Improvements

- 📋 **Refine zoom controls** — Dynamic zoom limits and slower zoom rate
  - Epic: `tasks/refine-zoom-controls.md`
  - Priority: High (improve zoom control usability)

- 📋 **Add drag paint ghost tiles** — Visual preview of cells during drag painting
  - Epic: `tasks/add-drag-paint-ghost-tiles.md`
  - Priority: High (improve drag painting feedback and accuracy)

## 📋 Next: Life Garden Mode (New Branch)

- 📋 **Implement Life Garden mode** — Add player-controlled birth mode
  - Epic: `tasks/implement-life-garden-mode.md`
  - Priority: HIGH (core game mode, unique value proposition)
  - Branch: `LifeGarden`
  - Features: Mode toggle, birth candidate highlighting, Skip button, turn-based flow
  - Subtasks:
    - ✅ Mode Toggle System (completed 2026-02-04)
    - 📋 **Birth Candidate Highlighting** — Visualize valid birth positions
      - Epic: `tasks/birth-candidate-highlighting.md`
      - Status: Planned, ready for execution

## 🚧 In Progress: Goal Challenge Loop (Life Garden Progression)

- ✅ **Add puzzle mode** — Curated challenge mode with pre-seeded life and map goals
  - Epic: `tasks/add-puzzle-mode.md`
  - Priority: HIGHEST (defines the intended challenge experience)
  - Status: Completed (approved)
  - Scope:
    - Add `puzzle` as a dedicated mode variant
    - Load pre-generated goals and seeded stable starting cells
    - Add finite seed economy for player births
    - Add inert obstacles that cannot be grown through
    - Preserve deterministic replay/restart per puzzle map

- ✅ **Add puzzle progression** — Advance to subsequent puzzles after player confirms win
  - Epic: `tasks/add-puzzle-progression.md`
  - Priority: HIGHEST (enables campaign-style challenge loop)
  - Status: Completed (user confirmed 3 puzzles + seed limit work)
  - Scope:
    - Add explicit `I won` confirmation action in puzzle win state
    - Track puzzle index/order and completion progression
    - Load next puzzle map after confirmed victory
    - Support terminal completion when final puzzle is cleared

- ⏸️ **Puzzle playspace view** — Limit grid view and zoom/center on puzzle playspace
  - Epic: `tasks/puzzle-playspace-view.md`
  - Priority: HIGH (improves puzzle readability and focus)
  - Status: Implementation complete, awaiting user verification
  - Scope:
    - Derive or define playspace region from puzzle cells/goals/obstacles
    - On puzzle load/reset, center view and zoom to fit playspace
    - Optional pan/zoom limits in puzzle mode so playspace stays in focus
    - No change to grid dimensions or simulation; view-only

- 🚧 **Add goal tiles** — Define one or more map target cells that growth must reach
  - Epic: `tasks/add-goal-tiles.md`
  - Priority: HIGH (core objective loop for challenge mode)
  - Status: Runtime visibility issue found; goal markers not appearing in gameplay
  - Scope:
    - Add goal cell data to state (single or multiple goals)
    - Render goals as distinct map markers
    - Add win condition: any live growth reaches a goal tile
    - Add success feedback/UI state when goal is reached

- 📋 **Fix goal tile runtime placement/visibility** — Ensure goals are injected into live Life Garden runs
  - Epic: `tasks/fix-goal-tiles-visibility.md`
  - Priority: HIGH (blocks challenge loop usability)
  - Scope:
    - Ensure non-empty `goalTiles` are set during Life Garden gameplay setup/reset
    - Verify state-to-UI wiring from page/container into `GridCanvas`
    - Add integration tests proving goal markers appear in real app flow

- 📋 **Add seed limit economy** — Restrict player births to finite resources per run
  - Epic: `tasks/add-seed-limit.md` (to create)
  - Priority: HIGH (introduces meaningful player decisions)
  - Scope:
    - Add `seedsRemaining` to Life Garden state
    - Decrement on valid player birth, not on invalid clicks
    - Disable birth placement when seeds are exhausted
    - Keep `Skip` available at zero seeds
    - Add lose/fail condition if no seeds remain and no path to goal

- 📋 **Add obstacle tiles** — Place inert map cells that cannot be occupied or grown through
  - Epic: `tasks/add-obstacles.md` (to create)
  - Priority: HIGH (enables level design and route shaping)
  - Scope:
    - Add obstacle coordinates to map state
    - Treat obstacles as permanently blocked/inert cells in engine stepping
    - Prevent player placement on obstacles
    - Render obstacles as a separate immutable layer

### Recommended implementation order for challenge mode

1. Stabilize Life Garden turn flow (choice/advance/reveal + Skip).
2. Add obstacle support in simulation and renderer (foundation for map constraints).
3. Add goal tiles and goal-reached win detection.
4. Add seed-limit resource system and fail-state checks.
5. Add curated challenge maps that combine goals + obstacles + seed limits.

## Future: User Journey Testing

- Create first user journey for testing
- Run end-to-end tests with user test scripts

Implementation order is defined in `ARCHITECTURE.md` (section "Next steps").

