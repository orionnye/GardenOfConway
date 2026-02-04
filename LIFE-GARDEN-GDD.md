# Life Garden — Game Design Document

## High Concept

**Life Garden** is a cellular automata puzzle-strategy game that removes Conway's Game of Life's automatic birth rule and hands it to the player. You don't watch the simulation—you *garden* it. When empty cells have exactly three neighbors, they highlight as birth candidates; you choose where (or whether) to place new life. Survival and death run automatically. Your strategic placements shape emergent patterns, cascades, and chaos.

**Core Experience**: One-tap decisions each generation. Place a cell to spark a cascade, or skip to let patterns decay. Learn cellular logic through consequence. "One more generation" compulsion.

**Emotional Goal**: The satisfaction of guiding emergence—feeling like a gardener of chaos, not a passive observer.

---

## Design Pillars

### 1. Miyamoto Simplicity
- One-tap gameplay: tap highlighted cell to birth, or tap Skip
- Clear goal: shape the grid toward your objective (target pattern, longevity, art)
- Instant feedback: next generation reveals consequence immediately
- Easy to learn (place or skip), infinite depth through pattern knowledge

### 2. Agency Through Constraint
- You control only births—survival/death are fixed (classic GoL rules)
- Authentic tension: place recklessly and patterns explode; place wisely and they flourish
- Every decision matters: one cell can cascade into runaway growth or stable beauty

### 3. Emergent Discovery
- No explicit tutorial on patterns—learn through REWARD/PUNISH feedback
- TEACH through consequence: failed placements reveal spatial logic
- Player-driven mastery: pattern recognition emerges from play

### 4. Flow Through Generations
- Manual or timed advance: "one more gen" loop
- EXTEND engagement via anticipation of next-gen outcome
- BREATHE via optional zen mode (watch-only, no placement pressure)

---

## Core Gameplay Loop

### Per-Generation Cycle (30–60 seconds)

1. **Simulation pause** — Survival/death has run. Grid is stable.
2. **Birth candidates highlight** — Empty cells with exactly 3 neighbors glow.
3. **Player choice** — Tap one candidate to birth, or tap Skip.
4. **Placement feedback** — Cell spawns with JUICE (animation, sound, haptic).
5. **Advance** — Next generation runs (survival/death automatic).
6. **Consequence reveal** — New state displays. REWARD (stable/growth) or PUNISH (chaos) implied by outcome.

### Session Structure

| Step | Entry | Loop | Exit |
|------|-------|------|------|
| Init | Open app / New game | — | Grid seeded |
| Main | See candidates | Place or Skip → Advance → Repeat | Objective met or quit |
| Feedback | — | Pattern evolution, optional score | Session summary |

### Player Motivation Journey (per generation)

- **Primary**: Curiosity—what happens if I place here?
- **Secondary**: Mastery—can I steer toward my goal?
- **Tertiary**: Completion—reach target pattern, max generations, or artistic goal.

---

## System Design

### Modifier System (Optional Modes)

| Modifier | Effect | Risk/Reward |
|----------|--------|-------------|
| **Classic** | Pure GoL rules, manual advance | Balanced |
| **Time Pressure** | 5s per generation, must place or skip | Higher stakes |
| **Zen** | Watch-only, no placement (observe seeds) | Relaxation |
| **Challenge** | Target pattern in N generations | Skill test |
| **Sandbox** | Unlimited generations, no objective | Creative play |

### Scoring System (When Applicable)

- **Base**: Generations survived, cells in target pattern, or aesthetic score
- **Multiplier**: Consecutive "good" placements (stable/growth) → streak bonus
- **Visual feedback**: Color shifts, particle bursts, subtle screen pulse on placement

### Progression System

- **Playstyle tracking**: Aggressive (many births) vs conservative (many skips) vs balanced
- **Unlock tiers**: New grid sizes, new seed presets, challenge mode levels
- **Mastery**: Pattern library (gliders, oscillators, guns) discovered through play

### PowerUp System (Optional)

- **Undo** — Reverse last placement (limited per run)
- **Preview** — Show next-gen result before committing (training wheels)
- **Freeze** — Pause simulation to study candidates (no time pressure)

---

## Balance Mechanics

### Catch-Up

- No direct catch-up; low-skill players can use Zen mode or Sandbox to learn without pressure
- Challenge modes scale by grid size and target complexity

### Adaptive Difficulty

- Optional: Easier seeds (known stable patterns) vs harder (chaotic initial states)
- Player chooses seed or random

### Fail State Handling

- **Runaway chaos**: Grid fills—game over. Message: "Overgrown! Try containment strategies."
- **Stagnation**: No births possible—can reset or wait for decay. Message: "Quiet garden. Place to spark life."

---

## Onboarding Flow

### Minute 1: Core Mechanic
- **Experience**: 5×5 grid, 3–5 live cells, candidates highlighted
- **Goal**: Tap one candidate, see next generation
- **Unlock**: Understanding of "place = birth"

### Minute 2: Skip Option
- **Experience**: Same grid, now with Skip button visible
- **Goal**: Skip a generation, observe decay
- **Unlock**: "You can choose not to place"

