
import React from 'react';

const logoUrl = './logo.png';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md h-20 fixed top-0 left-0 right-0 z-10">
      <div className="container mx-auto px-4 h-full flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="bg-slate-800 rounded-full p-1 w-12 h-12 flex items-center justify-center">
            <img src={logoUrl} alt="Logo" className="h-8 w-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#8C1515]">
            Stamford English
          </h1>
        </div>
      </div>
    </header>
  );
};