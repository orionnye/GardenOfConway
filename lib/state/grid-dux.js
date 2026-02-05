// grid-dux.js - Transpiled from grid-dux.sudo
import { 
  deserializePattern, 
  serializePattern,
  encodePatternUrl,
  toRLE
} from '../engine/patterns';
import { PATTERNS } from '../engine/patterns';
import { 
  stepGrid as applyRules,
  getBirthCandidates as computeBirthCandidates,
  applyBirth,
} from '../engine/rules';

const slice = 'grid';

// Initial State
export const initialState = {
  cells: [],
  generation: 0,
  bounds: { width: 60, height: 60 },
  isRunning: false,
  speed: 5, // 1-10 steps per second
  mode: 'classic', // 'classic' | 'lifeGarden'
  birthCandidates: [], // Valid birth positions in Life Garden mode
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

export const setSpeed = (payload = {}) => ({
  type: `${slice}/setSpeed`,
  payload,
});

export const setMode = (payload = {}) => ({
  type: `${slice}/setMode`,
  payload,
});

export const applyPlayerBirth = (payload = {}) => ({
  type: `${slice}/applyPlayerBirth`,
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

    case stepGrid().type: {
      const nextCells = applyRules(state.cells, state.bounds);
      const nextBirthCandidates = state.mode === 'lifeGarden'
        ? computeBirthCandidates(nextCells, state.bounds)
        : [];
      
      return {
        ...state,
        cells: nextCells,
        generation: state.generation + 1,
        birthCandidates: nextBirthCandidates,
      };
    }

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
      
      // Center pattern on the grid
      const gridBounds = state.bounds;
      const patternBounds = pattern.bounds;
      const offsetX = Math.floor((gridBounds.width - patternBounds.width) / 2);
      const offsetY = Math.floor((gridBounds.height - patternBounds.height) / 2);
      
      const centeredCells = pattern.cells.map(cell => ({
        x: cell.x + offsetX,
        y: cell.y + offsetY,
      }));
      
      return {
        ...state,
        cells: centeredCells,
        bounds: gridBounds, // Keep the grid bounds, not the pattern bounds
      };
    }

    case setSpeed().type:
      return {
        ...state,
        speed: payload.speed,
      };

    case setMode().type: {
      const newMode = payload.mode;
      const newBirthCandidates = newMode === 'lifeGarden'
        ? computeBirthCandidates(state.cells, state.bounds)
        : [];
      
      return {
        ...state,
        mode: newMode,
        // Auto-pause simulation when switching to Life Garden mode
        isRunning: newMode === 'lifeGarden' ? false : state.isRunning,
        birthCandidates: newBirthCandidates,
      };
    }

    case applyPlayerBirth().type: {
      const { cell } = payload;
      
      // Only apply in Life Garden mode
      if (state.mode !== 'lifeGarden') {
        console.warn('applyPlayerBirth can only be used in Life Garden mode');
        return state;
      }
      
      try {
        // Apply the birth (will throw if invalid)
        const cellsWithBirth = applyBirth(cell, state.cells, state.bounds);
        
        // Step the grid with the new cell
        const nextCells = applyRules(cellsWithBirth, state.bounds);
        
        // Compute new birth candidates
        const nextBirthCandidates = computeBirthCandidates(nextCells, state.bounds);
        
        return {
          ...state,
          cells: nextCells,
          generation: state.generation + 1,
          birthCandidates: nextBirthCandidates,
        };
      } catch (error) {
        // Invalid birth candidate - don't modify state
        console.warn(`Invalid birth: ${error.message}`);
        return state;
      }
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
export const getSpeed = (state) => state[slice].speed;
export const getMode = (state) => state[slice].mode;
export const getBirthCandidates = (state) => state[slice].birthCandidates;

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
