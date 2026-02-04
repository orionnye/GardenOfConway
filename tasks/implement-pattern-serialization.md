# Implement Pattern Serialization Epic

**Status**: ✅ COMPLETED (2026-02-04)  
**Goal**: Enable saving, loading, and sharing of Game of Life patterns.

## Overview

WHY: Users need to persist their creations, share patterns with others, and import classic patterns from the GoL community. Without serialization, every session starts from scratch and there's no way to collaborate or build a pattern library.

---

## JSON Serialization

Implement JSON-based pattern export and import for internal use and URL sharing.

**Requirements**:
- Given a cells array and bounds, should serialize to JSON string with exact coordinates preserved.
- Given a JSON string, should deserialize to cells array and bounds without data loss.
- Given a serialization round-trip (serialize then deserialize), should produce identical cell coordinates.
- Given invalid JSON input, should throw descriptive error.
- Given bounds or cells outside valid ranges, should validate and reject gracefully.

---

## URL-Safe Encoding

Make patterns shareable via URL parameters.

**Requirements**:
- Given a JSON pattern string, should encode to URL-safe base64 format.
- Given a URL-safe encoded string, should decode back to original JSON pattern.
- Given a 30×30 grid with 50 cells, should produce URL under 500 characters.
- Given an encoded/decoded round-trip, should preserve exact pattern.

---

## RLE Format Support

Support Run-Length Encoded format for GoL community interop.

**Requirements**:
- Given an RLE string (e.g., "3bo$2bob$3o!"), should parse to cells array and bounds.
- Given a cells array and bounds, should serialize to valid RLE format.
- Given RLE with header comments (#C, #N), should extract pattern name and metadata.
- Given malformed RLE input, should provide clear parse error with line number.
- Given standard patterns (glider, blinker), should round-trip through RLE without corruption.

---

## Pattern Library

Provide curated classic patterns as named constants.

**Requirements**:
- Given pattern name "GLIDER", should return 5-cell diagonal spaceship pattern.
- Given pattern name "BLINKER", should return 3-cell period-2 oscillator.
- Given pattern name "BLOCK", should return 4-cell still life.
- Given pattern library list, should include metadata (category, period, dimensions).
- Given a pattern constant, should be immutable (defensive copy on access).

---

## Status Flow

📋 PLANNED → 🚧 IN PROGRESS → ⏸️ PENDING REVIEW → ✅ COMPLETED
