import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Folder, TextData } from '../types';
import { FolderIcon, DocumentIcon, ChevronDownIcon } from './icons';

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
  const [folders] = useLocalStorage<Folder[]>('app_folders', []);
  const [texts] = useLocalStorage<TextData[]>('app_texts', []);

  return (
    <div className="container mx-auto p-4 md:p-6 text-gray-800">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">レッスンを選択</h2>
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
            <p className="text-gray-500 mt-2">管理者がフォルダとレッスンを追加する必要があります。</p>
        </div>
      )}
    </div>
  );
};

export default UserView;