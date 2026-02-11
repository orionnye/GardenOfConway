'use client';

import { useSelector } from 'react-redux';
import { getBirthCandidates, getMode, getRunState } from '@/lib/state/grid-dux';

export default function BirthCandidateBanner() {
  const birthCandidates = useSelector(getBirthCandidates);
  const mode = useSelector(getMode);
  const runState = useSelector(getRunState);

  const isPlacementMode = mode === 'lifeGarden' || mode === 'puzzle';

  // Only show in placement modes when no candidates exist and run is active
  if (!isPlacementMode || runState !== 'active' || birthCandidates.length > 0) {
    return null;
  }

  return (
    <div 
      className="fixed top-24 left-1/2 -translate-x-1/2 z-20 animate-in fade-in duration-200"
      role="alert"
      aria-live="polite"
    >
      <div className="bg-amber-100 text-amber-900 px-6 py-3 rounded-lg shadow-lg border-2 border-amber-400">
        <p className="font-semibold">No valid births available</p>
        <p className="text-sm text-amber-700 mt-1">
          Skip or place a cell to continue gardening
        </p>
      </div>
    </div>
  );
}
