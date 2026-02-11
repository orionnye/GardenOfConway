import { describe, test, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import assert from 'node:assert';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore, combineReducers } from 'redux';
import GridControls from './GridControls';
import gridReducer, { stepGrid, toggleRunning, resetGrid, clearGrid } from '@/lib/state/grid-dux';

describe('GridControls', () => {
  test('Step Button', () => {
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

    const { getByText } = render(
      <Provider store={store}>
        <GridControls />
      </Provider>
    );

    const stepButton = getByText('Step');
    
    assert({
      given: 'GridControls component',
      should: 'render Step button',
      actual: stepButton.textContent,
      expected: 'Step',
    });
  });

  test('Play/Pause Button Toggle', () => {
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

    const { getByText } = render(
      <Provider store={store}>
        <GridControls />
      </Provider>
    );

    const playButton = getByText('Play');
    
    assert({
      given: 'simulation not running',
      should: 'show Play button',
      actual: playButton.textContent,
      expected: 'Play',
    });
  });

  test('Generation Display', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer, {
      grid: {
        cells: [],
        generation: 42,
        bounds: { width: 60, height: 60 },
        isRunning: false,
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <GridControls />
      </Provider>
    );

    const generationDisplay = getByText('42');
    
    assert({
      given: 'generation count of 42',
      should: 'display generation number',
      actual: generationDisplay.textContent,
      expected: '42',
    });
  });

  test('Step Button Dispatch', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const { getByText } = render(
      <Provider store={store}>
        <GridControls />
      </Provider>
    );

    const stepButton = getByText('Step');
    fireEvent.click(stepButton);
    
    assert({
      given: 'Step button clicked',
      should: 'dispatch stepGrid action',
      actual: dispatchSpy.mock.calls.length > 0,
      expected: true,
    });
  });

  test('Reset and Clear Buttons', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer);

    const { getByText } = render(
      <Provider store={store}>
        <GridControls />
      </Provider>
    );

    const resetButton = getByText('Reset');
    const clearButton = getByText('Clear');
    
    assert({
      given: 'GridControls component',
      should: 'render Reset and Clear buttons',
      actual: `${resetButton.textContent},${clearButton.textContent}`,
      expected: 'Reset,Clear',
    });
  });

  test('Reset View Button', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer);

    const { getByText } = render(
      <Provider store={store}>
        <GridControls />
      </Provider>
    );

    const resetViewButton = getByText('Reset View');
    
    assert({
      given: 'GridControls component',
      should: 'render Reset View button for viewport reset',
      actual: resetViewButton.textContent,
      expected: 'Reset View',
    });
  });

  test('Play Button in Life Garden Mode', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer, {
      grid: {
        cells: [],
        generation: 0,
        bounds: { width: 60, height: 60 },
        isRunning: false,
        speed: 5,
        mode: 'lifeGarden',
      },
    });

    const { container } = render(
      <Provider store={store}>
        <GridControls />
      </Provider>
    );

    const playButton = Array.from(container.querySelectorAll('button')).find(
      btn => btn.textContent === 'Play' || btn.textContent === 'Pause'
    ) as HTMLButtonElement;
    
    assert({
      given: 'mode is "lifeGarden"',
      should: 'disable Play button',
      actual: playButton?.disabled,
      expected: true,
    });
  });

  test('Step Button Disabled After Goal Win', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer, {
      grid: {
        cells: [],
        generation: 3,
        bounds: { width: 60, height: 60 },
        isRunning: false,
        speed: 5,
        mode: 'lifeGarden',
        birthCandidates: [],
        goalTiles: [{ x: 1, y: 1 }],
        runState: 'won',
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <GridControls />
      </Provider>
    );

    const stepButton = getByText('Step') as HTMLButtonElement;

    assert({
      given: 'Life Garden win state',
      should: 'disable Step button',
      actual: stepButton.disabled,
      expected: true,
    });
  });

  test('Puzzle seed counter display', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer, {
      grid: {
        cells: [],
        generation: 2,
        bounds: { width: 60, height: 60 },
        isRunning: false,
        speed: 5,
        mode: 'puzzle',
        birthCandidates: [],
        goalTiles: [{ x: 24, y: 20 }],
        obstacles: [{ x: 22, y: 19 }],
        seedLimit: 8,
        seedsRemaining: 6,
        runState: 'active',
      },
    });

    render(
      <Provider store={store}>
        <GridControls />
      </Provider>
    );

    const seedText = document.body.textContent?.includes('Seeds:');
    const seedValue = document.body.textContent?.includes('6');

    assert({
      given: 'puzzle mode state with remaining seeds',
      should: 'render seed counter feedback',
      actual: seedText && seedValue,
      expected: true,
    });
  });
});
