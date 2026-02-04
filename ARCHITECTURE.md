# ConwayGame — Architecture

This document defines the structural organization, data flow, and technical decisions for the ConwayGame project (GoL sandbox with optional Life Garden mode).

## Guiding principles

1. **Pure simulation core**: The grid state + step function must be deterministic, pure, and easily testable
2. **Separation of concerns**: State management (Redux), side effects (redux-saga), and UI (React) live in distinct modules
3. **Mode as configuration**: Life Garden mode shares the simulation engine but overrides birth behavior via a mode flag + player input
4. **Rendering as consumer**: UI reads from state; it never mutates the simulation directly

## Tech stack (from vision.md)

- **Framework**: Next.js (App Router)
- **UI Library**: React (functional components + hooks)
- **State Management**: Redux (no Redux Toolkit; use Autodux pattern from `ai/rules/frameworks/redux/`)
- **Side Effects**: redux-saga
- **UI Components**: Shadcn UI
- **Testing**: Vitest + Riteway (per `ai/rules/tdd.mdc`)
- **Deployment**: Vercel

## High-level architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Next.js App                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Sandbox    │  │ Life Garden  │  │   Settings   │  │
│  │   (page)     │  │   (page)     │  │   (page)     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ▲
                         │ (dispatch actions, read state)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                      Redux Store                        │
│  ┌────────────────────────────────────────────────────┐ │
│  │  Grid State (cells, generation, bounds)           │ │
│  │  Simulation Config (speed, mode, running)         │ │
│  │  UI State (selection, tool, candidate highlights) │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
         ▲                                    ▲
         │ (actions)                          │ (side effects)
         ▼                                    ▼
┌──────────────────┐              ┌──────────────────────┐
│  Pure Functions  │◄─────────────│   Redux Sagas        │
│  (engine/rules)  │              │  (timers, persist,   │
│  • stepGrid()    │              │   URL sync, I/O)     │
│  • getCandidates()│             └──────────────────────┘
│  • applyBirth()  │
└──────────────────┘
```

## Module structure

### `/lib/engine/` — Pure simulation core

**Purpose**: Deterministic, testable, framework-agnostic GoL engine.

**Files**:
- `grid.ts` — Grid representation (`Grid` type, bounds, cell lookup)
- `rules.ts` — Conway rules: `getNeighborCount()`, `stepGrid()`, `getCandidates()` (for Life Garden mode)
- `patterns.ts` — Serialization/deserialization (RLE, custom format), pattern library (glider, blinker, etc.)

**Constraints**:
- No Redux imports
- No side effects (no timers, no I/O)
- All functions pure and testable via unit tests

### `/lib/state/` — Redux state management

**Purpose**: Application state (grid, simulation config, UI) using Autodux pattern.

**Files**:
- `grid-dux.sudo` — Autodux dux object for grid state (cells, generation, bounds)
- `grid-dux.js` — Transpiled Redux slice
- `simulation-dux.sudo` — Autodux for simulation config (mode, speed, isRunning)
- `simulation-dux.js`
- `ui-dux.sudo` — Autodux for UI state (selected tool, candidate highlights, modals)
- `ui-dux.js`
- `selectors.ts` — Memoized selectors (using reselect if needed)
- `store.ts` — Root reducer + store creation

**Constraints**:
- Use Autodux pattern from `ai/rules/frameworks/redux/`
- Never read state directly; always use selectors
- No side effects in reducers

### `/lib/sagas/` — Side effects (redux-saga)

**Purpose**: Handle timers, persistence, URL sync, and async I/O.

**Files**:
- `simulation-saga.ts` — Auto-advance timer (when `isRunning` is true)
- `persistence-saga.ts` — Save/load grid state to localStorage
- `url-saga.ts` — Sync grid state to URL params (for sharing)
- `root-saga.ts` — Combines all sagas

**Constraints**:
- All I/O and timing logic lives here (not in reducers or components)
- Use `redux-saga` patterns: `takeEvery`, `takeLatest`, `call`, `put`, `select`

### `/components/` — React presentation components

**Purpose**: Stateless UI components that receive props and dispatch actions.

**Structure**:
```
/components/
  /grid/
    Grid.tsx          — Main grid renderer (canvas or DOM)
    GridControls.tsx  — Play/pause, step, speed controls
    GridEditor.tsx    — Paint/erase tools (sandbox mode)
  /life-garden/
    CandidateOverlay.tsx — Highlights birth candidates (Life Garden mode)
    PlacementFeedback.tsx — Juice/animation for player births
  /patterns/
    PatternPicker.tsx — Seed selector (glider, blinker, etc.)
    PatternExport.tsx — Export/import UI
  /ui/
    (Shadcn UI components as needed)
