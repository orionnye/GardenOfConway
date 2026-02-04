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
  getCells,
  getGeneration,
  getBounds,
  getIsRunning,
  getPatternJSON,
  getPatternURL,
  getPatternRLE,
  isPatternEmpty,
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
});
