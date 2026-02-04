# Life Garden — MVP Extraction (Build Spec)

This is the implementable MVP extracted from `LIFE-GARDEN-GDD.md`. It intentionally excludes optional systems (powerups, monetization, leaderboards) to keep the first build crisp.

## Product statement (MVP)

Life Garden is a cellular automata game variant where **survival/death are automatic** (classic GoL), but **births are player-controlled**. Each generation, the system highlights valid birth candidates; the player may place **at most one** new cell or **Skip**, then the simulation advances one generation and reveals the consequence.

## Formal rules (MVP)

### Grid + neighborhood

- Grid is a finite rectangle of size \(W \times H\) (MVP sizes: 5×5, 10×10, 15×15).
- Neighborhood is Moore (8 adjacent cells).
- Out-of-bounds neighbors are treated as empty (no wraparound) for MVP.

### State and definitions

- Let \(S_t\) be the set of alive cells at generation \(t\).
- For each cell \(c\), let \(n_t(c)\) be the count of alive neighbors of \(c\) in \(S_t\).
- A **birth candidate** at generation \(t\) is any empty cell \(c \notin S_t\) where \(n_t(c) = 3\).

### Player action constraints (key twist)

- On each generation \(t\), the player may choose **zero or one** birth action:
  - **Birth(c)** where \(c\) is a birth candidate at generation \(t\), OR
  - **Skip** (no birth).

Attempting to birth a non-candidate is invalid and does not advance the generation.

### Advance function (deterministic)

The next state \(S_{t+1}\) is computed from \(S_t\) and the optional player-selected birth \(b_t\):

- **Survival/death (automatic)**:
  - For alive cell \(c \in S_t\): it survives into \(S_{t+1}\) iff \(n_t(c) \in \{2,3\}\).
  - Otherwise it is not in \(S_{t+1}\).
- **Birth (player-controlled)**:
  - If the player chose Birth(c) where \(c\) is a valid candidate (\(n_t(c)=3\)), then include \(c\) in \(S_{t+1}\).
  - No other empty cells are born automatically.

This ordering ensures neighbor counts are always computed from \(S_t\), not from partially-updated state.

## Generation state machine (MVP)

### Phases

- **CHOICE**: Show grid \(S_t\). Compute candidates from \(S_t\). Highlight all birth candidates. Await user input.
- **ADVANCE**: On valid Birth(c) or Skip, compute \(S_{t+1}\) deterministically and increment generation counter.
- **REVEAL**: Present the new grid \(S_{t+1}\) (with feedback/juice for the chosen birth if any), then transition back to CHOICE for generation \(t+1\).

### Notes

- The simulation is never “running” in MVP; it advances only via explicit user action (Birth/Skip).
- Candidate highlight is derived data: \(candidates_t = \{ c \notin S_t \mid n_t(c)=3 \}\).

## MVP UX requirements

- **Primary interaction**: tap a highlighted candidate to birth; or tap Skip to advance without a birth.
- **Feedback**:
  - On Birth: immediate, satisfying “pop/grow” animation on the placed cell before/while advancing.
  - On invalid tap: subtle reject feedback (no advance).
- **Clarity**: candidate highlighting must be visually distinct from alive cells and from non-candidate empties.

## MVP session setup (seeds)

Support two start types:

- **Curated seeds**: at least a small set (e.g., blinker, toad, glider-like starts if applicable under player-birth rules).
- **Random seeds**: initial alive placement driven by a density parameter (e.g., 0–100%).

## MVP fail states (measurable)

Choose two explicit end conditions:

- **Overgrown**: all cells alive (\(|S_t| = W \times H\)) → game over.
- **Quiet garden**: no birth candidates for **N** consecutive generations (default \(N=3\)) → offer restart/new seed.

## MVP objectives (pick at least one)

Ship at least one objective type (the rest can be “Sandbox”).

- **Longevity**: survive for \(G\) generations without triggering Overgrown or Quiet garden.

(Optional later: “reach target pattern” requires a formal pattern detection spec; not MVP.)

## MVP scope exclusions (explicit)

Not in MVP unless later promoted:

- Timed pressure mode
- Zen watch-only mode
- Undo / Preview / Freeze powerups
- Progression/unlocks, playstyle tracking
- Daily challenges, leaderboards, social sharing UX
- Monetization/premium

## Vision alignment decision (required next doc change)

Current repo `vision.md` describes a GoL sandbox/simulator. This MVP defines a **game variant**.

Decide one of:

- **A. Life Garden is the primary app**, and classic GoL sandbox becomes a mode/tool later.
- **B. Classic GoL sandbox is primary**, and Life Garden is a mode.

This decision should be reflected in `vision.md` and the forthcoming `ARCHITECTURE.md`.

