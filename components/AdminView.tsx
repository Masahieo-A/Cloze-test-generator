import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Folder, TextData } from '../types';
import { PlusIcon, TrashIcon } from './icons';

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
    </div>
  );
};

export default AdminView;