'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getPatternJSON, getPatternURL, getPatternRLE, loadPattern } from '@/lib/state/grid-dux';

type ExportFormat = 'json' | 'rle' | 'url';

export default function PatternExport() {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ExportFormat>('json');
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const [showImport, setShowImport] = useState(false);

  const patternJSON = useSelector(getPatternJSON);
  const patternURL = useSelector(getPatternURL);
  const patternRLE = useSelector(getPatternRLE);

  const exportData = {
    json: patternJSON,
    rle: patternRLE,
    url: patternURL,
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportData[activeTab]);
      // Could show a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleImport = () => {
    try {
      setImportError('');
      dispatch(loadPattern({ pattern: importData }));
      setImportData('');
      setIsOpen(false);
      setShowImport(false);
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Invalid pattern data');
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow-lg"
        aria-label="Export/Import pattern"
      >
        Export/Import
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {showImport ? 'Import Pattern' : 'Export Pattern'}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white"
            aria-label="Close export/import dialog"
          >
            ✕
          </button>
        </div>

        {!showImport ? (
          <>
            {/* Export Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('json')}
                className={`px-4 py-2 rounded ${
                  activeTab === 'json'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                JSON
              </button>
              <button
                onClick={() => setActiveTab('rle')}
                className={`px-4 py-2 rounded ${
                  activeTab === 'rle'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                RLE
              </button>
              <button
                onClick={() => setActiveTab('url')}
                className={`px-4 py-2 rounded ${
                  activeTab === 'url'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-700 text-gray-300'
                }`}
              >
                URL
              </button>
            </div>

            {/* Export Data */}
            <textarea
              readOnly
              value={exportData[activeTab]}
              className="w-full h-64 p-3 bg-gray-900 text-gray-300 font-mono text-sm rounded resize-none"
              aria-label={`Pattern ${activeTab} export data`}
            />

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Copy to Clipboard
              </button>
              <button
                onClick={() => setShowImport(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
              >
                Import Pattern
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Import Section */}
            <p className="text-gray-300 mb-2">
              Paste pattern data (JSON, RLE, or URL-encoded):
            </p>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="w-full h-64 p-3 bg-gray-900 text-gray-300 font-mono text-sm rounded resize-none"
              placeholder="Paste pattern data here..."
              aria-label="Pattern import data"
            />

            {importError && (
              <div className="mt-2 p-2 bg-red-900 text-red-200 rounded text-sm">
                {importError}
              </div>
            )}

            {/* Import Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleImport}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                disabled={!importData.trim()}
              >
                Load Pattern
              </button>
              <button
                onClick={() => {
                  setShowImport(false);
                  setImportData('');
                  setImportError('');
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                Back to Export
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
