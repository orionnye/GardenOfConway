import { describe, test } from 'vitest';
import { assert } from 'riteway/vitest';
import { 
  getNeighborCount, 
  isWithinBounds, 
  stepGrid, 
  getBirthCandidates, 
  isValidBirthCandidate,
  applyBirth
} from './rules';
import type { Cell, Bounds } from './types';

describe('rules - Grid Utilities', () => {
  test('isWithinBounds()', () => {
    {
      const bounds: Bounds = { width: 10, height: 10 };
      const cell: Cell = { x: 5, y: 5 };

      assert({
        given: 'a cell coordinate and bounds',
        should: 'return true if cell is within bounds',
        actual: isWithinBounds(cell, bounds),
        expected: true,
      });
    }

    {
      const bounds: Bounds = { width: 10, height: 10 };
      const cell: Cell = { x: 10, y: 5 };

      assert({
        given: 'a cell at edge (x === width)',
        should: 'return false (out of bounds)',
        actual: isWithinBounds(cell, bounds),
        expected: false,
      });
    }

    {
      const bounds: Bounds = { width: 10, height: 10 };
      const cell: Cell = { x: -1, y: 5 };

      assert({
        given: 'a cell with negative coordinate',
        should: 'return false (out of bounds)',
        actual: isWithinBounds(cell, bounds),
        expected: false,
      });
    }
  });
});

