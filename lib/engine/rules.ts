// Pure functions for Conway's Game of Life simulation
import type { Cell, Bounds } from './types';

/**
 * Check if a cell is within grid bounds
 */
export const isWithinBounds = (cell: Cell, bounds: Bounds): boolean => {
  return (
    cell.x >= 0 &&
    cell.x < bounds.width &&
    cell.y >= 0 &&
    cell.y < bounds.height
  );
};

/**
 * Check if two cells are at the same position
 */
const cellsEqual = (a: Cell, b: Cell): boolean => {
  return a.x === b.x && a.y === b.y;
};

/**
 * Get all 8 neighbor positions for a given cell (Moore neighborhood)
 */
const getNeighborPositions = (cell: Cell): Cell[] => {
  return [
    { x: cell.x - 1, y: cell.y - 1 }, // Top-left
    { x: cell.x,     y: cell.y - 1 }, // Top
    { x: cell.x + 1, y: cell.y - 1 }, // Top-right
    { x: cell.x - 1, y: cell.y },     // Left
    { x: cell.x + 1, y: cell.y },     // Right
    { x: cell.x - 1, y: cell.y + 1 }, // Bottom-left
    { x: cell.x,     y: cell.y + 1 }, // Bottom
    { x: cell.x + 1, y: cell.y + 1 }, // Bottom-right
  ];
};

/**
 * Count how many of a cell's 8 neighbors are alive
 */
export const getNeighborCount = (cell: Cell, liveCells: Cell[]): number => {
  const neighborPositions = getNeighborPositions(cell);
  
  return neighborPositions.reduce((count, neighborPos) => {
    const isAlive = liveCells.some(liveCell => cellsEqual(liveCell, neighborPos));
    return isAlive ? count + 1 : count;
  }, 0);
};

/**
 * Get all cells that could potentially be affected in the next generation
 * (all live cells + all their neighbors)
 */
const getCandidateCells = (liveCells: Cell[], bounds: Bounds): Cell[] => {
  const candidateSet = new Set<string>();

  // Add all live cells
  liveCells.forEach(cell => {
    candidateSet.add(`${cell.x},${cell.y}`);
  });

  // Add all neighbors of live cells
  liveCells.forEach(cell => {
    getNeighborPositions(cell).forEach(neighbor => {
      if (isWithinBounds(neighbor, bounds)) {
        candidateSet.add(`${neighbor.x},${neighbor.y}`);
      }
    });
  });

  // Convert back to Cell objects
  return Array.from(candidateSet).map(key => {
    const [x, y] = key.split(',').map(Number);
    return { x, y };
  });
};

/**
 * Apply Conway's Game of Life rules for one generation step
 * 
 * Rules:
 * - Live cell with 2-3 neighbors survives
 * - Live cell with <2 neighbors dies (underpopulation)
 * - Live cell with >3 neighbors dies (overpopulation)
 * - Dead cell with exactly 3 neighbors becomes alive (reproduction)
 * 
 * Returns new cells array without mutating input
 */
export const stepGrid = (liveCells: Cell[], bounds: Bounds): Cell[] => {
  const nextGeneration: Cell[] = [];
  const candidates = getCandidateCells(liveCells, bounds);

  candidates.forEach(cell => {
    const neighbors = getNeighborCount(cell, liveCells);
    const isAlive = liveCells.some(liveCell => cellsEqual(liveCell, cell));

    if (isAlive) {
      // Live cell survives if it has 2 or 3 neighbors
      if (neighbors === 2 || neighbors === 3) {
        nextGeneration.push(cell);
      }
    } else {
      // Dead cell becomes alive if it has exactly 3 neighbors
      if (neighbors === 3) {
        nextGeneration.push(cell);
      }
    }
  });

  return nextGeneration;
};

/**
 * Get all valid birth candidates for Life Garden mode
 * (empty cells with exactly 3 neighbors)
 */
export const getBirthCandidates = (liveCells: Cell[], bounds: Bounds): Cell[] => {
  const candidates: Cell[] = [];
  const checked = new Set<string>();

  // Check all neighbors of live cells
  liveCells.forEach(cell => {
    getNeighborPositions(cell).forEach(neighbor => {
      const key = `${neighbor.x},${neighbor.y}`;
      
      // Skip if already checked, out of bounds, or already alive
      if (
        checked.has(key) ||
        !isWithinBounds(neighbor, bounds) ||
        liveCells.some(liveCell => cellsEqual(liveCell, neighbor))
      ) {
        return;
      }

      checked.add(key);

      // Check if this dead cell has exactly 3 neighbors
      const neighborCount = getNeighborCount(neighbor, liveCells);
      if (neighborCount === 3) {
        candidates.push(neighbor);
      }
    });
  });

  return candidates;
};

/**
 * Check if a cell is a valid birth candidate for Life Garden mode
 * (must be dead, within bounds, and have exactly 3 neighbors)
 */
export const isValidBirthCandidate = (
  cell: Cell,
  liveCells: Cell[],
  bounds: Bounds
): boolean => {
  // Must be within bounds
  if (!isWithinBounds(cell, bounds)) {
    return false;
  }

  // Must be dead (not already in liveCells)
  const isAlive = liveCells.some(liveCell => cellsEqual(liveCell, cell));
  if (isAlive) {
    return false;
  }

  // Must have exactly 3 neighbors
  const neighborCount = getNeighborCount(cell, liveCells);
  return neighborCount === 3;
};

/**
 * Apply a manual birth for Life Garden mode
 * 
 * Validates that the cell is a valid birth candidate, then adds it to the live cells.
 * This is used for player-controlled births in Life Garden mode.
 * 
 * @param cell - Cell to birth
 * @param liveCells - Current live cells
 * @param bounds - Grid dimensions
 * @returns New cells array with the birth applied
 * @throws Error if cell is not a valid birth candidate
 */
export const applyBirth = (
  cell: Cell,
  liveCells: Cell[],
  bounds: Bounds
): Cell[] => {
  // Validate it's a valid birth candidate
  if (!isValidBirthCandidate(cell, liveCells, bounds)) {
    // Provide specific error message
    if (!isWithinBounds(cell, bounds)) {
      throw new Error(`Cell (${cell.x}, ${cell.y}) is out of bounds (${bounds.width}x${bounds.height})`);
    }
    
    const isAlive = liveCells.some(liveCell => cellsEqual(liveCell, cell));
    if (isAlive) {
      throw new Error(`Cell (${cell.x}, ${cell.y}) is already alive`);
    }
    
    const neighborCount = getNeighborCount(cell, liveCells);
    throw new Error(`Cell (${cell.x}, ${cell.y}) has ${neighborCount} neighbors, must have exactly 3 for birth`);
  }
  
  // Return new array with the birth cell added (immutable)
  return [...liveCells, cell];
};
