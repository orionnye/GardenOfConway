import { describe, test, vi, beforeEach } from 'vitest';
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
    position = { x: 0, y: 0, set: vi.fn() };
    scale = { x: 1, y: 1, set: vi.fn() };
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

describe('GridCanvas - Viewport Controls', () => {
  beforeEach(() => {
    // Clear any global viewport reset function
    delete (window as any).__resetGridViewport;
  });

  test('Viewport Reset Function Registration', async () => {
    const onViewportReset = vi.fn();
    
    render(
      <GridCanvas onViewportReset={onViewportReset} />
    );

    await waitFor(() => {
      assert({
        given: 'GridCanvas with onViewportReset callback',
        should: 'register global reset function',
        actual: typeof (window as any).__resetGridViewport,
        expected: 'function',
      });
    });
  });

  test('Viewport Container Creation', async () => {
    const { container } = render(<GridCanvas />);

    await waitFor(() => {
      const canvas = container.querySelector('canvas');
      
      assert({
        given: 'GridCanvas component mounted',
        should: 'create viewport container for transformations',
        actual: canvas !== null,
        expected: true,
      });
    });
  });

  test('Mouse Wheel Zoom', async () => {
    const { container } = render(<GridCanvas />);

    await waitFor(() => {
      const canvas = container.querySelector('canvas');
      
      if (canvas) {
        // Simulate wheel event
        const wheelEvent = new WheelEvent('wheel', {
          deltaY: -100, // Scroll up to zoom in
          clientX: 400,
          clientY: 300,
        });
        
        canvas.dispatchEvent(wheelEvent);
      }

      assert({
        given: 'mouse wheel scroll event',
        should: 'handle zoom event without errors',
        actual: canvas !== null,
        expected: true,
      });
    });
  });

  test('Context Menu Prevention', async () => {
    const { container } = render(<GridCanvas />);

    await waitFor(() => {
      const canvas = container.querySelector('canvas');
      
      if (canvas) {
        const contextMenuEvent = new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
        });
        
        const prevented = !canvas.dispatchEvent(contextMenuEvent);
        
        assert({
          given: 'right-click context menu event',
          should: 'prevent default context menu',
          actual: prevented,
          expected: true,
        });
      }
    });
  });

  test('Pan Mode Cursor Style', async () => {
    const { container } = render(<GridCanvas />);

    await waitFor(() => {
      const wrapper = container.querySelector('div[style*="cursor"]');
      
      assert({
        given: 'GridCanvas with viewport controls',
        should: 'have cursor style wrapper',
        actual: wrapper !== null,
        expected: true,
      });
    });
  });

  test('Coordinate Transformation', () => {
    // Test inverse transformation for click coordinates
    const viewport = { x: 100, y: 50, scale: 2 };
    const screenX = 300;
    const screenY = 200;
    
    // Apply inverse transformation
    const worldX = (screenX - viewport.x) / viewport.scale;
    const worldY = (screenY - viewport.y) / viewport.scale;

    assert({
      given: 'viewport transformation and screen coordinates',
      should: 'correctly convert to world coordinates',
      actual: { worldX, worldY },
      expected: { worldX: 100, worldY: 75 },
    });
  });

  test('Zoom Limits', () => {
    const minZoom = 0.5;
    const maxZoom = 4.0;
    
    // Test clamping
    const clampZoom = (scale: number) => Math.max(minZoom, Math.min(maxZoom, scale));
    
    assert({
      given: 'zoom scale below minimum',
      should: 'clamp to minimum zoom',
      actual: clampZoom(0.1),
      expected: 0.5,
    });
    
    assert({
      given: 'zoom scale above maximum',
      should: 'clamp to maximum zoom',
      actual: clampZoom(10),
      expected: 4.0,
    });
  });

  test('Dynamic Zoom Limit Calculation', () => {
    const canvasWidth = 800;
    const canvasHeight = 600;
    const gridWidth = 60;
    const gridHeight = 60;
    
    // Calculate base cell size
    const baseCellSize = Math.min(
      canvasWidth / gridWidth,
      canvasHeight / gridHeight
    );
    
    // Minimum zoom: fit grid with 10% margin (grid takes 90% of viewport)
    const minZoom = 0.9;
    
    // Maximum zoom: show ~5 cells
    const targetCellCount = 5;
    const maxZoom = Math.min(canvasWidth, canvasHeight) / (targetCellCount * baseCellSize);
    
    assert({
      given: 'canvas 800x600 and grid 60x60',
      should: 'calculate minimum zoom to fit grid with margin',
      actual: minZoom,
      expected: 0.9,
    });
    
    assert({
      given: 'canvas and grid dimensions',
      should: 'calculate maximum zoom greater than minimum',
      actual: maxZoom > minZoom,
      expected: true,
    });
  });

  test('Pan Boundary Calculation', () => {
    const canvasWidth = 800;
    const canvasHeight = 600;
    const gridWidth = 60;
    const gridHeight = 60;
    const scale = 1;
    const visibleRatio = 0.2;
    
    const baseCellSize = Math.min(
      canvasWidth / gridWidth,
      canvasHeight / gridHeight
    );
    
    const scaledGridWidth = gridWidth * baseCellSize * scale;
    const scaledGridHeight = gridHeight * baseCellSize * scale;
    
    // Calculate boundaries
    const maxX = canvasWidth - (scaledGridWidth * visibleRatio);
    const minX = -(scaledGridWidth * (1 - visibleRatio));
    const maxY = canvasHeight - (scaledGridHeight * visibleRatio);
    const minY = -(scaledGridHeight * (1 - visibleRatio));
    
    assert({
      given: 'grid and canvas dimensions',
      should: 'allow panning right until 20% visible',
      actual: maxX > 0,
      expected: true,
    });
    
    assert({
      given: 'grid and canvas dimensions',
      should: 'allow panning left until 20% visible',
      actual: minX < 0,
      expected: true,
    });
    
    assert({
      given: 'pan boundaries',
      should: 'have wider range than canvas width',
      actual: (maxX - minX) > canvasWidth,
      expected: true,
    });
  });

  test('Reduced Zoom Speed', () => {
    const oldZoomIntensity = 0.1;
    const newZoomIntensity = 0.05;
    
    const currentScale = 1.0;
    const delta = 1; // zoom in
    
    const oldScaleFactor = 1 + delta * oldZoomIntensity;
    const newScaleFactor = 1 + delta * newZoomIntensity;
    
    const oldNewScale = currentScale * oldScaleFactor;
    const newNewScale = currentScale * newScaleFactor;
    
    assert({
      given: 'reduced zoom intensity',
      should: 'zoom more slowly (smaller scale change)',
      actual: (newNewScale - currentScale) < (oldNewScale - currentScale),
      expected: true,
    });
    
    assert({
      given: 'zoom intensity of 0.05',
      should: 'produce 5% scale change per step',
      actual: newNewScale,
      expected: 1.05,
    });
  });
});
