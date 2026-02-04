// grid-dux.js - Transpiled from grid-dux.sudo
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

export default reducer;
