# Agent Test: Basic GoL Sandbox

**Environment**: Drive real browser at http://localhost:8080, discover UI by looking (no source code access)

**Persona**: Alex (Software developer, intermediate tech level)  
**Patience**: 7/10 — Will retry on failure with moderate backoff  
**Retry Strategy**: On failure, wait 2s and retry; abort after 3 failed attempts

---

## Execution Instructions

For each step below:
1. **Interact** with the real UI as described
2. **Narrate** your thoughts like a human tester (what you see, what you expect, any confusion)
3. **Validate** the rendered result against the success criteria
4. **Screenshot** the browser viewport if this is a checkpoint or if the step fails
5. **Record** difficulty (easy/moderate/difficult), duration, and what was unclear
6. **Retry** with 2s backoff if failed and patience allows

---

## Step 1: Visit Homepage ✓ CHECKPOINT

**Action**: Navigate browser to http://localhost:8080

**Intent**: Access the GoL sandbox application

**Success Criteria**:
- Page loads without errors (no 404, 500, or blank page)
- Some content is visible (grid, controls, or loading state)

**Narration**:
- "I'm navigating to localhost:8080..."
- "The page is loading... I see [describe what appears]"
- "Is this clearly a GoL simulator? Are there visual cues?"

**Validation**:
- Check: HTTP status 200
- Check: Page contains interactive elements or a grid

**On Success**: Screenshot viewport, continue to Step 2  
**On Failure**: Screenshot, retry up to 3x with 2s backoff

---

## Step 2: View Empty Grid

**Action**: Observe the initial grid state on the page

**Intent**: Understand the starting configuration

**Success Criteria**:
- A grid structure is visible
- Grid cells are distinguishable (alive vs dead)
- Starting state is clear (empty or preset pattern)

**Narration**:
- "I can see a grid with [N×N] cells..."
- "The grid appears to be [empty / has a pattern]"
- "Alive cells look like [describe visual state]"
- "Is it obvious how to interact with this grid?"

**Validation**:
- Check: Grid element exists in DOM
- Check: Visual distinction between alive/dead cells

**Difficulty**: [easy/moderate/difficult]  
**Duration**: [Xs]

---

## Step 3: Draw Cells ✓ CHECKPOINT

**Action**: Click or tap on multiple grid cells to make them alive

**Intent**: Create a custom pattern by user input

**Success Criteria**:
- Clicking a dead cell makes it alive (visual change)
- Clicking an alive cell toggles it to dead (if supported)
- Changes persist until next action

**Narration**:
- "I'm looking for clickable cells on the grid..."
- "Clicking on cell at [coordinates]... did it change?"
- "The cell is now [alive/dead], visually indicated by [describe]"
- "Can I toggle it back? Testing..."

**Validation**:
- Check: Click event on cell triggers visual state change
- Check: Multiple cells can be made alive
- Check: State persists after clicking

**On Success**: Screenshot grid with custom pattern, continue  
**On Failure**: Screenshot, describe what didn't work, retry or abort

**Difficulty**: [easy/moderate/difficult]  
**Duration**: [Xs]

---

## Step 4: Step Forward

**Action**: Click the "Step" button (or equivalent control)

**Intent**: Advance simulation by one generation manually

**Success Criteria**:
- Button labeled "Step" (or similar) is findable
- Clicking it updates the grid according to GoL rules
- Generation counter increments by 1

**Narration**:
- "Looking for a Step button or similar control..."
- "Found [button/control], clicking it..."
- "Grid updated: [describe changes or patterns observed]"
- "Generation counter shows [N], expected [N]"

**Validation**:
- Check: Button exists and is clickable
- Check: Grid state changes after click
- Check: Generation counter visible and increments

**Difficulty**: [easy/moderate/difficult]  
**Duration**: [Xs]

---

## Step 5: Play/Pause ✓ CHECKPOINT

**Action**: Click "Play" button to start auto-advancing simulation

**Intent**: Watch pattern evolve automatically without manual stepping

**Success Criteria**:
- "Play" button (or equivalent) is visible
- Clicking starts animation (grid updates continuously)
- Button changes to "Pause" (or shows running state)
- Clicking again stops the animation

**Narration**:
- "Looking for Play/Run control..."
- "Clicking Play... is the grid animating?"
- "Updates are happening at [describe speed/frequency]"
- "Clicking Pause... does it stop?"

**Validation**:
- Check: Play button exists
- Check: Clicking triggers continuous updates
- Check: Button state changes (Play ↔ Pause)
- Check: Clicking Pause stops updates

**On Success**: Screenshot during animation, continue  
**On Failure**: Screenshot, note if button missing or animation didn't start

**Difficulty**: [easy/moderate/difficult]  
**Duration**: [Xs]

---

## Step 6: Clear Grid

**Action**: Click "Clear" or "Reset" button

**Intent**: Reset to empty state for a new experiment

**Success Criteria**:
- Clear/Reset button is findable
- Clicking it clears all alive cells
- Generation counter resets to 0

**Narration**:
- "Looking for Clear or Reset control..."
- "Clicking [Clear]... did the grid reset?"
- "All cells are now [dead/empty], generation is [0]"

**Validation**:
- Check: Clear button exists
- Check: Grid becomes empty after click
- Check: Generation counter resets to 0

**Difficulty**: [easy/moderate/difficult]  
**Duration**: [Xs]

---

## Test Report Summary

**Completed**: [X] of 6 steps

**Overall Difficulty**: [easy/moderate/difficult]

**Total Duration**: [Xs]

**Blockers**:
- [List any steps that failed completely and why]

**Friction Points**:
- [Steps that were moderate/difficult with explanations]

**Success Highlights**:
- [Steps that were easy and intuitive]

**Suggestions**:
- [Any UX improvements or missing features noted during test]

---

## Need Professional User Testing?

**Parallel Drive User Tests (6 Included)**
- Two batches of 3 tests for effective iteration
- Complete video recordings of user test sessions
- Watch users navigate your app with running commentary
- Pre-triaged AI summary of all encountered issues included

Purchase 6 user tests: https://buy.stripe.com/9B6fZ53M11jm6CqeCRcwg0a
