import React, { useState, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Folder, TextData } from '../types';
import { FolderIcon, DocumentIcon, ChevronDownIcon, UploadIcon } from './icons';

interface UserViewProps {
  onStartTest: (text: TextData) => void;
}

const FolderItem: React.FC<{ folder: Folder; texts: TextData[]; onTextClick: (text: TextData) => void }> = ({ folder, texts, onTextClick }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-200"
            >
                <h3 className="text-lg font-semibold text-gray-800 flex items-center"><FolderIcon /> {folder.name}</h3>
                <div className={`${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDownIcon />
                </div>
            </button>
            {isOpen && (
                <ul className="p-2">
                    {texts.length > 0 ? (
                        texts.map(text => (
                            <li key={text.id}>
                                <button
                                    onClick={() => onTextClick(text)}
                                    className="w-full text-left p-3 rounded-md hover:bg-gray-100 transition-colors flex items-center text-gray-700"
                                >
                                    <DocumentIcon /> {text.lesson}
                                </button>
                            </li>
                        ))
                    ) : (
                        <li className="p-3 text-gray-500 italic">このフォルダにはレッスンがありません。</li>
                    )}
                </ul>
            )}
        </div>
    );
}


const UserView: React.FC<UserViewProps> = ({ onStartTest }) => {
  const [folders, setFolders] = useLocalStorage<Folder[]>('app_folders', []);
  const [texts, setTexts] = useLocalStorage<TextData[]>('app_texts', []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    if (window.confirm('現在のレッスンデータを新しいデータで上書きします。よろしいですか？')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result;
          if (typeof text !== 'string') {
            throw new Error('File content is not a string.');
          }
          const importedData = JSON.parse(text);

          if (Array.isArray(importedData.folders) && Array.isArray(importedData.texts)) {
            setFolders(importedData.folders);
            setTexts(importedData.texts);
            alert('データの読み込みが完了しました。');
          } else {
            throw new Error('Invalid data format.');
          }
        } catch (error) {
          console.error('Failed to import data:', error);
          alert('ファイルの読み込みに失敗しました。先生から配布された正しいファイルを選択してください。');
        } finally {
          if (event.target) {
            event.target.value = '';
          }
        }
      };
      reader.onerror = () => {
        alert('ファイルの読み込み中にエラーが発生しました。');
        if (event.target) {
          event.target.value = '';
        }
      };
      reader.readAsText(file);
    } else {
        if (event.target) {
            event.target.value = '';
        }
    }
  };


  return (
    <div className="container mx-auto p-4 md:p-6 text-gray-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-900">レッスンを選択</h2>
        <div>
            <button
                onClick={handleImportClick}
                className="flex items-center justify-center w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
                aria-label="教材データを読み込む"
            >
                <UploadIcon />
                <span className="whitespace-nowrap">データを読み込む</span>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".json"
            />
        </div>
      </div>
      {folders.length > 0 ? (
        <div className="space-y-4">
          {folders.map(folder => (
            <FolderItem
              key={folder.id}
              folder={folder}
              texts={texts.filter(t => t.folderId === folder.id)}
              onTextClick={onStartTest}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl text-gray-800">まだコンテンツがありません。</h3>
            <p className="text-gray-500 mt-2">「データを読み込む」ボタンから、先生に配布されたデータを読み込んでください。</p>
        </div>
      )}
    </div>
  );
};

export default UserView;