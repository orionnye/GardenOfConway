// Pattern serialization and deserialization for Conway's Game of Life
import type { Cell, Bounds } from './types';

/**
 * Pattern format for JSON serialization
 */
export interface Pattern {
  cells: Cell[];
  bounds: Bounds;
  metadata?: PatternMetadata;
}

/**
 * Pattern metadata
 */
export interface PatternMetadata {
  name: string;
  category: 'still-life' | 'oscillator' | 'spaceship' | 'methuselah' | 'other';
  period: number;
  description?: string;
}

/**
 * Serialize a pattern to JSON string
 * 
 * @param cells - Array of live cell coordinates
 * @param bounds - Grid dimensions
 * @returns JSON string representation of the pattern
 */
export const serializePattern = (cells: Cell[], bounds: Bounds): string => {
  const pattern: Pattern = {
    cells,
    bounds,
  };
  return JSON.stringify(pattern);
};

/**
 * Deserialize a pattern from JSON string
 * 
 * @param json - JSON string representation of a pattern
 * @returns Pattern object with cells and bounds
 * @throws Error if JSON is invalid or missing required fields
 */
export const deserializePattern = (json: string): Pattern => {
  let parsed: any;
  
  try {
    parsed = JSON.parse(json);
  } catch (error) {
    throw new Error(`Invalid JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Validate required fields
  if (!parsed.cells || !Array.isArray(parsed.cells)) {
    throw new Error('Missing or invalid "cells" field');
  }

  if (!parsed.bounds || typeof parsed.bounds !== 'object') {
    throw new Error('Missing or invalid "bounds" field');
  }

  if (typeof parsed.bounds.width !== 'number' || typeof parsed.bounds.height !== 'number') {
    throw new Error('Bounds must have numeric width and height');
  }

  // Validate cell format
  for (const cell of parsed.cells) {
    if (typeof cell.x !== 'number' || typeof cell.y !== 'number') {
      throw new Error('All cells must have numeric x and y coordinates');
    }
  }

  return {
    cells: parsed.cells,
    bounds: parsed.bounds,
  };
};

/**
 * Encode a pattern to URL-safe base64 string
 * 
 * Uses URL-safe base64 encoding (- instead of +, _ instead of /, no padding)
 * 
 * @param cells - Array of live cell coordinates
 * @param bounds - Grid dimensions
 * @returns URL-safe base64 encoded string
 */
export const encodePatternUrl = (cells: Cell[], bounds: Bounds): string => {
  const json = serializePattern(cells, bounds);
  
  // Convert to base64
  const base64 = Buffer.from(json, 'utf-8').toString('base64');
  
  // Make URL-safe: replace + with -, / with _, remove padding =
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Decode a URL-safe base64 pattern string
 * 
 * @param encoded - URL-safe base64 encoded pattern string
 * @returns Pattern object with cells and bounds
 * @throws Error if encoded string is invalid
 */
export const decodePatternUrl = (encoded: string): Pattern => {
  // Convert from URL-safe base64 back to standard base64
  let base64 = encoded
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  // Add padding back if needed
  const padding = (4 - (base64.length % 4)) % 4;
  base64 += '='.repeat(padding);
  
  // Decode from base64
  const json = Buffer.from(base64, 'base64').toString('utf-8');
  
  // Deserialize JSON
  return deserializePattern(json);
};

/**
 * Parse RLE (Run-Length Encoded) format pattern
 * 
 * RLE format uses:
 * - `b` = dead cell
 * - `o` = live cell
 * - `$` = end of line
 * - `!` = end of pattern
 * - Numbers prefix run counts (e.g., `3o` = three live cells)
 * - Lines starting with `#` are comments
 * 
 * @param rle - RLE format string
 * @returns Pattern with cells and bounds
 * @throws Error if RLE is malformed
 */
export const parseRLE = (rle: string): Pattern => {
  const cells: Cell[] = [];
  let x = 0;
  let y = 0;
  let maxX = 0;
  let maxY = 0;
  
  // Remove comments (lines starting with #)
  const lines = rle.split('\n');
  const patternLines = lines.filter(line => !line.trim().startsWith('#'));
  const patternString = patternLines.join('');
  
  // Parse the pattern
  let i = 0;
  let runCount = '';
  
  while (i < patternString.length) {
    const char = patternString[i];
    
    // Build run count number
    if (char >= '0' && char <= '9') {
      runCount += char;
      i++;
      continue;
    }
    
    const count = runCount ? parseInt(runCount, 10) : 1;
    runCount = '';
    
    switch (char) {
      case 'b': // dead cells
        x += count;
        break;
        
      case 'o': // live cells
        for (let j = 0; j < count; j++) {
          cells.push({ x, y });
          maxX = Math.max(maxX, x);
          x++;
        }
        break;
        
      case '$': // end of line
        y += count;
        maxY = Math.max(maxY, y);
        x = 0;
        break;
        
      case '!': // end of pattern
        return {
          cells,
          bounds: { 
            width: maxX + 1, 
            height: maxY + 1 
          },
        };
        
      case ' ':
      case '\t':
      case '\n':
      case '\r':
        // Skip whitespace
        break;
        
      default:
        throw new Error(`Invalid RLE character: '${char}' at position ${i}`);
    }
    
    i++;
  }
  
  // If we reach here without finding !, throw error
  throw new Error('RLE pattern must end with !');
};

/**
 * Convert pattern to RLE (Run-Length Encoded) format
 * 
 * @param cells - Array of live cell coordinates
 * @param bounds - Grid dimensions
 * @returns RLE format string
 */
export const toRLE = (cells: Cell[], bounds: Bounds): string => {
  if (cells.length === 0) {
    return '!';
  }
  
  // Create a grid representation for easier encoding
  const grid: boolean[][] = [];
  for (let y = 0; y < bounds.height; y++) {
    grid[y] = new Array(bounds.width).fill(false);
  }
  
  // Mark live cells
  let maxY = 0;
  let maxX = 0;
  for (const cell of cells) {
    if (cell.y < bounds.height && cell.x < bounds.width) {
      grid[cell.y][cell.x] = true;
      maxY = Math.max(maxY, cell.y);
      maxX = Math.max(maxX, cell.x);
    }
  }
  
  // Encode to RLE
  let rle = '';
  
  for (let y = 0; y <= maxY; y++) {
    let deadCount = 0;
    let liveCount = 0;
    
    for (let x = 0; x <= maxX; x++) {
      if (grid[y][x]) {
        // Flush dead cells if any
        if (deadCount > 0) {
          rle += deadCount > 1 ? `${deadCount}b` : 'b';
          deadCount = 0;
        }
        liveCount++;
      } else {
        // Flush live cells if any
        if (liveCount > 0) {
          rle += liveCount > 1 ? `${liveCount}o` : 'o';
          liveCount = 0;
        }
        deadCount++;
      }
    }
    
    // Flush remaining live cells
    if (liveCount > 0) {
      rle += liveCount > 1 ? `${liveCount}o` : 'o';
    }
    
    // Add line ending (except for last line)
    if (y < maxY) {
      rle += '$';
    }
  }
  
  // Add pattern terminator
  rle += '!';
  
  return rle;
};

/**
 * Curated pattern library
 * 
 * Each function returns a defensive copy to ensure immutability
 */
export const PATTERNS = {
  /**
   * Glider - Classic 5-cell diagonal spaceship
   * Moves one cell diagonally every 4 generations
   */
  GLIDER: (): Pattern => ({
    cells: [
      { x: 1, y: 0 },
      { x: 2, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    bounds: { width: 5, height: 5 },
    metadata: {
      name: 'Glider',
      category: 'spaceship',
      period: 4,
      description: 'A small diagonal spaceship that moves one cell every 4 generations',
    },
  }),

  /**
   * Blinker - Simple 3-cell period-2 oscillator
   * Alternates between horizontal and vertical line
   */
  BLINKER: (): Pattern => ({
    cells: [
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
    bounds: { width: 5, height: 5 },
    metadata: {
      name: 'Blinker',
      category: 'oscillator',
      period: 2,
      description: 'The smallest oscillator, alternating between horizontal and vertical',
    },
  }),

  /**
   * Block - 2×2 still life
   * Never changes (period 1)
   */
  BLOCK: (): Pattern => ({
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    bounds: { width: 5, height: 5 },
    metadata: {
      name: 'Block',
      category: 'still-life',
      period: 1,
      description: 'A stable 2×2 square that never changes',
    },
  }),

  /**
   * Beehive - 6-cell still life
   * Hexagonal shape that never changes
   */
  BEEHIVE: (): Pattern => ({
    cells: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 3, y: 1 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    bounds: { width: 6, height: 6 },
    metadata: {
      name: 'Beehive',
      category: 'still-life',
      period: 1,
      description: 'A hexagonal still life resembling a beehive',
    },
  }),

  /**
   * Toad - 6-cell period-2 oscillator
   * Alternates between two configurations
   */
  TOAD: (): Pattern => ({
    cells: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
      { x: 2, y: 2 },
    ],
    bounds: { width: 6, height: 6 },
    metadata: {
      name: 'Toad',
      category: 'oscillator',
      period: 2,
      description: 'A period-2 oscillator that rocks back and forth',
    },
  }),

  /**
   * Beacon - 6-cell period-2 oscillator
   * Two blocks that blink
   */
  BEACON: (): Pattern => ({
    cells: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 3, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ],
    bounds: { width: 6, height: 6 },
    metadata: {
      name: 'Beacon',
      category: 'oscillator',
      period: 2,
      description: 'Two blocks that blink on and off',
    },
  }),

  /**
   * Pulsar - 48-cell period-3 oscillator
   * Large symmetric oscillator
   */
  PULSAR: (): Pattern => {
    const cells: Cell[] = [
      // Top quadrant
      { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 4, y: 0 }, { x: 8, y: 0 }, { x: 9, y: 0 }, { x: 10, y: 0 },
      { x: 0, y: 2 }, { x: 5, y: 2 }, { x: 7, y: 2 }, { x: 12, y: 2 },
      { x: 0, y: 3 }, { x: 5, y: 3 }, { x: 7, y: 3 }, { x: 12, y: 3 },
      { x: 0, y: 4 }, { x: 5, y: 4 }, { x: 7, y: 4 }, { x: 12, y: 4 },
      { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 8, y: 5 }, { x: 9, y: 5 }, { x: 10, y: 5 },
      // Bottom quadrant (mirrored)
      { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 }, { x: 10, y: 7 },
      { x: 0, y: 8 }, { x: 5, y: 8 }, { x: 7, y: 8 }, { x: 12, y: 8 },
      { x: 0, y: 9 }, { x: 5, y: 9 }, { x: 7, y: 9 }, { x: 12, y: 9 },
      { x: 0, y: 10 }, { x: 5, y: 10 }, { x: 7, y: 10 }, { x: 12, y: 10 },
      { x: 2, y: 12 }, { x: 3, y: 12 }, { x: 4, y: 12 }, { x: 8, y: 12 }, { x: 9, y: 12 }, { x: 10, y: 12 },
    ];
    
    return {
      cells,
      bounds: { width: 15, height: 15 },
      metadata: {
        name: 'Pulsar',
        category: 'oscillator',
        period: 3,
        description: 'A large symmetric period-3 oscillator',
      },
    };
  },

  /**
   * R-pentomino - 5-cell methuselah
   * Stabilizes after 1103 generations
   */
  R_PENTOMINO: (): Pattern => ({
    cells: [
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ],
    bounds: { width: 5, height: 5 },
    metadata: {
      name: 'R-pentomino',
      category: 'methuselah',
      period: 1103,
      description: 'A small pattern that evolves for 1103 generations before stabilizing',
    },
  }),
};
