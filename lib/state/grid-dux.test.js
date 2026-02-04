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
  getCells,
  getGeneration,
  getBounds,
  getIsRunning,
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
});
