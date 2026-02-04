# Fix Buffer Browser Compatibility

**Status**: ✅ COMPLETED (2026-02-04)  
**Goal**: Replace Node.js `Buffer` API with browser-native base64 encoding in pattern serialization.

## Overview

WHY: The `encodePatternUrl` and `decodePatternUrl` functions in `lib/engine/patterns.ts` currently use Node.js `Buffer` API, which is not available in browser environments. This will cause runtime errors when users try to share patterns via URL. We need to replace these with browser-native `btoa`/`atob` functions before building the grid renderer UI.

**Impact**: CRITICAL — Blocks URL sharing feature from working in production.

**Affected File**: `lib/engine/patterns.ts` (lines 89-124)

---

## Browser-Native Base64 Encoding

Replace `Buffer.from().toString('base64')` with `btoa()` for encoding.

**Requirements**:
- Given a JSON pattern string, should encode to base64 using browser-native `btoa()`.
- Given encoding with `btoa()`, should produce same base64 output as Node.js `Buffer` approach.
- Given Unicode characters in pattern JSON, should handle encoding without corruption.
- Given encoded pattern, should be URL-safe (replace `+`, `/`, `=` as before).

**Current Code** (lines 89-100):
```typescript
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
```

**Replacement Code**:
```typescript
export const encodePatternUrl = (cells: Cell[], bounds: Bounds): string => {
  const json = serializePattern(cells, bounds);
  
  // Convert to base64 using browser-native btoa
  const base64 = btoa(json);
  
  // Make URL-safe: replace + with -, / with _, remove padding =
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};
```

---

## Browser-Native Base64 Decoding

Replace `Buffer.from().toString('utf-8')` with `atob()` for decoding.

**Requirements**:
- Given a URL-safe base64 string, should decode to JSON using browser-native `atob()`.
- Given decoding with `atob()`, should produce same JSON output as Node.js `Buffer` approach.
- Given malformed base64 input, should throw clear error message.
- Given decoded JSON, should deserialize to valid Pattern object.

**Current Code** (lines 109-124):
```typescript
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
```

**Replacement Code**:
```typescript
export const decodePatternUrl = (encoded: string): Pattern => {
  // Convert from URL-safe base64 back to standard base64
  let base64 = encoded
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  // Add padding back if needed
  const padding = (4 - (base64.length % 4)) % 4;
  base64 += '='.repeat(padding);
  
  // Decode from base64 using browser-native atob
  const json = atob(base64);
  
  // Deserialize JSON
  return deserializePattern(json);
};
```

---

## Test Compatibility

Ensure tests continue to pass after replacement.

**Requirements**:
- Given existing pattern tests, should pass without modification.
- Given URL encoding round-trip test, should produce identical pattern.
- Given test environment (Node.js via Vitest), should support `btoa`/`atob` natively or via polyfill.
- Given pattern with special characters, should encode/decode correctly.

**Implementation Notes**:
- Modern Node.js (v16+) supports `btoa`/`atob` natively in global scope
- Vitest runs in Node.js context, so these should work without polyfill
- If tests fail, add polyfill at top of test file:
  ```typescript
  import { Buffer } from 'buffer';
  if (typeof btoa === 'undefined') {
    global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');
    global.atob = (str) => Buffer.from(str, 'base64').toString('binary');
  }
  ```

---

## Verification Steps

Confirm fix works in both browser and test environments.

**Requirements**:
- Given tests run via `npm test`, should pass with browser-native API.
- Given pattern URL encoding in browser console, should produce valid base64 string.
- Given pattern URL decoding in browser console, should restore original pattern.
- Given round-trip test (encode → decode), should preserve all cell coordinates exactly.

**Manual Testing**:
```typescript
// In browser console (after fix):
const pattern = { cells: [{x:1,y:2}], bounds: {width:10,height:10} };
const json = JSON.stringify(pattern);
const encoded = btoa(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
console.log('Encoded:', encoded);

const decoded = atob(encoded.replace(/-/g, '+').replace(/_/g, '/'));
console.log('Decoded:', JSON.parse(decoded));
```

---

## Edge Cases to Test

Ensure encoding handles various pattern scenarios.

**Requirements**:
- Given empty grid (0 cells), should encode/decode successfully.
- Given large pattern (200+ cells), should encode without truncation.
- Given pattern with max bounds (100×100), should encode within reasonable URL length.
- Given pattern JSON with quotes and special chars, should escape properly in base64.

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED

---

## Success Criteria

- [x] `encodePatternUrl` uses `btoa()` instead of `Buffer`
- [x] `decodePatternUrl` uses `atob()` instead of `Buffer`
- [x] All existing tests pass (`npm test` shows 29/29 passing)
- [x] Manual browser test confirms encoding/decoding works
- [x] No TypeScript errors in `lib/engine/patterns.ts`
- [x] Round-trip test (encode → decode) preserves pattern exactly
