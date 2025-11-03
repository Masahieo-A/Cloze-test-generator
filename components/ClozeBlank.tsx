import React, { useState } from 'react';

interface ClozeBlankProps {
  answer: string;
  mode: 'reveal' | 'input';
}

const ClozeBlank: React.FC<ClozeBlankProps> = ({ answer, mode }) => {
  // Reveal mode state
  const [isRevealed, setIsRevealed] = useState(false);

  // Input mode state
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<'pending' | 'correct' | 'incorrect'>('pending');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Case-insensitive comparison
      const isCorrect = inputValue.trim().toLowerCase() === answer.toLowerCase();
      setStatus(isCorrect ? 'correct' : 'incorrect');
    }
  };

  // --- Reveal Mode ---
  if (mode === 'reveal') {
    if (isRevealed) {
      return <span className="text-green-600 font-bold">{answer}</span>;
    }

    return (
      <span
        onClick={() => setIsRevealed(true)}
        className="bg-green-100 border border-green-400 text-transparent rounded px-2 py-0.5 cursor-pointer hover:bg-green-200 transition-colors"
        style={{ minWidth: `${Math.max(answer.length, 3)}ch` }}
        data-answer={answer}
      >
        {answer}
      </span>
    );
  }

  // --- Input Mode ---
  if (status === 'pending') {
    return (
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="inline-block bg-transparent border-b-2 border-gray-400 focus:border-indigo-500 outline-none text-center mx-1 px-1 text-gray-800"
        style={{ width: `${Math.max(answer.length, 5)}ch` }}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
        aria-label={`Fill in the blank for word starting with ${answer[0]}`}
      />
    );
  }

  if (status === 'correct') {
    return <span className="text-green-600 font-bold">{answer}</span>;
  }
  
  // status === 'incorrect'
  return (
    <span className="inline-block bg-red-100 rounded px-1">
      <span className="text-red-600 line-through">{inputValue || '...'}</span>
      <span className="text-green-600 font-bold ml-1">({answer})</span>
    </span>
  );
};

export default ClozeBlank;