describe('rules - Neighbor Counting', () => {
  test('getNeighborCount()', () => {
    // Test empty grid
    {
      const cell: Cell = { x: 5, y: 5 };
      const liveCells: Cell[] = [];

      assert({
        given: 'an empty grid',
        should: 'return 0 neighbors for any cell',
        actual: getNeighborCount(cell, liveCells),
        expected: 0,
      });
    }

    // Test single neighbor
    {
      const cell: Cell = { x: 5, y: 5 };
      const liveCells: Cell[] = [{ x: 5, y: 6 }]; // One neighbor above

      assert({
        given: 'a cell with one adjacent live cell',
        should: 'return 1',
        actual: getNeighborCount(cell, liveCells),
        expected: 1,
      });
    }

    // Test all 8 neighbors
    {
      const cell: Cell = { x: 5, y: 5 };
      const liveCells: Cell[] = [
        { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, // Top row
        { x: 4, y: 5 },                 { x: 6, y: 5 }, // Middle row (skip center)
        { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }, // Bottom row
      ];

      assert({
        given: 'a cell surrounded by 8 live cells',
        should: 'return 8',
        actual: getNeighborCount(cell, liveCells),
        expected: 8,
      });
    }

    // Test non-adjacent cells don't count
    {
      const cell: Cell = { x: 5, y: 5 };
      const liveCells: Cell[] = [
        { x: 5, y: 6 },   // Adjacent (should count)
        { x: 10, y: 10 }, // Far away (shouldn't count)
        { x: 5, y: 8 },   // Two cells away (shouldn't count)
      ];

      assert({
        given: 'a mix of adjacent and non-adjacent live cells',
        should: 'count only the adjacent cells',
        actual: getNeighborCount(cell, liveCells),
        expected: 1,
      });
    }

    // Test diagonal neighbors
    {
      const cell: Cell = { x: 5, y: 5 };
      const liveCells: Cell[] = [
        { x: 4, y: 4 }, // Top-left diagonal
        { x: 6, y: 6 }, // Bottom-right diagonal
      ];

      assert({
        given: 'a cell with diagonal neighbors',
        should: 'count diagonal neighbors',
        actual: getNeighborCount(cell, liveCells),
        expected: 2,
      });
    }
  });
});

describe('rules - Conway Step Function', () => {
  test('stepGrid()', () => {
    // Test live cell with 2 neighbors survives
    {
      const liveCells: Cell[] = [
        { x: 5, y: 5 }, // Center (has 2 neighbors)
        { x: 4, y: 5 }, // Left neighbor
        { x: 6, y: 5 }, // Right neighbor
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const nextCells = stepGrid(liveCells, bounds);

      const centerSurvived = nextCells.some(c => c.x === 5 && c.y === 5);

      assert({
        given: 'a live cell with 2 neighbors',
        should: 'survive to next generation',
        actual: centerSurvived,
        expected: true,
      });
    }

    // Test live cell with 3 neighbors survives
    {
      const liveCells: Cell[] = [
        { x: 5, y: 5 }, // Center (has 3 neighbors)
        { x: 4, y: 5 }, // Left
        { x: 6, y: 5 }, // Right
        { x: 5, y: 4 }, // Top
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const nextCells = stepGrid(liveCells, bounds);

      const centerSurvived = nextCells.some(c => c.x === 5 && c.y === 5);

      assert({
        given: 'a live cell with 3 neighbors',
        should: 'survive to next generation',
        actual: centerSurvived,
        expected: true,
      });
    }

    // Test live cell with <2 neighbors dies
    {
      const liveCells: Cell[] = [
        { x: 5, y: 5 }, // Center (has 1 neighbor)
        { x: 4, y: 5 }, // Left neighbor
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const nextCells = stepGrid(liveCells, bounds);

      const centerSurvived = nextCells.some(c => c.x === 5 && c.y === 5);

      assert({
        given: 'a live cell with <2 neighbors',
        should: 'die (underpopulation)',
        actual: centerSurvived,
        expected: false,
      });
    }

    // Test live cell with >3 neighbors dies
    {
      const liveCells: Cell[] = [
        { x: 5, y: 5 }, // Center (has 4 neighbors)
        { x: 4, y: 5 }, { x: 6, y: 5 }, // Left, Right
        { x: 5, y: 4 }, { x: 5, y: 6 }, // Top, Bottom
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const nextCells = stepGrid(liveCells, bounds);

      const centerSurvived = nextCells.some(c => c.x === 5 && c.y === 5);

      assert({
        given: 'a live cell with >3 neighbors',
        should: 'die (overpopulation)',
        actual: centerSurvived,
        expected: false,
      });
    }

    // Test dead cell with exactly 3 neighbors becomes alive
    {
      const liveCells: Cell[] = [
        { x: 4, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 4 }, // Three cells around (5,5)
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const nextCells = stepGrid(liveCells, bounds);

      const centerBorn = nextCells.some(c => c.x === 5 && c.y === 5);

      assert({
        given: 'a dead cell with exactly 3 neighbors',
        should: 'become alive (reproduction)',
        actual: centerBorn,
        expected: true,
      });
    }

    // Test dead cell with ≠3 neighbors stays dead
    {
      const liveCells: Cell[] = [
        { x: 4, y: 5 }, { x: 6, y: 5 }, // Two neighbors around (5,5)
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const nextCells = stepGrid(liveCells, bounds);

      const centerBorn = nextCells.some(c => c.x === 5 && c.y === 5);

      assert({
        given: 'a dead cell with ≠3 neighbors',
        should: 'stay dead',
        actual: centerBorn,
        expected: false,
      });
    }

    // Test step function doesn't mutate input
    {
      const liveCells: Cell[] = [{ x: 5, y: 5 }, { x: 6, y: 5 }];
      const bounds: Bounds = { width: 10, height: 10 };
      const originalLength = liveCells.length;
      
      stepGrid(liveCells, bounds);

      assert({
        given: 'the step function is called',
        should: 'not mutate the input cells array',
        actual: liveCells.length,
        expected: originalLength,
      });
    }

    // Test classic blinker pattern (oscillator)
    {
      // Horizontal line becomes vertical
      const liveCells: Cell[] = [
        { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 },
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const nextCells = stepGrid(liveCells, bounds);

      // After one step, should be vertical line
      const hasTop = nextCells.some(c => c.x === 5 && c.y === 4);
      const hasCenter = nextCells.some(c => c.x === 5 && c.y === 5);
      const hasBottom = nextCells.some(c => c.x === 5 && c.y === 6);
      const cellCount = nextCells.length;

      assert({
        given: 'a horizontal blinker pattern',
        should: 'become vertical after one step',
        actual: { hasTop, hasCenter, hasBottom, cellCount },
        expected: { hasTop: true, hasCenter: true, hasBottom: true, cellCount: 3 },
      });
    }
  });
});

describe('rules - Life Garden Mode Support', () => {
  test('getBirthCandidates()', () => {
    // Test getBirthCandidates with empty grid
    {
      const liveCells: Cell[] = [];
      const bounds: Bounds = { width: 10, height: 10 };
      const candidates = getBirthCandidates(liveCells, bounds);

      assert({
        given: 'an empty grid',
        should: 'return no birth candidates',
        actual: candidates.length,
        expected: 0,
      });
    }

    // Test getBirthCandidates with pattern
    {
      const liveCells: Cell[] = [
        { x: 4, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 4 },
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const candidates = getBirthCandidates(liveCells, bounds);

      // Cell (5,5) should be a candidate (has exactly 3 neighbors)
      const hasCenterCandidate = candidates.some(c => c.x === 5 && c.y === 5);

      assert({
        given: 'a grid state with potential births',
        should: 'return cells with exactly 3 neighbors',
        actual: hasCenterCandidate,
        expected: true,
      });
    }
  });

  test('isValidBirthCandidate()', () => {
    // Test isValidBirthCandidate
    {
      const liveCells: Cell[] = [
        { x: 4, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 4 },
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const cell: Cell = { x: 5, y: 5 }; // Has exactly 3 neighbors

      assert({
        given: 'a cell with exactly 3 neighbors',
        should: 'return true (valid birth candidate)',
        actual: isValidBirthCandidate(cell, liveCells, bounds),
        expected: true,
      });
    }

    // Test isValidBirthCandidate with alive cell
    {
      const liveCells: Cell[] = [
        { x: 5, y: 5 }, { x: 4, y: 5 }, { x: 6, y: 5 },
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const cell: Cell = { x: 5, y: 5 }; // Already alive

      assert({
        given: 'a cell that is already alive',
        should: 'return false (not a valid birth candidate)',
        actual: isValidBirthCandidate(cell, liveCells, bounds),
        expected: false,
      });
    }

    // Test isValidBirthCandidate with wrong neighbor count
    {
      const liveCells: Cell[] = [
        { x: 4, y: 5 }, { x: 6, y: 5 }, // Only 2 neighbors
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const cell: Cell = { x: 5, y: 5 };

      assert({
        given: 'a cell with ≠3 neighbors',
        should: 'return false (not a valid birth candidate)',
        actual: isValidBirthCandidate(cell, liveCells, bounds),
        expected: false,
      });
    }

    // Test isValidBirthCandidate out of bounds
    {
      const liveCells: Cell[] = [
        { x: 4, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 4 },
      ];
      const bounds: Bounds = { width: 5, height: 5 };
      const cell: Cell = { x: 10, y: 10 }; // Out of bounds

      assert({
        given: 'a cell out of bounds',
        should: 'return false (not valid)',
        actual: isValidBirthCandidate(cell, liveCells, bounds),
        expected: false,
      });
    }
  });

  test('applyBirth()', () => {
    // Test valid birth
    {
      const liveCells: Cell[] = [
        { x: 4, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 4 },
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const birthCell: Cell = { x: 5, y: 5 }; // Valid candidate with 3 neighbors
      
      const newCells = applyBirth(birthCell, liveCells, bounds);

      assert({
        given: 'a valid birth candidate cell and current live cells',
        should: 'add the cell to live cells array',
        actual: newCells.length,
        expected: liveCells.length + 1,
      });
    }

    // Test birth cell is included
    {
      const liveCells: Cell[] = [
        { x: 4, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 4 },
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const birthCell: Cell = { x: 5, y: 5 };
      
      const newCells = applyBirth(birthCell, liveCells, bounds);
      const hasBirthCell = newCells.some(c => c.x === 5 && c.y === 5);

      assert({
        given: 'a birth at position (5,5)',
        should: 'include that cell in returned array',
        actual: hasBirthCell,
        expected: true,
      });
    }

    // Test immutability
    {
      const liveCells: Cell[] = [
        { x: 4, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 4 },
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const birthCell: Cell = { x: 5, y: 5 };
      const originalLength = liveCells.length;
      
      applyBirth(birthCell, liveCells, bounds);

      assert({
        given: 'a valid birth applied',
        should: 'return new array without mutating input',
        actual: liveCells.length,
        expected: originalLength,
      });
    }

    // Test already alive error
    {
      const liveCells: Cell[] = [
        { x: 5, y: 5 }, { x: 4, y: 5 }, { x: 6, y: 5 },
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const birthCell: Cell = { x: 5, y: 5 }; // Already alive
      let errorThrown = false;

      try {
        applyBirth(birthCell, liveCells, bounds);
      } catch (error) {
        errorThrown = true;
      }

      assert({
        given: 'an invalid candidate (already alive)',
        should: 'throw descriptive error',
        actual: errorThrown,
        expected: true,
      });
    }

    // Test out of bounds error
    {
      const liveCells: Cell[] = [
        { x: 4, y: 5 }, { x: 6, y: 5 }, { x: 5, y: 4 },
      ];
      const bounds: Bounds = { width: 5, height: 5 };
      const birthCell: Cell = { x: 10, y: 10 }; // Out of bounds
      let errorThrown = false;

      try {
        applyBirth(birthCell, liveCells, bounds);
      } catch (error) {
        errorThrown = true;
      }

      assert({
        given: 'an invalid candidate (out of bounds)',
        should: 'throw descriptive error',
        actual: errorThrown,
        expected: true,
      });
    }

    // Test wrong neighbor count error
    {
      const liveCells: Cell[] = [
        { x: 4, y: 5 }, { x: 6, y: 5 }, // Only 2 neighbors
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const birthCell: Cell = { x: 5, y: 5 }; // Not exactly 3 neighbors
      let errorThrown = false;

      try {
        applyBirth(birthCell, liveCells, bounds);
      } catch (error) {
        errorThrown = true;
      }

      assert({
        given: 'an invalid candidate (not exactly 3 neighbors)',
        should: 'throw descriptive error',
        actual: errorThrown,
        expected: true,
      });
    }
  });
});
