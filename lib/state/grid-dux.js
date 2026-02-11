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
import {
  defaultPuzzle,
  getPuzzleById,
  getPuzzleByIndex,
  getPuzzleCount as getPuzzleSequenceCount,
} from '../puzzles/default-puzzle';

const slice = 'grid';

const toCellKey = ({ x, y }) => `${x},${y}`;

const normalizeGoalTiles = (goalTiles = []) => {
  const uniqueTiles = Array.from(
    goalTiles.reduce((acc, cell) => {
      acc.set(toCellKey(cell), cell);
      return acc;
    }, new Map()).values()
  );

  return uniqueTiles.sort((a, b) => {
    if (a.y === b.y) return a.x - b.x;
    return a.y - b.y;
  });
};

const hasGoalOverlap = (cells = [], goalTiles = []) => {
  if (cells.length === 0 || goalTiles.length === 0) return false;
  const liveCellSet = new Set(cells.map(toCellKey));
  return goalTiles.some((goal) => liveCellSet.has(toCellKey(goal)));
};

const normalizeObstacles = (obstacles = []) => normalizeGoalTiles(obstacles);

const createBlockedSet = (obstacles = []) => new Set(obstacles.map(toCellKey));

const removeBlockedCells = (cells = [], blockedSet = new Set()) =>
  cells.filter((cell) => !blockedSet.has(toCellKey(cell)));

const removeBlockedCandidates = (candidates = [], blockedSet = new Set()) =>
  candidates.filter((candidate) => !blockedSet.has(toCellKey(candidate)));

const createPuzzleState = (state, puzzle = defaultPuzzle, puzzleIndex = 0) => {
  const obstacles = normalizeObstacles(puzzle.obstacles);
  const blockedSet = createBlockedSet(obstacles);
  const cells = removeBlockedCells(puzzle.initialCells || [], blockedSet);
  const bounds = puzzle.bounds || state.bounds;
  const goalTiles = normalizeGoalTiles(puzzle.goalTiles || []);
  const seedLimit = puzzle.seedLimit ?? 0;

  return {
    ...state,
    mode: 'puzzle',
    puzzleId: puzzle.id || defaultPuzzle.id,
    puzzleIndex,
    puzzleCount: getPuzzleSequenceCount(),
    puzzleCampaignComplete: false,
    cells,
    bounds,
    goalTiles,
    obstacles,
    seedLimit,
    seedsRemaining: seedLimit,
    generation: 0,
    birthCandidates: removeBlockedCandidates(computeBirthCandidates(cells, bounds), blockedSet),
    runState: hasGoalOverlap(cells, goalTiles) ? 'won' : 'active',
    isRunning: false,
  };
};

