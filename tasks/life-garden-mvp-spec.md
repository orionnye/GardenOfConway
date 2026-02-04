# Life Garden MVP Spec Epic

**Status**: ✅ COMPLETED (2026-02-03)  
**Goal**: Extract a crisp, implementable MVP spec from `LIFE-GARDEN-GDD.md` (rules, state machine, modes, and acceptance requirements).

## Overview

WHY: Turn the GDD into an unambiguous MVP definition so engineering can implement the core “player-controlled births” loop without scope drift or rule-ordering bugs.

---

## MVP Definition (Doc Output)

Create a 1-page MVP spec document that is explicit enough to build against.

**Requirements**:
- Given the full GDD, should define the exact Life Garden automaton rules (including action limits and ordering per generation).
- Given a generation boundary, should specify a state machine that separates resolved state, candidate computation, player choice, and advance.
- Given MVP scope, should separate MVP features from later/optional systems (powerups, monetization, leaderboards).
- Given a player session, should define measurable fail states and at least one measurable objective type for MVP.
- Given sharing/import needs, should define an MVP seed format requirement (even if implementation is deferred).
- Given the repo vision, should explicitly declare whether “Life Garden” is the primary experience or a mode alongside classic GoL sandbox.

---

## Rule Set (MVP)

Define the rules in a formal, implementable way.

**Requirements**:
- Given a grid state at generation \(t\), should compute neighbor counts from state \(t\) using 8-neighborhood (Moore neighborhood).
- Given a cell is alive at \(t\), should survive to \(t+1\) iff it has exactly 2 or 3 alive neighbors at \(t\); otherwise it dies.
- Given a cell is empty at \(t\), should only become alive at \(t+1\) if and only if the player explicitly chooses it as a birth AND it is a valid birth candidate (exactly 3 alive neighbors at \(t\)).
- Given a generation \(t\), should allow at most one player birth action (choose 1 candidate) or no action (Skip).
- Given no candidate is chosen, should advance to \(t+1\) applying survival/death only.

---

## Candidate Highlighting (MVP)

Define what the UI highlights and when.

**Requirements**:
- Given a resolved post-advance state at generation \(t\), should compute and highlight all empty cells with exactly 3 alive neighbors as birth candidates for generation \(t\).
- Given a player attempts to birth a non-candidate cell, should reject the action (no state change) and provide feedback.
- Given a player births a highlighted candidate, should show immediate placement feedback before advancing.

---

## Generation State Machine (MVP)

Define the per-generation sequence to avoid off-by-one bugs.

**Requirements**:
- Given a new generation begins, should enter a “CHOICE” phase where candidates are visible and the simulation is not auto-advancing.
- Given the player chooses a candidate or presses Skip, should transition to an “ADVANCE” phase that computes next state deterministically.
- Given “ADVANCE” completes, should transition to a “REVEAL” phase that presents the new state and then returns to “CHOICE”.

---

## Modes & Scope (MVP)

Lock a minimal set of modes to ship the core loop.

**Requirements**:
- Given v1 scope, should ship “Classic Life Garden” mode (manual advance / per-generation choice).
- Given v1 scope, should not include leaderboards, accounts, monetization, or premium gating.
- Given v1 scope, should treat Undo/Preview/Freeze as out-of-scope unless explicitly promoted into MVP.

---

## Grid Constraints & Performance Targets (MVP)

Set realistic targets that drive rendering/engine decisions.

**Requirements**:
- Given the MVP, should support at least the three grid sizes called out in the GDD (5×5, 10×10, 15×15).
- Given the MVP, should define a “game over” threshold for overgrowth (e.g., all cells alive) and a “quiet” threshold for stagnation (e.g., zero candidates for N consecutive generations).
- Given mobile-first, should define a performance target that is testable (e.g., advance step under X ms for 15×15 on a mid-tier device class).

---

## Seeds / Import / Export (MVP)

Define how sessions start and how patterns can be shared.

**Requirements**:
- Given a new session, should support starting from a curated seed and a random seed with a density parameter.
- Given a seed is generated or chosen, should represent it in a deterministic, serializable format suitable for later import/export.

---

## Vision Alignment Decision (MVP)

Choose how this relates to the repo’s current `vision.md`.

**Requirements**:
- Given the current `vision.md` describes a GoL sandbox, should decide and document whether Life Garden is the primary app or a mode within a broader sandbox.

