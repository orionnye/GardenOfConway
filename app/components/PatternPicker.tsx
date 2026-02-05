'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loadPatternFromLibrary } from '@/lib/state/grid-dux';

// Pattern library metadata
const PATTERN_LIST = [
  { name: 'GLIDER', displayName: 'Glider', category: 'spaceship', description: 'Small spaceship that moves diagonally' },
  { name: 'BLINKER', displayName: 'Blinker', category: 'oscillator', description: 'Period-2 oscillator' },
  { name: 'TOAD', displayName: 'Toad', category: 'oscillator', description: 'Period-2 oscillator' },
  { name: 'BEACON', displayName: 'Beacon', category: 'oscillator', description: 'Period-2 oscillator' },
  { name: 'PULSAR', displayName: 'Pulsar', category: 'oscillator', description: 'Period-3 oscillator' },
  { name: 'BLOCK', displayName: 'Block', category: 'still-life', description: 'Simple 2x2 still life' },
  { name: 'BEEHIVE', displayName: 'Beehive', category: 'still-life', description: 'Common still life pattern' },
  { name: 'R_PENTOMINO', displayName: 'R-Pentomino', category: 'methuselah', description: 'Chaotic pattern that stabilizes after 1103 generations' },
];

const CATEGORY_EMOJI = {
  spaceship: '🔹',
  oscillator: '🟦',
  'still-life': '🟩',
  methuselah: '🔥',
};

export default function PatternPicker() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const handleLoadPattern = (patternName: string) => {
    dispatch(loadPatternFromLibrary({ name: patternName }));
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-20 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded shadow-lg"
        aria-label="Open pattern picker"
      >
        Load Pattern
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Load Pattern</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white"
            aria-label="Close pattern picker"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2">
          {PATTERN_LIST.map((pattern) => (
            <button
              key={pattern.name}
              onClick={() => handleLoadPattern(pattern.name)}
              className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">
                  {CATEGORY_EMOJI[pattern.category as keyof typeof CATEGORY_EMOJI]}
                </span>
                <div>
                  <div className="text-white font-medium">
                    {pattern.displayName}
                  </div>
                  <div className="text-sm text-gray-400">
                    {pattern.description}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
