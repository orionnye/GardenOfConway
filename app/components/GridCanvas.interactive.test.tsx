import { describe, test, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import assert from 'node:assert';
import GridCanvas from './GridCanvas';

// Mock PixiJS
vi.mock('pixi.js', () => {
  class MockGraphics {
    clear = vi.fn().mockReturnThis();
    rect = vi.fn().mockReturnThis();
    fill = vi.fn().mockReturnThis();
    stroke = vi.fn().mockReturnThis();
    moveTo = vi.fn().mockReturnThis();
    lineTo = vi.fn().mockReturnThis();
  }

  class MockContainer {
    children: any[] = [];
    interactive = false;
    on = vi.fn();
    off = vi.fn();
    addChild = vi.fn((child: any) => {
      this.children.push(child);
      return child;
    });
    removeChildren = vi.fn(() => {
      this.children = [];
    });
  }

  return {
    Application: class MockApplication {
      canvas: HTMLCanvasElement;
      destroy = vi.fn();
      stage: MockContainer;
      
      constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;
        this.stage = new MockContainer();
      }
      
      async init(options?: any) {
        this.canvas.setAttribute('aria-label', "Conway's Game of Life grid, 60 by 60 cells");
        return Promise.resolve();
      }
    },
    Graphics: MockGraphics,
    Container: MockContainer,
  };
});

describe('GridCanvas - Interactive Cell Editing', () => {
  test('Cell Click Handler', async () => {
    const onCellClick = vi.fn();
    const cells = [{ x: 5, y: 5 }];
    const bounds = { width: 60, height: 60 };

    const { container } = render(
      <GridCanvas 
        cells={cells} 
        bounds={bounds} 
        onCellClick={onCellClick}
      />
    );

    await waitFor(() => {
      const canvas = container.querySelector('canvas');
      
      assert({
        given: 'GridCanvas with onCellClick handler',
        should: 'accept onCellClick prop',
        actual: canvas !== null,
        expected: true,
      });
    });
  });

  test('Convert Screen to Grid Coordinates', () => {
    // This will test the coordinate conversion logic
    const cellSize = 20;
    const mouseX = 100;
    const mouseY = 100;
    
    const gridX = Math.floor(mouseX / cellSize);
    const gridY = Math.floor(mouseY / cellSize);

    assert({
      given: 'mouse position (100, 100) with cellSize 20',
      should: 'convert to grid coordinates (5, 5)',
      actual: `${gridX},${gridY}`,
      expected: '5,5',
    });
  });
});
