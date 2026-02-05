import { describe, test, vi, beforeEach } from 'vitest';
import { assert } from 'riteway/vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore, combineReducers } from 'redux';
import ModeToggle from './ModeToggle';
import { reducer as gridReducer } from '@/lib/state/grid-dux';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

beforeEach(() => {
  localStorageMock.clear();
});

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
      ...initialState,
    },
  };

  return createStore(rootReducer, preloadedState);
};

describe('ModeToggle', () => {
  test('rendering with both buttons', () => {
    const store = createMockStore();
    const { container } = render(
      <Provider store={store}>
        <ModeToggle />
      </Provider>
    );

    const buttons = container.querySelectorAll('button');

    assert({
      given: 'mode toggle component rendered',
      should: 'display both Classic and Life Garden buttons',
      actual: buttons.length,
      expected: 2,
    });
  });

  test('classic mode active styling', () => {
    const store = createMockStore({ mode: 'classic' });
    const { container } = render(
      <Provider store={store}>
        <ModeToggle />
      </Provider>
    );

    const classicButton = Array.from(container.querySelectorAll('button')).find(
      btn => btn.textContent === 'Classic'
    );
    const hasActiveStyle = classicButton?.className.includes('bg-blue-600');

    assert({
      given: 'mode is "classic"',
      should: 'highlight Classic button with active style',
      actual: hasActiveStyle,
      expected: true,
    });
  });

  test('life garden mode active styling', () => {
    const store = createMockStore({ mode: 'lifeGarden' });
    const { container } = render(
      <Provider store={store}>
        <ModeToggle />
      </Provider>
    );

    const lifeGardenButton = Array.from(container.querySelectorAll('button')).find(
      btn => btn.textContent === 'Life Garden'
    );
    const hasActiveStyle = lifeGardenButton?.className.includes('bg-green-600');

    assert({
      given: 'mode is "lifeGarden"',
      should: 'highlight Life Garden button with active style',
      actual: hasActiveStyle,
      expected: true,
    });
  });

  test('localStorage persistence', () => {
    {
      // Mock localStorage
      const localStorageMock = {
        getItem: vi.fn(() => null),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      };
      global.localStorage = localStorageMock as any;

      const store = createMockStore({ mode: 'classic' });
      render(
        <Provider store={store}>
          <ModeToggle />
        </Provider>
      );

      // Should try to load from localStorage on mount
      assert({
        given: 'component mounts',
        should: 'attempt to read mode from localStorage',
        actual: localStorageMock.getItem.mock.calls.length > 0,
        expected: true,
      });
    }
  });
});
