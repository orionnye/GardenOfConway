# Fix Test Framework Integration

**Status**: ✅ COMPLETE  
**Goal**: Fix riteway-vitest integration so all 22 tests execute properly instead of being marked as todo.

## Overview

WHY: Test files are using incorrect riteway integration pattern. Tests import from `riteway` instead of `riteway/vitest` and don't wrap assertions in `test()` blocks. This causes all 22 tests to show as `[object Object]` and be marked as "todo", meaning **zero tests are actually running**.

IMPACT: The simulation engine implementation is untested and unvalidated. Critical before considering the implementation production-ready.

---

## Fix Riteway Import Pattern

Update test files to use vitest-specific riteway integration.

**Requirements**:
- Given `lib/engine/rules.test.ts`, should change import from `import { assert } from 'riteway'` to `import { assert } from 'riteway/vitest'`.
- Given `lib/state/grid-dux.test.js`, should change import from `import { assert } from 'riteway'` to `import { assert } from 'riteway/vitest'`.
- Given the riteway/vitest assert, should use vitest's `expect` under the hood for proper test registration.

**Files**:
- `lib/engine/rules.test.ts` (line 2)
- `lib/state/grid-dux.test.js` (line 2)

---

## Wrap Assertions in test() Blocks

Restructure tests to properly register with vitest test runner.

**Requirements**:
- Given a `describe` block with async callback, should convert to standard sync callback.
- Given multiple assertions in describe block, should wrap related assertions in `test()` blocks.
- Given test function names, should describe what's being tested (e.g., `test('isWithinBounds()', ...)`).
- Given existing assertion blocks, should preserve all test cases and their structure.

**Current Pattern (WRONG)**:
```typescript
describe('rules - Grid Utilities', async (assert) => {
  {
    const bounds: Bounds = { width: 10, height: 10 };
    const cell: Cell = { x: 5, y: 5 };

    assert({
      given: 'a cell coordinate and bounds',
      should: 'return true if cell is within bounds',
      actual: isWithinBounds(cell, bounds),
      expected: true,
    });
  }
});
```

**Correct Pattern**:
```typescript
describe('rules - Grid Utilities', () => {
  test('isWithinBounds()', () => {
    {
      const bounds: Bounds = { width: 10, height: 10 };
      const cell: Cell = { x: 5, y: 5 };

      assert({
        given: 'a cell coordinate and bounds',
        should: 'return true if cell is within bounds',
        actual: isWithinBounds(cell, bounds),
        expected: true,
      });
    }
  });
});
```

**Files**:
- `lib/engine/rules.test.ts` (4 describe blocks, needs ~8 test() wrappers)
- `lib/state/grid-dux.test.js` (1 describe block, needs ~7 test() wrappers)

---

## Update Vitest Configuration

Ensure vitest config includes JavaScript test files.

**Requirements**:
- Given `vitest.config.ts`, should include `**/*.test.{ts,tsx,js,jsx}` pattern instead of just `**/*.test.{ts,tsx}`.
- Given the updated pattern, should allow `grid-dux.test.js` to be discovered.

**Files**:
- `vitest.config.ts` (line 12)

---

## Verify Tests Execute

Confirm all tests run and pass.

**Requirements**:
- Given `npm test` is run, should show 22 tests running (not "todo").
- Given test output, should display actual test names instead of `[object Object]`.
- Given all tests, should pass (implementation is correct, only integration was broken).
- Given test coverage, should report on `lib/engine/rules.ts` and `lib/state/grid-dux.js`.

**Acceptance Criteria**:
```
✓ lib/engine/rules.test.ts (22 tests)
  ✓ rules - Grid Utilities (3)
  ✓ rules - Neighbor Counting (5)
  ✓ rules - Conway Step Function (8)
  ✓ rules - Life Garden Mode Support (6)

✓ lib/state/grid-dux.test.js (7 tests)
  ✓ grid-dux (7)

Test Files  2 passed (2)
     Tests  29 passed (29)
```

---

## Test Organization

Consider grouping related assertions for better readability.

**Recommendations**:
- Given multiple related assertions, could group in one `test()` block with multiple assertion blocks.
- Given complex test cases (like blinker pattern), could create dedicated `test()` for clarity.
- Given test names, should be descriptive enough to identify failing test quickly.

**Example Grouping**:
```typescript
describe('rules - Grid Utilities', () => {
  test('isWithinBounds()', () => {
    // Multiple assertion blocks testing different scenarios
    {
      // Test case 1: valid cell
      assert({ ... });
    }
    {
      // Test case 2: edge case
      assert({ ... });
    }
    {
      // Test case 3: negative coordinate
      assert({ ... });
    }
  });
});
```

---

## Success Metrics

- [x] All tests in `rules.test.ts` execute and pass (5 test blocks)
- [x] All tests in `grid-dux.test.js` execute and pass (7 test blocks)
- [x] No tests marked as "todo" or "skipped"
- [x] Test output shows actual test descriptions (not `[object Object]`)
- [x] `npm test` exits with code 0
- [x] Test coverage report generates successfully

## Completion Summary

**Tests Fixed**: 12 test() blocks now executing (previously 22 assertion blocks marked as "todo")
- `lib/engine/rules.test.ts`: 5 tests covering Grid Utilities, Neighbor Counting, Conway Step Function, and Life Garden Mode
- `lib/state/grid-dux.test.js`: 7 tests covering Redux state management

**Note**: The original count of 22 represented individual assertion blocks in the riteway pattern. After proper integration, vitest counts test() functions (12 total), each containing multiple assertions. This is the correct behavior.

**Result**: ✅ All tests passing, simulation engine validated

---

## Notes

**Technical Context**:
- Riteway supports multiple test runners (Tape, Vitest)
- Must import from `riteway/vitest` for vitest integration
- Riteway's vitest adapter wraps assertions in `expect().toStrictEqual()`
- Reference: `node_modules/riteway/source/vitest.test.jsx` for correct pattern

**Testing Philosophy** (per GDD):
- Simulation engine must be deterministic and pure
- Tests validate Conway's rules and Life Garden mechanics
- TDD approach: tests define behavior before implementation
- Current implementation appears correct, just needs proper test execution

**Related Tasks**:
- Blocks: `implement-simulation-engine.md` validation
- Enables: UI integration with confidence in engine correctness
