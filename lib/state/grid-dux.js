// grid-dux.js - Transpiled from grid-dux.sudo
import { 
  deserializePattern, 
  serializePattern,
  encodePatternUrl,
  toRLE
} from '../engine/patterns';
import { PATTERNS } from '../engine/patterns';

const slice = 'grid';

// Initial State
export const initialState = {
  cells: [],
  generation: 0,
  bounds: { width: 30, height: 30 },
  isRunning: false,
};

// Action Creators
export const setGrid = (payload = {}) => ({
  type: `${slice}/setGrid`,
  payload,
});

export const stepGrid = (payload = {}) => ({
  type: `${slice}/stepGrid`,
  payload,
});

export const clearGrid = (payload = {}) => ({
  type: `${slice}/clearGrid`,
  payload,
});

export const resetGrid = (payload = {}) => ({
  type: `${slice}/resetGrid`,
  payload,
});

export const toggleRunning = (payload = {}) => ({
  type: `${slice}/toggleRunning`,
  payload,
});

export const setCells = (payload = {}) => ({
  type: `${slice}/setCells`,
  payload,
});

export const loadPattern = (payload = {}) => ({
  type: `${slice}/loadPattern`,
  payload,
});

export const loadPatternFromLibrary = (payload = {}) => ({
  type: `${slice}/loadPatternFromLibrary`,
  payload,
});

// Reducer
export const reducer = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case setGrid().type:
      return {
        ...state,
        cells: payload.cells,
        bounds: payload.bounds || state.bounds,
      };

    case stepGrid().type:
      return {
        ...state,
        generation: state.generation + 1,
      };

    case clearGrid().type:
      return {
        ...state,
        cells: [],
      };

    case resetGrid().type:
      return {
        ...state,
        cells: [],
        generation: 0,
        bounds: payload.bounds || state.bounds,
      };

    case toggleRunning().type:
      return {
        ...state,
        isRunning: !state.isRunning,
      };

    case setCells().type:
      return {
        ...state,
        cells: payload.cells,
      };

    case loadPattern().type: {
      try {
        const pattern = deserializePattern(payload.pattern);
        return {
          ...state,
          cells: pattern.cells,
          bounds: pattern.bounds,
        };
      } catch (error) {
        throw new Error(`Failed to load pattern: ${error.message}`);
      }
    }

    case loadPatternFromLibrary().type: {
      const patternName = payload.name;
      if (!PATTERNS[patternName]) {
        throw new Error(`Pattern "${patternName}" not found in library`);
      }
      const pattern = PATTERNS[patternName]();
      return {
        ...state,
        cells: pattern.cells,
        bounds: pattern.bounds,
      };
    }

    default:
      return state;
  }
};

// Selectors
export const getGrid = (state) => state[slice];
export const getCells = (state) => state[slice].cells;
export const getGeneration = (state) => state[slice].generation;
export const getBounds = (state) => state[slice].bounds;
export const getIsRunning = (state) => state[slice].isRunning;

// Pattern Export Selectors
export const getPatternJSON = (state) => 
  serializePattern(getCells(state), getBounds(state));

export const getPatternURL = (state) => 
  encodePatternUrl(getCells(state), getBounds(state));

export const getPatternRLE = (state) => 
  toRLE(getCells(state), getBounds(state));

export const isPatternEmpty = (state) => 
  getCells(state).length === 0;

export default reducer;