// Initial State
export const initialState = {
  cells: [],
  generation: 0,
  bounds: { width: 60, height: 60 },
  isRunning: false,
  speed: 5, // 1-10 steps per second
  mode: 'classic', // 'classic' | 'lifeGarden' | 'puzzle'
  birthCandidates: [], // Valid birth positions in Life Garden mode
  goalTiles: [],
  obstacles: [],
  seedLimit: 0,
  seedsRemaining: 0,
  puzzleId: null,
  puzzleIndex: 0,
  puzzleCount: getPuzzleSequenceCount(),
  puzzleCampaignComplete: false,
  runState: 'active', // 'active' | 'won'
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

export const setGoalTiles = (payload = {}) => ({
  type: `${slice}/setGoalTiles`,
  payload,
});

export const confirmPuzzleVictory = (payload = {}) => ({
  type: `${slice}/confirmPuzzleVictory`,
  payload,
});

// Reducer
export const reducer = (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case setGrid().type:
      {
      const obstacles = payload.obstacles ? normalizeObstacles(payload.obstacles) : state.obstacles;
      const blockedSet = createBlockedSet(obstacles);
      const cells = removeBlockedCells(payload.cells, blockedSet);
      const goalTiles = payload.goalTiles ? normalizeGoalTiles(payload.goalTiles) : state.goalTiles;
      const mode = payload.mode || state.mode;
      const runState = payload.runState || (
        (mode === 'lifeGarden' || mode === 'puzzle') && hasGoalOverlap(cells, goalTiles)
          ? 'won'
          : state.runState
      );
      return {
        ...state,
        cells,
        bounds: payload.bounds || state.bounds,
        mode,
        goalTiles,
        obstacles,
        seedLimit: payload.seedLimit ?? state.seedLimit,
        seedsRemaining: payload.seedsRemaining ?? state.seedsRemaining,
        puzzleIndex: payload.puzzleIndex ?? state.puzzleIndex,
        puzzleCount: payload.puzzleCount ?? state.puzzleCount,
        puzzleCampaignComplete: payload.puzzleCampaignComplete ?? state.puzzleCampaignComplete,
        runState,
      };
      }

    case stepGrid().type: {
      if ((state.mode === 'lifeGarden' || state.mode === 'puzzle') && state.runState === 'won') {
        return state;
      }

      const blockedSet = createBlockedSet(state.obstacles);
      const nextCells = removeBlockedCells(
        applyRules(state.cells, state.bounds),
        blockedSet
      );
      const nextBirthCandidates = state.mode === 'lifeGarden' || state.mode === 'puzzle'
        ? removeBlockedCandidates(computeBirthCandidates(nextCells, state.bounds), blockedSet)
        : [];
      const didWin = (state.mode === 'lifeGarden' || state.mode === 'puzzle')
        && state.runState !== 'won'
        && hasGoalOverlap(nextCells, state.goalTiles);
      
      return {
        ...state,
        cells: nextCells,
        generation: state.generation + 1,
        birthCandidates: nextBirthCandidates,
        runState: didWin ? 'won' : state.runState,
        isRunning: didWin ? false : state.isRunning,
      };
    }

    case clearGrid().type:
      return {
        ...state,
        cells: [],
        birthCandidates: [],
        seedsRemaining: state.mode === 'puzzle' ? state.seedLimit : state.seedsRemaining,
        runState: 'active',
      };

    case resetGrid().type: {
      if (state.mode === 'puzzle') {
        const nextPuzzleIndex = payload.puzzleIndex ?? state.puzzleIndex ?? 0;
        const puzzle = payload.puzzleId
          ? getPuzzleById(payload.puzzleId)
          : getPuzzleByIndex(nextPuzzleIndex);
        return createPuzzleState(state, puzzle, nextPuzzleIndex);
      }

      const nextBounds = payload.bounds || state.bounds;
      return {
        ...state,
        cells: [],
        generation: 0,
        bounds: nextBounds,
        goalTiles: payload.goalTiles ? normalizeGoalTiles(payload.goalTiles) : state.goalTiles,
        birthCandidates: state.mode === 'lifeGarden' ? computeBirthCandidates([], nextBounds) : [],
        runState: 'active',
        isRunning: state.mode === 'lifeGarden' || state.mode === 'puzzle' ? false : state.isRunning,
      };
    }

    case toggleRunning().type:
      if (state.mode === 'lifeGarden' || state.mode === 'puzzle') {
        return state;
      }
      return {
        ...state,
        isRunning: !state.isRunning,
      };

    case setCells().type:
      {
      const blockedSet = createBlockedSet(state.obstacles);
      const cells = removeBlockedCells(payload.cells, blockedSet);
      const didWin = (state.mode === 'lifeGarden' || state.mode === 'puzzle')
        && hasGoalOverlap(cells, state.goalTiles);
      return {
        ...state,
        cells,
        birthCandidates: state.mode === 'lifeGarden' || state.mode === 'puzzle'
          ? removeBlockedCandidates(computeBirthCandidates(cells, state.bounds), blockedSet)
          : state.birthCandidates,
        runState: didWin ? 'won' : 'active',
        isRunning: didWin ? false : state.isRunning,
      };
      }

    case loadPattern().type: {
      try {
        const pattern = deserializePattern(payload.pattern);
        const nextGoalTiles = payload.goalTiles
          ? normalizeGoalTiles(payload.goalTiles)
          : state.goalTiles;
        const nextRunState = state.mode === 'lifeGarden' && hasGoalOverlap(pattern.cells, nextGoalTiles)
          ? 'won'
          : 'active';
        return {
          ...state,
          cells: pattern.cells,
          bounds: pattern.bounds,
          goalTiles: nextGoalTiles,
          birthCandidates: state.mode === 'lifeGarden'
            ? computeBirthCandidates(pattern.cells, pattern.bounds)
            : [],
          runState: nextRunState,
          isRunning: nextRunState === 'won' ? false : state.isRunning,
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
      const nextGoalTiles = payload.goalTiles
        ? normalizeGoalTiles(payload.goalTiles)
        : state.goalTiles;
      const nextRunState = state.mode === 'lifeGarden' && hasGoalOverlap(centeredCells, nextGoalTiles)
        ? 'won'
        : 'active';
      
      return {
        ...state,
        cells: centeredCells,
        bounds: gridBounds, // Keep the grid bounds, not the pattern bounds
        goalTiles: nextGoalTiles,
        birthCandidates: state.mode === 'lifeGarden'
          ? computeBirthCandidates(centeredCells, gridBounds)
          : [],
        runState: nextRunState,
        isRunning: nextRunState === 'won' ? false : state.isRunning,
      };
    }

    case setSpeed().type:
      return {
        ...state,
        speed: payload.speed,
      };

    case setMode().type: {
      const newMode = payload.mode;
      if (newMode === 'puzzle') {
        const nextPuzzleIndex = payload.puzzleIndex ?? 0;
        const puzzle = payload.puzzleId
          ? getPuzzleById(payload.puzzleId)
          : getPuzzleByIndex(nextPuzzleIndex);
        return createPuzzleState(state, puzzle, nextPuzzleIndex);
      }

      const newBirthCandidates = newMode === 'lifeGarden'
        ? computeBirthCandidates(state.cells, state.bounds)
        : [];
      const nextRunState = newMode === 'lifeGarden' && hasGoalOverlap(state.cells, state.goalTiles)
        ? 'won'
        : 'active';
      
      return {
        ...state,
        mode: newMode,
        obstacles: [],
        seedLimit: 0,
        seedsRemaining: 0,
        puzzleId: null,
        // Auto-pause simulation when switching to Life Garden mode
        isRunning: newMode === 'lifeGarden' ? false : state.isRunning,
        birthCandidates: newBirthCandidates,
        runState: nextRunState,
      };
    }

    case applyPlayerBirth().type: {
      const { cell } = payload;
      
      // Only apply in placement modes
      if ((state.mode !== 'lifeGarden' && state.mode !== 'puzzle') || state.runState === 'won') {
        console.warn('applyPlayerBirth can only be used in placement modes');
        return state;
      }

      if (state.mode === 'puzzle' && state.seedsRemaining <= 0) {
        return state;
      }

      const blockedSet = createBlockedSet(state.obstacles);
      if (blockedSet.has(toCellKey(cell))) {
        return state;
      }
      
      try {
        // Apply the birth (will throw if invalid)
        const cellsWithBirth = applyBirth(cell, state.cells, state.bounds);
        
        // Step the grid with the new cell
        const nextCells = applyRules(cellsWithBirth, state.bounds);
        
        // Compute new birth candidates
        const nextBirthCandidates = removeBlockedCandidates(
          computeBirthCandidates(nextCells, state.bounds),
          blockedSet
        );
        const didWin = hasGoalOverlap(nextCells, state.goalTiles);
        
        return {
          ...state,
          cells: nextCells,
          generation: state.generation + 1,
          birthCandidates: nextBirthCandidates,
          runState: didWin ? 'won' : state.runState,
          seedsRemaining: state.mode === 'puzzle'
            ? Math.max(0, state.seedsRemaining - 1)
            : state.seedsRemaining,
          isRunning: didWin ? false : state.isRunning,
        };
      } catch (error) {
        // Invalid birth candidate - don't modify state
        console.warn(`Invalid birth: ${error.message}`);
        return state;
      }
    }

    case setGoalTiles().type: {
      const nextGoalTiles = normalizeGoalTiles(payload.goalTiles || []);
      const didWin = state.mode === 'lifeGarden' || state.mode === 'puzzle'
        ? hasGoalOverlap(state.cells, nextGoalTiles)
        : false;
      return {
        ...state,
        goalTiles: nextGoalTiles,
        runState: didWin ? 'won' : 'active',
        isRunning: didWin ? false : state.isRunning,
      };
    }

    case confirmPuzzleVictory().type: {
      if (state.mode !== 'puzzle' || state.runState !== 'won' || state.puzzleCampaignComplete) {
        return state;
      }

      const finalIndex = Math.max(0, state.puzzleCount - 1);
      if (state.puzzleIndex >= finalIndex) {
        return {
          ...state,
          puzzleCampaignComplete: true,
          isRunning: false,
        };
      }

      const nextPuzzleIndex = state.puzzleIndex + 1;
      const nextPuzzle = getPuzzleByIndex(nextPuzzleIndex);
      return createPuzzleState(state, nextPuzzle, nextPuzzleIndex);
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
export const getGoalTiles = (state) => state[slice].goalTiles;
export const getObstacles = (state) => state[slice].obstacles;
export const getSeedLimit = (state) => state[slice].seedLimit;
export const getSeedsRemaining = (state) => state[slice].seedsRemaining;
export const getRunState = (state) => state[slice].runState;
export const getPuzzleIndex = (state) => state[slice].puzzleIndex;
export const getPuzzleCount = (state) => state[slice].puzzleCount;
export const getIsPuzzleCampaignComplete = (state) => state[slice].puzzleCampaignComplete;
export const getIsGoalReached = (state) => hasGoalOverlap(getCells(state), getGoalTiles(state));
export const getHasWon = (state) => getRunState(state) === 'won';
export const getIsPuzzleMode = (state) => getMode(state) === 'puzzle';

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
