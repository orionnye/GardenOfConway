# ConwayGame

A browser-based Conway's Game of Life playground with an optional **Life Garden** game mode where you control when cells are born.

## What is this?

**Primary experience**: Classic GoL sandbox — draw patterns, step/play/pause, explore emergence.

**Optional mode**: Life Garden — survival/death are automatic, but you choose where (and whether) to place new life each generation.

## Project Status

🚧 **Planning phase complete** — vision, architecture, and MVP spec defined.

Next: Bootstrap + implement pure simulation engine.

## Key Documents

- **`vision.md`** — Product vision and goals (source of truth)
- **`ARCHITECTURE.md`** — Technical structure, module boundaries, data flow
- **`LIFE-GARDEN-MVP.md`** — Implementable MVP extraction
- **`LIFE-GARDEN-GDD.md`** — Full game design document
- **`plan.md`** — Current task/epic status

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **UI**: React + Shadcn UI
- **State**: Redux (Autodux pattern, no Redux Toolkit)
- **Side Effects**: redux-saga
- **Testing**: Vitest + Riteway
- **Deployment**: Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Run development server (http://localhost:8080)
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Testing

```bash
# Run tests once
npm test

# Run tests in watch mode (TDD workflow)
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

## Installed Libraries

- **PixiJS v8** — WebGL rendering for high-performance grid visualization
- **Vitest** — Fast test runner with TypeScript support
- **Riteway** — Assertion library (per TDD rules)
- **@testing-library/react** — React component testing utilities
- **Redux + react-redux** — State management (Autodux pattern, no Redux Toolkit)
- **redux-saga** — Side effects management (timers, persistence, I/O)
- **@paralleldrive/cuid2** — ID generation for Autodux

## User Testing

User test scripts are available in the `plan/` directory:
- **Human test**: `plan/basic-gol-sandbox-human-test.md` — Think-aloud protocol with screen recording
- **Agent test**: `plan/basic-gol-sandbox-agent-test.md` — Executable browser automation script

To run agent tests (when UI is implemented):
```bash
# See ai/commands/run-test.md for execution instructions
```

## AI Agent Workflow

This project uses structured AI-assisted development:

- See `AGENTS.md` for agent guidelines
- See `ai/` directory for commands, rules, and workflows
- Before any task, agents must read `vision.md`

## License

_(To be determined)_
