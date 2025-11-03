import React, { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { XIcon } from './icons';

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PasscodeModal: React.FC<PasscodeModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useLocalStorage<string>('app_password', '');
  const [input, setInput] = useState('');
  const [confirmInput, setConfirmInput] = useState('');
  const [error, setError] = useState('');
  const isSettingPassword = !password;

  useEffect(() => {
    if (isOpen) {
      setInput('');
      setConfirmInput('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSettingPassword) {
      if (input.length < 4) {
        setError('パスコードは4文字以上で設定してください。');
        return;
      }
      if (input !== confirmInput) {
        setError('パスコードが一致しません。');
        return;
      }
      setPassword(input);
      onSuccess();
    } else {
      if (input === password) {
        onSuccess();
      } else {
        setError('パスコードが正しくありません。');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <XIcon />
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{isSettingPassword ? '管理者パスコードを設定' : '管理者パスコードを入力'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="passcode">
                {isSettingPassword ? '新しいパスコード' : 'パスコード'}
              </label>
              <input
                id="passcode"
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                autoFocus
              />
            </div>
            {isSettingPassword && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="confirm-passcode">
                  パスコードの確認
                </label>
                <input
                  id="confirm-passcode"
                  type="password"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            )}
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              {isSettingPassword ? 'パスコードを設定' : '入室'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasscodeModal;