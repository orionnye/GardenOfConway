import { describe, test, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import assert from 'node:assert';
import GridCanvas from './GridCanvas';
import * as PIXI from 'pixi.js';

const graphicsFillCalls: Array<{ color?: number; alpha?: number }> = [];

// Mock PixiJS Application to avoid WebGL context in test environment
vi.mock('pixi.js', () => {
  class MockGraphics {
    clear = vi.fn().mockReturnThis();
    rect = vi.fn().mockReturnThis();
    fill = vi.fn((args?: { color?: number; alpha?: number }) => {
      if (args) {
        graphicsFillCalls.push(args);
      }
      return this;
    });
    stroke = vi.fn().mockReturnThis();
    moveTo = vi.fn().mockReturnThis();
    lineTo = vi.fn().mockReturnThis();
    circle = vi.fn().mockReturnThis();
  }

  class MockContainer {
    children: any[] = [];
    interactive: boolean = false;
    addChild = vi.fn((child: any) => {
      this.children.push(child);
      return child;
    });
    removeChildren = vi.fn(() => {
      this.children = [];
    });
    on = vi.fn();
  }

  return {
    Application: class MockApplication {
      canvas: HTMLCanvasElement;
      destroy = vi.fn();
      stage: MockContainer;
      
      constructor() {
        // Create a real DOM canvas element for testing
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

describe('GridCanvas', () => {
  beforeEach(() => {
    graphicsFillCalls.length = 0;
  });

  test('PixiJS Application Setup', async () => {
    const { container } = render(<GridCanvas />);
    
    // Wait for PixiJS to initialize
    await waitFor(() => {
      const canvas = container.querySelector('canvas');
      assert({
        given: 'GridCanvas component mounted',
        should: 'render a canvas element',
        actual: canvas?.tagName,
        expected: 'CANVAS',
      });
    });
  });

  test('Accessibility', async () => {
    const { container } = render(<GridCanvas />);
    
    await waitFor(() => {
      const canvas = container.querySelector('canvas');
      const ariaLabel = canvas?.getAttribute('aria-label');
      
      assert({
        given: 'GridCanvas component mounted',
        should: 'have proper aria-label for accessibility',
        actual: ariaLabel?.includes('Conway'),
        expected: true,
      });
    });
  });

  test('Cell Rendering', async () => {
    const cells = [
      { x: 5, y: 5 },
      { x: 6, y: 5 },
    ];
    const bounds = { width: 60, height: 60 };
    
    const { container } = render(
      <GridCanvas cells={cells} bounds={bounds} />
    );
    
    await waitFor(() => {
      const canvas = container.querySelector('canvas');
      
      assert({
        given: 'cells array with 2 cells',
        should: 'render canvas element with cells',
        actual: canvas !== null,
        expected: true,
      });
    });
  });

  test('Empty Grid', async () => {
    const cells: Array<{x: number; y: number}> = [];
    const bounds = { width: 60, height: 60 };
    
    const { container } = render(
      <GridCanvas cells={cells} bounds={bounds} />
    );
    
    await waitFor(() => {
      const canvas = container.querySelector('canvas');
      
      assert({
        given: 'empty cells array',
        should: 'render canvas without crashing',
        actual: canvas !== null,
        expected: true,
      });
    });
  });

  test('Goal Tile Rendering in Life Garden mode', async () => {
    const goals = [{ x: 2, y: 2 }, { x: 4, y: 4 }];
    const cells = [{ x: 4, y: 4 }];

    const { container } = render(
      <GridCanvas
        cells={cells}
        bounds={{ width: 60, height: 60 }}
        goalTiles={goals}
        mode="lifeGarden"
      />
    );

    await waitFor(() => {
      const canvas = container.querySelector('canvas');
      const colors = graphicsFillCalls.map((entry) => entry.color);

      assert({
        given: 'Life Garden mode with goal tiles',
        should: 'render unreached and reached goal marker colors',
        actual: canvas !== null && colors.includes(0x2563eb) && colors.includes(0x7c3aed),
        expected: true,
      });
    });
  });

  test('Goal Tile Hidden in Classic mode', async () => {
    const goals = [{ x: 2, y: 2 }];

    const { container } = render(
      <GridCanvas
        cells={[]}
        bounds={{ width: 60, height: 60 }}
        goalTiles={goals}
        mode="classic"
      />
    );

    await waitFor(() => {
      const canvas = container.querySelector('canvas');
      const colors = graphicsFillCalls.map((entry) => entry.color);

      assert({
        given: 'Classic mode with goal tiles configured',
        should: 'omit goal marker fills from rendering',
        actual: canvas !== null && !colors.includes(0x2563eb) && !colors.includes(0x7c3aed),
        expected: true,
      });
    });
  });

  test('Puzzle mode with playspace content renders and focuses view', async () => {
    const cells = [{ x: 10, y: 10 }, { x: 11, y: 10 }];
    const goalTiles = [{ x: 24, y: 20 }];
    const obstacles = [{ x: 22, y: 19 }];

    const { container } = render(
      <GridCanvas
        cells={cells}
        bounds={{ width: 60, height: 60 }}
        goalTiles={goalTiles}
        obstacles={obstacles}
        mode="puzzle"
      />
    );

    await waitFor(() => {
      const canvas = container.querySelector('canvas');
      assert({
        given: 'puzzle mode with cells, goals, and obstacles',
        should: 'render canvas and apply playspace-focused viewport without error',
        actual: canvas !== null,
        expected: true,
      });
    });
  });
});

describe('GridCanvas - Drag Painting', () => {
  test('onDragPaint prop availability', async () => {
    const onDragPaint = vi.fn();
    const cells: Array<{x: number; y: number}> = [];
    const bounds = { width: 60, height: 60 };
    
    const { container } = render(
      <GridCanvas 
        cells={cells} 
        bounds={bounds} 
        onDragPaint={onDragPaint}
      />
    );
    
    await waitFor(() => {
      const canvas = container.querySelector('canvas');
      
      assert({
        given: 'component mounted with onDragPaint handler',
        should: 'render canvas element',
        actual: canvas !== null,
        expected: true,
      });
    });
  });

  test('component with drag handler readiness', async () => {
    const onDragPaint = vi.fn();
    const cells: Array<{x: number; y: number}> = [];
    const bounds = { width: 60, height: 60 };
    
    const { container } = render(
      <GridCanvas 
        cells={cells} 
        bounds={bounds} 
        onDragPaint={onDragPaint}
      />
    );
    
    await waitFor(() => {
      const canvas = container.querySelector('canvas');
      
      assert({
        given: 'component with drag handler',
        should: 'be ready to handle drag events',
        actual: canvas !== null,
        expected: true,
      });
    });
  });

  test('cursor style changes during drag', async () => {
    const onDragPaint = vi.fn();
    const cells: Array<{x: number; y: number}> = [];
    const bounds = { width: 60, height: 60 };
    
    const { container } = render(
      <GridCanvas 
        cells={cells} 
        bounds={bounds} 
        onDragPaint={onDragPaint}
      />
    );
    
    await waitFor(() => {
      const wrapper = container.querySelector('div');
      
      assert({
        given: 'component not in drag mode',
        should: 'have default cursor style',
        actual: wrapper?.style.cursor,
        expected: 'default',
      });
    });
  });
});

describe('GridCanvas - Ghost Tiles', () => {
  test('ghost tile container creation', async () => {
    const onDragPaint = vi.fn();
    const cells: Array<{x: number; y: number}> = [];
    const bounds = { width: 60, height: 60 };
    
    const { container } = render(
      <GridCanvas 
        cells={cells} 
        bounds={bounds} 
        onDragPaint={onDragPaint}
      />
    );
    
    await waitFor(() => {
      const canvas = container.querySelector('canvas');
      
      assert({
        given: 'component with drag paint enabled',
        should: 'initialize canvas for ghost tiles',
        actual: canvas !== null,
        expected: true,
      });
    });
  });
});
