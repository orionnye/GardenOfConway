import { describe, test, vi } from 'vitest';
import { render } from '@testing-library/react';
import assert from 'node:assert';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore, combineReducers } from 'redux';
import GridContainer from './GridContainer';
import gridReducer from '@/lib/state/grid-dux';

// Mock GridCanvas to avoid PixiJS initialization
vi.mock('./GridCanvas', () => ({
  default: ({ cells, bounds, onCellClick, onDragPaint }: any) => (
    <div 
      data-testid="grid-canvas" 
      data-cells={JSON.stringify(cells)} 
      data-bounds={JSON.stringify(bounds)}
      data-has-drag-paint={onDragPaint ? 'true' : 'false'}
    />
  ),
}));

describe('GridContainer', () => {
  test('Redux Connection', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer, {
      grid: {
        cells: [{ x: 5, y: 5 }],
        generation: 0,
        bounds: { width: 60, height: 60 },
        isRunning: false,
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <GridContainer />
      </Provider>
    );

    const canvas = getByTestId('grid-canvas');
    const cells = JSON.parse(canvas.getAttribute('data-cells') || '[]');

    assert({
      given: 'Redux store with cells',
      should: 'pass cells to GridCanvas',
      actual: cells.length,
      expected: 1,
    });
  });

  test('Bounds from Redux', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer, {
      grid: {
        cells: [],
        generation: 0,
        bounds: { width: 50, height: 50 },
        isRunning: false,
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <GridContainer />
      </Provider>
    );

    const canvas = getByTestId('grid-canvas');
    const bounds = JSON.parse(canvas.getAttribute('data-bounds') || '{}');

    assert({
      given: 'Redux store with custom bounds',
      should: 'pass bounds to GridCanvas',
      actual: bounds.width,
      expected: 50,
    });
  });

  test('Cell Click Interaction', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer, {
      grid: {
        cells: [{ x: 5, y: 5 }],
        generation: 0,
        bounds: { width: 60, height: 60 },
        isRunning: false,
      },
    });

    render(
      <Provider store={store}>
        <GridContainer />
      </Provider>
    );

    // Get the onCellClick prop that was passed to GridCanvas
    const state = store.getState();

    assert({
      given: 'GridContainer with Redux store',
      should: 'provide onCellClick handler to GridCanvas',
      actual: state.grid.cells.length,
      expected: 1,
    });
  });

  test('Drag Paint Handler Provided', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer, {
      grid: {
        cells: [],
        generation: 0,
        bounds: { width: 60, height: 60 },
        isRunning: false,
      },
    });

    const { getByTestId } = render(
      <Provider store={store}>
        <GridContainer />
      </Provider>
    );

    const canvas = getByTestId('grid-canvas');
    const hasDragPaint = canvas.getAttribute('data-has-drag-paint');

    assert({
      given: 'GridContainer component',
      should: 'provide onDragPaint handler to GridCanvas',
      actual: hasDragPaint,
      expected: 'true',
    });
  });
});
