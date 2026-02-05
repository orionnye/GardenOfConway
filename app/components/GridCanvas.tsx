'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as PIXI from 'pixi.js';

interface Cell {
  x: number;
  y: number;
}

interface GridCanvasProps {
  cells?: Cell[];
  bounds?: { width: number; height: number };
  birthCandidates?: Cell[];
  mode?: 'classic' | 'lifeGarden';
  onCellClick?: (cell: Cell, isAlive: boolean) => void;
  onDragPaint?: (cells: Cell[], mode: 'draw' | 'erase') => void;
  onBirthCandidateClick?: (cell: Cell) => void;
  onViewportReset?: () => void;
}

interface Viewport {
  x: number;
  y: number;
  scale: number;
}

export default function GridCanvas({ 
  cells = [], 
  bounds = { width: 60, height: 60 },
  birthCandidates = [],
  mode = 'classic',
  onCellClick,
  onDragPaint,
  onBirthCandidateClick,
  onViewportReset,
}: GridCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const cellsContainerRef = useRef<PIXI.Container | null>(null);
  const gridLinesRef = useRef<PIXI.Graphics | null>(null);
  const viewportContainerRef = useRef<PIXI.Container | null>(null);
  const ghostTilesContainerRef = useRef<PIXI.Container | null>(null);
  const birthCandidatesContainerRef = useRef<PIXI.Container | null>(null);
  const invalidClickFeedbackRef = useRef<PIXI.Graphics | null>(null);
  
  // Viewport state for zoom and pan
  const [viewport, setViewport] = useState<Viewport>({ x: 0, y: 0, scale: 1 });
  const viewportRef = useRef<Viewport>(viewport);
  
  // Drag painting state
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'draw' | 'erase'>('draw');
  const paintedCellsRef = useRef<Set<string>>(new Set());
  const dragBatchRef = useRef<Cell[]>([]);
  const batchTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Ghost tiles state
  const [ghostTiles, setGhostTiles] = useState<Cell[]>([]);
  const ghostTilesRef = useRef<Set<string>>(new Set());
  
  // Pan state (separate from drag painting)
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number; viewportX: number; viewportY: number } | null>(null);

  // Store latest values in refs to avoid triggering re-initialization
  const cellsRef = useRef<Cell[]>(cells);
  const birthCandidatesRef = useRef<Cell[]>(birthCandidates);
  const modeRef = useRef(mode);
  const onCellClickRef = useRef(onCellClick);
  const onDragPaintRef = useRef(onDragPaint);
  const onBirthCandidateClickRef = useRef(onBirthCandidateClick);
  const dragModeRef = useRef(dragMode);
  const isDraggingRef = useRef(isDragging);

  // Update refs when props/state change
  useEffect(() => {
    cellsRef.current = cells;
    birthCandidatesRef.current = birthCandidates;
    modeRef.current = mode;
    onCellClickRef.current = onCellClick;
    onDragPaintRef.current = onDragPaint;
    onBirthCandidateClickRef.current = onBirthCandidateClick;
    dragModeRef.current = dragMode;
    isDraggingRef.current = isDragging;
    viewportRef.current = viewport;
  });
  
  // Calculate initial viewport scale
  const getInitialViewport = useCallback((): Viewport => {
    if (!appRef.current) return { x: 0, y: 0, scale: 1 };
    
    const limits = calculateZoomLimits(
      appRef.current.canvas.width,
      appRef.current.canvas.height,
      bounds.width,
      bounds.height
    );
    
    return { x: 0, y: 0, scale: limits.default };
  }, [bounds.width, bounds.height]);
  
  // Reset viewport function
  const resetViewport = useCallback(() => {
    setViewport(getInitialViewport());
  }, [getInitialViewport]);
  
  // Expose reset function to parent via callback
  useEffect(() => {
    if (onViewportReset) {
      // This is a bit of a hack, but allows parent to trigger reset
      // Store the reset function in a way the parent can access it
      (window as any).__resetGridViewport = resetViewport;
    }
    return () => {
      delete (window as any).__resetGridViewport;
    };
  }, [onViewportReset, resetViewport]);

  // Helper: Create cell key for tracking
  const cellKey = (cell: Cell) => `${cell.x},${cell.y}`;

  // Helper: Check if cell is alive (uses ref for latest cells)
  const isCellAlive = (cell: Cell) => {
    return cellsRef.current.some(c => c.x === cell.x && c.y === cell.y);
  };

  // Helper: Check if cell is a birth candidate
  const isBirthCandidate = (cell: Cell) => {
    return birthCandidatesRef.current.some(c => c.x === cell.x && c.y === cell.y);
  };

  // Helper: Show invalid click feedback (red flash)
  const showInvalidClickFeedback = (cell: Cell) => {
    if (!appRef.current || !invalidClickFeedbackRef.current) return;
    
    const cellSize = calculateCellSize(
      appRef.current.canvas.width,
      appRef.current.canvas.height,
      bounds.width,
      bounds.height
    );
    
    const feedback = invalidClickFeedbackRef.current;
    feedback.clear();
    feedback.rect(
      cell.x * cellSize,
      cell.y * cellSize,
      cellSize,
      cellSize
    );
    feedback.fill({ color: 0xdc2626, alpha: 0.6 });
    feedback.visible = true;
    
    // Fade out after 200ms
    setTimeout(() => {
      if (feedback) {
        feedback.visible = false;
      }
    }, 200);
  };

  // Helper: Get cell from coordinates (accounting for viewport transformation)
  const getCellFromCoords = (screenX: number, screenY: number) => {
    if (!appRef.current) return null;
    
    const cellSize = calculateCellSize(
      appRef.current.canvas.width,
      appRef.current.canvas.height,
      bounds.width,
      bounds.height
    );
    
    // Apply inverse viewport transformation
    const vp = viewportRef.current;
    const worldX = (screenX - vp.x) / vp.scale;
    const worldY = (screenY - vp.y) / vp.scale;

    const gridX = Math.floor(worldX / cellSize);
    const gridY = Math.floor(worldY / cellSize);

    // Check if within bounds
    if (gridX >= 0 && gridX < bounds.width && gridY >= 0 && gridY < bounds.height) {
      return { x: gridX, y: gridY };
    }
    
    return null;
  };

  // Batch dispatch cells (uses ref for latest callback)
  const flushDragBatch = () => {
    if (dragBatchRef.current.length > 0 && onDragPaintRef.current) {
      onDragPaintRef.current([...dragBatchRef.current], dragModeRef.current);
      dragBatchRef.current = [];
    }
  };

  // Add cell to batch
  const addCellToBatch = (cell: Cell) => {
    const key = cellKey(cell);
    
    // Skip if already painted in this drag session
    if (paintedCellsRef.current.has(key)) {
      return;
    }
    
    paintedCellsRef.current.add(key);
    dragBatchRef.current.push(cell);
    
    // Add ghost tile for visual feedback
    if (!ghostTilesRef.current.has(key)) {
      ghostTilesRef.current.add(key);
      setGhostTiles(prev => [...prev, cell]);
    }

    // Clear existing timer
    if (batchTimerRef.current) {
      clearTimeout(batchTimerRef.current);
    }

    // Set new timer to batch updates every 50ms
    batchTimerRef.current = setTimeout(() => {
      flushDragBatch();
    }, 50);
  };

  // Cleanup batch timer on unmount
  useEffect(() => {
    return () => {
      if (batchTimerRef.current) {
        clearTimeout(batchTimerRef.current);
      }
    };
  }, []);

  // Initialize PixiJS Application
  useEffect(() => {
    if (!containerRef.current) return;

    const app = new PIXI.Application();
    
    app.init({
      backgroundColor: 0x1a1a1a,
      antialias: true,
      resizeTo: window,
    }).then(() => {
      if (containerRef.current && !appRef.current) {
        containerRef.current.appendChild(app.canvas);
        
        // Set accessibility label
        app.canvas.setAttribute('aria-label', `Conway's Game of Life grid, ${bounds.width} by ${bounds.height} cells`);
        
        appRef.current = app;

        // Create viewport container that will hold all transformed content
        const viewportContainer = new PIXI.Container();
        app.stage.addChild(viewportContainer);
        viewportContainerRef.current = viewportContainer;

        // Create graphics for grid lines
        const gridLines = new PIXI.Graphics();
        viewportContainer.addChild(gridLines);
        gridLinesRef.current = gridLines;

        // Create container for cells
        const cellsContainer = new PIXI.Container();
        viewportContainer.addChild(cellsContainer);
        cellsContainerRef.current = cellsContainer;
        
        // Create container for ghost tiles (above cells)
        const ghostTilesContainer = new PIXI.Container();
        ghostTilesContainer.interactiveChildren = false; // Don't block pointer events
        viewportContainer.addChild(ghostTilesContainer);
        ghostTilesContainerRef.current = ghostTilesContainer;
        
        // Create container for birth candidates (above ghost tiles)
        const birthCandidatesContainer = new PIXI.Container();
        birthCandidatesContainer.interactiveChildren = false;
        viewportContainer.addChild(birthCandidatesContainer);
        birthCandidatesContainerRef.current = birthCandidatesContainer;
        
        // Create graphics for invalid click feedback (top layer)
        const invalidClickFeedback = new PIXI.Graphics();
        invalidClickFeedback.visible = false;
        viewportContainer.addChild(invalidClickFeedback);
        invalidClickFeedbackRef.current = invalidClickFeedback;

        // Draw grid lines
        drawGridLines(gridLines, bounds);

        // Setup interactive container for click events
        const interactiveContainer = new PIXI.Container();
        interactiveContainer.interactive = true;
        app.stage.addChild(interactiveContainer);

        // Add pointer event handlers
        const handlePointerDown = (event: any) => {
          const x = event.global?.x ?? event.clientX ?? 0;
          const y = event.global?.y ?? event.clientY ?? 0;
          const button = event.button ?? 0;
          
          // Right-click or middle-click for panning
          if (button === 2 || button === 1 || event.shiftKey) {
            setIsPanning(true);
            panStartRef.current = {
              x,
              y,
              viewportX: viewportRef.current.x,
              viewportY: viewportRef.current.y,
            };
            return;
          }
          
          // Left-click for painting/clicking
          const cell = getCellFromCoords(x, y);
          if (!cell) return;
          
          // Life Garden mode: handle birth candidate clicks
          if (modeRef.current === 'lifeGarden' && onBirthCandidateClickRef.current) {
            if (isBirthCandidate(cell)) {
              onBirthCandidateClickRef.current(cell);
            } else {
              // Show red flash feedback for invalid click
              showInvalidClickFeedback(cell);
            }
            return;
          }
          
          const isAlive = isCellAlive(cell);
          
          // If drag painting is enabled, start drag mode
          if (onDragPaintRef.current) {
            setIsDragging(true);
            setDragMode(isAlive ? 'erase' : 'draw');
            paintedCellsRef.current.clear();
            dragBatchRef.current = [];
            
            // Clear ghost tiles
            ghostTilesRef.current.clear();
            setGhostTiles([]);
            
            // Add first cell to batch
            addCellToBatch(cell);
          } else if (onCellClickRef.current) {
            // Fallback to single click
            onCellClickRef.current(cell, isAlive);
          }
        };

        const handlePointerMove = (event: any) => {
          const x = event.global?.x ?? event.clientX ?? 0;
          const y = event.global?.y ?? event.clientY ?? 0;
          
          // Handle panning
          if (panStartRef.current) {
            const dx = x - panStartRef.current.x;
            const dy = y - panStartRef.current.y;
            setViewport(prev => {
              const newViewport = {
                ...prev,
                x: panStartRef.current!.viewportX + dx,
                y: panStartRef.current!.viewportY + dy,
              };
              
              // Apply pan boundary constraints
              return clampViewport(
                newViewport,
                app.canvas.width,
                app.canvas.height,
                bounds.width,
                bounds.height
              );
            });
            return;
          }
          
          // Handle drag painting
          if (isDraggingRef.current && onDragPaintRef.current) {
            const cell = getCellFromCoords(x, y);
            if (cell) {
              addCellToBatch(cell);
            }
          }
        };

        const handlePointerUp = () => {
          // End panning
          if (panStartRef.current) {
            setIsPanning(false);
            panStartRef.current = null;
          }
          
          // End drag painting
          if (isDraggingRef.current && onDragPaintRef.current) {
            // Flush any remaining batched cells
            flushDragBatch();
            setIsDragging(false);
            paintedCellsRef.current.clear();
            
            // Clear ghost tiles
            ghostTilesRef.current.clear();
            setGhostTiles([]);
          }
        };
        
        // Handle mouse wheel for zooming
        const handleWheel = (event: WheelEvent) => {
          event.preventDefault();
          
          const rect = app.canvas.getBoundingClientRect();
          const mouseX = event.clientX - rect.left;
          const mouseY = event.clientY - rect.top;
          
          // Calculate dynamic zoom limits
          const limits = calculateZoomLimits(
            app.canvas.width,
            app.canvas.height,
            bounds.width,
            bounds.height
          );
          
          // Reduced zoom intensity for better control (0.05 instead of 0.1)
          const zoomIntensity = 0.05;
          const delta = -Math.sign(event.deltaY);
          const scaleFactor = 1 + delta * zoomIntensity;
          
          setViewport(prev => {
            // Apply dynamic zoom limits
            const newScale = Math.max(limits.min, Math.min(limits.max, prev.scale * scaleFactor));
            
            // Zoom to cursor position
            const worldX = (mouseX - prev.x) / prev.scale;
            const worldY = (mouseY - prev.y) / prev.scale;
            
            const newX = mouseX - worldX * newScale;
            const newY = mouseY - worldY * newScale;
            
            const newViewport = {
              x: newX,
              y: newY,
              scale: newScale,
            };
            
            // Apply pan boundary constraints after zoom
            return clampViewport(
              newViewport,
              app.canvas.width,
              app.canvas.height,
              bounds.width,
              bounds.height
            );
          });
        };

        interactiveContainer.on('pointerdown', handlePointerDown);
        interactiveContainer.on('pointermove', handlePointerMove);
        interactiveContainer.on('pointerup', handlePointerUp);
        interactiveContainer.on('pointerupoutside', handlePointerUp);

        // Also handle canvas events for fallback with coordinate conversion
        app.canvas.addEventListener('mousedown', (e) => {
          const rect = app.canvas.getBoundingClientRect();
          const event = {
            ...e,
            clientX: e.clientX - rect.left,
            clientY: e.clientY - rect.top,
          };
          handlePointerDown(event);
        });
        
        app.canvas.addEventListener('mousemove', (e) => {
          const rect = app.canvas.getBoundingClientRect();
          const event = {
            ...e,
            clientX: e.clientX - rect.left,
            clientY: e.clientY - rect.top,
          };
          handlePointerMove(event);
        });
        
        app.canvas.addEventListener('mouseup', (e) => {
          handlePointerUp();
        });
        
        // Add wheel event for zooming
        app.canvas.addEventListener('wheel', handleWheel, { passive: false });
        
        // Disable context menu on right-click
        app.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Touch events for mobile
        app.canvas.addEventListener('touchstart', (e) => {
          e.preventDefault(); // Prevent scrolling
          const touch = e.touches[0];
          const rect = app.canvas.getBoundingClientRect();
          const event = {
            clientX: touch.clientX - rect.left,
            clientY: touch.clientY - rect.top,
          };
          handlePointerDown(event);
        }, { passive: false });
        
        app.canvas.addEventListener('touchmove', (e) => {
          e.preventDefault(); // Prevent scrolling
          const touch = e.touches[0];
          const rect = app.canvas.getBoundingClientRect();
          const event = {
            clientX: touch.clientX - rect.left,
            clientY: touch.clientY - rect.top,
          };
          handlePointerMove(event);
        }, { passive: false });
        
        app.canvas.addEventListener('touchend', (e) => {
          e.preventDefault();
          handlePointerUp();
        }, { passive: false });
        
        // Initialize viewport with calculated default zoom after everything is set up
        setTimeout(() => {
          const initialViewport = getInitialViewport();
          setViewport(initialViewport);
        }, 0);
      }
    });

    // Cleanup on unmount
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, {
          children: true,
          texture: true,
        });
        appRef.current = null;
        cellsContainerRef.current = null;
        gridLinesRef.current = null;
        ghostTilesContainerRef.current = null;
      }
    };
  }, [bounds.width, bounds.height]); // Only re-initialize when bounds change

  // Apply viewport transformation
  useEffect(() => {
    const container = viewportContainerRef.current;
    if (!container || !container.position || !container.scale) return;
    
    container.position.set(viewport.x, viewport.y);
    container.scale.set(viewport.scale, viewport.scale);
  }, [viewport]);

  // Render cells when they change
  useEffect(() => {
    if (!appRef.current || !cellsContainerRef.current) return;

    const cellsContainer = cellsContainerRef.current;
    const app = appRef.current;

    // Clear previous cells
    cellsContainer.removeChildren();

    // Calculate cell size to fit viewport
    const cellSize = calculateCellSize(
      app.canvas.width,
      app.canvas.height,
      bounds.width,
      bounds.height
    );

    // Render each cell
    cells.forEach(cell => {
      const graphics = new PIXI.Graphics();
      
      // Draw cell rectangle
      graphics.rect(
        cell.x * cellSize,
        cell.y * cellSize,
        cellSize,
        cellSize
      );
      
      // Fill with green color
      graphics.fill({ color: 0x22c55e });
      
      // Add border
      graphics.stroke({ color: 0x166534, width: 1 });

      cellsContainer.addChild(graphics);
    });
  }, [cells, bounds]);
  
  // Render ghost tiles for drag preview
  useEffect(() => {
    if (!appRef.current || !ghostTilesContainerRef.current) return;

    const ghostContainer = ghostTilesContainerRef.current;
    const app = appRef.current;

    // Clear previous ghost tiles
    ghostContainer.removeChildren();

    // Calculate cell size to fit viewport
    const cellSize = calculateCellSize(
      app.canvas.width,
      app.canvas.height,
      bounds.width,
      bounds.height
    );

    // Render each ghost tile
    ghostTiles.forEach(cell => {
      const graphics = new PIXI.Graphics();
      
      // Draw ghost tile rectangle
      graphics.rect(
        cell.x * cellSize,
        cell.y * cellSize,
        cellSize,
        cellSize
      );
      
      // Use green for draw mode, red for erase mode, with 40% opacity
      const ghostColor = dragMode === 'draw' ? 0x22c55e : 0xdc2626;
      graphics.fill({ color: ghostColor, alpha: 0.4 });
      
      // Add subtle border
      const borderColor = dragMode === 'draw' ? 0x166534 : 0x991b1b;
      graphics.stroke({ color: borderColor, width: 1, alpha: 0.6 });

      ghostContainer.addChild(graphics);
    });
  }, [ghostTiles, bounds, dragMode]);

  // Render birth candidates in Life Garden mode
  useEffect(() => {
    if (!appRef.current || !birthCandidatesContainerRef.current) return;

    const candidatesContainer = birthCandidatesContainerRef.current;
    const app = appRef.current;

    // Clear previous birth candidates
    candidatesContainer.removeChildren();

    // Only render in Life Garden mode
    if (mode !== 'lifeGarden') return;

    // Calculate cell size to fit viewport
    const cellSize = calculateCellSize(
      app.canvas.width,
      app.canvas.height,
      bounds.width,
      bounds.height
    );

    // Render each birth candidate with yellow glow
    birthCandidates.forEach(cell => {
      // Skip if cell is already alive
      const isAlive = cells.some(c => c.x === cell.x && c.y === cell.y);
      if (isAlive) return;

      const graphics = new PIXI.Graphics();
      
      // Draw birth candidate rectangle
      graphics.rect(
        cell.x * cellSize,
        cell.y * cellSize,
        cellSize,
        cellSize
      );
      
      // Yellow fill with 50% opacity
      graphics.fill({ color: 0xfacc15, alpha: 0.5 });
      
      // Yellow glow border
      graphics.stroke({ color: 0xeab308, width: 2, alpha: 0.8 });

      candidatesContainer.addChild(graphics);
    });
  }, [birthCandidates, cells, bounds, mode]);

  // Update cursor style based on mode
  const cursorStyle = isPanning 
    ? 'grabbing'
    : isDragging 
      ? (dragMode === 'draw' ? 'crosshair' : 'not-allowed')
      : 'default';

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full" 
      style={{ cursor: cursorStyle }}
    />
  );
}

