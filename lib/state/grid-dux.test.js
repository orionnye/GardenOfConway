import { describe, test } from 'vitest';
import { assert } from 'riteway/vitest';
import {
  reducer,
  initialState,
  setGrid,
  stepGrid,
  clearGrid,
  resetGrid,
  toggleRunning,
  setCells,
  loadPattern,
  loadPatternFromLibrary,
  applyPlayerBirth,
  setGoalTiles,
  confirmPuzzleVictory,
  getCells,
  getGeneration,
  getBounds,
  getIsRunning,
  getPatternJSON,
  getPatternURL,
  getPatternRLE,
  isPatternEmpty,
  getBirthCandidates,
  getMode,
  setMode,
  getGoalTiles,
  getRunState,
  getIsGoalReached,
  getHasWon,
  getSeedsRemaining,
  getSeedLimit,
  getObstacles,
  getPuzzleIndex,
  getPuzzleCount,
  getIsPuzzleCampaignComplete,
} from './grid-dux';

// Helper to wrap reducer with slice for selector tests
const withSlice = (slice) => (reducer) => (state, action) => ({
  [slice]: reducer(state?.[slice], action),
});

const wrappedReducer = withSlice('grid')(reducer);

describe('grid-dux', () => {
  test('initial state', () => {
    const state = wrappedReducer(undefined, {});
    
    assert({
      given: 'an initial state',
      should: 'have empty cells and generation 0',
      actual: {
        cells: getCells(state),
        generation: getGeneration(state),
      },
      expected: {
        cells: [],
        generation: 0,
      },
    });
  });

  test('setGrid action', () => {
    const cells = [{ x: 5, y: 5 }, { x: 6, y: 5 }];
    const state = wrappedReducer(undefined, setGrid({ cells }));

    assert({
      given: 'setGrid action with cells',
      should: 'update cells in state',
      actual: getCells(state),
      expected: cells,
    });
  });

  test('stepGrid action', () => {
    const state = wrappedReducer(undefined, stepGrid());

    assert({
      given: 'stepGrid action',
      should: 'increment generation',
      actual: getGeneration(state),
      expected: 1,
    });
  });

  test('clearGrid action', () => {
    const cells = [{ x: 5, y: 5 }];
    let state = wrappedReducer(undefined, setGrid({ cells }));
    state = wrappedReducer(state, clearGrid());

    assert({
      given: 'clearGrid action',
      should: 'set cells to empty array',
      actual: getCells(state),
      expected: [],
    });
  });

  test('resetGrid action', () => {
    const cells = [{ x: 5, y: 5 }];
    let state = wrappedReducer(undefined, setGrid({ cells }));
    state = wrappedReducer(state, stepGrid());
    state = wrappedReducer(state, resetGrid());

    assert({
      given: 'resetGrid action',
      should: 'reset generation to 0 and clear cells',
      actual: {
        generation: getGeneration(state),
        cells: getCells(state),
      },
      expected: {
        generation: 0,
        cells: [],
      },
    });
  });

  test('toggleRunning action', () => {
    let state = wrappedReducer(undefined, {});
    const initialRunning = getIsRunning(state);
    state = wrappedReducer(state, toggleRunning());

    assert({
      given: 'toggleRunning action',
      should: 'toggle isRunning boolean',
      actual: getIsRunning(state),
      expected: !initialRunning,
    });
  });

  test('setCells action', () => {
    const cells = [{ x: 10, y: 10 }];
    let state = wrappedReducer(undefined, stepGrid());
    const genBefore = getGeneration(state);
    state = wrappedReducer(state, setCells({ cells }));

    assert({
      given: 'setCells action',
      should: 'update cells without changing generation',
      actual: {
        cells: getCells(state),
        generation: getGeneration(state),
      },
      expected: {
        cells,
        generation: genBefore,
      },
    });
  });

  test('loadPattern()', () => {
    const wrappedReducer = (state, action) => ({ grid: reducer(state?.grid, action) });

    // Test loading pattern from JSON
    {
      const patternJSON = JSON.stringify({
        cells: [{ x: 1, y: 2 }, { x: 3, y: 4 }],
        bounds: { width: 15, height: 15 },
      });
      
      const state = wrappedReducer(undefined, loadPattern({ pattern: patternJSON }));

      assert({
        given: 'a serialized pattern JSON',
        should: 'load cells and bounds into grid state',
        actual: {
          cellCount: getCells(state).length,
          boundsWidth: getBounds(state).width,
        },
        expected: {
          cellCount: 2,
          boundsWidth: 15,
        },
      });
    }

    // Test generation counter preservation
    {
      const patternJSON = JSON.stringify({
        cells: [{ x: 5, y: 5 }],
        bounds: { width: 10, height: 10 },
      });
      
      let state = wrappedReducer(undefined, stepGrid());
      state = wrappedReducer(state, stepGrid());
      const genBefore = getGeneration(state);
      state = wrappedReducer(state, loadPattern({ pattern: patternJSON }));

      assert({
        given: 'grid state with cells',
        should: 'preserve generation counter when loading new pattern',
        actual: getGeneration(state),
        expected: genBefore,
      });
    }

    // Test invalid pattern handling
    {
      const invalidJSON = 'not valid json';
      let errorOccurred = false;
      
      try {
        wrappedReducer(undefined, loadPattern({ pattern: invalidJSON }));
      } catch (error) {
        errorOccurred = true;
      }

      assert({
        given: 'invalid pattern data',
        should: 'handle error gracefully without corrupting state',
        actual: errorOccurred,
        expected: true,
      });
    }
  });

  test('loadPatternFromLibrary()', () => {
    const wrappedReducer = (state, action) => ({ grid: reducer(state?.grid, action) });

    // Test loading pattern by name
    {
      const state = wrappedReducer(undefined, loadPatternFromLibrary({ name: 'GLIDER' }));

      assert({
        given: 'a pattern name from library (e.g., "GLIDER")',
        should: 'load that pattern into state',
        actual: getCells(state).length,
        expected: 5, // Glider has 5 cells
      });
    }

    // Test pattern centering
    {
      const state = wrappedReducer(undefined, loadPatternFromLibrary({ name: 'GLIDER' }));
      const cells = getCells(state);
      const bounds = getBounds(state);
      
      // Glider pattern has bounds 5x5, centered on 60x60 grid should offset by (60-5)/2 = 27.5 -> 27
      const expectedOffsetX = Math.floor((60 - 5) / 2);
      const expectedOffsetY = Math.floor((60 - 5) / 2);
      
      // Glider's first cell is at {x: 1, y: 0} in the pattern
      // After centering, it should be at {x: 1 + 27, y: 0 + 27} = {x: 28, y: 27}
      const firstCell = cells[0];

      assert({
        given: 'a pattern loaded from library on 60×60 grid',
        should: 'center the pattern on the grid',
        actual: { x: firstCell.x, y: firstCell.y, boundsWidth: bounds.width },
        expected: { x: 28, y: 27, boundsWidth: 60 },
      });
    }

    // Test invalid pattern name
    {
      let errorOccurred = false;
      
      try {
        wrappedReducer(undefined, loadPatternFromLibrary({ name: 'NONEXISTENT' }));
      } catch (error) {
        errorOccurred = true;
      }

      assert({
        given: 'an invalid pattern name',
        should: 'throw error',
        actual: errorOccurred,
        expected: true,
      });
    }
  });

  test('Mode Toggle', () => {
    const wrappedReducer = (state, action) => ({ grid: reducer(state?.grid, action) });

    // Test initial mode
    {
      const state = wrappedReducer(undefined, {});
      const mode = state.grid.mode;

      assert({
        given: 'initial state',
        should: 'have mode set to "classic"',
        actual: mode,
        expected: 'classic',
      });
    }

    // Test setMode to lifeGarden
    {
      const state = wrappedReducer(undefined, { type: 'grid/setMode', payload: { mode: 'lifeGarden' } });
      const mode = state.grid.mode;

      assert({
        given: 'setMode action with "lifeGarden"',
        should: 'update mode to "lifeGarden"',
        actual: mode,
        expected: 'lifeGarden',
      });
    }

    // Test auto-pause when switching to lifeGarden
    {
      let state = wrappedReducer(undefined, toggleRunning()); // Start running
      state = wrappedReducer(state, { type: 'grid/setMode', payload: { mode: 'lifeGarden' } });

      assert({
        given: 'setMode to "lifeGarden" while simulation running',
        should: 'pause simulation automatically',
        actual: getIsRunning(state),
        expected: false,
      });
    }

    // Test switch back to classic
    {
      let state = wrappedReducer(undefined, { type: 'grid/setMode', payload: { mode: 'lifeGarden' } });
      state = wrappedReducer(state, { type: 'grid/setMode', payload: { mode: 'classic' } });

      assert({
        given: 'setMode switching back to "classic"',
        should: 'update mode to "classic"',
        actual: state.grid.mode,
        expected: 'classic',
      });
    }
  });

  test('Pattern Selectors', () => {
    // Test getPatternJSON selector
    {
      const cells = [{ x: 1, y: 2 }, { x: 3, y: 4 }];
      const bounds = { width: 10, height: 10 };
      const state = wrappedReducer(undefined, setGrid({ cells, bounds }));
      const json = getPatternJSON(state);
      const parsed = JSON.parse(json);

      assert({
        given: 'current grid state',
        should: 'select cells and bounds for serialization',
        actual: { cellCount: parsed.cells.length, boundsWidth: parsed.bounds.width },
        expected: { cellCount: 2, boundsWidth: 10 },
      });
    }

    // Test getPatternURL selector
    {
      const cells = [{ x: 5, y: 5 }];
      const bounds = { width: 10, height: 10 };
      const state = wrappedReducer(undefined, setGrid({ cells, bounds }));
      const url = getPatternURL(state);

      assert({
        given: 'current grid state',
        should: 'compute URL-safe encoded pattern string',
        actual: typeof url === 'string' && url.length > 0,
        expected: true,
      });
    }

    // Test getPatternRLE selector
    {
      const cells = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }];
      const bounds = { width: 10, height: 10 };
      const state = wrappedReducer(undefined, setGrid({ cells, bounds }));
      const rle = getPatternRLE(state);

      assert({
        given: 'current grid state',
        should: 'export as RLE format ending with !',
        actual: rle.endsWith('!'),
        expected: true,
      });
    }

    // Test isPatternEmpty selector
    {
      const state = wrappedReducer(undefined, clearGrid());

      assert({
        given: 'grid state with no cells',
        should: 'validate if pattern is empty',
        actual: isPatternEmpty(state),
        expected: true,
      });
    }

    // Test isPatternEmpty with cells
    {
      const cells = [{ x: 1, y: 1 }];
      const state = wrappedReducer(undefined, setGrid({ cells }));

      assert({
        given: 'grid state with cells',
        should: 'return false for empty check',
        actual: isPatternEmpty(state),
        expected: false,
      });
    }
  });

  test('Birth Candidate Highlighting', () => {
    // Test birth candidates computation in Life Garden mode
    {
      // Create a blinker pattern - should have 4 birth candidates
      const cells = [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ];
      const bounds = { width: 10, height: 10 };
      
      let state = wrappedReducer(undefined, setGrid({ cells, bounds }));
      state = wrappedReducer(state, setMode({ mode: 'lifeGarden' }));
      state = wrappedReducer(state, stepGrid());

      const candidates = getBirthCandidates(state);

      assert({
        given: 'Life Garden mode with blinker pattern after step',
        should: 'compute birth candidates',
        actual: candidates.length > 0,
        expected: true,
      });
    }

    // Test no birth candidates in Classic mode
    {
      const cells = [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ];
      const bounds = { width: 10, height: 10 };
      
      let state = wrappedReducer(undefined, setGrid({ cells, bounds }));
      state = wrappedReducer(state, setMode({ mode: 'classic' }));
      state = wrappedReducer(state, stepGrid());

      const candidates = getBirthCandidates(state);

      assert({
        given: 'Classic mode after step',
        should: 'have empty birth candidates array',
        actual: candidates.length,
        expected: 0,
      });
    }

    // Test applyPlayerBirth with valid candidate
    {
      // Setup: create a pattern where (2, 1) will be a valid birth candidate
      const cells = [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ];
      const bounds = { width: 10, height: 10 };
      
      let state = wrappedReducer(undefined, setGrid({ cells, bounds }));
      state = wrappedReducer(state, setMode({ mode: 'lifeGarden' }));
      
      // (2, 1) should have exactly 3 neighbors, making it a valid birth candidate
      const birthCell = { x: 2, y: 1 };
      state = wrappedReducer(state, applyPlayerBirth({ cell: birthCell }));

      const newCells = getCells(state);
      const birthApplied = newCells.some(c => c.x === birthCell.x && c.y === birthCell.y);

      assert({
        given: 'valid birth candidate in Life Garden mode',
        should: 'apply birth and advance generation',
        actual: birthApplied && getGeneration(state) === 1,
        expected: true,
      });
    }

    // Test applyPlayerBirth with invalid candidate
    {
      const cells = [{ x: 1, y: 1 }];
      const bounds = { width: 10, height: 10 };
      
      let state = wrappedReducer(undefined, setGrid({ cells, bounds }));
      state = wrappedReducer(state, setMode({ mode: 'lifeGarden' }));
      
      // Try to birth at (5, 5) which has no neighbors (invalid)
      const invalidCell = { x: 5, y: 5 };
      const initialGeneration = getGeneration(state);
      state = wrappedReducer(state, applyPlayerBirth({ cell: invalidCell }));

      assert({
        given: 'invalid birth candidate (no 3 neighbors)',
        should: 'not modify state or advance generation',
        actual: getGeneration(state),
        expected: initialGeneration,
      });
    }

    // Test birth candidates recomputed after player birth
    {
      const cells = [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ];
      const bounds = { width: 10, height: 10 };
      
      let state = wrappedReducer(undefined, setGrid({ cells, bounds }));
      state = wrappedReducer(state, setMode({ mode: 'lifeGarden' }));
      
      const birthCell = { x: 2, y: 1 };
      state = wrappedReducer(state, applyPlayerBirth({ cell: birthCell }));

      const candidates = getBirthCandidates(state);

      assert({
        given: 'player birth applied',
        should: 'recompute birth candidates for new state',
        actual: typeof candidates,
        expected: 'object', // Should be an array
      });
    }
  });

  test('Goal Tiles and Win Detection', () => {
    // Initial goal and run state
    {
      const state = wrappedReducer(undefined, {});

      assert({
        given: 'initial Life Garden state',
        should: 'initialize with no goals and active run state',
        actual: {
          goalTiles: getGoalTiles(state),
          runState: getRunState(state),
        },
        expected: {
          goalTiles: [],
          runState: 'active',
        },
      });
    }

    // Goal tile de-duplication and deterministic ordering
    {
      const state = wrappedReducer(undefined, setGoalTiles({
        goalTiles: [
          { x: 4, y: 4 },
          { x: 1, y: 2 },
          { x: 4, y: 4 },
          { x: 0, y: 0 },
        ],
      }));

      assert({
        given: 'goal tiles with duplicates and unsorted input',
        should: 'store de-duplicated goals in deterministic order',
        actual: getGoalTiles(state),
        expected: [
          { x: 0, y: 0 },
          { x: 1, y: 2 },
          { x: 4, y: 4 },
        ],
      });
    }

    // Reset should replace goals and clear win state
    {
      let state = wrappedReducer(undefined, setMode({ mode: 'lifeGarden' }));
      state = wrappedReducer(state, setGoalTiles({ goalTiles: [{ x: 1, y: 1 }] }));
      state = wrappedReducer(state, setCells({ cells: [{ x: 1, y: 1 }] }));
      state = wrappedReducer(state, stepGrid());
      state = wrappedReducer(state, resetGrid({
        goalTiles: [{ x: 2, y: 2 }, { x: 3, y: 3 }, { x: 2, y: 2 }],
      }));

      assert({
        given: 'won run followed by reset with level goals',
        should: 'restore active run state and replace goals',
        actual: {
          runState: getRunState(state),
          goalTiles: getGoalTiles(state),
        },
        expected: {
          runState: 'active',
          goalTiles: [{ x: 2, y: 2 }, { x: 3, y: 3 }],
        },
      });
    }

    // Classic mode should ignore goal win logic
    {
      let state = wrappedReducer(undefined, setMode({ mode: 'classic' }));
      state = wrappedReducer(state, setGoalTiles({ goalTiles: [{ x: 1, y: 1 }] }));
      state = wrappedReducer(state, setCells({ cells: [{ x: 1, y: 1 }] }));
      state = wrappedReducer(state, stepGrid());

      assert({
        given: 'classic mode with overlap between cells and goals',
        should: 'keep run state active',
        actual: getRunState(state),
        expected: 'active',
      });
    }

    // Life Garden win should trigger once and stop additional stepping
    {
      const cells = [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ];

      let state = wrappedReducer(undefined, setGrid({ cells, bounds: { width: 10, height: 10 } }));
      state = wrappedReducer(state, setMode({ mode: 'lifeGarden' }));
      state = wrappedReducer(state, setGoalTiles({ goalTiles: [{ x: 2, y: 1 }] }));
      state = wrappedReducer(state, stepGrid());
      const generationAfterWin = getGeneration(state);
      const stateAfterSecondStep = wrappedReducer(state, stepGrid());

      assert({
        given: 'goal reached during Life Garden step',
        should: 'win once and prevent duplicate progression',
        actual: {
          hasWon: getHasWon(state),
          generationAfterWin,
          generationAfterSecondStep: getGeneration(stateAfterSecondStep),
        },
        expected: {
          hasWon: true,
          generationAfterWin: 1,
          generationAfterSecondStep: 1,
        },
      });
    }
  });

  test('Goal-Reached Selectors', () => {
    // No goals reached
    {
      let state = wrappedReducer(undefined, setCells({ cells: [{ x: 1, y: 1 }] }));
      state = wrappedReducer(state, setGoalTiles({ goalTiles: [{ x: 5, y: 5 }] }));

      assert({
        given: 'cells and goals with no overlap',
        should: 'report goal not reached',
        actual: getIsGoalReached(state),
        expected: false,
      });
    }

    // Single overlap
    {
      let state = wrappedReducer(undefined, setCells({ cells: [{ x: 2, y: 2 }] }));
      state = wrappedReducer(state, setGoalTiles({ goalTiles: [{ x: 2, y: 2 }] }));

      assert({
        given: 'one overlapping cell and goal',
        should: 'report goal reached',
        actual: getIsGoalReached(state),
        expected: true,
      });
    }

    // Multiple overlaps
    {
      let state = wrappedReducer(undefined, setCells({
        cells: [{ x: 2, y: 2 }, { x: 3, y: 3 }],
      }));
      state = wrappedReducer(state, setGoalTiles({
        goalTiles: [{ x: 0, y: 0 }, { x: 3, y: 3 }, { x: 2, y: 2 }],
      }));

      assert({
        given: 'multiple overlapping goal tiles',
        should: 'report goal reached',
        actual: getIsGoalReached(state),
        expected: true,
      });
    }
  });

  test('Puzzle Mode Setup and Constraints', () => {
    // Puzzle mode initialization
    {
      const state = wrappedReducer(undefined, setMode({ mode: 'puzzle' }));

      assert({
        given: 'switching into puzzle mode',
        should: 'load seeded cells, goals, obstacles, and seed limits',
        actual: {
          mode: getMode(state),
          hasCells: getCells(state).length > 0,
          hasGoals: getGoalTiles(state).length > 0,
          hasObstacles: getObstacles(state).length > 0,
          seedsRemaining: getSeedsRemaining(state),
          seedLimit: getSeedLimit(state),
        },
        expected: {
          mode: 'puzzle',
          hasCells: true,
          hasGoals: true,
          hasObstacles: true,
          seedsRemaining: 8,
          seedLimit: 8,
        },
      });
    }

    // Valid player birth consumes one seed
    {
      let state = wrappedReducer(undefined, setMode({ mode: 'puzzle' }));
      state = wrappedReducer(state, applyPlayerBirth({ cell: { x: 21, y: 20 } }));

      assert({
        given: 'valid puzzle birth placement',
        should: 'consume one seed and advance generation',
        actual: {
          seedsRemaining: getSeedsRemaining(state),
          generation: getGeneration(state),
        },
        expected: {
          seedsRemaining: 7,
          generation: 1,
        },
      });
    }

    // Obstacles should reject births and prevent occupancy
    {
      let state = wrappedReducer(undefined, setMode({ mode: 'puzzle' }));
      const before = {
        generation: getGeneration(state),
        seedsRemaining: getSeedsRemaining(state),
      };
      state = wrappedReducer(state, applyPlayerBirth({ cell: { x: 22, y: 19 } }));
      const hasObstacleCell = getCells(state).some((cell) => cell.x === 22 && cell.y === 19);

      assert({
        given: 'birth attempt on an obstacle tile',
        should: 'ignore the action without consuming resources',
        actual: {
          generation: getGeneration(state),
          seedsRemaining: getSeedsRemaining(state),
          hasObstacleCell,
        },
        expected: {
          generation: before.generation,
          seedsRemaining: before.seedsRemaining,
          hasObstacleCell: false,
        },
      });
    }

    // Exhausted seeds should block new births
    {
      let state = wrappedReducer(undefined, setMode({ mode: 'puzzle' }));
      state = wrappedReducer(state, setGrid({
        ...state.grid,
        mode: 'puzzle',
        seedsRemaining: 0,
      }));
      const generationAfterBudget = getGeneration(state);
      state = wrappedReducer(state, applyPlayerBirth({ cell: { x: 21, y: 20 } }));

      assert({
        given: 'puzzle mode with no seeds remaining',
        should: 'block additional player births',
        actual: {
          seedsRemaining: getSeedsRemaining(state),
          generation: getGeneration(state),
        },
        expected: {
          seedsRemaining: 0,
          generation: generationAfterBudget,
        },
      });
    }

    // Reset should restart current puzzle deterministically
    {
      let state = wrappedReducer(undefined, setMode({ mode: 'puzzle' }));
      state = wrappedReducer(state, applyPlayerBirth({ cell: { x: 21, y: 20 } }));
      state = wrappedReducer(state, resetGrid());

      assert({
        given: 'puzzle run after player actions',
        should: 'reset to puzzle defaults for replay',
        actual: {
          generation: getGeneration(state),
          seedsRemaining: getSeedsRemaining(state),
          hasObstacleCell: getCells(state).some((cell) => cell.x === 22 && cell.y === 19),
          mode: getMode(state),
        },
        expected: {
          generation: 0,
          seedsRemaining: 8,
          hasObstacleCell: false,
          mode: 'puzzle',
        },
      });
    }
  });

  test('Puzzle Progression After Confirmed Victory', () => {
    // Confirmed win should advance to next puzzle
    {
      let state = wrappedReducer(undefined, setMode({ mode: 'puzzle' }));
      state = wrappedReducer(state, setGrid({ ...state.grid, mode: 'puzzle', runState: 'won' }));
      const currentIndex = getPuzzleIndex(state);

      state = wrappedReducer(state, confirmPuzzleVictory());

      assert({
        given: 'puzzle run in won state and player confirms with I won',
        should: 'advance to the next puzzle and reset run resources',
        actual: {
          puzzleIndex: getPuzzleIndex(state),
          runState: getRunState(state),
          seedsRemaining: getSeedsRemaining(state),
        },
        expected: {
          puzzleIndex: currentIndex + 1,
          runState: 'active',
          seedsRemaining: getSeedLimit(state),
        },
      });
    }

    // Without won state, confirmation should do nothing
    {
      let state = wrappedReducer(undefined, setMode({ mode: 'puzzle' }));
      const snapshot = state.grid;
      state = wrappedReducer(state, confirmPuzzleVictory());

      assert({
        given: 'puzzle run not yet won',
        should: 'ignore progression confirmation',
        actual: state.grid,
        expected: snapshot,
      });
    }

    // Final puzzle confirmation should set terminal completion state
    {
      let state = wrappedReducer(undefined, setMode({ mode: 'puzzle', puzzleIndex: getPuzzleCount(wrappedReducer(undefined, {})) - 1 }));
      state = wrappedReducer(state, setGrid({ ...state.grid, mode: 'puzzle', runState: 'won' }));
      const finalIndex = getPuzzleIndex(state);
      state = wrappedReducer(state, confirmPuzzleVictory());

      assert({
        given: 'final puzzle won and player confirms victory',
        should: 'enter puzzle campaign completion state without changing puzzle index',
        actual: {
          puzzleIndex: getPuzzleIndex(state),
          isPuzzleCampaignComplete: getIsPuzzleCampaignComplete(state),
        },
        expected: {
          puzzleIndex: finalIndex,
          isPuzzleCampaignComplete: true,
        },
      });
    }
  });
});
