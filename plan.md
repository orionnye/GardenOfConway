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

## Future: User Journey Testing

- Create first user journey for testing
- Run end-to-end tests with user test scripts

Implementation order is defined in `ARCHITECTURE.md` (section "Next steps").

