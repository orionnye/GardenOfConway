import { describe, test, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import assert from 'node:assert';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore, combineReducers } from 'redux';
import PatternPicker from './PatternPicker';
import gridReducer from '@/lib/state/grid-dux';

describe('PatternPicker', () => {
  test('Load Pattern Button', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer);

    const { getByText } = render(
      <Provider store={store}>
        <PatternPicker />
      </Provider>
    );

    const button = getByText('Load Pattern');
    
    assert({
      given: 'PatternPicker component',
      should: 'render Load Pattern button',
      actual: button.textContent,
      expected: 'Load Pattern',
    });
  });

  test('Open Pattern Modal', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer);

    const { getByText, queryByText } = render(
      <Provider store={store}>
        <PatternPicker />
      </Provider>
    );

    const button = getByText('Load Pattern');
    fireEvent.click(button);
    
    const modalTitle = queryByText('Load Pattern', { selector: 'h2' });
    
    assert({
      given: 'Load Pattern button clicked',
      should: 'open pattern picker modal',
      actual: modalTitle !== null,
      expected: true,
    });
  });

  test('Pattern List Display', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer);

    const { getByText } = render(
      <Provider store={store}>
        <PatternPicker />
      </Provider>
    );

    // Open modal
    fireEvent.click(getByText('Load Pattern'));
    
    // Check for some patterns
    const gliderPattern = getByText('Glider');
    const blinkerPattern = getByText('Blinker');
    
    assert({
      given: 'pattern picker modal open',
      should: 'display list of patterns',
      actual: `${gliderPattern.textContent},${blinkerPattern.textContent}`,
      expected: 'Glider,Blinker',
    });
  });

  test('Load Pattern Action', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const { getByText } = render(
      <Provider store={store}>
        <PatternPicker />
      </Provider>
    );

    // Open modal
    fireEvent.click(getByText('Load Pattern'));
    
    // Click a pattern
    fireEvent.click(getByText('Glider'));
    
    assert({
      given: 'pattern clicked in picker',
      should: 'dispatch loadPatternFromLibrary action',
      actual: dispatchSpy.mock.calls.length > 0,
      expected: true,
    });
  });
});
