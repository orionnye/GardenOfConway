'use client';

import { useDispatch, useSelector } from 'react-redux';
import {
  confirmPuzzleVictory,
  getIsPuzzleCampaignComplete,
  getMode,
  getPuzzleCount,
  getPuzzleIndex,
  getRunState,
  resetGrid,
} from '@/lib/state/grid-dux';

export default function GoalWinBanner() {
  const dispatch = useDispatch();
  const mode = useSelector(getMode);
  const runState = useSelector(getRunState);
  const puzzleIndex = useSelector(getPuzzleIndex);
  const puzzleCount = useSelector(getPuzzleCount);
  const isPuzzleCampaignComplete = useSelector(getIsPuzzleCampaignComplete);

  const isPlacementMode = mode === 'lifeGarden' || mode === 'puzzle';
  const isPuzzleMode = mode === 'puzzle';

  if (!isPlacementMode || runState !== 'won') {
    return null;
  }

  return (
    <div
      className="fixed top-24 left-1/2 -translate-x-1/2 z-30 animate-in fade-in duration-200"
      role="status"
      aria-live="polite"
    >
      <div className="bg-emerald-100 text-emerald-950 px-6 py-4 rounded-lg shadow-lg border-2 border-emerald-500 min-w-72">
        <p className="font-semibold">Goal reached!</p>
        <p className="text-sm text-emerald-800 mt-1">
          {isPuzzleMode
            ? isPuzzleCampaignComplete
              ? 'You completed all available puzzles.'
              : `Puzzle ${Math.min(puzzleIndex + 1, puzzleCount)} cleared. Confirm to continue.`
            : 'Your growth touched a target tile.'}
        </p>
        {isPuzzleMode ? (
          isPuzzleCampaignComplete ? (
            <button
              type="button"
              className="mt-3 px-3 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded"
              onClick={() => dispatch(resetGrid({ puzzleIndex: 0 }))}
            >
              Restart Puzzles
            </button>
          ) : (
            <button
              type="button"
              className="mt-3 px-3 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded"
              onClick={() => dispatch(confirmPuzzleVictory())}
            >
              I Won
            </button>
          )
        ) : (
          <button
            type="button"
            className="mt-3 px-3 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded"
            onClick={() => dispatch(resetGrid())}
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}