// Helper function to calculate cell size
function calculateCellSize(
  canvasWidth: number,
  canvasHeight: number,
  gridWidth: number,
  gridHeight: number
): number {
  return Math.min(
    canvasWidth / gridWidth,
    canvasHeight / gridHeight
  );
}

// Helper function to calculate dynamic zoom limits
function calculateZoomLimits(
  canvasWidth: number,
  canvasHeight: number,
  gridWidth: number,
  gridHeight: number
): { min: number; max: number; default: number } {
  const baseCellSize = calculateCellSize(canvasWidth, canvasHeight, gridWidth, gridHeight);
  
  // Minimum zoom: fit entire grid plus 10% margin
  // This means we want the grid to take up 90% of the viewport
  const minZoom = 0.9;
  
  // Maximum zoom: show approximately 4-5 cells
  // If we want to show 5 cells across the smaller dimension
  const targetCellCount = 5;
  const maxZoom = Math.min(canvasWidth, canvasHeight) / (targetCellCount * baseCellSize);
  
  // Default zoom: fit grid comfortably (same as min for now)
  const defaultZoom = minZoom;
  
  return {
    min: minZoom,
    max: Math.max(maxZoom, minZoom * 1.5), // Ensure max is at least 1.5x min
    default: defaultZoom,
  };
}

