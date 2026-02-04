# ConwayGame — Vision

## Why

Interactive cellular-automata simulations are one of the fastest ways to feel "complexity from simple rules." This project exists to make **Conway's Game of Life immediately playable, learnable, and shareable** in a modern web experience.

## Primary Experience: GoL Sandbox/Simulator

A browser-based playground where users can draw, step, play/pause, and explore Conway's Game of Life with minimal friction.

### Assumptions (explicit, easy to revise)

- **Browser-based**: Next.js + React, deployed on Vercel
- **Single-player, local-first** (no backend required for v1)
- **Deterministic engine**: patterns behave identically across devices and sessions
- **Classic GoL rules by default**: births and deaths follow standard Conway rules

## Product goals (v1)

### Classic GoL Sandbox (primary)

- **Fast, delightful simulation**: step, play, pause, speed control; smooth interaction even on larger grids
- **Great editor workflow**: paint cells, pan/zoom, clear/reset, undo/redo (or an equivalent low-friction workflow)
- **Pattern literacy**: seed common patterns (glider, oscillator, etc.) and let users experiment quickly
- **Shareability**: export/import patterns (file + copy/paste text; URL encoding is ideal if practical)
- **Accessibility + responsiveness**: works well on desktop; usable on mobile/tablet

### Life Garden Mode (optional game variant)

An alternative mode that uses the same engine but **replaces automatic births with player-controlled choices**:

- Each generation, the system highlights valid birth candidates (empty cells with exactly 3 neighbors)
- Player may place **at most one** new cell or **Skip**
- Survival/death remain automatic (classic GoL rules)
- Clear mode entry/exit so users understand the rule change
- Uses same sharing/persistence infrastructure

This mode turns observation into "gardening"—every tap shapes emergence directly.

## Non-goals (v1)

- Multiplayer, realtime collaboration, accounts, or social feeds
- Heavy 3D visuals or "gamey" progression systems for the sandbox
- Arbitrary compute plugins or untrusted user code execution
- Leaderboards, monetization, or premium gating

## Target users

- **Curious learners**: want to understand emergent behavior by experimentation
- **Tinkerers**: want a high-quality sandbox for designing patterns
- **Teachers/demoers**: need a reliable, clean presentation tool
- **Puzzle-minded players** (Life Garden mode): want simple rules and strategic depth

## Core experience loop (Sandbox)

Draw or seed a starting state → run/step the simulation → observe emergent behavior → tweak pattern or rules → share or save the result.

## UX principles

- **Instant feedback**: interactions respond immediately; no modal-heavy workflows
- **Clarity over cleverness**: visible controls, predictable editing, easy reset
- **Determinism + trust**: if you share a pattern, it reproduces faithfully
- **Small surprises**: subtle motion/feedback that supports understanding, not distraction

## Success criteria (v1)

- A new user can: draw cells, start/stop, step, change speed, reset, and import/export within minutes
- The simulation remains responsive at a "reasonably large" grid (exact targets will be set in `ARCHITECTURE.md` once we choose rendering strategy)
- The codebase keeps a clean separation between:
  - **Pure simulation core** (rules engine)
  - **State management** (Redux)
  - **Side effects** (timers, persistence, URL sync via redux-saga)
  - **UI** (React components)
- Life Garden mode can be toggled without duplicating engine logic

## Key constraints / decisions (initial)

- **Web stack**: Next.js + React, deploy on Vercel
- **State**: Redux (no Redux Toolkit). Side effects via **redux-saga**
- **UI**: Shadcn UI (use design-system components where applicable)
- **Architecture constraint**: keep the simulation "step" function pure and testable; rendering is a consumer of state, not the source of truth
- **Mode architecture**: Life Garden shares the same grid/step engine but overrides birth logic via a mode flag + player input

## Open questions (to resolve while drafting architecture)

- Grid representation: fixed-size vs infinite plane (tiled/chunked), and how we bound it for v1
- Rendering strategy: Canvas vs WebGL vs DOM grid, and performance targets
- Share format: RLE support? Custom compact encoding? URL length constraints
- Undo/redo: full state snapshots vs command log
- Mode switching UX: how to clearly signal rule changes when entering Life Garden mode
