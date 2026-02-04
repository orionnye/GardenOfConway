# Test: Basic GoL Sandbox (Human Test Script)

**Persona**: Alex — Software developer curious about cellular automata  
**Tech Level**: Expert  
**Patience**: 7/10  
**Goals**: Quickly experiment with GoL patterns, understand the sandbox controls

## Pre-test

- Start screen recording
- Clear browser state (cookies, cache, localStorage)
- Ensure localhost:8080 is running (`npm run dev`)

## Instructions

Read each step out loud before attempting it. Think aloud as you work - this helps reviewers follow along. Express any confusion, surprises, or friction you encounter.

## Steps

### Step 1: Visit Homepage

- **Goal**: Access the GoL sandbox
- **Do**: Navigate to http://localhost:8080 in your browser
- **Think aloud**: What do you see when the page loads? Is it clear what this application does?
- **Success**: Page loads and displays the application (grid or interface visible)
- **✓ CHECKPOINT** — Take a screenshot

---

### Step 2: View Empty Grid

- **Goal**: Understand the starting point
- **Do**: Observe the initial grid state
- **Think aloud**: Do you see a grid? Is it empty or does it show a pattern? Are there any controls visible?
- **Success**: Grid is visible and you can tell whether cells are alive or dead

---

### Step 3: Draw Cells

- **Goal**: Create a custom starting pattern
- **Do**: Click or tap on grid cells to make them alive
- **Think aloud**: How do you know which cells are "alive"? Can you toggle them on/off? Is it clear how to interact?
- **Success**: Clicked cells become alive and are visually highlighted
- **✓ CHECKPOINT** — Take a screenshot

---

### Step 4: Step Forward

- **Goal**: Advance the simulation by one generation
- **Do**: Click the "Step" button (or equivalent control)
- **Think aloud**: Can you find the Step control? What happens when you click it? Does the grid change? Do you see a generation counter?
- **Success**: Grid updates according to GoL rules, generation counter increments by 1

---

### Step 5: Play/Pause

- **Goal**: Watch the pattern evolve automatically
- **Do**: Click the "Play" button to start auto-advancing
- **Think aloud**: Is there a Play button? What happens when you click it? Does the pattern animate? Can you stop it?
- **Success**: Grid continuously updates at set speed; button changes to "Pause" (or equivalent state)
- **✓ CHECKPOINT** — Take a screenshot while running

---

### Step 6: Clear Grid

- **Goal**: Reset to empty state for new experiment
- **Do**: Click the "Clear" button
- **Think aloud**: Is there a Clear/Reset control? What do you expect to happen? Does it work as expected?
- **Success**: All cells become dead, generation resets to 0

---

## Post-test

- Stop screen recording
- **Reflection questions**:
  - What was confusing or unclear?
  - What worked well?
  - Would you use this to explore GoL patterns in real life?
  - Any features you expected but didn't find?
  - How would you rate the overall experience (1-10)?

---

**Thank you for testing!** Your feedback helps us improve the experience.
