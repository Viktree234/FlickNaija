
import React from 'react';
import { COLORS } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 px-4 py-4 flex items-center justify-between bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="flex items-center gap-2">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black"
          style={{ backgroundColor: COLORS.primary }}
        >
          FN
        </div>
        <h1 className="text-xl font-bold tracking-tight">
          Flick<span style={{ color: COLORS.primary }}>Naija</span>
        </h1>
      </div>
      <div className="flex gap-4">
        <a href="#/" className="text-sm font-medium hover:text-green-400 transition">Home</a>
        <a href="#/search" className="text-sm font-medium hover:text-green-400 transition">Browse</a>
      </div>
    </header>
  );
};

export default Header;
