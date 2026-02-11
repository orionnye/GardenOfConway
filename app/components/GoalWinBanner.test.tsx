import { describe, test } from 'vitest';
import { assert } from 'riteway/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import GoalWinBanner from './GoalWinBanner';
import { reducer as gridReducer } from '@/lib/state/grid-dux';

const createMockStore = (initialState = {}) => {
  const rootReducer = combineReducers({
    grid: gridReducer,
  });

  const preloadedState = {
    grid: {
      cells: [],
      generation: 0,
      bounds: { width: 60, height: 60 },
      isRunning: false,
      speed: 5,
      mode: 'classic',
      birthCandidates: [],
      goalTiles: [],
      runState: 'active',
      ...initialState,
    },
  };

  return createStore(rootReducer, preloadedState);
};

describe('GoalWinBanner', () => {
  test('should not render outside Life Garden mode', () => {
    const store = createMockStore({
      mode: 'classic',
      runState: 'won',
    });

    const { container } = render(
      <Provider store={store}>
        <GoalWinBanner />
      </Provider>
    );

    assert({
      given: 'classic mode',
      should: 'hide win feedback',
      actual: container.firstChild,
      expected: null,
    });
  });

  test('should render success message when run is won', () => {
    const store = createMockStore({
      mode: 'lifeGarden',
      runState: 'won',
    });

    render(
      <Provider store={store}>
        <GoalWinBanner />
      </Provider>
    );

    const message = screen.queryByText('Goal reached!');

    assert({
      given: 'life garden mode with won run state',
      should: 'render success feedback',
      actual: message !== null,
      expected: true,
    });
  });

  test('should render in puzzle mode when run is won', () => {
    const store = createMockStore({
      mode: 'puzzle',
      runState: 'won',
    });

    render(
      <Provider store={store}>
        <GoalWinBanner />
      </Provider>
    );

    const message = screen.queryByText('Goal reached!');

    assert({
      given: 'puzzle mode with won run state',
      should: 'render success feedback',
      actual: message !== null,
      expected: true,
    });
  });

  test('should show I won action in puzzle mode', () => {
    const store = createMockStore({
      mode: 'puzzle',
      runState: 'won',
    });

    render(
      <Provider store={store}>
        <GoalWinBanner />
      </Provider>
    );

    const button = screen.queryByRole('button', { name: 'I Won' });

    assert({
      given: 'puzzle mode with won run state',
      should: 'render explicit I won confirmation action',
      actual: button !== null,
      expected: true,
    });
  });

  test('should advance puzzle on I won confirmation', () => {
    const store = createMockStore({
      mode: 'puzzle',
      runState: 'won',
      puzzleIndex: 0,
      puzzleCount: 3,
      puzzleCampaignComplete: false,
    });

    render(
      <Provider store={store}>
        <GoalWinBanner />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'I Won' }));
    const state = store.getState();

    assert({
      given: 'puzzle win and I won confirmation',
      should: 'advance to the next puzzle index',
      actual: state.grid.puzzleIndex,
      expected: 1,
    });
  });

  test('should reset run when Play Again is clicked', () => {
    const store = createMockStore({
      mode: 'lifeGarden',
      runState: 'won',
      generation: 5,
      cells: [{ x: 2, y: 2 }],
      goalTiles: [{ x: 2, y: 2 }],
    });

    render(
      <Provider store={store}>
        <GoalWinBanner />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Play Again' }));
    const state = store.getState();

    assert({
      given: 'won state and replay action',
      should: 'clear generation and restore active run',
      actual: {
        generation: state.grid.generation,
        runState: state.grid.runState,
      },
      expected: {
        generation: 0,
        runState: 'active',
      },
    });
  });
});
