import { describe, test } from 'vitest';
import { assert } from 'riteway/vitest';
import { 
  serializePattern, 
  deserializePattern,
  encodePatternUrl,
  decodePatternUrl,
  parseRLE,
  toRLE,
  PATTERNS
} from './patterns';
import type { Cell, Bounds } from './types';

describe('patterns - JSON Serialization', () => {
  test('serializePattern()', () => {
    // Test basic serialization
    {
      const cells: Cell[] = [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const json = serializePattern(cells, bounds);
      const parsed = JSON.parse(json);

      assert({
        given: 'a cells array and bounds',
        should: 'serialize to valid JSON with cells and bounds properties',
        actual: typeof parsed === 'object' && 'cells' in parsed && 'bounds' in parsed,
        expected: true,
      });
    }

    // Test exact coordinate preservation
    {
      const cells: Cell[] = [
        { x: 5, y: 7 },
        { x: 8, y: 9 },
      ];
      const bounds: Bounds = { width: 15, height: 15 };
      const json = serializePattern(cells, bounds);
      const parsed = JSON.parse(json);

      assert({
        given: 'a cells array with specific coordinates',
        should: 'preserve exact coordinates in JSON',
        actual: { 
          firstCell: parsed.cells[0], 
          secondCell: parsed.cells[1],
          bounds: parsed.bounds 
        },
        expected: { 
          firstCell: { x: 5, y: 7 }, 
          secondCell: { x: 8, y: 9 },
          bounds: { width: 15, height: 15 }
        },
      });
    }

    // Test empty grid serialization
    {
      const cells: Cell[] = [];
      const bounds: Bounds = { width: 10, height: 10 };
      const json = serializePattern(cells, bounds);
      const parsed = JSON.parse(json);

      assert({
        given: 'an empty cells array',
        should: 'serialize to JSON with empty cells array',
        actual: parsed.cells.length,
        expected: 0,
      });
    }
  });

  test('deserializePattern()', () => {
    // Test basic deserialization
    {
      const json = JSON.stringify({
        cells: [{ x: 1, y: 2 }, { x: 3, y: 4 }],
        bounds: { width: 10, height: 10 },
      });
      const pattern = deserializePattern(json);

      assert({
        given: 'a valid JSON string',
        should: 'deserialize to cells array and bounds',
        actual: {
          cellCount: pattern.cells.length,
          boundsWidth: pattern.bounds.width,
        },
        expected: {
          cellCount: 2,
          boundsWidth: 10,
        },
      });
    }

    // Test coordinate preservation in deserialization
    {
      const json = JSON.stringify({
        cells: [{ x: 7, y: 9 }],
        bounds: { width: 20, height: 20 },
      });
      const pattern = deserializePattern(json);

      assert({
        given: 'JSON with specific coordinates',
        should: 'deserialize with exact coordinates preserved',
        actual: pattern.cells[0],
        expected: { x: 7, y: 9 },
      });
    }

    // Test invalid JSON handling
    {
      const invalidJson = 'not valid json {';
      let errorThrown = false;

      try {
        deserializePattern(invalidJson);
      } catch (error) {
        errorThrown = true;
      }

      assert({
        given: 'invalid JSON input',
        should: 'throw an error',
        actual: errorThrown,
        expected: true,
      });
    }

    // Test missing required fields
    {
      const incompleteJson = JSON.stringify({ cells: [] }); // missing bounds
      let errorThrown = false;

      try {
        deserializePattern(incompleteJson);
      } catch (error) {
        errorThrown = true;
      }

      assert({
        given: 'JSON missing required bounds field',
        should: 'throw an error',
        actual: errorThrown,
        expected: true,
      });
    }
  });

  test('serialize/deserialize round-trip', () => {
    // Test round-trip integrity
    {
      const originalCells: Cell[] = [
        { x: 2, y: 3 },
        { x: 5, y: 6 },
        { x: 8, y: 9 },
      ];
      const originalBounds: Bounds = { width: 15, height: 15 };

      const json = serializePattern(originalCells, originalBounds);
      const pattern = deserializePattern(json);

      assert({
        given: 'a serialization round-trip',
        should: 'produce identical cell coordinates',
        actual: {
          cells: pattern.cells,
          bounds: pattern.bounds,
        },
        expected: {
          cells: originalCells,
          bounds: originalBounds,
        },
      });
    }
  });
});

describe('patterns - URL-Safe Encoding', () => {
  test('encodePatternUrl()', () => {
    // Test basic URL encoding
    {
      const cells: Cell[] = [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const encoded = encodePatternUrl(cells, bounds);

      assert({
        given: 'a cells array and bounds',
        should: 'encode to URL-safe base64 string',
        actual: typeof encoded === 'string' && encoded.length > 0,
        expected: true,
      });
    }

    // Test URL-safe characters (no +, /, =)
    {
      const cells: Cell[] = [
        { x: 5, y: 7 },
        { x: 8, y: 9 },
      ];
      const bounds: Bounds = { width: 15, height: 15 };
      const encoded = encodePatternUrl(cells, bounds);

      // URL-safe base64 should not contain +, /, or =
      const hasUnsafeChars = /[+/=]/.test(encoded);

      assert({
        given: 'an encoded pattern',
        should: 'not contain URL-unsafe characters (+, /, =)',
        actual: hasUnsafeChars,
        expected: false,
      });
    }

    // Test compact encoding for typical pattern
    {
      const cells: Cell[] = [];
      // Create a 60x60 grid with ~20 cells (more realistic pattern)
      for (let i = 0; i < 20; i++) {
        cells.push({ x: i % 60, y: Math.floor(i / 6) });
      }
      const bounds: Bounds = { width: 60, height: 60 };
      const encoded = encodePatternUrl(cells, bounds);

      assert({
        given: 'a 60×60 grid with 20 cells',
        should: 'produce reasonably compact URL encoding',
        actual: encoded.length < 600,
        expected: true,
      });
    }
  });

  test('decodePatternUrl()', () => {
    // Test basic URL decoding
    {
      const cells: Cell[] = [
        { x: 1, y: 2 },
        { x: 3, y: 4 },
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const encoded = encodePatternUrl(cells, bounds);
      const pattern = decodePatternUrl(encoded);

      assert({
        given: 'a URL-encoded pattern',
        should: 'decode to original cells and bounds',
        actual: {
          cellCount: pattern.cells.length,
          boundsWidth: pattern.bounds.width,
        },
        expected: {
          cellCount: 2,
          boundsWidth: 10,
        },
      });
    }
  });

  test('encode/decode URL round-trip', () => {
    // Test round-trip integrity
    {
      const originalCells: Cell[] = [
        { x: 2, y: 3 },
        { x: 5, y: 6 },
        { x: 8, y: 9 },
      ];
      const originalBounds: Bounds = { width: 15, height: 15 };

      const encoded = encodePatternUrl(originalCells, originalBounds);
      const pattern = decodePatternUrl(encoded);

      assert({
        given: 'a URL encoding round-trip',
        should: 'preserve exact pattern',
        actual: {
          cells: pattern.cells,
          bounds: pattern.bounds,
        },
        expected: {
          cells: originalCells,
          bounds: originalBounds,
        },
      });
    }
  });
});

describe('patterns - RLE Format Support', () => {
  test('parseRLE()', () => {
    // Test simple glider pattern
    {
      const rle = 'bo$2bo$3o!';
      const pattern = parseRLE(rle);

      // Glider should have 5 cells
      assert({
        given: 'a glider RLE string',
        should: 'parse to 5 cells',
        actual: pattern.cells.length,
        expected: 5,
      });
    }

    // Test pattern with run counts
    {
      const rle = '3o$3o!';
      const pattern = parseRLE(rle);

      // Two rows of 3 cells = 6 cells
      assert({
        given: 'an RLE with run counts',
        should: 'parse correctly',
        actual: pattern.cells.length,
        expected: 6,
      });
    }

    // Test blinker pattern
    {
      const rle = '3o!';
      const pattern = parseRLE(rle);

      // Blinker has 3 cells in a row
      assert({
        given: 'a blinker RLE',
        should: 'parse to 3 horizontal cells',
        actual: {
          cellCount: pattern.cells.length,
          firstCell: pattern.cells[0],
          lastCell: pattern.cells[2],
        },
        expected: {
          cellCount: 3,
          firstCell: { x: 0, y: 0 },
          lastCell: { x: 2, y: 0 },
        },
      });
    }

    // Test RLE with header comments
    {
      const rle = '#N Glider\n#C A simple glider\nbo$2bo$3o!';
      const pattern = parseRLE(rle);

      // Should parse despite header comments
      assert({
        given: 'RLE with header comments',
        should: 'parse pattern ignoring comments',
        actual: pattern.cells.length,
        expected: 5,
      });
    }

    // Test malformed RLE
    {
      const malformed = 'invalid pattern $$$';
      let errorThrown = false;

      try {
        parseRLE(malformed);
      } catch (error) {
        errorThrown = true;
      }

      assert({
        given: 'malformed RLE input',
        should: 'throw error',
        actual: errorThrown,
        expected: true,
      });
    }
  });

  test('toRLE()', () => {
    // Test simple horizontal line
    {
      const cells: Cell[] = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const rle = toRLE(cells, bounds);

      // Should end with !
      assert({
        given: 'a horizontal line of 3 cells',
        should: 'produce valid RLE ending with !',
        actual: rle.endsWith('!'),
        expected: true,
      });
    }

    // Test pattern with multiple rows
    {
      const cells: Cell[] = [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ];
      const bounds: Bounds = { width: 10, height: 10 };
      const rle = toRLE(cells, bounds);

      // Should contain $ for row delimiter
      assert({
        given: 'cells in multiple rows',
        should: 'use $ as row delimiter',
        actual: rle.includes('$'),
        expected: true,
      });
    }
  });

  test('RLE round-trip', () => {
    // Test glider round-trip
    {
      const originalRle = 'bo$2bo$3o!';
      const pattern = parseRLE(originalRle);
      const roundTripRle = toRLE(pattern.cells, pattern.bounds);
      const finalPattern = parseRLE(roundTripRle);

      assert({
        given: 'a glider RLE round-trip',
        should: 'preserve cell count',
        actual: finalPattern.cells.length,
        expected: pattern.cells.length,
      });
    }

    // Test blinker round-trip
    {
      const originalRle = '3o!';
      const pattern = parseRLE(originalRle);
      const roundTripRle = toRLE(pattern.cells, pattern.bounds);
      const finalPattern = parseRLE(roundTripRle);

      // Should have same cells (may be in different order)
      assert({
        given: 'a blinker RLE round-trip',
        should: 'preserve all cells',
        actual: finalPattern.cells.length,
        expected: 3,
      });
    }
  });
});

describe('patterns - Pattern Library', () => {
  test('PATTERNS.GLIDER', () => {
    {
      const glider = PATTERNS.GLIDER();

      assert({
        given: 'pattern name "GLIDER"',
        should: 'return 5-cell diagonal spaceship pattern',
        actual: glider.cells.length,
        expected: 5,
      });
    }

    // Test immutability
    {
      const glider1 = PATTERNS.GLIDER();
      const glider2 = PATTERNS.GLIDER();

      glider1.cells.push({ x: 999, y: 999 });

      assert({
        given: 'modifying returned pattern',
        should: 'not affect subsequent calls (defensive copy)',
        actual: glider2.cells.length,
        expected: 5,
      });
    }
  });

  test('PATTERNS.BLINKER', () => {
    {
      const blinker = PATTERNS.BLINKER();

      assert({
        given: 'pattern name "BLINKER"',
        should: 'return 3-cell period-2 oscillator',
        actual: blinker.cells.length,
        expected: 3,
      });
    }
  });

  test('PATTERNS.BLOCK', () => {
    {
      const block = PATTERNS.BLOCK();

      assert({
        given: 'pattern name "BLOCK"',
        should: 'return 4-cell still life',
        actual: block.cells.length,
        expected: 4,
      });
    }
  });

  test('Pattern metadata', () => {
    {
      const glider = PATTERNS.GLIDER();

      assert({
        given: 'a pattern from library',
        should: 'include metadata (category, period)',
        actual: typeof glider.metadata === 'object' && 
                'category' in glider.metadata && 
                'period' in glider.metadata,
        expected: true,
      });
    }
  });
});
