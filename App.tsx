import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminView from './components/AdminView';
import UserView from './components/UserView';
import PasscodeModal from './components/PasscodeModal';
import ConfigModal from './components/ConfigModal';
import TestView from './components/TestView';
import { TextData, TestConfig } from './types';
import './index.css';

type ViewState = 'list' | 'test';

const App: React.FC = () => {
  const [isAdminView, setIsAdminView] = useState(false);
  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const [currentView, setCurrentView] = useState<ViewState>('list');
  const [selectedText, setSelectedText] = useState<TextData | null>(null);
  const [testConfig, setTestConfig] = useState<TestConfig | null>(null);

  const handleAdminClick = () => {
    setIsPasscodeModalOpen(true);
  };

  const handlePasscodeSuccess = () => {
    setIsAdminView(true);
    setIsPasscodeModalOpen(false);
  };

  const handleStartTestSelection = (text: TextData) => {
    setSelectedText(text);
    setIsConfigModalOpen(true);
  };

  const handleStartTest = (config: TestConfig) => {
    setTestConfig(config);
    setCurrentView('test');
    setIsConfigModalOpen(false);
  };
  
  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedText(null);
    setTestConfig(null);
  };

  const renderContent = () => {
    if (isAdminView) {
      return <AdminView onExit={() => setIsAdminView(false)} />;
    }

    switch (currentView) {
      case 'test':
        if (selectedText && testConfig) {
          return <TestView textData={selectedText} config={testConfig} onBack={handleBackToList}/>;
        }
        // Fallback to list if data is missing
        return <UserView onStartTest={handleStartTestSelection} />;
      case 'list':
      default:
        return <UserView onStartTest={handleStartTestSelection} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer onAdminClick={handleAdminClick} />

      <PasscodeModal
        isOpen={isPasscodeModalOpen}
        onClose={() => setIsPasscodeModalOpen(false)}
        onSuccess={handlePasscodeSuccess}
      />
      
      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        onStartTest={handleStartTest}
        textData={selectedText}
      />
    </div>
  );
};

export default App;