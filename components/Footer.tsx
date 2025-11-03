import React from 'react';

interface FooterProps {
  onAdminClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-white text-gray-500 p-4 mt-auto border-t border-gray-200">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; 2024 Cloze Test Generator. All rights reserved.</p>
        <button
          onClick={onAdminClick}
          className="mt-2 text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Admin
        </button>
      </div>
    </footer>
  );
};

export default Footer;