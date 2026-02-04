import { describe, test, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import assert from 'node:assert';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore, combineReducers } from 'redux';
import PatternExport from './PatternExport';
import gridReducer from '@/lib/state/grid-dux';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('PatternExport', () => {
  test('Export Button', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer);

    const { getByText } = render(
      <Provider store={store}>
        <PatternExport />
      </Provider>
    );

    const button = getByText('Export/Import');
    
    assert({
      given: 'PatternExport component',
      should: 'render Export/Import button',
      actual: button.textContent,
      expected: 'Export/Import',
    });
  });

  test('Open Export Modal', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer);

    const { getByText, queryByText } = render(
      <Provider store={store}>
        <PatternExport />
      </Provider>
    );

    const button = getByText('Export/Import');
    fireEvent.click(button);
    
    const modalTitle = queryByText('Export Pattern');
    
    assert({
      given: 'Export/Import button clicked',
      should: 'open export modal',
      actual: modalTitle !== null,
      expected: true,
    });
  });

  test('Format Tabs', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer);

    const { getByText } = render(
      <Provider store={store}>
        <PatternExport />
      </Provider>
    );

    // Open modal
    fireEvent.click(getByText('Export/Import'));
    
    const jsonTab = getByText('JSON');
    const rleTab = getByText('RLE');
    const urlTab = getByText('URL');
    
    assert({
      given: 'export modal open',
      should: 'show format tabs (JSON, RLE, URL)',
      actual: `${jsonTab.textContent},${rleTab.textContent},${urlTab.textContent}`,
      expected: 'JSON,RLE,URL',
    });
  });

  test('Copy to Clipboard', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer, {
      grid: {
        cells: [{ x: 1, y: 1 }],
        generation: 0,
        bounds: { width: 60, height: 60 },
        isRunning: false,
      },
    });

    const { getByText } = render(
      <Provider store={store}>
        <PatternExport />
      </Provider>
    );

    // Open modal
    fireEvent.click(getByText('Export/Import'));
    
    const copyButton = getByText('Copy to Clipboard');
    fireEvent.click(copyButton);
    
    assert({
      given: 'Copy to Clipboard button clicked',
      should: 'call navigator.clipboard.writeText',
      actual: (navigator.clipboard.writeText as any).mock.calls.length > 0,
      expected: true,
    });
  });

  test('Import Pattern Button', () => {
    const rootReducer = combineReducers({
      grid: gridReducer,
    });

    const store = createStore(rootReducer);

    const { getByText, queryByText } = render(
      <Provider store={store}>
        <PatternExport />
      </Provider>
    );

    // Open modal
    fireEvent.click(getByText('Export/Import'));
    
    // Click Import Pattern button
    const importButton = getByText('Import Pattern');
    fireEvent.click(importButton);
    
    const importTitle = queryByText('Import Pattern');
    
    assert({
      given: 'Import Pattern button clicked',
      should: 'show import UI',
      actual: importTitle !== null,
      expected: true,
    });
  });
});