// Helper function to calculate pan boundaries
function calculatePanBoundaries(
  canvasWidth: number,
  canvasHeight: number,
  gridWidth: number,
  gridHeight: number,
  scale: number
): { minX: number; maxX: number; minY: number; maxY: number } {
  const cellSize = calculateCellSize(canvasWidth, canvasHeight, gridWidth, gridHeight);
  const scaledGridWidth = gridWidth * cellSize * scale;
  const scaledGridHeight = gridHeight * cellSize * scale;
  
  // Allow panning until only 20% of grid is visible
  const visibleRatio = 0.2;
  
  // Maximum pan right (grid moves left, right edge at 20% visibility)
  const maxX = canvasWidth - (scaledGridWidth * visibleRatio);
  
  // Minimum pan left (grid moves right, left edge at 20% visibility)
  const minX = -(scaledGridWidth * (1 - visibleRatio));
  
  // Maximum pan down (grid moves up, bottom edge at 20% visibility)
  const maxY = canvasHeight - (scaledGridHeight * visibleRatio);
  
  // Minimum pan up (grid moves down, top edge at 20% visibility)
  const minY = -(scaledGridHeight * (1 - visibleRatio));
  
  return { minX, maxX, minY, maxY };
}

// Helper function to clamp viewport within boundaries
function clampViewport(
  viewport: Viewport,
  canvasWidth: number,
  canvasHeight: number,
  gridWidth: number,
  gridHeight: number
): Viewport {
  const boundaries = calculatePanBoundaries(
    canvasWidth,
    canvasHeight,
    gridWidth,
    gridHeight,
    viewport.scale
  );
  
  return {
    x: Math.max(boundaries.minX, Math.min(boundaries.maxX, viewport.x)),
    y: Math.max(boundaries.minY, Math.min(boundaries.maxY, viewport.y)),
    scale: viewport.scale,
  };
}

// Helper function to draw grid lines
function drawGridLines(
  graphics: PIXI.Graphics,
  bounds: { width: number; height: number }
) {
  // This will be implemented with proper sizing
  // For now, just set up the graphics object
  graphics.clear();
  
  // Calculate cell size based on window dimensions
  const cellSize = calculateCellSize(
    window.innerWidth,
    window.innerHeight,
    bounds.width,
    bounds.height
  );

  // Draw vertical lines
  for (let x = 0; x <= bounds.width; x++) {
    graphics.moveTo(x * cellSize, 0);
    graphics.lineTo(x * cellSize, bounds.height * cellSize);
  }

  // Draw horizontal lines
  for (let y = 0; y <= bounds.height; y++) {
    graphics.moveTo(0, y * cellSize);
    graphics.lineTo(bounds.width * cellSize, y * cellSize);
  }

  graphics.stroke({ color: 0x262626, width: 1, alpha: 0.3 });
}