```

**Constraints**:
- **Presentation components only** — no direct state mutation
- Use React hooks for local UI state (hover, focus) only
- Dispatch Redux actions via `useDispatch`
- Read state via `useSelector` + selectors

### `/containers/` — React container components

**Purpose**: Wire Redux state + actions to presentation components.

**Files**:
- `GridContainer.tsx` — Connects `<Grid>` to Redux state/actions
- `LifeGardenContainer.tsx` — Connects Life Garden UI to state/actions

**Constraints**:
- Containers should **never** contain direct UI markup (import presentation components instead)
- Use `react-redux` `connect` or hooks (`useSelector`, `useDispatch`)
- No business logic (logic lives in engine or sagas)

### `/app/` — Next.js App Router pages

**Structure**:
```
/app/
  page.tsx           — Landing/home (choose Sandbox or Life Garden)
  sandbox/
    page.tsx         — Classic GoL sandbox
  life-garden/
    page.tsx         — Life Garden game mode
  layout.tsx         — Root layout (global providers, fonts, etc.)
  providers.tsx      — Redux Provider wrapper
```

## Data flow (step-by-step)

### Classic Sandbox mode

1. **User action** (e.g., clicks "Step" button)
2. **Component dispatches** `stepGrid()` action
3. **Reducer** calls `engine/rules.stepGrid()` (pure function), returns new state
4. **State updated** → React components re-render with new grid
5. **Optional saga** (if auto-running): timer dispatches `stepGrid()` at interval

### Life Garden mode

1. **Simulation advances** → candidates computed via `engine/rules.getCandidates()`
2. **UI displays** candidate highlights (derived from state)
3. **User taps candidate** → dispatches `placeBirth(cellId)` action
4. **Reducer validates** candidate, calls `engine/rules.applyBirth()`, updates state
5. **Simulation advances** one generation → reveal new state
6. **Loop repeats** (back to step 1)

## Rendering strategy (TBD — pick one)

### Option A: Canvas 2D

**Pros**: Fast for medium grids (30×30 to 100×100), good mobile performance  
**Cons**: Accessibility harder (need ARIA labels + alternative views)  
**Target**: 60fps for 50×50 grid on mid-tier mobile

### Option B: DOM grid (CSS Grid or flexbox)

**Pros**: Simple, accessible, easy to style with Shadcn/Tailwind  
**Cons**: Performance drops at larger grid sizes (>30×30 may stutter)  
**Target**: 60fps for 15×15 grid on mobile, acceptable for 30×30 on desktop

### Option C: WebGL (via PixiJS or custom)

**Pros**: Highest performance, can handle huge grids (200×200+)  
**Cons**: Overkill for MVP, accessibility requires extra work  
**Target**: 60fps for 100×100+ grid

**Decision for MVP**: Start with **Canvas 2D** (Option A) for 15×15 to 30×30 grids. Add accessibility via ARIA live regions + keyboard nav.

## Performance targets (MVP)

- **Grid sizes**: 5×5, 10×10, 15×15, 30×30
- **Frame rate**: 60fps rendering on mid-tier mobile (iPhone 12 / Pixel 5 equivalent)
- **Step latency**: <16ms to compute next generation (30×30 grid)
- **Memory**: <100MB total on mobile

## Share / persistence format

### Grid state serialization

**Option 1: RLE (Run-Length Encoded)**
- Standard format in GoL community
- Compact for sparse grids
- Example: `3bo$2bob$3o!` (glider)

**Option 2: Custom JSON + URL-safe encoding**
- Store grid bounds + live cell coordinates
- Base64-encode for URL params
- Example: `{"w":30,"h":30,"cells":[[5,5],[5,6],[6,5]]}`

**Decision for MVP**: Support **both**:
- RLE for export/import (community interop)
- Custom JSON + base64 for URL sharing (easier to implement, better debugging)

## Mode switching (Sandbox ↔ Life Garden)

### State changes on mode switch

- **Entering Life Garden**:
  - Set `mode: 'life-garden'` in state
  - Pause auto-advance (player controls timing)
  - Compute initial candidates, highlight them
  - Disable editor tools (paint/erase)

- **Exiting to Sandbox**:
  - Set `mode: 'sandbox'`
  - Re-enable auto-advance + editor tools
  - Clear candidate highlights

### UX clarity

- Show a clear modal/banner on mode entry: "Life Garden mode: you control births"
- Visual distinction (color theme shift, UI layout change)
- "Return to Sandbox" button always visible

## Security considerations (future)

For v1 (offline sandbox), security is minimal. Future considerations:

- **URL sharing**: Validate imported grid state (bounds, cell coordinates) to prevent crashes
- **RLE import**: Parse safely to prevent injection (use a vetted RLE parser or sandbox the parse step)
- **Future backend**: If adding leaderboards/accounts, apply OWASP Top 10 mitigations (see `ai/rules/security/`)

## Testing strategy

- **Engine tests** (`/lib/engine/*.test.ts`): Unit tests for pure functions (rules, patterns)
- **Reducer tests** (`/lib/state/*.test.ts`): Test state transitions via actions
- **Saga tests** (`/lib/sagas/*.test.ts`): Test side effects using `redux-saga-test-plan`
- **Component tests** (`/components/**/*.test.tsx`): Render tests + interaction (Vitest + Testing Library)
- **E2E tests** (future): Use Playwright for full user flows (draw → step → export)

## Folder structure (summary)

```
/ConwayGame
  /app                — Next.js pages (App Router)
  /components         — React presentation components
  /containers         — React-Redux container components
  /lib
    /engine           — Pure simulation logic
    /state            — Redux state (Autodux dux files)
    /sagas            — Side effects (redux-saga)
  /public             — Static assets
  /ai                 — Agent rules + commands
  /tasks              — Epic plans (task-creator.mdc pattern)
  vision.md           — Product vision (source of truth)
  ARCHITECTURE.md     — This file
  LIFE-GARDEN-GDD.md  — Full game design doc
  LIFE-GARDEN-MVP.md  — MVP extraction (build spec)
  plan.md             — Current task/epic index
```

## Next steps (implementation order)

1. **Bootstrap Next.js project** (App Router, TypeScript, Tailwind + Shadcn)
2. **Implement pure engine** (`/lib/engine/grid.ts`, `/lib/engine/rules.ts`) with TDD
3. **Create Redux state** (Autodux dux files for grid + simulation config)
4. **Build basic Grid component** (Canvas 2D renderer)
5. **Add controls** (step, play/pause, reset)
6. **Implement editor tools** (paint/erase for sandbox mode)
7. **Add pattern library** (seed picker for common patterns)
8. **Implement Life Garden mode** (candidate highlights + player birth input)
9. **Add persistence** (localStorage + URL sharing via sagas)
10. **Polish + accessibility** (ARIA labels, keyboard nav, mobile responsiveness)

---

**This architecture is the implementation guide.** All code changes should preserve these module boundaries and data flow patterns.
