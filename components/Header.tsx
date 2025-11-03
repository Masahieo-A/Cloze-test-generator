import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white text-gray-800 p-4 shadow-md">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">Cloze Test Generator</h1>
        <p className="text-sm text-gray-500">高校生向け英語学習ツール</p>
      </div>
    </header>
  );
};

export default Header;