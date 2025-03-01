import React from 'react';

interface FooterProps {
  isSearching: boolean;
  onChangelogClick: () => void;
}

export function Footer({ isSearching, onChangelogClick }: FooterProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-amber-200/80 text-xs lg:text-sm text-center px-4 mt-12">
      <div>
        Press <kbd className="px-3 py-1.5 bg-[#3c1f10] rounded-lg shadow-inner border border-amber-900/20">Enter</kbd> to search or{' '}
        <kbd className="px-3 py-1.5 bg-[#3c1f10] rounded-lg shadow-inner border border-amber-900/20">Tab</kbd> + <kbd className="px-3 py-1.5 bg-[#3c1f10] rounded-lg shadow-inner border border-amber-900/20">Enter</kbd> for random shit
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-4 items-center w-full max-w-2xl border-t border-amber-200/20 pt-4">
        {/* Left side - Made with love */}
        <div className="flex items-center justify-center sm:justify-end gap-2 text-amber-200/80">
          Made with<span className="text-yellow-500">♥</span>by{' '}
          <a 
            href="https://www.southlemonai.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-yellow-500 hover:text-yellow-400 transition-colors duration-200"
          >
            SouthLemonAI
          </a>
          <button
            onClick={onChangelogClick}
            className="text-amber-200/60 hover:text-amber-200 transition-colors duration-200"
          >
            v0.2.2
          </button>
        </div>
        {/* Right side - Powered by Groq */}
        <div className="flex items-center gap-3 justify-center sm:justify-start">
          <a href="https://groq.com" target="_blank" rel="noopener noreferrer">
            <img
              src="https://groq.com/wp-content/uploads/2024/03/PBG-mark1-color.svg"
              alt="Powered by Groq"
              className="h-6 opacity-90 hover:opacity-100 transition-opacity duration-200"
            />
          </a>
          <span className="text-amber-200/60 whitespace-nowrap">
            Powered by Groq for <span className="text-amber-200 font-bold italic">fast as shit</span> inference
          </span>
        </div>
      </div>
    </div>
  );
}