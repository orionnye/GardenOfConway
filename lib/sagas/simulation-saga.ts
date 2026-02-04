import { call, put, select, take, delay, fork, cancel, cancelled } from 'redux-saga/effects';
import type { Task } from 'redux-saga';
import { getIsRunning, getSpeed, stepGrid, toggleRunning } from '../state/grid-dux';

/**
 * Auto-advance saga - runs simulation steps at regular intervals when isRunning is true
 */
function* autoAdvanceSaga(): Generator<any, void, any> {
  let autoAdvanceTask: Task<any> | null = null;

  try {
    while (true) {
      // Wait for toggleRunning action
      yield take(toggleRunning().type);
      
      const isRunning = yield select(getIsRunning);

      if (isRunning && !autoAdvanceTask) {
        // Start auto-advance
        autoAdvanceTask = yield fork(runSimulation);
      } else if (!isRunning && autoAdvanceTask) {
        // Stop auto-advance
        yield cancel(autoAdvanceTask);
        autoAdvanceTask = null;
      }
    }
  } finally {
    if (yield cancelled()) {
      if (autoAdvanceTask) {
        yield cancel(autoAdvanceTask);
      }
    }
  }
}

/**
 * Run simulation loop - steps grid at regular intervals
 */
function* runSimulation(): Generator<any, void, any> {
  try {
    while (true) {
      yield put(stepGrid());
      
      // Get speed from state (1-10 steps per second)
      const speed = yield select(getSpeed);
      const delayMs = 1000 / (speed || 5);
      
      yield delay(delayMs);
    }
  } finally {
    if (yield cancelled()) {
      // Cleanup if needed
    }
  }
}

/**
 * Root saga - combine all sagas
 */
export default function* rootSaga(): Generator<any, void, any> {
  yield fork(autoAdvanceSaga);
}
