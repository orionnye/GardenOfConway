# Setup Redux + Redux-Saga Epic

**Status**: ✅ COMPLETED (2026-02-04)  
**Goal**: Add Redux state management with redux-saga for side effects, using Autodux pattern.

## Overview

WHY: Establish the state management foundation so we can build the pure simulation engine and wire it to UI components cleanly (per `ARCHITECTURE.md`).

---

## Install Redux Dependencies

Add Redux, react-redux, and redux-saga libraries.

**Requirements**:
- Given the stack requires Redux without Redux Toolkit, should install redux and react-redux.
- Given side effects use redux-saga, should install redux-saga.
- Given Autodux uses cuid2 for IDs, should install @paralleldrive/cuid2.
- Given development needs devtools, should install @redux-devtools/extension.

---

## Create Store Infrastructure

Set up the Redux store with saga middleware.

**Requirements**:
- Given the project uses Autodux pattern, should create `/lib/state/store.ts` with root reducer and saga middleware.
- Given development needs debugging, should configure Redux DevTools extension.
- Given Next.js App Router requires providers, should create a Redux Provider wrapper component.

---

## Create Initial Grid Dux (Autodux)

Build the first state slice for grid management using Autodux pattern.

**Requirements**:
- Given the simulation needs grid state, should create `grid-dux.sudo` with initialState for grid cells and generation count.
- Given actions are needed, should define basic actions: `setGrid`, `stepGrid`, `clearGrid`, `resetGrid`.
- Given components need to read state, should define selectors: `getGrid`, `getGeneration`, `getCells`.
- Given Autodux requires transpilation, should transpile to `grid-dux.js`.

---

## Wire Redux to App

Connect Redux store to Next.js application.

**Requirements**:
- Given Next.js App Router requires client-side providers, should wrap app with Redux Provider in layout.
- Given the provider needs to be a client component, should mark it with 'use client' directive.
