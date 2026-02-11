/**
 * Derives a rectangular playspace region from puzzle content (cells, goals, obstacles)
 * and computes a viewport that fits and centers that region in the canvas.
 */

export interface CellLike {
  x: number;
  y: number;
}

export interface Bounds {
  width: number;
  height: number;
}

export interface PlayspaceBounds {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

export interface Viewport {
  x: number;
  y: number;
  scale: number;
}

const defaultMargin = 2;

/**
 * Collect min/max extent from a list of cells.
 */
function extent(
  items: CellLike[],
  gridBounds: Bounds
): { minX: number; maxX: number; minY: number; maxY: number } | null {
  if (items.length === 0) return null;
  let minX = gridBounds.width;
  let maxX = -1;
  let minY = gridBounds.height;
  let maxY = -1;
  for (const c of items) {
    if (c.x < 0 || c.y < 0 || c.x >= gridBounds.width || c.y >= gridBounds.height) continue;
    minX = Math.min(minX, c.x);
    maxX = Math.max(maxX, c.x);
    minY = Math.min(minY, c.y);
    maxY = Math.max(maxY, c.y);
  }
  if (minX > maxX || minY > maxY) return null;
  return { minX, maxX, minY, maxY };
}

/**
 * Derive playspace bounds from cells, goalTiles, and obstacles with a margin.
 * Returns null if no content or content is out of bounds.
 */
export function getPlayspaceBounds(
  cells: CellLike[],
  goalTiles: CellLike[],
  obstacles: CellLike[],
  gridBounds: Bounds,
  margin: number = defaultMargin
): PlayspaceBounds | null {
  const all = [...cells, ...goalTiles, ...obstacles];
  const ext = extent(all, gridBounds);
  if (!ext) return null;

  const minX = Math.max(0, ext.minX - margin);
  const maxX = Math.min(gridBounds.width - 1, ext.maxX + margin);
  const minY = Math.max(0, ext.minY - margin);
  const maxY = Math.min(gridBounds.height - 1, ext.maxY + margin);

  if (minX > maxX || minY > maxY) return null;

  return {
    minX,
    minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

/**
 * Compute viewport (x, y, scale) so that the playspace region is centered and fits
 * in the canvas with optional padding (ratio of canvas, e.g. 0.1 = 10% padding).
 * Cell size is assumed uniform: cellSize = min(canvasW/gridW, canvasH/gridH) at scale 1.
 */
export function getViewportToFitPlayspace(
  canvasWidth: number,
  canvasHeight: number,
  playspace: PlayspaceBounds,
  gridBounds: Bounds,
  paddingRatio: number = 0.15
): Viewport {
  const gridCellSize = Math.min(
    canvasWidth / gridBounds.width,
    canvasHeight / gridBounds.height
  );

  const playspacePxWidth = playspace.width * gridCellSize;
  const playspacePxHeight = playspace.height * gridCellSize;

  const availableW = canvasWidth * (1 - 2 * paddingRatio);
  const availableH = canvasHeight * (1 - 2 * paddingRatio);
  if (availableW <= 0 || availableH <= 0) {
    return { x: 0, y: 0, scale: 1 };
  }

  const scaleX = availableW / playspacePxWidth;
  const scaleY = availableH / playspacePxHeight;
  // Cap scale so small playspaces can zoom in enough to be readable (was 4, raised for puzzle UX)
  const scale = Math.min(scaleX, scaleY, 12);
  const cellSize = gridCellSize * scale;

  const playspaceCenterX = (playspace.minX + playspace.width / 2 - 0.5) * gridCellSize;
  const playspaceCenterY = (playspace.minY + playspace.height / 2 - 0.5) * gridCellSize;

  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;

  const x = canvasCenterX - playspaceCenterX * scale;
  const y = canvasCenterY - playspaceCenterY * scale;

  return { x, y, scale };
}