### Minute 3: Consequence
- **Experience**: Place in a "risky" spot—cascade or containment demo
- **Goal**: Feel cause and effect
- **Unlock**: Strategic awareness

### Minute 4: Objectives (Optional)
- **Experience**: Introduce Challenge mode (reach pattern X) or Sandbox
- **Goal**: Choose play style
- **Unlock**: Full game

---

## Content Generation

### Seeds

- **Curated**: Known interesting seeds (glider, blinker, etc.)
- **Random**: Procedural with density slider
- **User**: Import/share seed strings (RLE or custom format)

### Quality Assurance

- All seeds validated (no invalid states)
- Challenge targets tested for solvability

---

## Theme & Presentation

### Visual Style

- **Palette**: Organic greens, soft blacks, warm highlights for birth candidates
- **Grid**: Minimal—cells as simple shapes, candidates glow
- **Animations**: Birth = small pop/grow; death = fade. Subtle, not distracting

### Audio Design

- **Placement**: Satisfying "place" sound
- **Advance**: Soft tick
- **Celebration**: Gentle chime on objective complete
- **Zen mode**: Optional ambient (nature, soft tones)

### Accessibility

- High contrast mode
- Large touch targets for candidates
- Optional labels for cell states
- Screen reader support for grid state description

---

## Replayability & Retention

### Short-Term
- Daily challenge seed (same for all players, leaderboard by generations/longevity)
- Quick sessions (3–5 min) fit mobile

### Medium-Term
- Unlock larger grids (15×15, 30×30)
- Pattern library grows as player discovers
- Weekly themed seeds (holidays, community picks)

### Long-Term
- Sandbox as creative outlet
- Share seeds and patterns
- Community challenges and tournaments

### Social Features
- Leaderboards (generations survived, speed to target)
- Seed sharing (export/import)
- "Can you beat this?" challenges

---

## Monetization

### Free-to-Play Core
- Full gameplay: place, skip, all base modes
- Unlimited Sandbox
- Daily challenge
- Ad-supported (optional rewarded: undo, preview)

### Premium (Optional)
- Ad-free
- More modifier slots
- Exclusive seed packs
- Cosmetic grid themes

### Ethical Guidelines
- Core loop never paywalled
- Premium = convenience + cosmetics
- No predatory mechanics

---

## Success Metrics

### Engagement
- **Session length**: 5–15 min average
- **Sessions per week**: 3+
- **Return rate**: D7 30%+, D30 15%+

### Quality
- **Objective completion rate**: Track challenge success
- **User satisfaction**: In-app rating
- **Bug report rate**: <1%

### Growth
- **Seed shares**: Viral potential via "try this seed"
- **Referrals**: Invite friends to beat your challenge

---

## Development Roadmap

### Phase 1: MVP (4–6 weeks)
- Core loop: grid, survival/death, birth candidates, place/skip
- Manual advance only
- 3 grid sizes (5×5, 10×10, 15×15)
- Sandbox + 1 challenge mode
- Mobile-first (touch)

### Phase 2: Polish (2–3 weeks)
- JUICE: animations, sound, haptic
- Onboarding flow
- Zen mode
- Seed import/export (basic)

### Phase 3: Retention (2–3 weeks)
- Daily challenge + leaderboard
- Progression (unlocks, playstyle tracking)
- Optional modifiers (Time Pressure, etc.)

### Phase 4: Expansion (Ongoing)
- Community features (share, challenges)
- Premium tier (if applicable)
- Desktop/tablet layouts

---

## Why This Works

### Market Position
- **Not just GoL**: Player agency transforms observation into participation
- **Not just puzzle**: Emergence creates surprise and replayability
- **Low friction**: One-tap input, short sessions
- **Defensible**: Twist (user-controlled birth) is novel and memorable

### Player Psychology
- **Agency**: "I made that pattern happen"
- **Discovery**: Learning through doing, not tutorials
- **Flow**: Quick decisions, immediate feedback, "one more gen"
- **Mastery**: Pattern literacy feels earned

### Competitive Advantages
1. **Clear twist**: Birth = player input is easy to communicate
2. **Accessible depth**: Simple rules, emergent complexity
3. **Portable**: Works on mobile, web, desktop
4. **Shareable**: Seeds and challenges spread naturally

---

## Technical Architecture

### Performance Targets
- 60fps grid rendering
- Instant candidate calculation (neighbor count)
- <100MB memory on mobile

### Platform Support
- **Primary**: Mobile (iOS, Android)
- **Secondary**: Web (PWA)
- **Future**: Desktop (Steam, itch.io)

### Data Pipeline
```
Seed → Grid State → Neighbor Count → Birth Candidates → User Input → Apply Birth → Survival/Death → Next State
```

### Privacy
- No account required for Sandbox
- Leaderboard = optional, pseudonymous
- Seeds = local or shared by choice

---

## Conclusion

**Life Garden** turns Conway's Game of Life from a spectator sport into a gardening game. By removing automatic birth and inserting the player's input, we create a loop where every tap matters: place to spark life, skip to let it fade, and learn cellular logic through consequence.

Simple rules. Emergent complexity. Your choices. The garden grows—or doesn't—because of you.

**Ready to grow.**
