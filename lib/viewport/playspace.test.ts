import { describe, test } from 'vitest';
import assert from 'node:assert';
import {
  getPlayspaceBounds,
  getViewportToFitPlayspace,
  type PlayspaceBounds,
} from './playspace';

describe('playspace viewport', () => {
  const gridBounds = { width: 60, height: 60 };

  test('getPlayspaceBounds returns null when no content', () => {
    const result = getPlayspaceBounds([], [], [], gridBounds);
    assert.strictEqual(result, null);
  });

  test('getPlayspaceBounds derives region from cells with margin', () => {
    const cells = [{ x: 10, y: 10 }, { x: 12, y: 11 }];
    const result = getPlayspaceBounds(cells, [], [], gridBounds, 2);
    assert.ok(result);
    assert.strictEqual(result!.minX, 8);
    assert.strictEqual(result!.minY, 8);
    assert.strictEqual(result!.width, 7);
    assert.strictEqual(result!.height, 6);
  });

  test('getPlayspaceBounds includes goals and obstacles', () => {
    const cells = [{ x: 5, y: 5 }];
    const goalTiles = [{ x: 20, y: 20 }];
    const obstacles = [{ x: 12, y: 12 }];
    const result = getPlayspaceBounds(cells, goalTiles, obstacles, gridBounds, 1);
    assert.ok(result);
    assert.strictEqual(result!.minX, 4);
    assert.strictEqual(result!.minY, 4);
    assert.strictEqual(result!.width, 18);
    assert.strictEqual(result!.height, 18);
  });

  test('getPlayspaceBounds clamps to grid bounds', () => {
    const cells = [{ x: 0, y: 0 }, { x: 2, y: 2 }];
    const result = getPlayspaceBounds(cells, [], [], gridBounds, 5);
    assert.ok(result);
    assert.strictEqual(result!.minX, 0);
    assert.strictEqual(result!.minY, 0);
    assert.ok(result!.width <= 60);
    assert.ok(result!.height <= 60);
  });

  test('getViewportToFitPlayspace returns centered viewport', () => {
    const playspace: PlayspaceBounds = { minX: 10, minY: 10, width: 20, height: 15 };
    const view = getViewportToFitPlayspace(800, 600, playspace, gridBounds, 0.1);
    assert.ok(typeof view.x === 'number');
    assert.ok(typeof view.y === 'number');
    assert.ok(view.scale > 0);
    assert.ok(view.scale <= 12);
  });

  test('getViewportToFitPlayspace fallback when playspace small', () => {
    const playspace: PlayspaceBounds = { minX: 0, minY: 0, width: 5, height: 5 };
    const view = getViewportToFitPlayspace(800, 600, playspace, gridBounds);
    assert.ok(view.scale >= 1);
    assert.ok(view.scale <= 12);
  });
});
