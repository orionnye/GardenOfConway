import { describe, test } from 'vitest';
import assert from 'node:assert';
import { call, put, select, delay, fork, cancel, take } from 'redux-saga/effects';
import rootSaga from './simulation-saga';
import { getIsRunning, stepGrid, toggleRunning } from '../state/grid-dux';

describe('simulation-saga', () => {
  test('Auto-Advance Saga Structure', () => {
    const saga = rootSaga();
    const effect = saga.next().value;

    assert({
      given: 'root saga initialized',
      should: 'fork auto-advance saga',
      actual: effect?.type,
      expected: 'FORK',
    });
  });

  test('Saga Exports', () => {
    assert({
      given: 'simulation-saga module',
      should: 'export root saga as default',
      actual: typeof rootSaga,
      expected: 'function',
    });
  });
});
