import React, { useState, useEffect } from 'react';
import { TextData, TestConfig } from '../types';
import { XIcon } from './icons';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTest: (config: TestConfig) => void;
  textData: TextData | null;
}

const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, onStartTest, textData }) => {
  const [gapInterval, setGapInterval] = useState(5);
  const [showTranslation, setShowTranslation] = useState(true);
  const [mode, setMode] = useState<'reveal' | 'input'>('reveal');

  useEffect(() => {
    // Reset to default when modal opens for a new text
    if (isOpen) {
      setGapInterval(5);
      setShowTranslation(true);
      setMode('reveal');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartTest({
      gapInterval: Math.max(1, gapInterval), // Ensure interval is at least 1
      showTranslation,
      mode,
    });
  };

  if (!isOpen || !textData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XIcon />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">テスト設定</h2>
        <p className="text-gray-600 mb-6">{textData.lesson}</p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="gapInterval" className="block text-sm font-medium text-gray-700 mb-1">
                穴埋めの間隔
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="gapInterval"
                  type="number"
                  value={gapInterval}
                  onChange={(e) => setGapInterval(parseInt(e.target.value, 10))}
                  min="1"
                  className="w-20 bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900 text-center focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-gray-700">単語ごとに穴埋め</span>
              </div>
            </div>

            <div>
              <h3 className="block text-sm font-medium text-gray-700 mb-2">テストモード</h3>
              <div className="flex items-center space-x-4">
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="mode" value="reveal" checked={mode === 'reveal'} onChange={() => setMode('reveal')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                  <span className="ml-2 text-sm text-gray-700">解答表示モード</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input type="radio" name="mode" value="input" checked={mode === 'input'} onChange={() => setMode('input')} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                  <span className="ml-2 text-sm text-gray-700">入力判定モード</span>
                </label>
              </div>
            </div>

            {textData.translation && (
              <div className="flex items-center">
                <input
                  id="showTranslation"
                  type="checkbox"
                  checked={showTranslation}
                  onChange={(e) => setShowTranslation(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 bg-gray-100"
                />
                <label htmlFor="showTranslation" className="ml-2 block text-sm text-gray-700">
                  日本語訳を表示する
                </label>
              </div>
            )}
          </div>

          <div className="mt-8">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              テスト開始
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfigModal;