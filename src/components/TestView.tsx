import React, { useMemo } from 'react';
import { TextData, TestConfig } from '../types';
import ClozeBlank from './ClozeBlank';

interface TestViewProps {
  textData: TextData;
  config: TestConfig;
  onBack: () => void;
}

type ClozeElement = React.ReactElement | string;

const generateClozeElements = (content: string, interval: number, mode: 'reveal' | 'input'): ClozeElement[] => {
  const elements: ClozeElement[] = [];
  const parts = content.split(/(\s+|[.,?!;:])/).filter(part => part);

  let wordCount = 0;
  parts.forEach((part, index) => {
    if (part.trim() && !/^[.,?!;:]+$/.test(part)) {
      wordCount++;
      if (wordCount > 0 && wordCount % interval === 0) {
        elements.push(<ClozeBlank key={`${index}-${part}`} answer={part} mode={mode} />);
      } else {
        elements.push(part);
      }
    } else {
      elements.push(part);
    }
  });

  return elements;
};

const TestView: React.FC<TestViewProps> = ({ textData, config, onBack }) => {

  const clozeElements = useMemo(() => 
    generateClozeElements(textData.content, config.gapInterval, config.mode), 
    [textData.content, config.gapInterval, config.mode]
  );

  return (
    <div className="container mx-auto p-4 md:p-6 text-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{textData.lesson}</h2>
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          一覧に戻る
        </button>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg shadow-md border border-gray-200">
        <div className="text-lg md:text-xl leading-relaxed text-gray-800 whitespace-pre-wrap">
          {clozeElements.map((el, i) => (
            <React.Fragment key={i}>{el}</React.Fragment>
          ))}
        </div>
      </div>

      {config.showTranslation && textData.translation && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-xl font-semibold mb-2 text-indigo-600">日本語訳</h3>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{textData.translation}</p>
        </div>
      )}
    </div>
  );
};

export default TestView;