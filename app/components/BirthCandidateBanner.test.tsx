import { describe, test } from 'vitest';
import { assert } from 'riteway/vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import BirthCandidateBanner from './BirthCandidateBanner';
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
      ...initialState,
    },
  };

  return createStore(rootReducer, preloadedState);
};

describe('BirthCandidateBanner', () => {
  test('should not render in Classic mode', () => {
    const store = createMockStore({
      mode: 'classic',
      birthCandidates: [],
    });

    const { container } = render(
      <Provider store={store}>
        <BirthCandidateBanner />
      </Provider>
    );

    assert({
      given: 'Classic mode with no candidates',
      should: 'not render banner',
      actual: container.firstChild,
      expected: null,
    });
  });

  test('should not render in Life Garden mode with candidates', () => {
    const store = createMockStore({
      mode: 'lifeGarden',
      birthCandidates: [{ x: 1, y: 1 }],
    });

    const { container } = render(
      <Provider store={store}>
        <BirthCandidateBanner />
      </Provider>
    );

    assert({
      given: 'Life Garden mode with candidates available',
      should: 'not render banner',
      actual: container.firstChild,
      expected: null,
    });
  });

  test('should render in Life Garden mode with no candidates', () => {
    const store = createMockStore({
      mode: 'lifeGarden',
      birthCandidates: [],
    });

    render(
      <Provider store={store}>
        <BirthCandidateBanner />
      </Provider>
    );

    const message = screen.queryByText('No valid births available');

    assert({
      given: 'Life Garden mode with no candidates',
      should: 'display no births available message',
      actual: message !== null,
      expected: true,
    });
  });

  test('should include helper text in banner', () => {
    const store = createMockStore({
      mode: 'lifeGarden',
      birthCandidates: [],
    });

    render(
      <Provider store={store}>
        <BirthCandidateBanner />
      </Provider>
    );

    const helperText = screen.queryByText(/Skip or place a cell/);

    assert({
      given: 'banner displayed',
      should: 'include helper text about next actions',
      actual: helperText !== null,
      expected: true,
    });
  });
});
