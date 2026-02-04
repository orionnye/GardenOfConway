# Setup PixiJS + Vitest Epic

**Status**: ✅ COMPLETED (2026-02-04)  
**Goal**: Add PixiJS for WebGL rendering and Vitest for testing framework.

## Overview

WHY: PixiJS provides high-performance WebGL rendering for the grid (supports large grids 100×100+). Vitest aligns with the TDD workflow and integrates cleanly with TypeScript.

---

## Install PixiJS

Add PixiJS for WebGL-based grid rendering.

**Requirements**:
- Given the architecture specifies rendering strategy, should install PixiJS v8 (latest stable).
- Given TypeScript is used, should include PixiJS type definitions.

---

## Install Vitest + Testing Dependencies

Set up Vitest with Riteway assertion library per TDD rules.

**Requirements**:
- Given TDD workflow requires testing, should install Vitest as the test runner.
- Given the stack uses Riteway for assertions, should install riteway library.
- Given React components need testing, should install @testing-library/react and jsdom.

---

## Configure Vitest

Create Vitest config aligned with project structure.

**Requirements**:
- Given tests are colocated with source, should configure Vitest to find `*.test.ts` and `*.test.tsx` files.
- Given the project uses TypeScript path aliases (@/*), should configure Vitest to resolve them.
- Given React components need jsdom, should configure test environment as jsdom.

---

## Add Test Scripts

Update package.json with test commands.

**Requirements**:
- Given developers need to run tests, should add `test` script to package.json.
- Given TDD workflow requires watch mode, should add `test:watch` script.
