
import React, { useState, useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Folder, TextData } from '../types';
import { PlusIcon, TrashIcon, DownloadIcon, UploadIcon } from './icons';

interface AdminViewProps {
  onExit: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onExit }) => {
  const [folders, setFolders] = useLocalStorage<Folder[]>('app_folders', []);
  const [texts, setTexts] = useLocalStorage<TextData[]>('app_texts', []);

  const [newFolderName, setNewFolderName] = useState('');
  const [lesson, setLesson] = useState('');
  const [content, setContent] = useState('');
  const [translation, setTranslation] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      setFolders([...folders, { id: crypto.randomUUID(), name: newFolderName.trim() }]);
      setNewFolderName('');
    }
  };

  const handleDeleteFolder = (folderId: string) => {
    if (window.confirm('このフォルダと含まれる全てのテキストを削除します。よろしいですか？')) {
      setFolders(folders.filter(f => f.id !== folderId));
      setTexts(texts.filter(t => t.folderId !== folderId));
    }
  };

  const handleAddText = (e: React.FormEvent) => {
    e.preventDefault();
    if (lesson.trim() && content.trim() && selectedFolderId) {
      const newText: TextData = {
        id: crypto.randomUUID(),
        folderId: selectedFolderId,
        lesson: lesson.trim(),
        content: content.trim(),
        translation: translation.trim(),
      };
      setTexts([...texts, newText]);
      setLesson('');
      setContent('');
      setTranslation('');
    }
  };
  
  const handleDeleteText = (textId: string) => {
    if (window.confirm('このテキストを削除します。よろしいですか？')) {
      setTexts(texts.filter(t => t.id !== textId));
    }
  };

  const handleExport = () => {
    const dataToExport = {
      folders,
      texts,
    };
    const jsonString = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloze-app-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        return;
      }

      if (window.confirm('現在のデータを上書きします。よろしいですか？')) {
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
              alert('データのインポートが完了しました。');
            } else {
              throw new Error('Invalid data format.');
            }
          } catch (error) {
            console.error('Failed to import data:', error);
            alert('ファイルの読み込みに失敗しました。有効なJSONファイルを選択してください。');
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">管理者ダッシュボード</h2>
        <button onClick={onExit} className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors">
          管理者ビューを終了
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Folder Management */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">フォルダ管理</h3>
          <form onSubmit={handleAddFolder} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="新しいフォルダ名"
              className="flex-grow bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-md"><PlusIcon /></button>
          </form>
          <ul className="space-y-2">
            {folders.map(folder => (
              <li key={folder.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{folder.name}</span>
                <button onClick={() => handleDeleteFolder(folder.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon /></button>
              </li>
            ))}
          </ul>
        </div>

        {/* Text Registration */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">新規テキスト登録</h3>
          <form onSubmit={handleAddText} className="space-y-4">
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>フォルダを選択してください</option>
              {folders.map(folder => <option key={folder.id} value={folder.id}>{folder.name}</option>)}
            </select>
            <input
              type="text"
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              placeholder="レッスン名 (例: Lesson 5 Part 2)"
              required
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="英語本文"
              required
              rows={5}
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="日本語訳（任意）"
              rows={3}
              className="w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
              テキストを保存
            </button>
          </form>
        </div>
      </div>
      
      {/* Data List */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">登録済みコンテンツ</h3>
        <div className="space-y-4">
          {folders.map(folder => (
            <div key={folder.id}>
              <h4 className="text-lg font-bold text-indigo-600">{folder.name}</h4>
              <ul className="pl-4 mt-2 space-y-2">
                {texts.filter(t => t.folderId === folder.id).map(text => (
                  <li key={text.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                    <span>{text.lesson}</span>
                    <button onClick={() => handleDeleteText(text.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon /></button>
                  </li>
                ))}
                  {texts.filter(t => t.folderId === folder.id).length === 0 && (
                    <li className="text-gray-500 italic">このフォルダにはテキストがありません。</li>
                  )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">データ管理</h3>
        <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleExport}
              className="flex items-center justify-center w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              <DownloadIcon />
              <span>データをエクスポート</span>
            </button>
            <button
              onClick={handleImportClick}
              className="flex items-center justify-center w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              <UploadIcon />
              <span>データをインポート</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".json"
            />
        </div>
        <p className="text-sm text-gray-500 mt-4">
          データをJSONファイルとしてエクスポート・インポートできます。これにより、別端末へのデータ移行やバックアップが可能です。インポートすると現在のデータは上書きされますのでご注意ください。
        </p>
      </div>
    </div>
  );
};

export default AdminView;
